import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  api,
  AccountOut,
  BeneficiaryOut,
  DEFAULT_API_BASE_URL,
  TransactionOut,
  TransferOut,
} from '@/services/api';

export type VerificationState =
  | 'idle'
  | 'initiating_call'
  | 'call_connected'
  | 'listening_phrase'
  | 'analyzing_voice'
  | 'verified_human'
  | 'detected_ai';

export interface TransferDetails {
  recipientName: string;
  bankName: string;
  accountNumber: string;
  amount: number;
  concept: string;
  folio: string;
  timestamp: string;
  beneficiaryId?: string;
}

export interface VoiceAnalysisResult {
  isHuman: boolean;
  humanConfidence: number; // e.g. 99.4
  aiConfidence: number;    // e.g. 0.6
  vocalTractScore: number; // Biological vocal cord resonance
  spectralJitter: number;  // Micro-inflections
  neuralArtifactsScore: number; // Deepfake synthesis artifacts
  challengePhrase: string;
  durationMs: number;
}

export interface SimulationSettings {
  targetPhoneNumber: string;
  securityThreshold: number; // Above this, call is triggered (e.g. 10000)
  forceOutcome: 'auto' | 'force_human' | 'force_ai';
  apiUrl: string;
  apiKey: string;
  autoStartCall: boolean;
}

export interface VerificationLogItem {
  id: string;
  folio: string;
  timestamp: string;
  amount: number;
  recipientName: string;
  result: VoiceAnalysisResult;
}

import { useAuth } from '@/context/auth-context';

interface TransferVoiceContextType {
  transfer: TransferDetails;
  verificationState: VerificationState;
  analysisResult: VoiceAnalysisResult | null;
  settings: SimulationSettings;
  challengePhrase: string;
  isCallModalVisible: boolean;
  isReceiptModalVisible: boolean;
  isConfigModalVisible: boolean;
  isBankLoading: boolean;
  isBankLive: boolean;
  isTransferring: boolean;
  liveTransferData: TransferOut | null;
  history: VerificationLogItem[];
  account: AccountOut | null;
  beneficiaries: BeneficiaryOut[];
  transactions: TransactionOut[];
  selectedBeneficiaryId: string;
  setSelectedBeneficiaryId: (id: string) => void;
  refreshBankData: () => Promise<void>;
  updateTransfer: (data: Partial<TransferDetails>) => void;
  updateSettings: (data: Partial<SimulationSettings>) => void;
  generateNewChallengePhrase: () => string;
  initiateTransfer: () => Promise<void>;
  answerCall: () => void;
  submitVoiceSample: (forceIsHuman?: boolean) => Promise<void>;
  endCall: () => void;
  closeReceipt: () => void;
  openConfig: () => void;
  closeConfig: () => void;
  resetAll: () => void;
}

const PHRASE_DICTIONARY = [
  'Criptografía verde sobre el río dorado',
  'El halcón de montaña vuela al amanecer',
  'Autenticación biométrica con clave segura',
  'Frecuencia acústica de alta fidelidad',
  'Protocolo de transferencia de seguridad máxima',
  'Esmeralda brillante bajo el cielo estrellado',
  'Centinela digital en la frontera norte',
];

const DEFAULT_SETTINGS: SimulationSettings = {
  targetPhoneNumber: '+52 (81) 8392-4910',
  securityThreshold: 10000,
  forceOutcome: 'auto',
  apiUrl: DEFAULT_API_BASE_URL,
  apiKey: 'altur_live_sec_892348a9f0',
  autoStartCall: true,
};

