import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ShoColors, ShoRadius, ShoSpacing } from '@/constants/sho-theme';
import { ShoHeader } from '@/components/sho-header';
import { ShoIcon } from '@/components/sho-icon';
import { useSho } from '@/context/sho-context';

export default function OrderConfirmationScreen() {
  const params = useLocalSearchParams();
  const { orders } = useSho();

  const order = orders.find((o) => o.id === params.orderId) || orders[0];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ShoHeader title="Order Confirmed" showBack onBackPress={() => router.push('/')} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Celebration Stamp */}
        <View style={styles.celebrationCard}>
          <View style={styles.verifiedCircle}>
            <ShoIcon name="verified" size={32} color={ShoColors.onPrimaryFixed} />
          </View>

          <Text style={styles.eyebrow}>Order Acquired</Text>
          <Text style={styles.orderNumberText}>{order.orderNumber}</Text>
          <Text style={styles.thankYouText}>
            Your footwear requisition has been authenticated. It is now routed to our atelier for inspection and hand-boxing in cedar packaging.
          </Text>

          <View style={styles.trackingPill}>
            <ShoIcon name="local_shipping" size={15} color={ShoColors.secondary} />
            <Text style={styles.trackingText}>{order.trackingCode}</Text>
          </View>
        </View>

        {/* Ordered Items List */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Reserved Silhouettes</Text>
          {order.items.map((item, idx) => (
            <View key={idx} style={styles.itemRow}>
              <Image source={{ uri: item.image }} style={styles.itemThumb} resizeMode="cover" />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.productName}</Text>
                <Text style={styles.itemMeta}>
                  {item.color} • EU {item.size} • Qty {item.quantity}
                </Text>
                <Text style={styles.itemPrice}>${(item.unitPrice * item.quantity).toFixed(2)}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Shipping & Delivery Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Dispatch Destination</Text>
          <Text style={styles.recipientName}>{order.shippingAddress.fullName}</Text>
          <Text style={styles.addressBody}>
            {order.shippingAddress.street}{'\n'}
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
          </Text>
          <View style={styles.deliveryBadge}>
            <Text style={styles.deliveryBadgeText}>
              Estimated Arrival: {order.estimatedDelivery}
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <Pressable
            accessibilityLabel="Track Order"
            onPress={() =>
              router.push({
                pathname: '/order-tracking' as any,
                params: { orderId: order.id },
              })
            }
            style={({ pressed }) => [styles.trackOrderBtn, pressed && styles.pressed]}>
            <ShoIcon name="local_shipping" size={18} color={ShoColors.onPrimaryFixed} />
            <Text style={styles.trackOrderText}>Track Parcel</Text>
          </Pressable>

          <Pressable
            accessibilityLabel="Continue Shopping"
            onPress={() => router.push('/')}
            style={({ pressed }) => [styles.continueBtn, pressed && styles.pressed]}>
            <Text style={styles.continueText}>Return to Home</Text>
          </Pressable>
        </View>

        <View style={{ height: 40 }} />
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
  celebrationCard: {
    backgroundColor: ShoColors.surfaceContainer,
    borderRadius: ShoRadius.lg,
    padding: ShoSpacing.xl,
    alignItems: 'center',
    textAlign: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(233, 226, 209, 0.3)',
  },
  verifiedCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: ShoColors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    color: ShoColors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  orderNumberText: {
    fontFamily: 'serif',
    fontSize: 24,
    fontWeight: '700',
    color: ShoColors.onSurface,
  },
  thankYouText: {
    fontSize: 12,
    color: ShoColors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 290,
  },
  trackingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: ShoColors.surfaceContainerHigh,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: ShoRadius.full,
    marginTop: 6,
  },
  trackingText: {
    fontSize: 11,
    fontWeight: '700',
    color: ShoColors.onSurface,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: ShoColors.surfaceContainer,
    borderRadius: ShoRadius.default,
    padding: ShoSpacing.md,
    borderWidth: 1,
    borderColor: ShoColors.borderSubtle,
    gap: 12,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: ShoColors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  itemRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  itemThumb: {
    width: 64,
    height: 64,
    borderRadius: ShoRadius.default,
    backgroundColor: ShoColors.surfaceContainerLow,
  },
  itemInfo: {
    flex: 1,
    gap: 2,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: ShoColors.onSurface,
  },
  itemMeta: {
    fontSize: 11,
    color: ShoColors.textMuted,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: ShoColors.primaryFixed,
  },
  recipientName: {
    fontSize: 14,
    fontWeight: '700',
    color: ShoColors.onSurface,
  },
  addressBody: {
    fontSize: 12,
    color: ShoColors.onSurfaceVariant,
    lineHeight: 18,
  },
  deliveryBadge: {
    backgroundColor: ShoColors.surfaceContainerLow,
    padding: 8,
    borderRadius: ShoRadius.default,
  },
  deliveryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: ShoColors.secondary,
  },
  actionsRow: {
    gap: 10,
    marginTop: 8,
  },
  trackOrderBtn: {
    height: 52,
    borderRadius: ShoRadius.full,
    backgroundColor: ShoColors.primaryFixed,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  trackOrderText: {
    fontSize: 14,
    fontWeight: '800',
    color: ShoColors.onPrimaryFixed,
  },
  continueBtn: {
    height: 50,
    borderRadius: ShoRadius.full,
    borderWidth: 1,
    borderColor: ShoColors.borderElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: {
    fontSize: 13,
    fontWeight: '700',
    color: ShoColors.onSurface,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
