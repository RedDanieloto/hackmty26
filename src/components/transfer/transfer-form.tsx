import React from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { BrandColors } from '@/constants/theme';
import { useTransferVoice } from '@/context/transfer-voice-context';

const PRESET_AMOUNTS = [5000, 50000, 150000, 500000];

export function TransferForm() {
  const {
    transfer,
    beneficiaries,
    selectedBeneficiaryId,
    setSelectedBeneficiaryId,
    updateTransfer,
    initiateTransfer,
    isTransferring,
  } = useTransferVoice();

  const handleAmountChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    const num = cleaned ? parseInt(cleaned, 10) : 0;
    updateTransfer({ amount: num });
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <View style={styles.card}>
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.titleRow}>
            <AppIcon name="transfer" size={16} color={BrandColors.sandDune} />
            <Text style={styles.cardTitle}>Transferencia Bancaria</Text>
          </View>
          <Text style={styles.cardSubtitle}>
            Protección Biométrica Altur Voice Engine
          </Text>
        </View>
      </View>

      {/* Beneficiaries Quick Select */}
      {beneficiaries && beneficiaries.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.label}>Destinatarios Frecuentes</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.beneficiariesScroll}>
            {beneficiaries.map((b) => {
              const isSelected = b.beneficiary_id === selectedBeneficiaryId;
              return (
                <Pressable
                  key={b.beneficiary_id}
                  onPress={() => {
                    setSelectedBeneficiaryId(b.beneficiary_id);
                    updateTransfer({
                      recipientName: b.name,
                      bankName: b.bank_name,
                      accountNumber: b.account_number,
                    });
                  }}
                  style={({ pressed }) => [
                    styles.benCard,
                    isSelected && styles.benCardSelected,
                    pressed && styles.btnPressed,
                  ]}>
                  <View style={[styles.benIconWrapper, isSelected && styles.benIconWrapperSelected]}>
                    <AppIcon
                      name="user"
                      size={12}
                      color={isSelected ? '#18271B' : BrandColors.sandDune}
                    />
                  </View>
                  <View style={styles.benInfo}>
                    <Text
                      numberOfLines={1}
                      style={[styles.benName, isSelected && styles.benNameSelected]}>
                      {b.name}
                    </Text>
                    <Text style={styles.benBank}>{b.bank_name}</Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Recipient Information Form */}
      <View style={styles.section}>
        <Text style={styles.label}>Nombre del Beneficiario</Text>
        <TextInput
          style={styles.input}
          value={transfer.recipientName}
          onChangeText={(text) => updateTransfer({ recipientName: text })}
          placeholder="Nombre completo"
          placeholderTextColor="rgba(221, 214, 185, 0.4)"
        />
      </View>

      <View style={styles.rowInputs}>
        <View style={[styles.section, { flex: 1 }]}>
          <Text style={styles.label}>Banco</Text>
          <TextInput
            style={styles.input}
            value={transfer.bankName}
            onChangeText={(text) => updateTransfer({ bankName: text })}
            placeholder="Banco receptor"
            placeholderTextColor="rgba(221, 214, 185, 0.4)"
          />
        </View>

        <View style={[styles.section, { flex: 1.4 }]}>
          <Text style={styles.label}>Cuenta o CLABE</Text>
          <TextInput
            style={styles.input}
            value={transfer.accountNumber}
            onChangeText={(text) => updateTransfer({ accountNumber: text })}
            placeholder="18 dígitos"
            keyboardType="number-pad"
            placeholderTextColor="rgba(221, 214, 185, 0.4)"
          />
        </View>
      </View>

      {/* Amount Input */}
      <View style={styles.section}>
        <Text style={styles.label}>Monto (MXN)</Text>
        <View style={styles.amountContainer}>
          <Text style={styles.currencySymbol}>$</Text>
          <TextInput
            style={styles.amountInput}
            value={transfer.amount ? transfer.amount.toLocaleString('es-MX') : ''}
            onChangeText={handleAmountChange}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor="rgba(221, 214, 185, 0.3)"
          />
        </View>

        {/* Preset Amount Pills */}
        <View style={styles.presetPillsRow}>
          {PRESET_AMOUNTS.map((amt) => {
            const isSelected = transfer.amount === amt;
            return (
              <Pressable
                key={amt}
                onPress={() => updateTransfer({ amount: amt })}
                style={({ pressed }) => [
                  styles.pill,
                  isSelected && styles.pillSelected,
                  pressed && styles.btnPressed,
                ]}>
                <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
                  {formatCurrency(amt)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Concept */}
      <View style={styles.section}>
        <Text style={styles.label}>Concepto</Text>
        <TextInput
          style={styles.input}
          value={transfer.concept}
          onChangeText={(text) => updateTransfer({ concept: text })}
          placeholder="Concepto o referencia"
          placeholderTextColor="rgba(221, 214, 185, 0.4)"
        />
      </View>

      {/* Action CTA */}
      <Pressable
        onPress={initiateTransfer}
        disabled={isTransferring}
        style={({ pressed }) => [
          styles.transferBtn,
          pressed && styles.btnPressed,
          isTransferring && { opacity: 0.7 },
        ]}>
        {isTransferring ? (
          <ActivityIndicator size="small" color={BrandColors.sandDuneLight} />
        ) : (
          <>
            <AppIcon
              name="phone-call"
              size={16}
              color={BrandColors.sandDuneLight}
            />
            <Text style={styles.transferBtnText}>
              Transferir {formatCurrency(transfer.amount)} (Validación por Voz)
            </Text>
          </>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 560,
    backgroundColor: 'rgba(30, 48, 34, 0.94)',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(221, 214, 185, 0.22)',
    ...Platform.select({
      web: {
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.35)',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.35,
        shadowRadius: 20,
        elevation: 8,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(221, 214, 185, 0.12)',
    paddingBottom: 12,
  },
  headerLeft: {
    flex: 1,
    marginRight: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 16.5,
    fontWeight: '700',
    color: BrandColors.sandDuneLight,
    letterSpacing: -0.2,
  },
  cardSubtitle: {
    fontSize: 11,
    color: BrandColors.sandDuneMuted,
    marginTop: 2,
  },
  section: {
    marginBottom: 12,
  },
  beneficiariesScroll: {
    gap: 8,
    paddingVertical: 2,
    paddingRight: 12,
  },
  benCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(18, 30, 21, 0.7)',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: 'rgba(221, 214, 185, 0.2)',
    minWidth: 130,
    maxWidth: 180,
  },
  benCardSelected: {
    backgroundColor: BrandColors.hunterGreen,
    borderColor: BrandColors.sandDune,
  },
  benIconWrapper: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(221, 214, 185, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  benIconWrapperSelected: {
    backgroundColor: BrandColors.sandDune,
  },
  benInfo: {
    flexShrink: 1,
  },
  benName: {
    fontSize: 11,
    fontWeight: '600',
    color: BrandColors.sandDune,
  },
  benNameSelected: {
    color: BrandColors.sandDuneLight,
    fontWeight: '700',
  },
  benBank: {
    fontSize: 9.5,
    color: BrandColors.sandDuneMuted,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 8,
  },
  label: {
    fontSize: 11.5,
    fontWeight: '600',
    color: BrandColors.sandDune,
    marginBottom: 5,
    letterSpacing: 0.2,
  },
  input: {
    height: 42,
    backgroundColor: 'rgba(18, 30, 21, 0.75)',
    borderRadius: 11,
    borderWidth: 1,
    borderColor: 'rgba(221, 214, 185, 0.22)',
    paddingHorizontal: 12,
    color: BrandColors.sandDuneLight,
    fontSize: 13,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(18, 30, 21, 0.9)',
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: BrandColors.sandDune,
    paddingHorizontal: 14,
    height: 50,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: '700',
    color: BrandColors.sandDune,
    marginRight: 6,
  },
  amountInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: BrandColors.sandDuneLight,
  },
  presetPillsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  pill: {
    flex: 1,
    backgroundColor: 'rgba(221, 214, 185, 0.1)',
    paddingVertical: 7,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: 'rgba(221, 214, 185, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillSelected: {
    backgroundColor: BrandColors.hunterGreen,
    borderColor: BrandColors.sandDune,
  },
  pillText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: BrandColors.sandDune,
  },
  pillTextSelected: {
    color: BrandColors.sandDuneLight,
    fontWeight: '700',
  },
  transferBtn: {
    flexDirection: 'row',
    backgroundColor: BrandColors.hunterGreen,
    height: 48,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    borderWidth: 1,
    borderColor: BrandColors.sandDune,
    ...Platform.select({
      web: {
        boxShadow: '0 6px 16px rgba(62, 95, 68, 0.45)',
      },
      default: {
        shadowColor: BrandColors.hunterGreen,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 4,
      },
    }),
  },
  btnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.985 }],
  },
  transferBtnText: {
    color: BrandColors.sandDuneLight,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
