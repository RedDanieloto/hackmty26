import React, { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedFluidBlob } from './animated-fluid-blob';
import { AppIcon } from '@/components/ui/app-icon';
import { BrandColors } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';

import { api, DEFAULT_API_BASE_URL } from '@/services/api';

export function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login, loginWithVoice, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [voiceScanning, setVoiceScanning] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [apiLatency, setApiLatency] = useState<number | undefined>(undefined);

  // API Configuration Modal State
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [apiUrlInput, setApiUrlInput] = useState(api.getBaseUrl());
  const [isTestingUrl, setIsTestingUrl] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const testAndSaveUrl = async (urlToTest?: string) => {
    const targetUrl = (urlToTest || apiUrlInput).trim();
    if (!targetUrl) return;

    setIsTestingUrl(true);
    setTestResult(null);
    try {
      const res = await api.checkHealth(targetUrl);
      if (res.status === 'ok') {
        api.setBaseUrl(targetUrl);
        setApiStatus('connected');
        setApiLatency(res.latencyMs);
        setTestResult({
          success: true,
          message: `¡Conexión exitosa! (${res.latencyMs || 0}ms): ${res.message}`,
        });
        setTimeout(() => {
          setShowConfigModal(false);
          setTestResult(null);
        }, 1000);
      } else {
        setApiStatus('error');
        setTestResult({
          success: false,
          message: res.message || 'No se pudo conectar con el servidor',
        });
      }
    } catch (err: any) {
      setApiStatus('error');
      setTestResult({
        success: false,
        message: err?.message || 'Error al conectar',
      });
    } finally {
      setIsTestingUrl(false);
    }
  };

  // Check API health on mount
  React.useEffect(() => {
    let isMounted = true;
    api.checkHealth().then((res) => {
      if (!isMounted) return;
      if (res.status === 'ok') {
        setApiStatus('connected');
        setApiLatency(res.latencyMs);
      } else {
        setApiStatus('error');
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCredentialsLogin = async () => {
    setErrorMessage('');
    if (!email.trim()) {
      setErrorMessage('Por favor introduce tu correo electrónico.');
      return;
    }
    if (!password) {
      setErrorMessage('Por favor introduce tu contraseña.');
      return;
    }
    const result = await login(email, password);
    if (!result.success) {
      setErrorMessage(result.error || 'Correo o contraseña incorrectos.');
    }
  };

  const handleVoiceLogin = async () => {
    setErrorMessage('');
    setVoiceScanning(true);
    try {
      await loginWithVoice();
    } finally {
      setVoiceScanning(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Dynamic Animated Organic Liquid Aura Blob */}
      <AnimatedFluidBlob />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: Math.max(insets.top + 20, 48),
              paddingBottom: Math.max(insets.bottom + 20, 36),
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          {/* Header Brand Section */}
          <View style={styles.header}>
            <View style={styles.iconWrapper}>
              <Image
                source={require('@/assets/images/voice-auth-icon.png')}
                style={styles.voiceIcon}
                contentFit="cover"
              />
            </View>

            <Text style={styles.title}>Secure voice authentication</Text>

            <View style={styles.badge}>
              <View style={styles.badgeDot} />
              <Text style={styles.badgeText}>SISTEMA DE IDENTIDAD BIOMÉTRICA</Text>
            </View>

            {/* FastAPI Connection Indicator (Pressable) */}
            <Pressable
              onPress={() => setShowConfigModal(true)}
              style={({ pressed }) => [
                styles.apiStatusPill,
                apiStatus === 'connected' ? styles.apiPillOnline : styles.apiPillOffline,
                pressed && { opacity: 0.8 },
              ]}>
              <View
                style={[
                  styles.apiStatusDot,
                  {
                    backgroundColor:
                      apiStatus === 'connected' ? '#10B981' : apiStatus === 'checking' ? '#F59E0B' : '#EF4444',
                  },
                ]}
              />
            </Pressable>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            {errorMessage ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errorMessage}</Text>
                <Pressable
                  onPress={() => setShowConfigModal(true)}
                  style={styles.errorConfigLink}>
                  <AppIcon name="settings" size={12} color={BrandColors.sandDune} />
                  <Text style={styles.errorConfigLinkText}>
                    Actualizar URL del Servidor FastAPI
                  </Text>
                </Pressable>
              </View>
            ) : null}

            {/* Email / Username */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Usuario o Correo</Text>
              <TextInput
                style={styles.input}
                placeholder="ej. usuario@altur.io"
                placeholderTextColor="rgba(221, 214, 185, 0.45)"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
              />
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <View style={styles.passwordLabelRow}>
                <Text style={styles.inputLabel}>Contraseña o PIN</Text>
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <Text style={styles.togglePasswordText}>
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                  </Text>
                </Pressable>
              </View>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="rgba(221, 214, 185, 0.45)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
            </View>

            {/* Primary Login Button */}
            <Pressable
              onPress={handleCredentialsLogin}
              disabled={isLoading || voiceScanning}
              style={({ pressed }) => [
                styles.primaryButton,
                (pressed || isLoading) && styles.buttonPressed,
              ]}>
              {isLoading && !voiceScanning ? (
                <ActivityIndicator color={BrandColors.sandDune} size="small" />
              ) : (
                <Text style={styles.primaryButtonText}>Iniciar Sesión</Text>
              )}
            </Pressable>
          </View>

          {/* Footer "powered by altur" */}
          <View style={styles.footer}>
            <Text style={styles.poweredText}>powered by</Text>
            <Image
              source={require('@/assets/images/altur-logo-sand.png')}
              style={styles.alturLogo}
              contentFit="contain"
            />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* API Configuration Modal */}
      <Modal
        visible={showConfigModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfigModal(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.configModalCard}>
            <View style={styles.configModalHeader}>
              <View style={styles.configModalTitleRow}>
                <AppIcon name="settings" size={16} color={BrandColors.sandDune} />
                <Text style={styles.configModalTitle}>Configurar Servidor FastAPI</Text>
              </View>
              <Pressable
                onPress={() => setShowConfigModal(false)}
                style={styles.configModalCloseBtn}>
                <AppIcon name="phone-off" size={14} color={BrandColors.sandDune} />
              </Pressable>
            </View>

            <Text style={styles.configModalDesc}>
              Ingresa la dirección IP o URL de tu servidor backend FastAPI:
            </Text>

            <View style={styles.configInputGroup}>
              <Text style={styles.configInputLabel}>URL del Servidor API</Text>
              <TextInput
                style={styles.configInput}
                value={apiUrlInput}
                onChangeText={setApiUrlInput}
                placeholder="http://64.177.86.66:8000 o http://localhost:8000"
                placeholderTextColor="rgba(221, 214, 185, 0.4)"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Presets */}
            <View style={styles.presetsRow}>
              <Pressable
                onPress={() => {
                  setApiUrlInput('http://localhost:8000');
                  testAndSaveUrl('http://localhost:8000');
                }}
                style={styles.presetPill}>
                <Text style={styles.presetPillText}>localhost:8000</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setApiUrlInput(DEFAULT_API_BASE_URL);
                  testAndSaveUrl(DEFAULT_API_BASE_URL);
                }}
                style={styles.presetPill}>
                <Text style={styles.presetPillText}>Producción (64.177.86.66)</Text>
              </Pressable>
            </View>

            {testResult ? (
              <View
                style={[
                  styles.configResultBox,
                  testResult.success ? styles.configResultSuccess : styles.configResultError,
                ]}>
                <Text
                  style={[
                    styles.configResultText,
                    testResult.success ? styles.configResultSuccessText : styles.configResultErrorText,
                  ]}>
                  {testResult.message}
                </Text>
              </View>
            ) : null}

            <Pressable
              onPress={() => testAndSaveUrl()}
              disabled={isTestingUrl}
              style={({ pressed }) => [
                styles.configSaveBtn,
                pressed && { opacity: 0.8 },
                isTestingUrl && { opacity: 0.6 },
              ]}>
              {isTestingUrl ? (
                <ActivityIndicator color="#18271B" size="small" />
              ) : (
                <Text style={styles.configSaveBtnText}>Probar y Guardar URL</Text>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#18271B', // Deep Hunter Green background
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 26,
  },
  iconWrapper: {
    width: 90,
    height: 90,
    borderRadius: 100,
    backgroundColor: BrandColors.hunterGreenDeep,
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 1.5,
    // borderColor: 'rgba(221, 214, 185, 0.35)',
    // shadowColor: BrandColors.sandDune,
    shadowOffset: { width: 0, height: 6 },
    // shadowOpacity: 0.2,
    elevation: 6,
    overflow: 'hidden',
    marginBottom: 16,
  },
  voiceIcon: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: BrandColors.sandDuneLight,
    textAlign: 'center',
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(221, 214, 185, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(221, 214, 185, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: BrandColors.sandDune,
  },
  badgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: BrandColors.sandDune,
    letterSpacing: 1,
  },
  apiStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    marginTop: 6,
    borderWidth: 1,
  },
  apiPillOnline: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  apiPillOffline: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  apiStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  apiStatusText: {
    fontSize: 9,
    fontWeight: '700',
    color: BrandColors.sandDune,
    letterSpacing: 0.6,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: 'rgba(35, 55, 39, 0.85)',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(221, 214, 185, 0.2)',
    ...Platform.select({
      web: {
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 18,
        elevation: 8,
      },
    }),
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: BrandColors.sandDune,
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  togglePasswordText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: BrandColors.sandDune,
    opacity: 0.8,
  },
  input: {
    height: 48,
    backgroundColor: 'rgba(22, 38, 25, 0.75)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(221, 214, 185, 0.25)',
    paddingHorizontal: 14,
    color: BrandColors.sandDuneLight,
    fontSize: 14,
  },
  primaryButton: {
    height: 48,
    backgroundColor: BrandColors.hunterGreen,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
    borderWidth: 1,
    borderColor: 'rgba(221, 214, 185, 0.3)',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(40, 65, 45, 0.4)',
      },
      default: {
        shadowColor: BrandColors.hunterGreenDark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
      },
    }),
  },
  primaryButtonText: {
    color: BrandColors.sandDuneLight,
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.3,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(221, 214, 185, 0.18)',
  },
  dividerText: {
    fontSize: 11,
    color: 'rgba(221, 214, 185, 0.65)',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  voiceButton: {
    height: 48,
    backgroundColor: 'rgba(62, 95, 68, 0.35)',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(221, 214, 185, 0.3)',
  },
  voiceButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  voiceScanningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  voiceWaveSymbol: {
    fontSize: 16,
  },
  voiceButtonText: {
    color: BrandColors.sandDune,
    fontWeight: '600',
    fontSize: 14,
    letterSpacing: 0.2,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.985 }],
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
    gap: 6,
  },
  poweredText: {
    fontSize: 11,
    color: 'rgba(221, 214, 185, 0.6)',
    fontWeight: '500',
    letterSpacing: 1.2,
    textTransform: 'lowercase',
  },
  alturLogo: {
    width: 120,
    height: 32,
  },
  errorConfigLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(221, 214, 185, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(221, 214, 185, 0.25)',
  },
  errorConfigLinkText: {
    fontSize: 11,
    fontWeight: '700',
    color: BrandColors.sandDune,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(5, 12, 7, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  configModalCard: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#1E3223',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: BrandColors.sandDune,
    ...Platform.select({
      web: {
        boxShadow: '0 16px 36px rgba(0, 0, 0, 0.6)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
      },
    }),
  },
  configModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  configModalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  configModalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: BrandColors.sandDuneLight,
  },
  configModalCloseBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(221, 214, 185, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  configModalDesc: {
    fontSize: 12,
    color: BrandColors.sandDuneMuted,
    lineHeight: 17,
    marginBottom: 16,
  },
  configInputGroup: {
    marginBottom: 12,
  },
  configInputLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: BrandColors.sandDune,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  configInput: {
    height: 46,
    backgroundColor: 'rgba(15, 26, 18, 0.85)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BrandColors.sandDune,
    paddingHorizontal: 12,
    color: BrandColors.sandDuneLight,
    fontSize: 13,
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  presetPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(221, 214, 185, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(221, 214, 185, 0.25)',
  },
  presetPillText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: BrandColors.sandDune,
  },
  configResultBox: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
    borderWidth: 1,
  },
  configResultSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  configResultError: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  configResultText: {
    fontSize: 11.5,
    textAlign: 'center',
    fontWeight: '500',
  },
  configResultSuccessText: {
    color: '#34D399',
  },
  configResultErrorText: {
    color: '#FCA5A5',
  },
  configSaveBtn: {
    height: 44,
    backgroundColor: BrandColors.sandDune,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  configSaveBtnText: {
    color: '#18271B',
    fontSize: 14,
    fontWeight: '700',
  },
});
