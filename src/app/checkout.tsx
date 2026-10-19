import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  SafeAreaView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { ShoColors, ShoRadius, ShoSpacing } from '@/constants/sho-theme';
import { ShoHeader } from '@/components/sho-header';
import { ShoIcon } from '@/components/sho-icon';
import { useSho } from '@/context/sho-context';

export default function CheckoutPaymentScreen() {
  const { cart, cartTotal, placeOrder, user, updateAddress } = useSho();

  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');
  const [selectedPayment, setSelectedPayment] = useState<'card' | 'applepay' | 'paystack'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('888');

  // Address edit state
  const [fullName, setFullName] = useState(user?.address.fullName || 'Wisdom Akpan');
  const [street, setStreet] = useState(user?.address.street || '12 Freedom Street');
  const [city, setCity] = useState(user?.address.city || 'Calabar');
  const [phone, setPhone] = useState(user?.address.phone || '+234 806 123 4567');

  const shippingFee = deliveryMethod === 'standard' ? 0 : 15;
  const finalTotal = cartTotal + shippingFee;

  const handleCompletePayment = async () => {
    updateAddress({ fullName, street, city, phone });
    const order = await placeOrder(
      deliveryMethod === 'standard' ? 'Standard Complimentary' : 'Express Courier',
      shippingFee
    );
    router.replace({
      pathname: '/order-confirmation' as any,
      params: { orderId: order.id },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ShoHeader title="Secure Checkout" showBack />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Editorial Title */}
        <View style={styles.headerBlock}>
          <Text style={styles.eyebrow}>Bespoke Transaction</Text>
          <Text style={styles.title}>Payment & Details</Text>
          <Text style={styles.subtitle}>
            All transactions are 256-bit encrypted with instant boutique authentication.
          </Text>
        </View>

        {/* Shipping Destination */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <ShoIcon name="location_on" size={18} color={ShoColors.secondary} />
            <Text style={styles.cardHeaderTitle}>Delivery Destination</Text>
          </View>

          <View style={styles.formRow}>
            <Text style={styles.inputLabel}>Recipient Name</Text>
            <TextInput
              style={styles.textInput}
              value={fullName}
              onChangeText={setFullName}
              placeholderTextColor={ShoColors.outline}
            />
          </View>

          <View style={styles.formRow}>
            <Text style={styles.inputLabel}>Street Address</Text>
            <TextInput
              style={styles.textInput}
              value={street}
              onChangeText={setStreet}
              placeholderTextColor={ShoColors.outline}
            />
          </View>

          <View style={styles.rowTwoCols}>
            <View style={[styles.formRow, { flex: 1 }]}>
              <Text style={styles.inputLabel}>City / Region</Text>
              <TextInput
                style={styles.textInput}
                value={city}
                onChangeText={setCity}
                placeholderTextColor={ShoColors.outline}
              />
            </View>
            <View style={[styles.formRow, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Phone</Text>
              <TextInput
                style={styles.textInput}
                value={phone}
                onChangeText={setPhone}
                placeholderTextColor={ShoColors.outline}
              />
            </View>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <ShoIcon name="credit_card" size={18} color={ShoColors.secondary} />
            <Text style={styles.cardHeaderTitle}>Payment Instrument</Text>
          </View>

          <View style={styles.paymentMethodButtons}>
            <Pressable
              onPress={() => setSelectedPayment('card')}
              style={[
                styles.methodBtn,
                selectedPayment === 'card' && styles.methodBtnActive,
              ]}>
              <ShoIcon name="credit_card" size={18} color={ShoColors.primaryFixed} />
              <Text style={styles.methodBtnText}>Card</Text>
            </Pressable>

            <Pressable
              onPress={() => setSelectedPayment('applepay')}
              style={[
                styles.methodBtn,
                selectedPayment === 'applepay' && styles.methodBtnActive,
              ]}>
              <ShoIcon name="account_balance_wallet" size={18} color={ShoColors.primaryFixed} />
              <Text style={styles.methodBtnText}>Apple Pay</Text>
            </Pressable>

            <Pressable
              onPress={() => setSelectedPayment('paystack')}
              style={[
                styles.methodBtn,
                selectedPayment === 'paystack' && styles.methodBtnActive,
              ]}>
              <ShoIcon name="payments" size={18} color={ShoColors.primaryFixed} />
              <Text style={styles.methodBtnText}>Paystack</Text>
            </Pressable>
          </View>

          {selectedPayment === 'card' && (
            <View style={styles.cardInputsBlock}>
              <View style={styles.formRow}>
                <Text style={styles.inputLabel}>Card Number</Text>
                <TextInput
                  style={styles.textInput}
                  value={cardNumber}
                  onChangeText={setCardNumber}
                  placeholderTextColor={ShoColors.outline}
                />
              </View>
              <View style={styles.rowTwoCols}>
                <View style={[styles.formRow, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Expiry</Text>
                  <TextInput
                    style={styles.textInput}
                    value={expiry}
                    onChangeText={setExpiry}
                    placeholderTextColor={ShoColors.outline}
                  />
                </View>
                <View style={[styles.formRow, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>CVV</Text>
                  <TextInput
                    style={styles.textInput}
                    value={cvv}
                    onChangeText={setCvv}
                    placeholderTextColor={ShoColors.outline}
                    secureTextEntry
                  />
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Order Summary Confirmation */}
        <View style={styles.card}>
          <Text style={styles.summaryTitle}>Transaction Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Footwear Items ({cart.length})</Text>
            <Text style={styles.summaryValue}>${cartTotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping ({deliveryMethod})</Text>
            <Text style={styles.summaryValue}>{shippingFee === 0 ? 'Free' : `$${shippingFee}.00`}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalBoldLabel}>Charge Amount</Text>
            <Text style={styles.totalBoldValue}>${finalTotal.toFixed(2)}</Text>
          </View>
        </View>

        {/* Authorize Button */}
        <Pressable
          accessibilityLabel="Authorize Payment"
          onPress={handleCompletePayment}
          style={({ pressed }) => [styles.authorizeBtn, pressed && styles.pressed]}>
          <ShoIcon name="lock" size={20} color={ShoColors.onPrimaryFixed} />
          <Text style={styles.authorizeBtnText}>
            Authorize Payment • ${finalTotal.toFixed(2)}
          </Text>
        </Pressable>

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ShoColors.surface,
  },
  scrollContent: {
    paddingHorizontal: ShoSpacing.margin,
    paddingTop: ShoSpacing.sm,
    gap: ShoSpacing.md,
  },
  headerBlock: {
    gap: 4,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    color: ShoColors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  title: {
    fontFamily: 'serif',
    fontSize: 26,
    fontWeight: '600',
    color: ShoColors.primary,
  },
  subtitle: {
    fontSize: 12,
    color: ShoColors.onSurfaceVariant,
    lineHeight: 18,
  },
  card: {
    backgroundColor: ShoColors.surfaceContainer,
    borderRadius: ShoRadius.default,
    padding: ShoSpacing.md,
    borderWidth: 1,
    borderColor: ShoColors.borderSubtle,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardHeaderTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: ShoColors.onSurface,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  formRow: {
    gap: 4,
  },
  inputLabel: {
    fontSize: 11,
    color: ShoColors.textMuted,
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: ShoColors.surfaceContainerLow,
    borderRadius: ShoRadius.default,
    height: 44,
    paddingHorizontal: 12,
    color: ShoColors.onSurface,
    borderWidth: 1,
    borderColor: ShoColors.borderSubtle,
    fontSize: 13,
  },
  rowTwoCols: {
    flexDirection: 'row',
    gap: 12,
  },
  paymentMethodButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  methodBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 44,
    borderRadius: ShoRadius.default,
    backgroundColor: ShoColors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: ShoColors.borderSubtle,
  },
  methodBtnActive: {
    backgroundColor: ShoColors.surfaceContainerHigh,
    borderColor: ShoColors.primaryFixed,
  },
  methodBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: ShoColors.onSurface,
  },
  cardInputsBlock: {
    gap: 12,
    marginTop: 4,
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: ShoColors.onSurface,
    textTransform: 'uppercase',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 13,
    color: ShoColors.onSurfaceVariant,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: ShoColors.onSurface,
  },
  divider: {
    height: 1,
    backgroundColor: ShoColors.surfaceContainerHighest,
  },
  totalBoldLabel: {
    fontFamily: 'serif',
    fontSize: 18,
    fontWeight: '700',
    color: ShoColors.onSurface,
  },
  totalBoldValue: {
    fontSize: 20,
    fontWeight: '800',
    color: ShoColors.primaryFixed,
  },
  authorizeBtn: {
    height: 54,
    borderRadius: ShoRadius.full,
    backgroundColor: ShoColors.primaryFixed,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  authorizeBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: ShoColors.onPrimaryFixed,
    letterSpacing: 0.5,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
