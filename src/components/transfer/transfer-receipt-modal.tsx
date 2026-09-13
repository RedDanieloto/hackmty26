import React from 'react';
import {
  Dimensions,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';

import { AppIcon } from '@/components/ui/app-icon';
import { BrandColors } from '@/constants/theme';
import { useTransferVoice } from '@/context/transfer-voice-context';

export function TransferReceiptModal() {
  const {
    isReceiptModalVisible,
    analysisResult,
    transfer,
    closeReceipt,
    initiateTransfer,
  } = useTransferVoice();

  if (!analysisResult) return null;

  const isSuccess = analysisResult.isHuman;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <Modal
      visible={isReceiptModalVisible}
      transparent
      animationType="fade"
      onRequestClose={closeReceipt}>
      <View style={styles.modalOverlay}>
        <View style={[styles.cardContainer, isSuccess ? styles.cardSuccess : styles.cardBlocked]}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Status Header Badge & Icon */}
            <View style={styles.header}>
              <View
                style={[
                  styles.statusIconCircle,
                  isSuccess ? styles.iconSuccess : styles.iconBlocked,
                ]}>
                <AppIcon
                  name={isSuccess ? 'check' : 'alert'}
                  size={24}
                  color={isSuccess ? '#18271B' : '#FFFFFF'}
                />
              </View>

              <Text style={[styles.statusTitle, isSuccess ? styles.textSuccess : styles.textBlocked]}>
                {isSuccess ? 'Transferencia Exitosa' : 'Transferencia Bloqueada'}
              </Text>

              <Text style={styles.statusSubtitle}>
                {isSuccess
                  ? 'Identidad vocal humana autenticada con éxito'
                  : 'Voz sintética o deepfake detectado por Altur'}
              </Text>
            </View>

            {/* Amount Banner */}
            <View style={styles.amountBox}>
              <Text style={styles.amountLabel}>Monto de la Operación</Text>
              <Text style={[styles.amountValue, isSuccess ? styles.textSuccess : styles.textBlocked]}>
                {formatCurrency(transfer.amount)}
              </Text>
            </View>

            {/* Biometric Analysis Breakdown */}
            <View style={styles.analysisBox}>
              <View style={styles.analysisBoxHeader}>
                <View style={styles.analysisBoxTitleRow}>
                  <AppIcon name="shield" size={13} color={BrandColors.sandDune} />
                  <Text style={styles.analysisBoxTitle}>
                    Certificado Biométrico Anti-Spoofing
                  </Text>
                </View>
                <View
                  style={[
                    styles.tagBadge,
                    isSuccess ? styles.tagSuccess : styles.tagBlocked,
                  ]}>
                  <Text
                    style={[
                      styles.tagText,
                      isSuccess ? styles.tagTextSuccess : styles.tagTextBlocked,
                    ]}>
                    {isSuccess ? 'VOZ REAL' : 'CLON IA DETECTADO'}
                  </Text>
                </View>
              </View>

              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Probabilidad Humano Real:</Text>
                <Text style={[styles.metricValue, isSuccess ? styles.metricGreen : styles.metricRed]}>
                  {analysisResult.humanConfidence}%
                </Text>
              </View>

              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Riesgo de Síntesis / Clon IA:</Text>
                <Text style={[styles.metricValue, isSuccess ? styles.metricGreen : styles.metricRed]}>
                  {analysisResult.aiConfidence}%
                </Text>
              </View>

              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Resonancia Glótica / Biológica:</Text>
                <Text style={styles.metricValue}>{analysisResult.vocalTractScore}%</Text>
              </View>

              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Frase de Desafío validada:</Text>
                <Text style={styles.metricValueSmall} numberOfLines={1}>
                  "{analysisResult.challengePhrase}"
                </Text>
              </View>
            </View>

            {/* Transaction Data */}
            <View style={styles.detailsBox}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Beneficiario</Text>
                <Text style={styles.detailValue}>{transfer.recipientName}</Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Banco Destino</Text>
                <Text style={styles.detailValue}>{transfer.bankName}</Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Cuenta / CLABE</Text>
                <Text style={styles.detailValue}>{transfer.accountNumber}</Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Folio de Operación</Text>
                <Text style={styles.detailValueCode}>{transfer.folio}</Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Hora y Fecha</Text>
                <Text style={styles.detailValue}>{transfer.timestamp} • Hoy</Text>
              </View>
            </View>

            {/* Warning Message if Blocked */}
            {!isSuccess && (
              <View style={styles.fraudAlertNotice}>
                <AppIcon name="shield-alert" size={16} color="#FCA5A5" />
                <Text style={styles.fraudAlertText}>
                  Sus fondos no salieron de su cuenta. Se ha activado el protocolo de
                  congelamiento temporal por sospecha de suplantación de voz no autorizada.
                </Text>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionButtonsRow}>
              {isSuccess ? (
                <Pressable
                  onPress={closeReceipt}
                  style={({ pressed }) => [styles.primaryBtn, pressed && styles.btnPressed]}>
                  <Text style={styles.primaryBtnText}>Finalizar</Text>
                </Pressable>
              ) : (
                <>
                  <Pressable
                    onPress={() => {
                      closeReceipt();
                      initiateTransfer();
                    }}
                    style={({ pressed }) => [styles.retryBtn, pressed && styles.btnPressed]}>
                    <AppIcon name="refresh" size={14} color="#FFFFFF" />
                    <Text style={styles.retryBtnText}>Reintentar con Voz Real</Text>
                  </Pressable>
                  <Pressable
                    onPress={closeReceipt}
                    style={({ pressed }) => [styles.cancelBtn, pressed && styles.btnPressed]}>
                    <Text style={styles.cancelBtnText}>Cerrar</Text>
                  </Pressable>
                </>
              )}
            </View>

            {/* Footer Altur Brand */}
            <View style={styles.footerBrand}>
              <Text style={styles.poweredText}>Certificado emitido por</Text>
              <Image
                source={require('@/assets/images/altur-logo-sand.png')}
                style={styles.alturLogo}
                contentFit="contain"
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 10, 7, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  cardContainer: {
    width: '100%',
    maxWidth: 480,
    maxHeight: SCREEN_HEIGHT * 0.9,
    backgroundColor: '#1C2E20',
    borderRadius: 24,
    borderWidth: 1.2,
    ...Platform.select({
      web: {
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.55)',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 14 },
        shadowOpacity: 0.5,
        shadowRadius: 24,
        elevation: 10,
      },
    }),
    overflow: 'hidden',
  },
  cardSuccess: {
    borderColor: BrandColors.sandDune,
  },
  cardBlocked: {
    borderColor: '#EF4444',
  },
  scrollContent: {
    padding: 22,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  statusIconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconSuccess: {
    backgroundColor: BrandColors.sandDune,
  },
  iconBlocked: {
    backgroundColor: '#DC2626',
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginBottom: 3,
  },
  statusSubtitle: {
    fontSize: 12,
    color: BrandColors.sandDuneMuted,
    textAlign: 'center',
  },
  textSuccess: {
    color: BrandColors.sandDuneLight,
  },
  textBlocked: {
    color: '#EF4444',
  },
  amountBox: {
    width: '100%',
    backgroundColor: 'rgba(18, 30, 21, 0.85)',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(221, 214, 185, 0.18)',
    marginBottom: 14,
  },
  amountLabel: {
    fontSize: 11,
    color: BrandColors.sandDuneMuted,
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  analysisBox: {
    width: '100%',
    backgroundColor: 'rgba(30, 48, 34, 0.7)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(221, 214, 185, 0.18)',
    marginBottom: 14,
  },
  analysisBoxHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(221, 214, 185, 0.1)',
    paddingBottom: 8,
  },
  analysisBoxTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  analysisBoxTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: BrandColors.sandDuneLight,
  },
  tagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  tagBlocked: {
    backgroundColor: 'rgba(239, 68, 68, 0.25)',
  },
  tagText: {
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  tagTextSuccess: {
    color: '#34D399',
  },
  tagTextBlocked: {
    color: '#F87171',
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 3.5,
  },
  metricLabel: {
    fontSize: 11,
    color: BrandColors.sandDuneMuted,
  },
  metricValue: {
    fontSize: 12,
    fontWeight: '700',
    color: BrandColors.sandDuneLight,
  },
  metricGreen: {
    color: '#34D399',
  },
  metricRed: {
    color: '#F87171',
  },
  metricValueSmall: {
    fontSize: 10.5,
    fontWeight: '600',
    color: BrandColors.sandDune,
    maxWidth: 190,
  },
  detailsBox: {
    width: '100%',
    backgroundColor: 'rgba(18, 30, 21, 0.65)',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(221, 214, 185, 0.15)',
    marginBottom: 14,
    gap: 7,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 11,
    color: BrandColors.sandDuneMuted,
  },
  detailValue: {
    fontSize: 11.5,
    fontWeight: '600',
    color: BrandColors.sandDuneLight,
  },
  detailValueCode: {
    fontSize: 11.5,
    fontWeight: '700',
    fontFamily: Platform.select({ ios: 'Courier', default: 'monospace' }),
    color: BrandColors.sandDune,
  },
  fraudAlertNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    width: '100%',
  },
  fraudAlertText: {
    fontSize: 11,
    color: '#FCA5A5',
    lineHeight: 15,
    flex: 1,
  },
  actionButtonsRow: {
    width: '100%',
    gap: 8,
    marginBottom: 14,
  },
  primaryBtn: {
    backgroundColor: BrandColors.hunterGreen,
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BrandColors.sandDune,
  },
  primaryBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: BrandColors.sandDuneLight,
  },
  retryBtn: {
    flexDirection: 'row',
    backgroundColor: '#DC2626',
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  retryBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cancelBtn: {
    backgroundColor: 'rgba(221, 214, 185, 0.1)',
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(221, 214, 185, 0.2)',
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: BrandColors.sandDune,
  },
  btnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  footerBrand: {
    alignItems: 'center',
    paddingTop: 4,
    gap: 6,
  },
  poweredText: {
    fontSize: 10,
    color: BrandColors.sandDuneMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  alturLogo: {
    width: 90,
    height: 24,
  },
});
