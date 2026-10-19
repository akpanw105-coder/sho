import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  SafeAreaView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { ShoColors, ShoRadius, ShoSpacing } from '@/constants/sho-theme';
import { ShoHeader } from '@/components/sho-header';
import { ShoIcon } from '@/components/sho-icon';
import { useSho } from '@/context/sho-context';

export default function CartCheckoutScreen() {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartTotal,
    user,
    placeOrder,
  } = useSho();

  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');
  const [selectedPayment, setSelectedPayment] = useState<'Mastercard' | 'Apple Pay' | 'Paystack'>(
    'Mastercard'
  );

  const shippingFee = deliveryMethod === 'standard' ? 0 : 15;
  const finalTotal = cartTotal + shippingFee;

  const handleProceedPayment = async () => {
    if (cart.length === 0) {
      Alert.alert('Empty Bag', 'Please add footwear to your bag before proceeding to payment.');
      return;
    }
    const order = await placeOrder(
      deliveryMethod === 'standard' ? 'Standard Complimentary' : 'Express Courier',
      shippingFee
    );
    router.push({
      pathname: '/order-confirmation' as any,
      params: { orderId: order.id },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ShoHeader title="Bag & Checkout" showBack />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Top Flow Stepper Header matching Stitch Design */}
        <View style={styles.topFlowRow}>
          <View>
            <Text style={styles.orderReviewEyebrow}>Order Review</Text>
            <View style={styles.bagTitleRow}>
              <Text style={styles.bagTitleText}>Bag & Checkout</Text>
              <View style={styles.itemCountBadge}>
                <Text style={styles.itemCountText}>{cart.length} items</Text>
              </View>
            </View>
          </View>

          {cart.length > 0 && (
            <Pressable
              accessibilityLabel="Clear Bag"
              onPress={() => {
                Alert.alert('Clear Bag', 'Remove all items from your shopping bag?', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Clear', style: 'destructive', onPress: clearCart },
                ]);
              }}
              style={({ pressed }) => [styles.clearBagBtn, pressed && styles.pressed]}>
              <ShoIcon name="delete_sweep" size={20} color={ShoColors.onSurfaceVariant} />
            </Pressable>
          )}
        </View>

        {/* Stepper indicator matching editorial aesthetic */}
        <View style={styles.stepperCard}>
          <View style={styles.stepItem}>
            <View style={[styles.stepNumCircle, styles.stepNumCircleActive]}>
              <Text style={styles.stepNumActiveText}>1</Text>
            </View>
            <Text style={styles.stepLabelActive}>Items</Text>
          </View>

          <View style={styles.stepperBar}>
            <View style={[styles.stepperProgress, { width: '66%' }]} />
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepNumCircle}>
              <Text style={styles.stepNumText}>2</Text>
            </View>
            <Text style={styles.stepLabel}>Shipping</Text>
          </View>

          <View style={styles.stepperBar}>
            <View style={[styles.stepperProgress, { width: '0%' }]} />
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepNumCircle}>
              <Text style={styles.stepNumText}>3</Text>
            </View>
            <Text style={styles.stepLabel}>Pay</Text>
          </View>
        </View>

        {/* Cart Items Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>Selected Silhouettes</Text>
          <Text style={styles.returnsHint}>Free Returns within 14 Days</Text>
        </View>

        {cart.length === 0 ? (
          <View style={styles.emptyBagBox}>
            <ShoIcon name="shopping_bag" size={40} color={ShoColors.textMuted} />
            <Text style={styles.emptyTitle}>Your Bag is Empty</Text>
            <Text style={styles.emptySubtitle}>
              Explore our handcrafted archival footwear collections and reserve your size.
            </Text>
            <Pressable
              onPress={() => router.push('/explore')}
              style={({ pressed }) => [styles.exploreCtaBtn, pressed && styles.pressed]}>
              <Text style={styles.exploreCtaText}>Explore Catalog</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.itemsList}>
            {cart.map((item, idx) => (
              <View key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`} style={styles.cartCard}>
                <View style={styles.cartItemRow}>
                  {/* Thumbnail */}
                  <View style={styles.thumbWrapper}>
                    <Image
                      source={{ uri: item.product.image }}
                      style={styles.thumbImage}
                      resizeMode="cover"
                    />
                    <View style={styles.sizeTag}>
                      <Text style={styles.sizeTagText}>EU {item.selectedSize}</Text>
                    </View>
                  </View>

                  {/* Info Column */}
                  <View style={styles.itemInfoCol}>
                    <View style={styles.itemHeaderLine}>
                      <Text style={styles.itemTitle} numberOfLines={1}>
                        {item.product.name}
                      </Text>
                      <Pressable
                        accessibilityLabel="Delete item"
                        onPress={() =>
                          removeFromCart(
                            item.product.id,
                            item.selectedColor,
                            item.selectedSize
                          )
                        }
                        style={({ pressed }) => [styles.deleteBtn, pressed && styles.pressed]}>
                        <ShoIcon name="delete" size={17} color={ShoColors.error} />
                      </Pressable>
                    </View>

                    <Text style={styles.itemColorSubtitle} numberOfLines={1}>
                      {item.selectedColor}
                    </Text>

                    {/* Price and Stepper */}
                    <View style={styles.itemBottomLine}>
                      <Text style={styles.itemTotalFormatted}>
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </Text>

                      <View style={styles.stepperPill}>
                        <Pressable
                          accessibilityLabel="Decrease quantity"
                          onPress={() =>
                            updateCartQuantity(
                              item.product.id,
                              item.selectedColor,
                              item.selectedSize,
                              -1
                            )
                          }
                          style={({ pressed }) => [styles.stepActionBtn, pressed && styles.pressed]}>
                          <ShoIcon name="remove" size={13} color={ShoColors.onSurfaceVariant} />
                        </Pressable>
                        <Text style={styles.stepQuantityText}>{item.quantity}</Text>
                        <Pressable
                          accessibilityLabel="Increase quantity"
                          onPress={() =>
                            updateCartQuantity(
                              item.product.id,
                              item.selectedColor,
                              item.selectedSize,
                              1
                            )
                          }
                          style={({ pressed }) => [styles.stepActionBtn, pressed && styles.pressed]}>
                          <ShoIcon name="add" size={13} color={ShoColors.onSurfaceVariant} />
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Shipping Address Preview Card */}
        <View style={styles.addressSection}>
          <View style={styles.addressHeaderRow}>
            <View style={styles.addressIconHeader}>
              <View style={styles.addressPinCircle}>
                <ShoIcon name="location_on" size={16} color={ShoColors.secondary} />
              </View>
              <Text style={styles.addressHeaderTitle}>Shipping Address</Text>
            </View>
            <Pressable
              onPress={() => router.push('/profile')}
              style={({ pressed }) => [styles.addressEditBtn, pressed && styles.pressed]}>
              <Text style={styles.addressEditText}>Edit</Text>
            </Pressable>
          </View>

          <View style={styles.addressCardInner}>
            <View style={styles.addressNameRow}>
              <Text style={styles.addressFullName}>{user?.address.fullName || 'Wisdom Akpan'}</Text>
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultBadgeText}>Default</Text>
              </View>
            </View>
            <Text style={styles.addressStreetText}>
              {user?.address.street || '12 Freedom Street, Calabar'}{'\n'}
              {user?.address.city || 'Calabar'}, {user?.address.state || 'Cross River State'},{' '}
              {user?.address.postalCode || '540001'}
            </Text>
            <View style={styles.phoneRow}>
              <ShoIcon name="call" size={14} color={ShoColors.textMuted} />
              <Text style={styles.phoneText}>{user?.address.phone || '+234 806 123 4567'}</Text>
            </View>
          </View>
        </View>

        {/* Delivery Method Selection */}
        <View style={styles.deliverySection}>
          <Text style={styles.sectionHeading}>Delivery Method</Text>

          <Pressable
            onPress={() => setDeliveryMethod('standard')}
            style={[
              styles.deliveryOptionCard,
              deliveryMethod === 'standard' && styles.deliveryOptionActive,
            ]}>
            <View style={styles.deliveryRadioRow}>
              <View
                style={[
                  styles.radioOuter,
                  deliveryMethod === 'standard' && styles.radioOuterSelected,
                ]}>
                {deliveryMethod === 'standard' && (
                  <ShoIcon name="check" size={13} color={ShoColors.onPrimaryFixed} />
                )}
              </View>
              <View>
                <Text style={styles.deliveryOptTitle}>Standard Delivery</Text>
                <Text style={styles.deliveryOptSubtitle}>Estimated 3 – 5 business days</Text>
              </View>
            </View>
            <Text style={styles.deliveryPriceFree}>Free</Text>
          </Pressable>

          <Pressable
            onPress={() => setDeliveryMethod('express')}
            style={[
              styles.deliveryOptionCard,
              deliveryMethod === 'express' && styles.deliveryOptionActive,
            ]}>
            <View style={styles.deliveryRadioRow}>
              <View
                style={[
                  styles.radioOuter,
                  deliveryMethod === 'express' && styles.radioOuterSelected,
                ]}>
                {deliveryMethod === 'express' && (
                  <ShoIcon name="check" size={13} color={ShoColors.onPrimaryFixed} />
                )}
              </View>
              <View>
                <Text style={styles.deliveryOptTitle}>Express Courier</Text>
                <Text style={styles.deliveryOptSubtitle}>Guaranteed 1 – 2 business days</Text>
              </View>
            </View>
            <Text style={styles.deliveryPriceExpress}>+$15.00</Text>
          </Pressable>
        </View>

        {/* Preferred Payment Method Badges */}
        <View style={styles.paymentSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeading}>Preferred Payment</Text>
            <Text style={styles.secureHint}>Encrypted & Secure</Text>
          </View>

          <View style={styles.paymentChipsRow}>
            {(['Mastercard', 'Apple Pay', 'Paystack'] as const).map((method) => {
              const isSelected = selectedPayment === method;
              return (
                <Pressable
                  key={method}
                  onPress={() => setSelectedPayment(method)}
                  style={({ pressed }) => [
                    styles.paymentChip,
                    isSelected && styles.paymentChipSelected,
                    pressed && styles.pressed,
                  ]}>
                  <ShoIcon
                    name={
                      method === 'Mastercard'
                        ? 'credit_card'
                        : method === 'Apple Pay'
                        ? 'account_balance_wallet'
                        : 'payments'
                    }
                    size={20}
                    color={isSelected ? ShoColors.primaryFixed : ShoColors.textMuted}
                  />
                  <Text
                    style={[
                      styles.paymentChipLabel,
                      isSelected && { color: ShoColors.textIvory, fontWeight: '700' },
                    ]}>
                    {method}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Cost Breakdown Card matching Stitch Design */}
        <View style={styles.costBreakdownCard}>
          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Subtotal</Text>
            <Text style={styles.costValue}>${cartTotal.toFixed(2)}</Text>
          </View>
          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Shipping</Text>
            <Text style={[styles.costValue, { color: ShoColors.primaryFixed }]}>
              {shippingFee === 0 ? 'Free' : `+$${shippingFee.toFixed(2)}`}
            </Text>
          </View>
          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Estimated Boutique Tax</Text>
            <Text style={styles.costValue}>$0.00</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <View>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalSubtext}>Including all local duties</Text>
            </View>
            <Text style={styles.totalAmount}>${finalTotal.toFixed(2)}</Text>
          </View>
        </View>

        {/* Editorial Care Guarantee Note */}
        <View style={styles.guaranteeCard}>
          <ShoIcon name="verified" size={20} color={ShoColors.secondary} />
          <Text style={styles.guaranteeText}>
            Crafted and inspected in limited artisanal batches. Hand-boxed in zero-emission cedar packaging.
          </Text>
        </View>

        {/* Prominent CTA */}
        <Pressable
          accessibilityLabel="Proceed to Payment"
          onPress={handleProceedPayment}
          style={({ pressed }) => [styles.payButton, pressed && styles.pressed]}>
          <View style={styles.payBtnLeft}>
            <ShoIcon name="lock" size={20} color={ShoColors.onPrimaryFixed} />
            <Text style={styles.payBtnLabel}>Proceed to Payment</Text>
          </View>
          <Text style={styles.payBtnTotal}>${finalTotal.toFixed(2)}</Text>
        </Pressable>

        <Text style={styles.termsAgreementText}>
          By placing this order you agree to SHO. Terms of Curation.
        </Text>

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
    gap: ShoSpacing.lg,
  },
  topFlowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderReviewEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: ShoColors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  bagTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  bagTitleText: {
    fontFamily: 'serif',
    fontSize: 22,
    fontWeight: '600',
    color: ShoColors.onSurface,
  },
  itemCountBadge: {
    backgroundColor: ShoColors.surfaceContainerHigh,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: ShoRadius.full,
  },
  itemCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: ShoColors.primaryFixed,
  },
  clearBagBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ShoColors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperCard: {
    backgroundColor: ShoColors.surfaceContainer,
    borderRadius: ShoRadius.lg,
    paddingHorizontal: ShoSpacing.md,
    paddingVertical: ShoSpacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: ShoColors.borderSubtle,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stepNumCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: ShoColors.surfaceContainerHighest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumCircleActive: {
    backgroundColor: ShoColors.primaryFixed,
  },
  stepNumActiveText: {
    fontSize: 12,
    fontWeight: '700',
    color: ShoColors.onPrimaryFixed,
  },
  stepNumText: {
    fontSize: 12,
    fontWeight: '600',
    color: ShoColors.onSurfaceVariant,
  },
  stepLabelActive: {
    fontSize: 13,
    fontWeight: '700',
    color: ShoColors.onSurface,
  },
  stepLabel: {
    fontSize: 13,
    color: ShoColors.onSurfaceVariant,
  },
  stepperBar: {
    flex: 1,
    height: 2,
    backgroundColor: ShoColors.surfaceContainerHighest,
    marginHorizontal: 8,
    borderRadius: 1,
    overflow: 'hidden',
  },
  stepperProgress: {
    height: '100%',
    backgroundColor: ShoColors.primaryFixed,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: ShoColors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  returnsHint: {
    fontSize: 11,
    color: ShoColors.secondary,
  },
  emptyBagBox: {
    backgroundColor: ShoColors.surfaceContainer,
    borderRadius: ShoRadius.default,
    padding: ShoSpacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: ShoColors.borderSubtle,
  },
  emptyTitle: {
    fontFamily: 'serif',
    fontSize: 18,
    fontWeight: '600',
    color: ShoColors.onSurface,
  },
  emptySubtitle: {
    fontSize: 12,
    color: ShoColors.textMuted,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 18,
  },
  exploreCtaBtn: {
    marginTop: 12,
    backgroundColor: ShoColors.primaryFixed,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: ShoRadius.full,
  },
  exploreCtaText: {
    fontSize: 12,
    fontWeight: '700',
    color: ShoColors.onPrimaryFixed,
    textTransform: 'uppercase',
  },
  itemsList: {
    gap: 12,
  },
  cartCard: {
    backgroundColor: ShoColors.surfaceContainer,
    borderRadius: ShoRadius.default,
    padding: ShoSpacing.md,
    borderWidth: 1,
    borderColor: ShoColors.borderSubtle,
  },
  cartItemRow: {
    flexDirection: 'row',
    gap: ShoSpacing.md,
  },
  thumbWrapper: {
    width: 90,
    height: 90,
    borderRadius: ShoRadius.default,
    backgroundColor: ShoColors.surfaceContainerLow,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  sizeTag: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(8, 22, 19, 0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: ShoRadius.full,
  },
  sizeTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: ShoColors.primaryFixed,
  },
  itemInfoCol: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemHeaderLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: ShoColors.onSurface,
    flex: 1,
  },
  deleteBtn: {
    padding: 2,
  },
  itemColorSubtitle: {
    fontSize: 12,
    color: ShoColors.onSurfaceVariant,
    marginTop: 2,
  },
  itemBottomLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  itemTotalFormatted: {
    fontSize: 15,
    fontWeight: '700',
    color: ShoColors.primaryFixed,
  },
  stepperPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ShoColors.surfaceContainerHigh,
    borderRadius: ShoRadius.full,
    padding: 2,
  },
  stepActionBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepQuantityText: {
    fontSize: 13,
    fontWeight: '700',
    color: ShoColors.onSurface,
    paddingHorizontal: 8,
  },
  addressSection: {
    backgroundColor: ShoColors.surfaceContainer,
    borderRadius: ShoRadius.default,
    padding: ShoSpacing.md,
    borderWidth: 1,
    borderColor: ShoColors.borderSubtle,
    gap: ShoSpacing.sm,
  },
  addressHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addressIconHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addressPinCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: ShoColors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressHeaderTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: ShoColors.onSurface,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  addressEditBtn: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  addressEditText: {
    fontSize: 12,
    color: ShoColors.primaryFixed,
    textDecorationLine: 'underline',
  },
  addressCardInner: {
    backgroundColor: ShoColors.surfaceContainerLow,
    borderRadius: ShoRadius.default,
    padding: ShoSpacing.md,
    gap: 4,
  },
  addressNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addressFullName: {
    fontSize: 14,
    fontWeight: '700',
    color: ShoColors.onSurface,
  },
  defaultBadge: {
    backgroundColor: ShoColors.secondaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: ShoRadius.full,
  },
  defaultBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: ShoColors.onSecondaryContainer,
  },
  addressStreetText: {
    fontSize: 12,
    color: ShoColors.onSurfaceVariant,
    lineHeight: 18,
    marginTop: 2,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  phoneText: {
    fontSize: 12,
    color: ShoColors.onSurfaceVariant,
  },
  deliverySection: {
    gap: ShoSpacing.sm,
  },
  deliveryOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: ShoSpacing.md,
    backgroundColor: ShoColors.surfaceContainerLow,
    borderRadius: ShoRadius.default,
    borderWidth: 1,
    borderColor: ShoColors.borderSubtle,
  },
  deliveryOptionActive: {
    backgroundColor: ShoColors.surfaceContainer,
    borderColor: 'rgba(233, 226, 209, 0.4)',
  },
  deliveryRadioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ShoSpacing.md,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: ShoColors.surfaceContainerHighest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    backgroundColor: ShoColors.primaryFixed,
  },
  deliveryOptTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: ShoColors.onSurface,
  },
  deliveryOptSubtitle: {
    fontSize: 12,
    color: ShoColors.onSurfaceVariant,
  },
  deliveryPriceFree: {
    fontSize: 13,
    fontWeight: '700',
    color: ShoColors.primaryFixed,
    textTransform: 'uppercase',
  },
  deliveryPriceExpress: {
    fontSize: 13,
    fontWeight: '700',
    color: ShoColors.onSurface,
  },
  paymentSection: {
    gap: ShoSpacing.sm,
  },
  secureHint: {
    fontSize: 11,
    color: ShoColors.secondary,
  },
  paymentChipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  paymentChip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: ShoRadius.default,
    backgroundColor: ShoColors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: ShoColors.borderSubtle,
    gap: 4,
  },
  paymentChipSelected: {
    backgroundColor: ShoColors.surfaceContainer,
    borderColor: 'rgba(233, 226, 209, 0.5)',
  },
  paymentChipLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: ShoColors.onSurfaceVariant,
  },
  costBreakdownCard: {
    backgroundColor: ShoColors.surfaceContainer,
    borderRadius: ShoRadius.default,
    padding: ShoSpacing.md,
    borderWidth: 1,
    borderColor: ShoColors.borderSubtle,
    gap: 8,
  },
  costRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  costLabel: {
    fontSize: 13,
    color: ShoColors.onSurfaceVariant,
  },
  costValue: {
    fontSize: 13,
    fontWeight: '600',
    color: ShoColors.onSurface,
  },
  divider: {
    height: 1,
    backgroundColor: ShoColors.surfaceContainerHighest,
    marginVertical: 4,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontFamily: 'serif',
    fontSize: 20,
    fontWeight: '600',
    color: ShoColors.onSurface,
  },
  totalSubtext: {
    fontSize: 10,
    color: ShoColors.onSurfaceVariant,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: ShoColors.primaryFixed,
  },
  guaranteeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: ShoSpacing.sm,
    backgroundColor: ShoColors.surfaceContainerLow,
    borderRadius: ShoRadius.default,
    borderWidth: 1,
    borderColor: ShoColors.borderSubtle,
  },
  guaranteeText: {
    flex: 1,
    fontSize: 11,
    color: ShoColors.onSurfaceVariant,
    lineHeight: 16,
  },
  payButton: {
    height: 54,
    borderRadius: ShoRadius.full,
    backgroundColor: ShoColors.primaryFixed,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    shadowColor: '#e9e2d1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  payBtnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  payBtnLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: ShoColors.onPrimaryFixed,
    letterSpacing: 0.5,
  },
  payBtnTotal: {
    fontSize: 16,
    fontWeight: '800',
    color: ShoColors.onPrimaryFixed,
  },
  termsAgreementText: {
    fontSize: 10,
    color: ShoColors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: -8,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