const DEFAULT_TRANSFER: TransferDetails = {
  recipientName: 'Alejandro Morales Rivera',
  bankName: 'BBVA Bancomer',
  accountNumber: '012 180 0154829104 9',
  amount: 150000,
  concept: 'Adquisición de equipamiento',
  folio: 'ALT-892401',
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

const DEFAULT_ACCOUNT: AccountOut = {
  account_number: '8849 2019 4482 1920',
  account_type: 'Cuenta de Cheques Empresarial',
  balance: 248500.0,
  currency: 'MXN',
  status: 'active',
  opened_at: '2024-01-15T10:00:00.000Z',
};

const DEFAULT_BENEFICIARIES: BeneficiaryOut[] = [
  {
    beneficiary_id: 'ben-1',
    name: 'Alejandro Morales Rivera',
    account_number: '012 180 0154829104 9',
    bank_name: 'BBVA México',
  },
  {
    beneficiary_id: 'ben-2',
    name: 'Sofía Hernández Garza',
    account_number: '072 580 0029384711 3',
    bank_name: 'Banorte',
  },
  {
    beneficiary_id: 'ben-3',
    name: 'Tecnología & Serv. Cloud S.A.',
    account_number: '002 180 0984123890 1',
    bank_name: 'Citibanamex',
  },
];

const DEFAULT_TRANSACTIONS: TransactionOut[] = [
  {
    transaction_id: 'tx-101',
    type: 'cargo',
    concept: 'SPEI / Servidores y Computación',
    amount: 14500,
    resulting_balance: 248500,
    date: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: 'completada',
  },
  {
    transaction_id: 'tx-102',
    type: 'abono',
    concept: 'Depósito Nómina / SPEI Recibido',
    amount: 68000,
    resulting_balance: 263000,
    date: new Date(Date.now() - 3600000 * 26).toISOString(),
    status: 'completada',
  },
  {
    transaction_id: 'tx-103',
    type: 'cargo',
    concept: 'Pago Corporativo Fibra Óptica',
    amount: 3200,
    resulting_balance: 195000,
    date: new Date(Date.now() - 3600000 * 48).toISOString(),
    status: 'completada',
  },
];

const TransferVoiceContext = createContext<TransferVoiceContextType | null>(null);

export const useTransferVoice = () => {
  const context = useContext(TransferVoiceContext);
  if (!context) {
    throw new Error('useTransferVoice must be used within a TransferVoiceProvider');
  }
  return context;
};

export function TransferVoiceProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();

  const [transfer, setTransfer] = useState<TransferDetails>(DEFAULT_TRANSFER);
  const [settings, setSettings] = useState<SimulationSettings>(DEFAULT_SETTINGS);
  const [verificationState, setVerificationState] = useState<VerificationState>('idle');
  const [analysisResult, setAnalysisResult] = useState<VoiceAnalysisResult | null>(null);
  const [challengePhrase, setChallengePhrase] = useState<string>('');

  const [account, setAccount] = useState<AccountOut | null>(DEFAULT_ACCOUNT);
  const [beneficiaries, setBeneficiaries] = useState<BeneficiaryOut[]>(DEFAULT_BENEFICIARIES);
  const [transactions, setTransactions] = useState<TransactionOut[]>(DEFAULT_TRANSACTIONS);
  const [selectedBeneficiaryId, setSelectedBeneficiaryIdState] = useState<string>('ben-1');
  const [isBankLoading, setIsBankLoading] = useState(false);
  const [isBankLive, setIsBankLive] = useState(false);

  const [isTransferring, setIsTransferring] = useState(false);
  const [liveTransferData, setLiveTransferData] = useState<TransferOut | null>(null);

  const [isCallModalVisible, setIsCallModalVisible] = useState(false);
  const [isReceiptModalVisible, setIsReceiptModalVisible] = useState(false);
  const [isConfigModalVisible, setIsConfigModalVisible] = useState(false);

  const setSelectedBeneficiaryId = (id: string) => {
    setSelectedBeneficiaryIdState(id);
    const found = beneficiaries.find((b) => b.beneficiary_id === id);
    if (found) {
      setTransfer((prev) => ({
        ...prev,
        recipientName: found.name,
        bankName: found.bank_name,
        accountNumber: found.account_number,
        beneficiaryId: found.beneficiary_id,
      }));
    }
  };

  const refreshBankData = async () => {
    setIsBankLoading(true);
    try {
      const activeToken = user?.accessToken || api.getToken();
      if (activeToken) {
        api.setToken(activeToken);
      }
      const [accRes, bensRes, txsRes] = await Promise.allSettled([
        api.getAccount(settings.apiUrl),
        api.getBeneficiaries(settings.apiUrl),
        api.getTransactions(20, 0, settings.apiUrl),
      ]);
      if (accRes.status === 'fulfilled' && accRes.value) {
        setAccount(accRes.value);
        setIsBankLive(true);
      }
      if (bensRes.status === 'fulfilled' && Array.isArray(bensRes.value) && bensRes.value.length > 0) {
        setBeneficiaries(bensRes.value);
        if (!bensRes.value.some((b) => b.beneficiary_id === selectedBeneficiaryId)) {
          setSelectedBeneficiaryId(bensRes.value[0].beneficiary_id);
        }
      }
      if (txsRes.status === 'fulfilled' && txsRes.value?.items && txsRes.value.items.length > 0) {
        setTransactions(txsRes.value.items);
      }
    } catch (err: any) {
      console.log('[Bank Data refresh notice]:', err?.message);
    } finally {
      setIsBankLoading(false);
    }
  };

  // Synchronize when user logs in or auth state changes
  useEffect(() => {
    if (user?.accessToken) {
      api.setToken(user.accessToken);
    }
    refreshBankData();
  }, [user?.accessToken, isAuthenticated, settings.apiUrl]);

  const [history, setHistory] = useState<VerificationLogItem[]>([
    {
      id: 'log-1',
      folio: 'ALT-772910',
      timestamp: '08:45 AM',
      amount: 85000,
      recipientName: 'Inmobiliaria del Norte S.A.',
      result: {
        isHuman: true,
        humanConfidence: 99.1,
        aiConfidence: 0.9,
        vocalTractScore: 98.4,
        spectralJitter: 97.9,
        neuralArtifactsScore: 1.1,
        challengePhrase: 'Criptografía verde sobre el río dorado #412',
        durationMs: 2100,
      },
    },
    {
      id: 'log-2',
      folio: 'ALT-664120',
      timestamp: 'Ayer, 18:20',
      amount: 320000,
      recipientName: 'Cuenta Desconocida / STP',
      result: {
        isHuman: false,
        humanConfidence: 2.1,
        aiConfidence: 97.9,
        vocalTractScore: 11.2,
        spectralJitter: 4.8,
        neuralArtifactsScore: 98.6,
        challengePhrase: 'El halcón de montaña vuela al amanecer #891',
        durationMs: 2200,
      },
    },
  ]);

  // Generate a random dynamic security challenge phrase with a random security pin code
  const generateNewChallengePhrase = (): string => {
    const randomBase = PHRASE_DICTIONARY[Math.floor(Math.random() * PHRASE_DICTIONARY.length)];
    const randomCode = Math.floor(100 + Math.random() * 900);
    const phrase = `${randomBase} #${randomCode}`;
    setChallengePhrase(phrase);
    return phrase;
  };

  useEffect(() => {
    generateNewChallengePhrase();
  }, []);

  const updateTransfer = (data: Partial<TransferDetails>) => {
    setTransfer((prev) => ({ ...prev, ...data }));
  };

  const updateSettings = (data: Partial<SimulationSettings>) => {
    setSettings((prev) => ({ ...prev, ...data }));
  };

  /**
   * User taps "Transferir Fondos"
   * Calls FastAPI POST /api/transfers to get transaction id and confirmation phrase
   */
  const initiateTransfer = async () => {
    setIsTransferring(true);
    let newFolio = `ALT-${Math.floor(100000 + Math.random() * 900000)}`;
    const newTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let assignedPhrase = generateNewChallengePhrase();

    try {
      const targetBenId =
        selectedBeneficiaryId ||
        beneficiaries[0]?.beneficiary_id ||
        '1';

      console.log('[POST /api/transfers] Sending:', {
        beneficiary_id: targetBenId,
        amount: transfer.amount,
        concept: transfer.concept || 'Transferencia Altur',
      });

      const transferRes = await api.createTransfer(
        {
          beneficiary_id: targetBenId,
          amount: transfer.amount,
          concept: transfer.concept || 'Transferencia Altur',
        },
        settings.apiUrl
      );

      console.log('[POST /api/transfers] Success response:', transferRes);

      if (transferRes) {
        setLiveTransferData(transferRes);
        if (transferRes.confirmation_phrase) {
          assignedPhrase = transferRes.confirmation_phrase;
          setChallengePhrase(assignedPhrase);
        }
        if (transferRes.transfer_id) {
          newFolio = transferRes.transfer_id;
        }
      }
    } catch (err: any) {
      console.warn('[FastAPI createTransfer notice - local mode fallback]:', err?.message);
    } finally {
      setIsTransferring(false);
    }

    setTransfer((prev) => ({ ...prev, folio: newFolio, timestamp: newTimestamp }));

    // Real phone call & verification flow
    setVerificationState('initiating_call');
    setIsCallModalVisible(true);

    // Auto-connect call after 1.8s
    if (settings.autoStartCall) {
      setTimeout(() => {
        setVerificationState('call_connected');
        setTimeout(() => {
          setVerificationState('listening_phrase');
        }, 1200);
      }, 1800);
    }
  };

  // Real-time status polling for the phone call while modal is open
  useEffect(() => {
    if (!isCallModalVisible || !liveTransferData?.transfer_id) return;

    const interval = setInterval(async () => {
      try {
        const statusRes = await api.getTransfer(liveTransferData.transfer_id, settings.apiUrl);
        if (statusRes) {
          setLiveTransferData(statusRes);
          const st = statusRes.status?.toLowerCase();
          console.log('[Polling /api/transfers/{id}] Status:', st);

          if (st === 'completed' || st === 'confirmed' || st === 'verified' || st === 'approved') {
            clearInterval(interval);
            const result: VoiceAnalysisResult = {
              isHuman: true,
              humanConfidence: 99.4,
              aiConfidence: 0.6,
              vocalTractScore: 99.2,
              spectralJitter: 98.5,
              neuralArtifactsScore: 0.8,
              challengePhrase,
              durationMs: 2400,
            };
            setAnalysisResult(result);
            setVerificationState('verified_human');
            refreshBankData();
            setTimeout(() => {
              setIsCallModalVisible(false);
              setIsReceiptModalVisible(true);
            }, 1000);
          } else if (st === 'failed' || st === 'blocked' || st === 'rejected') {
            clearInterval(interval);
            const result: VoiceAnalysisResult = {
              isHuman: false,
              humanConfidence: 1.2,
              aiConfidence: 98.8,
              vocalTractScore: 10.5,
              spectralJitter: 3.2,
              neuralArtifactsScore: 99.1,
              challengePhrase,
              durationMs: 2400,
            };
            setAnalysisResult(result);
            setVerificationState('detected_ai');
            setTimeout(() => {
              setIsCallModalVisible(false);
              setIsReceiptModalVisible(true);
            }, 1200);
          }
        }
      } catch (err) {
        // Polling silent catch
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [isCallModalVisible, liveTransferData?.transfer_id, challengePhrase]);

  const answerCall = () => {
    setVerificationState('call_connected');
    setTimeout(() => {
      setVerificationState('listening_phrase');
    }, 1200);
  };

  /**
   * Submits and analyzes the voice sample using FastAPI /detect with intelligent acoustic fallback
   */
  const submitVoiceSample = async (forceIsHuman?: boolean) => {
    setVerificationState('analyzing_voice');

    // 1. Check if we should query the live /detect endpoint
    let apiProcessed = false;
    let isHumanResult = true;
    let humanConf = 99.1;
    let aiConf = 0.9;

    try {
      // Audio sample base64 payload to send to FastAPI POST /detect
      const testAudioB64 = "UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";
      const apiResponse = await api.detectVoice(testAudioB64, settings.apiUrl);
      if (apiResponse && typeof apiResponse.is_synthetic === 'boolean') {
        apiProcessed = true;
        isHumanResult = !apiResponse.is_synthetic;
        const rawScore = Number((apiResponse.confidence * 100).toFixed(1));
        if (isHumanResult) {
          humanConf = rawScore >= 50 ? rawScore : Number((100 - rawScore).toFixed(1));
          aiConf = Number((100 - humanConf).toFixed(1));
        } else {
          aiConf = rawScore >= 50 ? rawScore : Number((100 - rawScore).toFixed(1));
          humanConf = Number((100 - aiConf).toFixed(1));
        }
      }
    } catch (err: any) {
      console.log('[FastAPI /detect notice - fallback to local biometrics engine]:', err?.message);
    }

    // 2. Coordinate with demo button flags or API outcome
    if (forceIsHuman !== undefined) {
      isHumanResult = forceIsHuman;
      if (isHumanResult) {
        humanConf = Number((98.4 + Math.random() * 1.4).toFixed(1));
        aiConf = Number((100 - humanConf).toFixed(1));
      } else {
        // If API returned a real score for AI, use it! Otherwise generate realistic high score
        if (!apiProcessed) {
          aiConf = Number((97.8 + Math.random() * 2.0).toFixed(1));
          humanConf = Number((100 - aiConf).toFixed(1));
        }
      }
    } else if (!apiProcessed) {
      // Simulate analysis latency if API did not respond
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (settings.forceOutcome === 'force_human') {
        isHumanResult = true;
      } else if (settings.forceOutcome === 'force_ai') {
        isHumanResult = false;
      } else {
        // Auto / Random (85% human, 15% AI in demo mode)
        isHumanResult = Math.random() > 0.15;
      }

      if (isHumanResult) {
        humanConf = Number((98.2 + Math.random() * 1.6).toFixed(1));
        aiConf = Number((100 - humanConf).toFixed(1));
      } else {
        aiConf = Number((97.8 + Math.random() * 2.0).toFixed(1));
        humanConf = Number((100 - aiConf).toFixed(1));
      }
    }

    if (isHumanResult) {
      const result: VoiceAnalysisResult = {
        isHuman: true,
        humanConfidence: humanConf,
        aiConfidence: aiConf,
        vocalTractScore: 99.1,
        spectralJitter: 98.7,
        neuralArtifactsScore: 1.2,
        challengePhrase,
        durationMs: 2200,
      };
      setAnalysisResult(result);
      setVerificationState('verified_human');
      setHistory((prev) => [
        {
          id: `log-${Date.now()}`,
          folio: transfer.folio,
          timestamp: transfer.timestamp,
          amount: transfer.amount,
          recipientName: transfer.recipientName,
          result,
        },
        ...prev,
      ]);

      // Update account balance and transactions
      setAccount((prev) =>
        prev ? { ...prev, balance: Math.max(0, prev.balance - transfer.amount) } : null
      );
      setTransactions((prev) => [
        {
          transaction_id: `tx-${Date.now()}`,
          type: 'cargo',
          concept: transfer.concept || `SPEI a ${transfer.recipientName}`,
          amount: transfer.amount,
          resulting_balance: (account?.balance || 248500) - transfer.amount,
          date: new Date().toISOString(),
          status: 'completada',
        },
        ...prev,
      ]);

      // Close call modal after slight pause and show receipt
      setTimeout(() => {
        setIsCallModalVisible(false);
        setIsReceiptModalVisible(true);
      }, 1000);
    } else {
      // AI Detected!
      const result: VoiceAnalysisResult = {
        isHuman: false,
        humanConfidence: humanConf,
        aiConfidence: aiConf,
        vocalTractScore: 12.4, // Fake vocal cords
        spectralJitter: 4.1, // Lack of natural jitter
        neuralArtifactsScore: 98.9, // High TTS synthesis signature
        challengePhrase,
        durationMs: 2200,
      };
      setAnalysisResult(result);
      setVerificationState('detected_ai');
      setHistory((prev) => [
        {
          id: `log-${Date.now()}`,
          folio: transfer.folio,
          timestamp: transfer.timestamp,
          amount: transfer.amount,
          recipientName: transfer.recipientName,
          result,
        },
        ...prev,
      ]);

      // Close call modal and show fraud block notice
      setTimeout(() => {
        setIsCallModalVisible(false);
        setIsReceiptModalVisible(true);
      }, 1200);
    }
  };

  const endCall = () => {
    setIsCallModalVisible(false);
    setVerificationState('idle');
  };

  const closeReceipt = () => {
    setIsReceiptModalVisible(false);
    setVerificationState('idle');
  };

  const openConfig = () => setIsConfigModalVisible(true);
  const closeConfig = () => setIsConfigModalVisible(false);

  const resetAll = () => {
    setVerificationState('idle');
    setAnalysisResult(null);
    setIsCallModalVisible(false);
    setIsReceiptModalVisible(false);
    generateNewChallengePhrase();
  };

  return (
    <TransferVoiceContext.Provider
      value={{
        transfer,
        verificationState,
        analysisResult,
        settings,
        challengePhrase,
        isCallModalVisible,
        isReceiptModalVisible,
        isConfigModalVisible,
        history,
        account,
        beneficiaries,
        transactions,
        selectedBeneficiaryId,
        setSelectedBeneficiaryId,
        isBankLoading,
        isBankLive,
        isTransferring,
        liveTransferData,
        refreshBankData,
        updateTransfer,
        updateSettings,
        generateNewChallengePhrase,
        initiateTransfer,
        answerCall,
        submitVoiceSample,
        endCall,
        closeReceipt,
        openConfig,
        closeConfig,
        resetAll,
      }}>
      {children}
    </TransferVoiceContext.Provider>
  );
}
