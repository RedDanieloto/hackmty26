import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppIcon } from '@/components/ui/app-icon';
import { BrandColors } from '@/constants/theme';
import { useTransferVoice } from '@/context/transfer-voice-context';

function CallWaveBar({ delay, height }: { delay: number; height: number }) {
  const anim = useSharedValue(10);

  useEffect(() => {
    anim.value = withRepeat(
      withSequence(
        withTiming(height, { duration: 250 + delay, easing: Easing.inOut(Easing.quad) }),
        withTiming(8, { duration: 250 + delay, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    height: anim.value,
  }));

  return <Animated.View style={[styles.callWaveBar, animatedStyle]} />;
}

export function SecurityCallModal() {
  const insets = useSafeAreaInsets();
  const {
    isCallModalVisible,
    verificationState,
    transfer,
    challengePhrase,
    liveTransferData,
    endCall,
  } = useTransferVoice();

  const [callSeconds, setCallSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);

  // Timer while connected
  useEffect(() => {
    let interval: any;
    if (isCallModalVisible) {
      interval = setInterval(() => {
        setCallSeconds((s) => s + 1);
      }, 1000);
    } else {
      setCallSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isCallModalVisible]);

  const formatCallTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  const isAnalyzing = verificationState === 'analyzing_voice';
  const displayPhrase = liveTransferData?.confirmation_phrase || challengePhrase;

  return (
    <Modal
      visible={isCallModalVisible}
      transparent={Platform.OS === 'web'}
      animationType="slide"
      statusBarTranslucent
      onRequestClose={endCall}>
      <View style={[styles.modalOverlay, { paddingTop: Math.max(insets.top, 12) }]}>
        <View style={styles.callContainer}>
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: Math.max(insets.bottom + 20, 28) },
            ]}
            showsVerticalScrollIndicator={false}
            bounces={false}>
            {/* Header: Caller Identity */}
            <View style={styles.callHeader}>
              <View style={styles.callerIconContainer}>
                <AppIcon name="phone-call" size={30} color={BrandColors.sandDune} />
              </View>

              <Text style={styles.callerName}>Centro de Seguridad Altur</Text>
              <Text style={styles.callerSub}>
                {liveTransferData?.transfer_id
                  ? `Folio ${liveTransferData.transfer_id} • ${formatCallTime(callSeconds)}`
                  : `Llamada Telefónica Activa • ${formatCallTime(callSeconds)}`}
              </Text>

              <View style={styles.statusPill}>
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor:
                        verificationState === 'initiating_call'
                          ? '#F59E0B'
                          : isAnalyzing
                          ? '#38BDF8'
                          : '#10B981',
                    },
                  ]}
                />
                <Text style={styles.statusPillText}>
                  {liveTransferData?.status
                    ? liveTransferData.status.toUpperCase()
                    : verificationState === 'initiating_call'
                    ? 'LLAMADA ENTRANTE...'
                    : 'ESCUCHANDO EN VIVO'}
                </Text>
              </View>
            </View>

            {/* Compact Transaction Snapshot */}
            <View style={styles.txSnapshotCard}>
              <View style={styles.txSnapshotRow}>
                <View style={styles.txSnapshotCol}>
                  <Text style={styles.txSnapshotLabel}>MONTO A AUTORIZAR</Text>
                  <Text style={styles.txSnapshotAmount}>
                    ${transfer.amount.toLocaleString('es-MX')} MXN
                  </Text>
                </View>
                <View style={[styles.txSnapshotCol, { alignItems: 'flex-end' }]}>
                  <Text style={styles.txSnapshotLabel}>BENEFICIARIO</Text>
                  <Text style={styles.txSnapshotRecipient} numberOfLines={1}>
                    {transfer.recipientName || 'Destinatario'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Central Hero: Drawn Confirmation Phrase Card */}
            <View style={styles.challengeBox}>
              <View style={styles.challengeHeaderRow}>
                <View style={styles.challengeHeaderLeft}>
                  <AppIcon name="shield-check" size={14} color={BrandColors.sandDune} />
                  <Text style={styles.challengeLabel}>FRASE DE VERIFICACIÓN</Text>
                </View>
                <View style={styles.liveTagBadge}>
                  <Text style={styles.liveTagText}>EN VIVO</Text>
                </View>
              </View>

              <Text style={styles.challengeInstruction}>
                Pronuncia en voz alta esta frase en tu llamada cuando el contestador te lo pida:
              </Text>

              {/* Big Drawn Phrase Display */}
              <View style={styles.phraseCard}>
                <Text style={styles.phraseQuoteMarkLeft}>“</Text>
                <Text style={styles.challengePhraseText} selectable>
                  {displayPhrase}
                </Text>
                <Text style={styles.phraseQuoteMarkRight}>”</Text>
              </View>

              {/* Live Audio Wave Visualizer */}
              <View style={styles.waveRow}>
                <CallWaveBar delay={0} height={26} />
                <CallWaveBar delay={60} height={42} />
                <CallWaveBar delay={120} height={50} />
                <CallWaveBar delay={180} height={38} />
                <CallWaveBar delay={90} height={52} />
                <CallWaveBar delay={150} height={36} />
                <CallWaveBar delay={30} height={22} />
              </View>

              <Text style={styles.listeningNotice}>
                {liveTransferData?.status === 'completed' || liveTransferData?.status === 'verified'
                  ? 'Voz humana verificada con éxito por el servidor.'
                  : 'El servidor bancario autorizará la transferencia en tiempo real al validar tu voz.'}
              </Text>

              {isAnalyzing && (
                <View style={styles.analyzingRow}>
                  <ActivityIndicator size="small" color={BrandColors.sandDune} />
                  <Text style={styles.analyzingText}>
                    Analizando micro-vibraciones acústicas y anti-IA...
                  </Text>
                </View>
              )}
            </View>

            {/* In-Call iOS Phone Controls */}
            <View style={styles.callControlsRow}>
              {/* Mute Button */}
              <Pressable
                onPress={() => setIsMuted(!isMuted)}
                style={styles.controlBtnWrapper}>
                <View style={[styles.controlCircle, isMuted && styles.controlCircleActive]}>
                  <AppIcon
                    name={isMuted ? 'mic-off' : 'mic'}
                    size={20}
                    color={isMuted ? '#EF4444' : BrandColors.sandDuneLight}
                  />
                </View>
                <Text style={styles.controlLabel}>{isMuted ? 'Silenciado' : 'Silencio'}</Text>
              </Pressable>

              {/* End Call Button (Big Red iOS Phone Button) */}
              <Pressable onPress={endCall} style={styles.endCallCircle}>
                <AppIcon name="phone-off" size={24} color="#FFFFFF" />
              </Pressable>

              {/* Speaker Button */}
              <Pressable
                onPress={() => setIsSpeaker(!isSpeaker)}
                style={styles.controlBtnWrapper}>
                <View style={[styles.controlCircle, isSpeaker && styles.controlCircleActive]}>
                  <AppIcon
                    name="speaker"
                    size={20}
                    color={isSpeaker ? '#18271B' : BrandColors.sandDuneLight}
                  />
                </View>
                <Text style={styles.controlLabel}>{isSpeaker ? 'Altavoz' : 'Auricular'}</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: '#121F14', // Immersive Hunter Green for mobile
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      web: {
        backgroundColor: 'rgba(5, 10, 7, 0.9)',
        padding: 16,
      },
    }),
  },
  callContainer: {
    width: '100%',
    flex: 1,
    maxWidth: 480,
    backgroundColor: '#121F14',
    ...Platform.select({
      web: {
        borderRadius: 28,
        borderWidth: 1.2,
        borderColor: 'rgba(221, 214, 185, 0.25)',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7)',
        maxHeight: 760,
        overflow: 'hidden',
      },
    }),
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  callHeader: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  callerIconContainer: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: 'rgba(30, 48, 34, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: BrandColors.sandDune,
    marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: BrandColors.sandDune,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
    }),
  },
  callerName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FAF6EE',
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  callerSub: {
    fontSize: 12,
    color: BrandColors.sandDune,
    opacity: 0.9,
    marginTop: 3,
    textAlign: 'center',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(221, 214, 185, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(221, 214, 185, 0.25)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusPillText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: BrandColors.sandDune,
    letterSpacing: 0.8,
  },
  txSnapshotCard: {
    width: '100%',
    backgroundColor: 'rgba(30, 48, 34, 0.75)',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(221, 214, 185, 0.15)',
    marginBottom: 12,
  },
  txSnapshotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  txSnapshotCol: {
    flex: 1,
  },
  txSnapshotLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: BrandColors.sandDuneMuted,
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  txSnapshotAmount: {
    fontSize: 15,
    fontWeight: '800',
    color: BrandColors.sandDune,
  },
  txSnapshotRecipient: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FAF6EE',
  },
  challengeBox: {
    width: '100%',
    backgroundColor: '#182A1B',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: BrandColors.sandDune,
    alignItems: 'center',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 14,
      },
    }),
  },
  challengeHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginBottom: 6,
  },
  challengeHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  challengeLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: BrandColors.sandDune,
    letterSpacing: 0.8,
  },
  liveTagBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 1,
    borderColor: '#10B981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  liveTagText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#34D399',
    letterSpacing: 0.5,
  },
  challengeInstruction: {
    fontSize: 11.5,
    color: BrandColors.sandDuneLight,
    opacity: 0.9,
    marginBottom: 10,
    textAlign: 'center',
    lineHeight: 16,
  },
  phraseCard: {
    width: '100%',
    backgroundColor: '#0F1A12',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: BrandColors.sandDune,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  phraseQuoteMarkLeft: {
    position: 'absolute',
    top: -2,
    left: 8,
    fontSize: 24,
    fontWeight: '800',
    color: BrandColors.sandDuneMuted,
    opacity: 0.5,
  },
  phraseQuoteMarkRight: {
    position: 'absolute',
    bottom: -10,
    right: 8,
    fontSize: 24,
    fontWeight: '800',
    color: BrandColors.sandDuneMuted,
    opacity: 0.5,
  },
  challengePhraseText: {
    fontSize: 19,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.2,
    lineHeight: 26,
    paddingHorizontal: 8,
  },
  waveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 44,
    marginVertical: 4,
  },
  callWaveBar: {
    width: 4,
    backgroundColor: BrandColors.sandDune,
    borderRadius: 4,
  },
  listeningNotice: {
    fontSize: 10.5,
    color: BrandColors.sandDuneMuted,
    textAlign: 'center',
    lineHeight: 15,
    marginTop: 2,
  },
  analyzingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  analyzingText: {
    fontSize: 10.5,
    color: BrandColors.sandDune,
    fontWeight: '600',
  },
  callControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 10,
  },
  controlBtnWrapper: {
    alignItems: 'center',
    gap: 6,
    minWidth: 70,
  },
  controlCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(221, 214, 185, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(221, 214, 185, 0.25)',
  },
  controlCircleActive: {
    backgroundColor: BrandColors.sandDune,
  },
  controlLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: BrandColors.sandDune,
    textAlign: 'center',
  },
  endCallCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#EF4444',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.45,
        shadowRadius: 12,
      },
      default: {
        elevation: 8,
      },
    }),
  },
});
