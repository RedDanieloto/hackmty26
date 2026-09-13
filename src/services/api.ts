/**
 * Altur & Voice Authentication API Client
 * Production Server: http://64.177.86.66:8000
 */

import { Platform } from 'react-native';

export const DEFAULT_API_BASE_URL = 'http://64.177.86.66:8000';

export interface CustomerOut {
  full_name: string;
  email: string;
  phone_number: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  customer: CustomerOut;
}

export interface DetectionRequest {
  audio_b64: string;
}

export interface DetectionResponse {
  is_synthetic: boolean;
  confidence: number; // 0.0 to 1.0
}

export interface ApiHealthResponse {
  status: 'ok' | 'error';
  message: string;
  latencyMs?: number;
}

export interface AccountOut {
  account_number: string;
  account_type: string;
  balance: number;
  currency: string;
  status: string;
  opened_at: string;
}

export interface TransactionOut {
  transaction_id: string;
  type: string;
  concept: string;
  amount: number;
  resulting_balance: number;
  date: string;
  status: string;
  related_transfer_id?: string;
}

export interface PaginatedTransactions {
  items: TransactionOut[];
  total: number;
  limit: number;
  offset: number;
}

export interface BeneficiaryOut {
  beneficiary_id: string;
  name: string;
  account_number: string;
  bank_name: string;
}

export interface TransferCreateRequest {
  beneficiary_id: string;
  amount: number;
  concept: string;
}

export interface TransferOut {
  transfer_id: string;
  status: string;
  amount: number;
  concept: string;
  beneficiary_name: string;
  created_at: string;
  updated_at: string;
  confirmation_phrase?: string;
}

class ApiService {
  private baseUrl: string = DEFAULT_API_BASE_URL;
  private token: string | null = null;

  constructor() {
    this.baseUrl = DEFAULT_API_BASE_URL;
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public setBaseUrl(url: string) {
    this.baseUrl = url.replace(/\/+$/, '');
  }

  public setToken(token: string | null) {
    this.token = token;
  }

  public getToken(): string | null {
    return this.token;
  }

  /**
   * Helper to build clean standard URL
   */
  private buildUrl(path: string, customUrl?: string): string {
    const base = (customUrl || this.baseUrl).replace(/\/+$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    if (base.includes('ngrok')) {
      const separator = cleanPath.includes('?') ? '&' : '?';
      return `${base}${cleanPath}${separator}ngrok-skip-browser-warning=true`;
    }
    return `${base}${cleanPath}`;
  }

  /**
   * Helper to build standard headers
   */
  private getHeaders(includeAuth = true): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    if (this.baseUrl.includes('ngrok')) {
      headers['ngrok-skip-browser-warning'] = 'true';
    }

    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  /**
   * GET / - Health check / Read Root
   */
  public async checkHealth(customUrl?: string): Promise<ApiHealthResponse> {
    const startTime = Date.now();
    try {
      const fullUrl = this.buildUrl('/', customUrl);
      const isWeb = Platform.OS === 'web';

      const response = await fetch(fullUrl, {
        method: 'GET',
        // In web browsers, omit custom headers for simple GET to avoid preflight issues
        headers: isWeb ? { Accept: 'application/json' } : this.getHeaders(false),
      });

      const latencyMs = Date.now() - startTime;

      if (!response.ok) {
        return {
          status: 'error',
          message: `Servidor respondió con código ${response.status}`,
          latencyMs,
        };
      }

      const data = await response.json();
      const message = typeof data === 'string' ? data : data?.mensaje || 'Servidor en línea';

      return {
        status: 'ok',
        message,
        latencyMs,
      };
    } catch (error: any) {
      const latencyMs = Date.now() - startTime;
      const errorStr = String(error?.message || error);
      const isCors =
        errorStr.includes('Failed to fetch') ||
        errorStr.includes('Network request failed') ||
        error?.name === 'TypeError';

      return {
        status: 'error',
        message: isCors
          ? 'CORS bloqueado por navegador. Agrega CORSMiddleware a FastAPI.'
          : error?.message || 'No se pudo conectar al servidor FastAPI',
        latencyMs,
      };
    }
  }

  /**
   * POST /auth/login - Authenticate with email & password
   */
  public async login(credentials: LoginRequest, customUrl?: string): Promise<LoginResponse> {
    const fullUrl = this.buildUrl('/auth/login', customUrl);

    let response: Response;
    try {
      response = await fetch(fullUrl, {
        method: 'POST',
        headers: this.getHeaders(false),
        body: JSON.stringify(credentials),
      });
    } catch (err: any) {
      const errStr = String(err?.message || err);
      if (errStr.includes('Failed to fetch') || err?.name === 'TypeError') {
        throw new Error(
          'No se pudo conectar con el servidor (túnel ngrok fuera de línea o error de red/CORS). Verifica la URL de tu API.'
        );
      }
      throw new Error(`Error de red al conectar con el servidor: ${err?.message || err}`);
    }

    if (!response.ok) {
      let errorDetail = `Error ${response.status}`;
      try {
        const errorJson = await response.json();
        if (typeof errorJson.detail === 'string') {
          errorDetail = errorJson.detail;
        } else if (Array.isArray(errorJson.detail)) {
          errorDetail = errorJson.detail.map((d: any) => d.msg || JSON.stringify(d)).join(', ');
        }
      } catch {
        // unable to parse json
      }
      throw new Error(errorDetail);
    }

    const data: LoginResponse = await response.json();
    if (data.access_token) {
      this.token = data.access_token;
    }
    return data;
  }

  /**
   * GET /auth/me - Retrieve current customer profile
   */
  public async getMe(tokenOverride?: string, customUrl?: string): Promise<CustomerOut> {
    const fullUrl = this.buildUrl('/auth/me', customUrl);
    const token = tokenOverride || this.token;

    if (!token) {
      throw new Error('No hay token de sesión disponible');
    }

    let response: Response;
    try {
      response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err: any) {
      const errStr = String(err?.message || err);
      if (errStr.includes('Failed to fetch') || err?.name === 'TypeError') {
        throw new Error(
          'No se pudo conectar con el servidor (túnel ngrok fuera de línea o error de red).'
        );
      }
      throw new Error(`Error de red: ${err?.message || err}`);
    }

    if (!response.ok) {
      throw new Error(`No se pudo obtener el perfil del usuario (código ${response.status})`);
    }

    return await response.json();
  }

  /**
   * POST /detect - Detect if an audio is synthetic or human
   */
  public async detectVoice(audioB64: string, customUrl?: string): Promise<DetectionResponse> {
    const fullUrl = this.buildUrl('/detect', customUrl);

    let response: Response;
    try {
      response = await fetch(fullUrl, {
        method: 'POST',
        headers: this.getHeaders(true),
        body: JSON.stringify({ audio_b64: audioB64 }),
      });
    } catch (err: any) {
      const errStr = String(err?.message || err);
      if (errStr.includes('Failed to fetch') || err?.name === 'TypeError') {
        throw new Error(
          'No se pudo conectar con el servidor (túnel ngrok fuera de línea o error de red).'
        );
      }
      throw new Error(`Error al enviar audio al clasificador: ${err?.message || err}`);
    }

    if (!response.ok) {
      let errorDetail = `Error de detección ${response.status}`;
      try {
        const errorJson = await response.json();
        if (typeof errorJson.detail === 'string') {
          errorDetail = errorJson.detail;
        }
      } catch {
        // unable to parse
      }
      throw new Error(errorDetail);
    }

    return await response.json();
  }

  /**
   * POST /incoming-call - Webhook / trigger for telephone bot call
   */
  public async triggerIncomingCall(customUrl?: string): Promise<any> {
    const fullUrl = this.buildUrl('/incoming-call', customUrl);

    try {
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: this.getHeaders(false),
      });
      return await response.json().catch(() => 'ok');
    } catch (err) {
      console.warn('POST /incoming-call notice:', err);
      return null;
    }
  }

