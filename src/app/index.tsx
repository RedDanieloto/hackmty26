import React from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';

import { TransferForm } from '@/components/transfer/transfer-form';
import { AppIcon } from '@/components/ui/app-icon';
import { BrandColors, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useTransferVoice } from '@/context/transfer-voice-context';

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const { account, isBankLoading, isBankLive, refreshBankData } = useTransferVoice();
  const colorScheme = useColorScheme();

  const isDark = colorScheme === 'dark';

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 2,
    }).format(val);
  };

  // Get first name for compact header display
  const displayName = user?.name?.split(' ')[0] || 'Usuario';

  return (
    <View style={styles.outerContainer}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>

          {/* Top Bar / Compact Responsive Header */}
          <View style={styles.topBar}>
            <View style={styles.greetingContainer}>
              <Text style={styles.greetingText} numberOfLines={1} ellipsizeMode="tail">
                Hola, {displayName}
              </Text>
              <View style={styles.sessionStatusPill}>
                <View
                  style={[
                    styles.activeDot,
                    { backgroundColor: isBankLive ? '#10B981' : '#34D399' },
                  ]}
                />
                <Text style={styles.sessionStatusText}>
                  {isBankLive ? 'EN LÍNEA • FASTAPI' : 'SESIÓN ACTIVA'}
                </Text>
              </View>
            </View>

            {/* Logout Action Button */}
            <View style={styles.topBarActions}>
              <Pressable
                onPress={logout}
                accessibilityLabel="Cerrar Sesión"
                style={({ pressed }) => [styles.iconBtnLogout, pressed && styles.btnPressed]}>
                <AppIcon name="logout" size={14} color="#F87171" />
              </Pressable>
            </View>
          </View>

          {/* Account Balance Card */}
          <View style={styles.accountCard}>
            <View style={styles.accountCardHeader}>
              <View style={styles.accountCardHeaderLeft}>
                <Text style={styles.accountCardBank} numberOfLines={1} ellipsizeMode="tail">
                  {account?.account_type ? account.account_type.toUpperCase() : 'BANCO ALTUR • PRIORITY'}
                </Text>
                <Text style={styles.accountCardNumber}>
                  {account?.account_number || '•••• •••• •••• 9201'}
                </Text>
              </View>

              <View style={styles.headerRightRow}>
                <Pressable
                  onPress={refreshBankData}
                  disabled={isBankLoading}
                  accessibilityLabel="Actualizar saldo"
                  style={({ pressed }) => [styles.refreshBtn, pressed && styles.btnPressed]}>
                  {isBankLoading ? (
                    <ActivityIndicator size="small" color={BrandColors.sandDune} />
                  ) : (
                    <AppIcon name="refresh" size={13} color={BrandColors.sandDune} />
                  )}
                </Pressable>
                <View style={styles.shieldPill}>
                  <AppIcon name="shield-check" size={11} color="#34D399" />
                  <Text style={styles.shieldPillText}>Protegido</Text>
                </View>
              </View>
            </View>

            <View style={styles.balanceSection}>
              <Text style={styles.balanceLabel}>Saldo Disponible</Text>
              <Text style={styles.balanceValue}>
                {account ? formatCurrency(account.balance) : '$248,500.00 MXN'}
              </Text>
              {isBankLive && (
                <Text style={styles.liveApiBadge}>• Datos en vivo del servidor bancario</Text>
              )}
            </View>

            <View style={styles.accountCardFooter}>
              <AppIcon name="shield" size={12} color={BrandColors.sandDuneMuted} />
              <Text style={styles.accountCardFooterText}>
                Protegido contra llamadas fraudulentas y deepfakes de IA
              </Text>
            </View>
          </View>

          {/* Transfer Form Component */}
          <TransferForm />

          {/* Powered by Altur Footer */}
          <View style={styles.footerContainer}>
            <Text style={styles.poweredLabel}>POWERED BY</Text>
            <Image
              source={
                isDark
                  ? require('@/assets/images/altur-logo-sand.png')
                  : require('@/assets/images/altur-logo-green.png')
              }
              style={styles.alturLogoFooter}
              contentFit="contain"
            />
            <Text style={styles.footerSub}>
              Motor de Detección de Voz Humana vs Inteligencia Artificial
            </Text>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: BrandColors.hunterGreenDeep,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    // Crucial 160px bottom padding so content is never covered by the floating tab bar
    paddingBottom: 160,
    alignItems: 'center',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
    gap: 16,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 4,
  },
  greetingContainer: {
    flex: 1,
    marginRight: 10,
  },
  greetingText: {
    fontSize: 20,
    fontWeight: '800',
    color: BrandColors.sandDuneLight,
    letterSpacing: -0.2,
  },
  sessionStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(221, 214, 185, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    marginTop: 4,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(221, 214, 185, 0.25)',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  sessionStatusText: {
    color: BrandColors.sandDune,
    fontWeight: '700',
    fontSize: 9,
    letterSpacing: 0.6,
  },
  topBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(221, 214, 185, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(221, 214, 185, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBtnLogout: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.94 }],
  },
  accountCard: {
    width: '100%',
    maxWidth: 560,
    backgroundColor: '#28412D',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1.2,
    borderColor: BrandColors.sandDune,
    ...Platform.select({
      web: {
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35)',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 6,
      },
    }),
  },
  accountCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  accountCardHeaderLeft: {
    flex: 1,
    marginRight: 8,
  },
  accountCardBank: {
    fontSize: 10,
    fontWeight: '800',
    color: BrandColors.sandDune,
    letterSpacing: 1,
  },
  accountCardNumber: {
    fontSize: 12,
    color: BrandColors.sandDuneMuted,
    marginTop: 2,
  },
  headerRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  refreshBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(221, 214, 185, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(221, 214, 185, 0.25)',
  },
  shieldPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  shieldPillText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#34D399',
  },
  balanceSection: {
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 10,
    color: BrandColors.sandDune,
    opacity: 0.8,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  balanceValue: {
    fontSize: 28,
    fontWeight: '800',
    color: BrandColors.sandDuneLight,
    letterSpacing: -0.5,
  },
  liveApiBadge: {
    fontSize: 9.5,
    color: '#34D399',
    fontWeight: '600',
    marginTop: 3,
  },
  accountCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(221, 214, 185, 0.15)',
    paddingTop: 8,
  },
  accountCardFooterText: {
    fontSize: 10.5,
    color: BrandColors.sandDune,
    opacity: 0.85,
    flex: 1,
  },
  footerContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 5,
  },
  poweredLabel: {
    letterSpacing: 2,
    opacity: 0.6,
    fontSize: 9.5,
    fontWeight: '700',
    color: BrandColors.sandDune,
  },
  alturLogoFooter: {
    width: 100,
    height: 26,
  },
  footerSub: {
    fontSize: 10.5,
    color: BrandColors.sandDuneMuted,
    textAlign: 'center',
  },
});
