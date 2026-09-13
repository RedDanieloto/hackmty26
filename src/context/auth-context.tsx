import React, { createContext, useContext, useState } from 'react';
import { api, CustomerOut, DEFAULT_API_BASE_URL } from '@/services/api';

export interface UserProfile {
  name: string;
  email: string;
  phoneNumber?: string;
  accessToken?: string;
  authMethod: 'credentials' | 'voice' | 'guest';
}

export interface LoginResult {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isGuest: boolean;
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  loginWithVoice: () => Promise<boolean>;
  continueAsGuest: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isGuest: false,
  user: null,
  isLoading: false,
  login: async () => ({ success: false }),
  loginWithVoice: async () => false,
  continueAsGuest: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Real FastAPI Authentication via POST /auth/login
   */
  const login = async (email: string, password: string): Promise<LoginResult> => {
    setIsLoading(true);
    try {
      const response = await api.login({ email, password });

      const loggedUser: UserProfile = {
        name: response.customer.full_name || email.split('@')[0],
        email: response.customer.email || email,
        phoneNumber: response.customer.phone_number,
        accessToken: response.access_token,
        authMethod: 'credentials',
      };

      setUser(loggedUser);
      setIsAuthenticated(true);
      setIsGuest(false);
      return { success: true };
    } catch (error: any) {
      console.warn('API login failed:', error?.message);
      return {
        success: false,
        error: error?.message || 'Error al iniciar sesión',
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Prepared for Voice Biometric API:
   * const response = await fetch('https://api.yourdomain.com/v1/auth/voice-verify', { ... });
   */
  const loginWithVoice = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulated voice recognition processing time
      await new Promise((resolve) => setTimeout(resolve, 1400));

      const mockUser: UserProfile = {
        name: 'Voz Verificada',
        email: 'biometric@altur.io',
        authMethod: 'voice',
      };

      setUser(mockUser);
      setIsAuthenticated(true);
      setIsGuest(false);
      return true;
    } catch (error) {
      console.error('Error during voice login:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Continue without login (Guest Mode)
   */
  const continueAsGuest = () => {
    setIsAuthenticated(false);
    setIsGuest(true);
    setUser({
      name: 'Invitado',
      email: 'invitado@securevoice.app',
      authMethod: 'guest',
    });
  };

  /**
   * Log out and return to the login screen
   */
  const logout = () => {
    api.setToken(null);
    setIsAuthenticated(false);
    setIsGuest(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isGuest,
        user,
        isLoading,
        login,
        loginWithVoice,
        continueAsGuest,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