  /**
   * GET /api/account - Retrieve user bank account details & balance
   */
  public async getAccount(customUrl?: string): Promise<AccountOut> {
    const fullUrl = this.buildUrl('/api/account', customUrl);

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    if (!response.ok) {
      throw new Error(`Error al consultar cuenta bancaria (${response.status})`);
    }

    return await response.json();
  }

  /**
   * GET /api/account/transactions - Retrieve paginated transactions
   */
  public async getTransactions(limit = 20, offset = 0, customUrl?: string): Promise<PaginatedTransactions> {
    const path = `/api/account/transactions?limit=${limit}&offset=${offset}`;
    const fullUrl = this.buildUrl(path, customUrl);

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    if (!response.ok) {
      throw new Error(`Error al consultar movimientos (${response.status})`);
    }

    return await response.json();
  }

  /**
   * GET /api/beneficiaries - Retrieve registered transfer beneficiaries
   */
  public async getBeneficiaries(customUrl?: string): Promise<BeneficiaryOut[]> {
    const fullUrl = this.buildUrl('/api/beneficiaries', customUrl);

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    if (!response.ok) {
      throw new Error(`Error al consultar beneficiarios (${response.status})`);
    }

    return await response.json();
  }

  /**
   * POST /api/transfers - Create bank transfer and get confirmation phrase
   */
  public async createTransfer(req: TransferCreateRequest, customUrl?: string): Promise<TransferOut> {
    const fullUrl = this.buildUrl('/api/transfers', customUrl);

    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(req),
    });

    if (!response.ok) {
      let errorDetail = `Error al procesar transferencia (${response.status})`;
      try {
        const errorJson = await response.json();
        if (typeof errorJson.detail === 'string') {
          errorDetail = errorJson.detail;
        }
      } catch {}
      throw new Error(errorDetail);
    }

    const data = await response.json();
    if (Array.isArray(data)) {
      return data[0];
    }
    return data;
  }

  /**
   * GET /api/transfers - List transfers
   */
  public async listTransfers(limit = 20, offset = 0, customUrl?: string): Promise<TransferOut[]> {
    const path = `/api/transfers?limit=${limit}&offset=${offset}`;
    const fullUrl = this.buildUrl(path, customUrl);

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    if (!response.ok) {
      throw new Error(`Error al listar transferencias (${response.status})`);
    }

    return await response.json();
  }

  /**
   * GET /api/transfers/{transfer_id} - Get single transfer status
   */
  public async getTransfer(transferId: string, customUrl?: string): Promise<TransferOut> {
    const path = `/api/transfers/${encodeURIComponent(transferId)}`;
    const fullUrl = this.buildUrl(path, customUrl);

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    if (!response.ok) {
      throw new Error(`Error al consultar transferencia (${response.status})`);
    }

    const data = await response.json();
    if (Array.isArray(data)) {
      return data[0];
    }
    if (data && Array.isArray(data.items)) {
      return data.items[0];
    }
    return data;
  }
}

export const api = new ApiService();
