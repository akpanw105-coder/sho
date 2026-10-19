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
import { router } from 'expo-router';
import { ShoColors, ShoRadius, ShoSpacing } from '@/constants/sho-theme';
import { ShoHeader } from '@/components/sho-header';
import { ShoIcon } from '@/components/sho-icon';
import { useSho } from '@/context/sho-context';

export default function OrderHistoryScreen() {
  const { orders } = useSho();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ShoHeader title="Order History" showBack />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.headerBlock}>
          <Text style={styles.eyebrow}>Client Archive</Text>
          <Text style={styles.title}>Your Acquisitions</Text>
          <Text style={styles.subtitle}>
            Track historical shipments, certificates of authenticity, and parcel status.
          </Text>
        </View>

        {orders.length === 0 ? (
          <View style={styles.emptyBox}>
            <ShoIcon name="receipt_long" size={38} color={ShoColors.textMuted} />
            <Text style={styles.emptyTitle}>No Orders Yet</Text>
            <Text style={styles.emptySubtitle}>
              You have not placed any orders yet. Discover our latest footwear drop.
            </Text>
            <Pressable onPress={() => router.push('/explore')} style={styles.shopBtn}>
              <Text style={styles.shopBtnText}>Browse Drops</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.ordersList}>
            {orders.map((ord) => (
              <Pressable
                key={ord.id}
                onPress={() =>
                  router.push({
                    pathname: '/order-tracking' as any,
                    params: { orderId: ord.id },
                  })
                }
                style={({ pressed }) => [styles.orderCard, pressed && styles.pressed]}>
                {/* Header: Order #, Status, Date */}
                <View style={styles.orderCardHeader}>
                  <View>
                    <Text style={styles.orderNumber}>{ord.orderNumber}</Text>
                    <Text style={styles.orderDate}>{ord.date}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      ord.status === 'Delivered'
                        ? styles.statusDelivered
                        : ord.status === 'In Transit'
                        ? styles.statusInTransit
                        : styles.statusProcessing,
                    ]}>
                    <Text
                      style={[
                        styles.statusText,
                        ord.status === 'Delivered'
                          ? styles.statusTextDelivered
                          : ord.status === 'In Transit'
                          ? styles.statusTextInTransit
                          : styles.statusTextProcessing,
                      ]}>
                      {ord.status}
                    </Text>
                  </View>
                </View>

                {/* Items preview thumbs */}
                <View style={styles.itemsRow}>
                  {ord.items.map((item, idx) => (
                    <View key={idx} style={styles.thumbWrap}>
                      <Image
                        source={{ uri: item.image }}
                        style={styles.itemThumb}
                        resizeMode="cover"
                      />
                    </View>
                  ))}
                  <View style={styles.itemsSummaryCol}>
                    <Text style={styles.itemsSummaryText} numberOfLines={1}>
                      {ord.items.map((i) => i.productName).join(', ')}
                    </Text>
                    <Text style={styles.itemsCountText}>{ord.items.length} silhouettes</Text>
                  </View>
                </View>

                {/* Footer: Total & Track action */}
                <View style={styles.orderCardFooter}>
                  <Text style={styles.totalText}>${ord.total.toFixed(2)}</Text>
                  <View style={styles.trackLinkRow}>
                    <Text style={styles.trackLinkText}>View Tracking Details</Text>
                    <ShoIcon name="chevron_right" size={15} color={ShoColors.secondary} />
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        )}

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
  ordersList: {
    gap: 12,
  },
  orderCard: {
    backgroundColor: ShoColors.surfaceContainer,
    borderRadius: ShoRadius.default,
    padding: ShoSpacing.md,
    borderWidth: 1,
    borderColor: ShoColors.borderSubtle,
    gap: 12,
  },
  orderCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderNumber: {
    fontFamily: 'serif',
    fontSize: 16,
    fontWeight: '700',
    color: ShoColors.onSurface,
  },
  orderDate: {
    fontSize: 11,
    color: ShoColors.textMuted,
    marginTop: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: ShoRadius.full,
  },
  statusDelivered: {
    backgroundColor: 'rgba(52, 211, 153, 0.15)',
  },
  statusInTransit: {
    backgroundColor: 'rgba(233, 226, 209, 0.2)',
  },
  statusProcessing: {
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statusTextDelivered: {
    color: ShoColors.success,
  },
  statusTextInTransit: {
    color: ShoColors.primaryFixed,
  },
  statusTextProcessing: {
    color: ShoColors.warning,
  },
  itemsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  thumbWrap: {
    width: 48,
    height: 48,
    borderRadius: ShoRadius.sm,
    backgroundColor: ShoColors.surfaceContainerLow,
    overflow: 'hidden',
  },
  itemThumb: {
    width: '100%',
    height: '100%',
  },
  itemsSummaryCol: {
    flex: 1,
    marginLeft: 4,
  },
  itemsSummaryText: {
    fontSize: 13,
    fontWeight: '600',
    color: ShoColors.onSurface,
  },
  itemsCountText: {
    fontSize: 11,
    color: ShoColors.textMuted,
  },
  orderCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: ShoColors.borderSubtle,
  },
  totalText: {
    fontSize: 15,
    fontWeight: '800',
    color: ShoColors.primaryFixed,
  },
  trackLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trackLinkText: {
    fontSize: 12,
    fontWeight: '600',
    color: ShoColors.secondary,
  },
  emptyBox: {
    backgroundColor: ShoColors.surfaceContainer,
    borderRadius: ShoRadius.default,
    padding: ShoSpacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: ShoColors.borderSubtle,
    marginTop: 20,
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
    maxWidth: 260,
    lineHeight: 18,
  },
  shopBtn: {
    marginTop: 10,
    backgroundColor: ShoColors.primaryFixed,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: ShoRadius.full,
  },
  shopBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: ShoColors.onPrimaryFixed,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
