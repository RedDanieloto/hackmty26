import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashProvider } from '@/components/animated-splash';
import { LoginScreen } from '@/components/login-screen';
import AppTabs from '@/components/app-tabs';
import { AuthProvider, useAuth } from '@/context/auth-context';
import { TransferVoiceProvider } from '@/context/transfer-voice-context';
import { SecurityCallModal } from '@/components/transfer/security-call-modal';
import { TransferReceiptModal } from '@/components/transfer/transfer-receipt-modal';

SplashScreen.preventAutoHideAsync().catch(() => {});

function AppRoot() {
  const { isAuthenticated } = useAuth();

  // If not logged in, show the Login screen
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <>
      <AppTabs />
      <SecurityCallModal />
      <TransferReceiptModal />
    </>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <TransferVoiceProvider>
          <AnimatedSplashProvider>
            <AppRoot />
          </AnimatedSplashProvider>
        </TransferVoiceProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
