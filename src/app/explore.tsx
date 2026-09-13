import React from 'react';
import {
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

import { AppIcon } from '@/components/ui/app-icon';
import { BottomTabInset, BrandColors, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTransferVoice } from '@/context/transfer-voice-context';

export default function TabTwoScreen() {
  const { history, transactions, settings, refreshBankData } = useTransferVoice();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 2,
    }).format(val);
  };

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('es-MX', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  return (
    <View style={styles.outerContainer}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View>
                <View style={styles.titleRow}>
                  <AppIcon name="shield" size={18} color={BrandColors.sandDune} />
                  <Text style={styles.headerTitle}>Auditoría & Actividad</Text>
                </View>
                <Text style={styles.headerSubtitle}>
                  Monitoreo Anti-Deepfake y Transacciones Bancarias
                </Text>
              </View>
            </View>
          </View>

          {/* Security Stats Summary Cards */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{history.length}</Text>
              <Text style={styles.statLabel}>Verificaciones</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={[styles.statNumber, { color: '#34D399' }]}>
                {history.filter((h) => h.result.isHuman).length}
              </Text>
              <Text style={styles.statLabel}>Voz Humana</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={[styles.statNumber, { color: '#F87171' }]}>
                {history.filter((h) => !h.result.isHuman).length}
              </Text>
              <Text style={styles.statLabel}>Bloqueos IA</Text>
            </View>
          </View>

          {/* Section 1: Recent Bank Transactions from /api/account/transactions */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleRow}>
                <AppIcon name="history" size={15} color={BrandColors.sandDune} />
                <Text style={styles.sectionTitle}>Movimientos de la Cuenta</Text>
              </View>
              <Pressable
                onPress={refreshBankData}
                style={({ pressed }) => [styles.refreshPill, pressed && styles.btnPressed]}>
                <AppIcon name="refresh" size={11} color={BrandColors.sandDune} />
                <Text style={styles.refreshPillText}>Actualizar</Text>
              </Pressable>
            </View>
            <Text style={styles.sectionDesc}>
              Historial de movimientos sincronizado con el backend bancario:
            </Text>

            {transactions.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>
                  No hay movimientos registrados en la cuenta bancaria.
                </Text>
              </View>
            ) : (
              transactions.map((tx) => {
                const isCredit = tx.type.toLowerCase() === 'abono';
                return (
                  <View key={tx.transaction_id} style={styles.txCard}>
                    <View style={styles.txCardLeft}>
                      <View style={[styles.txIconCircle, isCredit ? styles.txCircleGreen : styles.txCircleNeutral]}>
                        <AppIcon
                          name={isCredit ? 'check' : 'transfer'}
                          size={12}
                          color={isCredit ? '#10B981' : BrandColors.sandDune}
                        />
                      </View>
                      <View style={styles.txDetails}>
                        <Text style={styles.txConcept} numberOfLines={1}>
                          {tx.concept}
                        </Text>
                        <Text style={styles.txDate}>{formatDate(tx.date)}</Text>
                      </View>
                    </View>

                    <View style={styles.txCardRight}>
                      <Text
                        style={[
                          styles.txAmount,
                          isCredit ? styles.txAmountCredit : styles.txAmountDebit,
                        ]}>
                        {isCredit ? '+' : '-'}
                        {formatCurrency(tx.amount)}
                      </Text>
                      <Text style={styles.txBalance}>
                        Saldo: {formatCurrency(tx.resulting_balance)}
                      </Text>
                    </View>
                  </View>
                );
              })
            )}
          </View>

          {/* Section 2: Biometric Verification Audit Log */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionTitleRow}>
              <AppIcon name="shield-check" size={15} color={BrandColors.sandDune} />
              <Text style={styles.sectionTitle}>Auditoría Biométrico-Vocal</Text>
            </View>
            <Text style={styles.sectionDesc}>
              Eventos de llamadas de validación antifraude para operaciones de alto monto:
            </Text>

            {history.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>
                  Aún no hay verificaciones registradas. Realiza una transferencia en Inicio para ver el análisis en tiempo real.
                </Text>
              </View>
            ) : (
              history.map((item) => {
                const isHuman = item.result.isHuman;
                return (
                  <View
                    key={item.id}
                    style={[
                      styles.historyCard,
                      isHuman ? styles.cardBorderGreen : styles.cardBorderRed,
                    ]}>
                    <View style={styles.historyCardTop}>
                      <View style={styles.historyCardLeft}>
                        <Text style={styles.historyFolio}>{item.folio}</Text>
                        <Text style={styles.historyTime}>{item.timestamp}</Text>
                      </View>

                      <View
                        style={[
                          styles.badge,
                          isHuman ? styles.badgeGreen : styles.badgeRed,
                        ]}>
                        <AppIcon
                          name={isHuman ? 'check' : 'alert'}
                          size={10}
                          color={isHuman ? '#34D399' : '#F87171'}
                        />
                        <Text
                          style={[
                            styles.badgeText,
                            isHuman ? styles.badgeTextGreen : styles.badgeTextRed,
                          ]}>
                          {isHuman ? 'VOZ REAL' : 'BLOQUEO IA'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.historyCardBody}>
                      <View style={styles.historyRow}>
                        <Text style={styles.historyLabel}>Destinatario:</Text>
                        <Text style={styles.historyValue}>{item.recipientName}</Text>
                      </View>

                      <View style={styles.historyRow}>
                        <Text style={styles.historyLabel}>Monto Operado:</Text>
                        <Text style={styles.historyValueBold}>
                          {formatCurrency(item.amount)}
                        </Text>
                      </View>

                      <View style={styles.historyRow}>
                        <Text style={styles.historyLabel}>Resultado:</Text>
                        <Text
                          style={[
                            styles.historyValue,
                            isHuman ? styles.textGreen : styles.textRed,
                          ]}>
                          {isHuman ? 'Autenticación Exitosa' : 'Bloqueada por Seguridad'}
                        </Text>
                      </View>

                      <View style={styles.historyRow}>
                        <Text style={styles.historyLabel}>Frase de desafío:</Text>
                        <Text style={styles.historyPhrase} numberOfLines={1}>
                          "{item.result.challengePhrase}"
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })
            )}
          </View>

          {/* Section 3: Technical Anti-Deepfake Protocol Explanation */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionTitleRow}>
              <AppIcon name="dna" size={15} color={BrandColors.sandDune} />
              <Text style={styles.sectionTitle}>Protocolo Tecnológico Anti-Spoofing</Text>
            </View>
            <Text style={styles.sectionDesc}>
              Cuatro capas de protección acústica y biométrica ejecutadas en milisegundos:
            </Text>

            <View style={styles.protocolGrid}>
              <View style={styles.protocolCard}>
                <View style={styles.protocolHeader}>
                  <AppIcon name="dice" size={14} color={BrandColors.sandDune} />
                  <Text style={styles.protocolCardTitle}>1. Desafío Dinámico Inédito</Text>
                </View>
                <Text style={styles.protocolCardText}>
                  La API genera una frase y PIN aleatorio irrepetible. Neutraliza ataques de reproducción (replay attacks) con audios pregrabados.
                </Text>
              </View>

              <View style={styles.protocolCard}>
                <View style={styles.protocolHeader}>
                  <AppIcon name="wave" size={14} color={BrandColors.sandDune} />
                  <Text style={styles.protocolCardTitle}>2. Resonancia del Tracto Vocal</Text>
                </View>
                <Text style={styles.protocolCardText}>
                  Evalúa la acústica biológica natural de cuerdas vocales humanas y presión subglótica frente a representaciones matemáticas sintéticas.
                </Text>
              </View>

              <View style={styles.protocolCard}>
                <View style={styles.protocolHeader}>
                  <AppIcon name="dna" size={14} color={BrandColors.sandDune} />
                  <Text style={styles.protocolCardTitle}>3. Detección de Vocoders Neuronales</Text>
                </View>
                <Text style={styles.protocolCardText}>
                  Identifica artefactos espectrales microscópicos característicos de arquitecturas como VALL-E, Bark, Tortoise y ElevenLabs.
                </Text>
              </View>

              <View style={styles.protocolCard}>
                <View style={styles.protocolHeader}>
                  <AppIcon name="bolt" size={14} color={BrandColors.sandDune} />
                  <Text style={styles.protocolCardTitle}>4. Micro-Inflexiones y Jitter</Text>
                </View>
                <Text style={styles.protocolCardText}>
                  Monitorea las fluctuaciones involuntarias de tono y velocidad muscular propias del aparato fonador humano real.
                </Text>
              </View>
            </View>
          </View>

          {/* Section 4: API Integration Blueprint */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionTitleRow}>
              <AppIcon name="code" size={15} color={BrandColors.sandDune} />
              <Text style={styles.sectionTitle}>Endpoints Integrados en Vivo</Text>
            </View>
            <Text style={styles.sectionDesc}>
              Especificación OpenAPI 3.1 activa en {settings.apiUrl}:
            </Text>

            <View style={styles.codeSnippetCard}>
              <Text style={styles.codeHeader}>• GET /api/account (Saldo y Estado de Cuenta)</Text>
              <Text style={styles.codeBlock}>
{`GET /api/account
Response: {
  "account_number": "8849 2019...",
  "balance": 248500.0,
  "currency": "MXN",
  "status": "active"
}`}
              </Text>

              <Text style={[styles.codeHeader, { marginTop: 10 }]}>
                • POST /api/transfers (Creación y Desafío de Voz)
              </Text>
              <Text style={styles.codeBlock}>
{`POST /api/transfers
Request:  { "beneficiary_id": "1", "amount": 150000, "concept": "Pago" }
Response: {
  "transfer_id": "ALT-92810",
  "status": "pending_verification",
  "confirmation_phrase": "Criptografía verde sobre el río dorado #412"
}`}
              </Text>

              <Text style={[styles.codeHeader, { marginTop: 10 }]}>
                • POST /detect (Clasificación Acústica Anti-IA)
              </Text>
              <Text style={styles.codeBlock}>
{`POST /detect
Request:  { "audio_b64": "<stream_wav_16khz>" }
Response: { "is_synthetic": false, "confidence": 0.984 }`}
              </Text>
            </View>
          </View>

          {/* Footer Brand */}
          <View style={styles.footerContainer}>
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
              Altur Voice Biometrics • Protegiendo operaciones financieras en tiempo real
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
    paddingBottom: 160,
    alignItems: 'center',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
    gap: 16,
  },
  header: {
    width: '100%',
    paddingVertical: 4,
  },
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: BrandColors.sandDuneLight,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 11.5,
    color: BrandColors.sandDuneMuted,
    marginTop: 2,
  },
  btnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(30, 48, 34, 0.85)',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(221, 214, 185, 0.18)',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: BrandColors.sandDuneLight,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 9.5,
    color: BrandColors.sandDuneMuted,
    textAlign: 'center',
    fontWeight: '600',
  },
  sectionContainer: {
    width: '100%',
    gap: 8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: BrandColors.sandDuneLight,
    letterSpacing: -0.2,
  },
  sectionDesc: {
    fontSize: 11.5,
    color: BrandColors.sandDuneMuted,
    lineHeight: 15.5,
    marginBottom: 2,
  },
  refreshPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(221, 214, 185, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  refreshPillText: {
    fontSize: 10,
    color: BrandColors.sandDune,
    fontWeight: '600',
  },
  emptyCard: {
    backgroundColor: 'rgba(30, 48, 34, 0.5)',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 11.5,
    color: BrandColors.sandDuneMuted,
    textAlign: 'center',
  },
  txCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 48, 34, 0.85)',
    borderRadius: 13,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(221, 214, 185, 0.15)',
  },
  txCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  txIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txCircleGreen: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  txCircleNeutral: {
    backgroundColor: 'rgba(221, 214, 185, 0.12)',
  },
  txDetails: {
    flex: 1,
  },
  txConcept: {
    fontSize: 12,
    fontWeight: '600',
    color: BrandColors.sandDuneLight,
    marginBottom: 2,
  },
  txDate: {
    fontSize: 10.5,
    color: BrandColors.sandDuneMuted,
  },
  txCardRight: {
    alignItems: 'flex-end',
  },
  txAmount: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  txAmountCredit: {
    color: '#34D399',
  },
  txAmountDebit: {
    color: BrandColors.sandDuneLight,
  },
  txBalance: {
    fontSize: 10,
    color: BrandColors.sandDuneMuted,
  },
  historyCard: {
    backgroundColor: 'rgba(30, 48, 34, 0.9)',
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1.2,
  },
  cardBorderGreen: {
    borderColor: 'rgba(16, 185, 129, 0.35)',
  },
  cardBorderRed: {
    borderColor: 'rgba(239, 68, 68, 0.35)',
  },
  historyCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(221, 214, 185, 0.1)',
    paddingBottom: 6,
    marginBottom: 6,
  },
  historyCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  historyFolio: {
    fontSize: 11.5,
    fontWeight: '700',
    color: BrandColors.sandDune,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  historyTime: {
    fontSize: 10.5,
    color: BrandColors.sandDuneMuted,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  badgeGreen: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  badgeRed: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  badgeTextGreen: {
    color: '#34D399',
  },
  badgeTextRed: {
    color: '#F87171',
  },
  historyCardBody: {
    gap: 3,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyLabel: {
    fontSize: 11,
    color: BrandColors.sandDuneMuted,
  },
  historyValue: {
    fontSize: 11.5,
    color: BrandColors.sandDuneLight,
    fontWeight: '500',
  },
  historyValueBold: {
    fontSize: 12.5,
    color: BrandColors.sandDuneLight,
    fontWeight: '700',
  },
  historyPhrase: {
    fontSize: 10.5,
    fontStyle: 'italic',
    color: BrandColors.sandDune,
    maxWidth: '65%',
  },
  textGreen: {
    color: '#34D399',
    fontWeight: '700',
  },
  textRed: {
    color: '#F87171',
    fontWeight: '700',
  },
  protocolGrid: {
    gap: 8,
  },
  protocolCard: {
    backgroundColor: 'rgba(30, 48, 34, 0.75)',
    borderRadius: 13,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(221, 214, 185, 0.15)',
  },
  protocolHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  protocolCardTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: BrandColors.sandDuneLight,
  },
  protocolCardText: {
    fontSize: 11,
    color: BrandColors.sandDune,
    lineHeight: 15,
    opacity: 0.9,
  },
  codeSnippetCard: {
    backgroundColor: 'rgba(15, 26, 18, 0.9)',
    borderRadius: 13,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(221, 214, 185, 0.22)',
  },
  codeHeader: {
    fontSize: 10.5,
    fontWeight: '700',
    color: BrandColors.sandDune,
    marginBottom: 4,
  },
  codeBlock: {
    fontSize: 10.5,
    color: BrandColors.sandDuneLight,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    lineHeight: 15,
  },
  footerContainer: {
    alignItems: 'center',
    paddingVertical: 14,
    gap: 5,
  },
  alturLogoFooter: {
    width: 90,
    height: 24,
  },
  footerSub: {
    fontSize: 10,
    color: BrandColors.sandDuneMuted,
    textAlign: 'center',
  },
});
