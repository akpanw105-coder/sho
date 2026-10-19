import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ShoColors, ShoRadius, ShoSpacing } from '@/constants/sho-theme';
import { ShoHeader } from '@/components/sho-header';
import { ShoIcon } from '@/components/sho-icon';
import { useSho } from '@/context/sho-context';

export default function OrderTrackingScreen() {
  const params = useLocalSearchParams();
  const { orders } = useSho();

  const order = orders.find((o) => o.id === params.orderId) || orders[0];

  const trackingSteps = [
    {
      title: 'Artisanal Preparation',
      subtitle: 'Footwear verified and authenticated in atelier',
      date: 'Oct 17, 09:30 AM',
      completed: true,
      current: false,
    },
    {
      title: 'Cedar Box Packaging',
      subtitle: 'Zero-emission sealed cedar boutique enclosure',
      date: 'Oct 17, 02:15 PM',
      completed: true,
      current: false,
    },
    {
      title: 'Dispatched with Courier',
      subtitle: 'Handed to premium private logistics courier',
      date: 'Oct 18, 08:00 AM',
      completed: true,
      current: order.status === 'In Transit',
    },
    {
      title: 'Out for Delivery',
      subtitle: 'Courier will contact recipient upon arrival',
      date: 'Estimated Oct 21',
      completed: order.status === 'Delivered',
      current: order.status === 'Out for Delivery',
    },
    {
      title: 'Delivered',
      subtitle: 'Handed to patron with signature receipt',
      date: order.status === 'Delivered' ? 'Delivered' : 'Pending',
      completed: order.status === 'Delivered',
      current: false,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ShoHeader title="Parcel Tracking" showBack />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Tracking Card Banner */}
        <View style={styles.bannerCard}>
          <View style={styles.bannerHeader}>
            <View>
              <Text style={styles.orderLabel}>Tracking Identifier</Text>
              <Text style={styles.trackingId}>{order.trackingCode}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{order.status}</Text>
            </View>
          </View>

          <View style={styles.etaRow}>
            <ShoIcon name="local_shipping" size={18} color={ShoColors.secondary} />
            <Text style={styles.etaText}>Estimated Delivery: {order.estimatedDelivery}</Text>
          </View>
        </View>

        {/* Timeline Stepper */}
        <View style={styles.timelineCard}>
          <Text style={styles.timelineTitle}>Transit Milestone Timeline</Text>

          <View style={styles.timelineBody}>
            {trackingSteps.map((step, idx) => (
              <View key={idx} style={styles.timelineRow}>
                {/* Left line & bullet */}
                <View style={styles.bulletCol}>
                  <View
                    style={[
                      styles.bullet,
                      step.completed && styles.bulletCompleted,
                      step.current && styles.bulletCurrent,
                    ]}>
                    {step.completed && (
                      <ShoIcon name="check" size={12} color={ShoColors.onPrimaryFixed} />
                    )}
                  </View>
                  {idx < trackingSteps.length - 1 && (
                    <View
                      style={[
                        styles.connectingLine,
                        step.completed && styles.connectingLineActive,
                      ]}
                    />
                  )}
                </View>

                {/* Right details */}
                <View style={styles.stepDetailsCol}>
                  <Text
                    style={[
                      styles.stepTitle,
                      step.current && { color: ShoColors.primaryFixed, fontWeight: '700' },
                    ]}>
                    {step.title}
                  </Text>
                  <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
                  <Text style={styles.stepDate}>{step.date}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Destination & Package Details */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>Parcel Content</Text>
          {order.items.map((it, i) => (
            <View key={i} style={styles.itemRow}>
              <Image source={{ uri: it.image }} style={styles.itemThumb} resizeMode="cover" />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{it.productName}</Text>
                <Text style={styles.itemSub}>
                  {it.color} • EU {it.size} • Qty {it.quantity}
                </Text>
              </View>
              <Text style={styles.itemPrice}>${(it.unitPrice * it.quantity).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>Recipient Details</Text>
          <Text style={styles.destName}>{order.shippingAddress.fullName}</Text>
          <Text style={styles.destAddress}>
            {order.shippingAddress.street}{'\n'}
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
          </Text>
          <Text style={styles.destPhone}>{order.shippingAddress.phone}</Text>
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
  bannerCard: {
    backgroundColor: ShoColors.surfaceContainer,
    borderRadius: ShoRadius.default,
    padding: ShoSpacing.md,
    borderWidth: 1,
    borderColor: 'rgba(233, 226, 209, 0.3)',
    gap: 12,
  },
  bannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: ShoColors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  trackingId: {
    fontFamily: 'serif',
    fontSize: 16,
    fontWeight: '700',
    color: ShoColors.onSurface,
    marginTop: 2,
  },
  badge: {
    backgroundColor: ShoColors.surfaceContainerHigh,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: ShoRadius.full,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: ShoColors.primaryFixed,
    textTransform: 'uppercase',
  },
  etaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: ShoColors.surfaceContainerLow,
    padding: 10,
    borderRadius: ShoRadius.default,
  },
  etaText: {
    fontSize: 12,
    fontWeight: '600',
    color: ShoColors.onSurface,
  },
  timelineCard: {
    backgroundColor: ShoColors.surfaceContainer,
    borderRadius: ShoRadius.default,
    padding: ShoSpacing.md,
    borderWidth: 1,
    borderColor: ShoColors.borderSubtle,
    gap: 16,
  },
  timelineTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: ShoColors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  timelineBody: {
    paddingLeft: 4,
  },
  timelineRow: {
    flexDirection: 'row',
    gap: 14,
  },
  bulletCol: {
    alignItems: 'center',
    width: 20,
  },
  bullet: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: ShoColors.surfaceContainerHighest,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: ShoColors.surfaceContainer,
  },
  bulletCompleted: {
    backgroundColor: ShoColors.primaryFixed,
  },
  bulletCurrent: {
    borderColor: ShoColors.primaryFixed,
    borderWidth: 2,
  },
  connectingLine: {
    width: 2,
    flex: 1,
    minHeight: 32,
    backgroundColor: ShoColors.surfaceContainerHighest,
  },
  connectingLineActive: {
    backgroundColor: ShoColors.primaryFixed,
  },
  stepDetailsCol: {
    flex: 1,
    paddingBottom: 16,
    gap: 2,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: ShoColors.onSurface,
  },
  stepSubtitle: {
    fontSize: 11,
    color: ShoColors.onSurfaceVariant,
  },
  stepDate: {
    fontSize: 10,
    color: ShoColors.textMuted,
    marginTop: 2,
  },
  card: {
    backgroundColor: ShoColors.surfaceContainer,
    borderRadius: ShoRadius.default,
    padding: ShoSpacing.md,
    borderWidth: 1,
    borderColor: ShoColors.borderSubtle,
    gap: 12,
  },
  cardSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: ShoColors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  itemThumb: {
    width: 48,
    height: 48,
    borderRadius: ShoRadius.sm,
    backgroundColor: ShoColors.surfaceContainerLow,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '600',
    color: ShoColors.onSurface,
  },
  itemSub: {
    fontSize: 11,
    color: ShoColors.textMuted,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: ShoColors.primaryFixed,
  },
  destName: {
    fontSize: 14,
    fontWeight: '700',
    color: ShoColors.onSurface,
  },
  destAddress: {
    fontSize: 12,
    color: ShoColors.onSurfaceVariant,
    lineHeight: 18,
  },
  destPhone: {
    fontSize: 12,
    color: ShoColors.textMuted,
  },
});
