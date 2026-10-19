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
import { ShoColors, ShoRadius, ShoSpacing } from '@/constants/sho-theme';
import { ShoHeader } from '@/components/sho-header';
import { ShoIcon } from '@/components/sho-icon';
import { useSho } from '@/context/sho-context';
import { Order } from '@/constants/sho-mock-data';

const STATUS_SEQUENCE: Order['status'][] = [
  'Processing',
  'Dispatched',
  'In Transit',
  'Out for Delivery',
  'Delivered',
];

export default function AdminOrdersScreen() {
  const { orders, updateOrderStatus } = useSho();
  const [filterStatus, setFilterStatus] = useState<'All' | Order['status']>('All');

  const statusFilters: (Order['status'] | 'All')[] = [
    'All', 'Processing', 'Dispatched', 'In Transit', 'Out for Delivery', 'Delivered', 'Cancelled',
  ];

  const visible =
    filterStatus === 'All' ? orders : orders.filter((o) => o.status === filterStatus);

  const handleAdvanceStatus = (order: Order) => {
    const currentIdx = STATUS_SEQUENCE.indexOf(order.status);
    if (currentIdx === -1 || currentIdx >= STATUS_SEQUENCE.length - 1) {
      Alert.alert('Status', `Order ${order.orderNumber} is already marked as Delivered.`);
      return;
    }
    const nextStatus = STATUS_SEQUENCE[currentIdx + 1];
    Alert.alert(
      'Advance Order Status',
      `Move "${order.orderNumber}" from "${order.status}" to "${nextStatus}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Advance', onPress: () => updateOrderStatus(order.id, nextStatus) },
      ]
    );
  };

  const handleCancelOrder = (order: Order) => {
    Alert.alert(
      'Cancel Order',
      `Cancel parcel "${order.orderNumber}"? This action cannot be undone.`,
      [
        { text: 'Dismiss', style: 'cancel' },
        {
          text: 'Cancel Order',
          style: 'destructive',
          onPress: () => updateOrderStatus(order.id, 'Cancelled'),
        },
      ]
    );
  };

  const statusColor = (status: Order['status']) => {
    switch (status) {
      case 'Delivered': return ShoColors.success;
      case 'In Transit': return ShoColors.primaryFixed;
      case 'Out for Delivery': return ShoColors.secondary;
      case 'Processing': return ShoColors.warning;
      case 'Cancelled': return ShoColors.error;
      default: return ShoColors.textMuted;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ShoHeader title="Orders Management" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.pageHeader}>
          <Text style={styles.eyebrow}>Fulfillment Operations</Text>
          <Text style={styles.title}>Order Pipeline</Text>
          <Text style={styles.subtitle}>
            Advance order statuses, cancel parcels, and manage the entire fulfillment lifecycle.
          </Text>
        </View>

        {/* Summary KPIs */}
        <View style={styles.kpiRow}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>{orders.length}</Text>
            <Text style={styles.kpiLabel}>Total</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={[styles.kpiValue, { color: ShoColors.warning }]}>
              {orders.filter((o) => o.status === 'Processing').length}
            </Text>
            <Text style={styles.kpiLabel}>Processing</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={[styles.kpiValue, { color: ShoColors.primaryFixed }]}>
              {orders.filter((o) => o.status === 'In Transit').length}
            </Text>
            <Text style={styles.kpiLabel}>In Transit</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={[styles.kpiValue, { color: ShoColors.success }]}>
              {orders.filter((o) => o.status === 'Delivered').length}
            </Text>
            <Text style={styles.kpiLabel}>Delivered</Text>
          </View>
        </View>

        {/* Status Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}>
          {statusFilters.map((s) => (
            <Pressable
              key={s}
              onPress={() => setFilterStatus(s as any)}
              style={[styles.filterPill, filterStatus === s && styles.filterPillActive]}>
              <Text style={[styles.filterPillText, filterStatus === s && styles.filterPillTextActive]}>
                {s}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Orders List */}
        <View style={styles.ordersList}>
          {visible.map((order) => (
            <View key={order.id} style={styles.orderCard}>
              {/* Header */}
              <View style={styles.orderHeaderRow}>
                <View>
                  <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                  <Text style={styles.orderDate}>{order.date} • {order.shippingAddress.fullName}</Text>
                </View>
                <View style={[styles.statusBadge, { borderColor: statusColor(order.status) + '40' }]}>
                  <View style={[styles.statusDot, { backgroundColor: statusColor(order.status) }]} />
                  <Text style={[styles.statusText, { color: statusColor(order.status) }]}>
                    {order.status}
                  </Text>
                </View>
              </View>

              {/* Items thumbnails */}
              <View style={styles.thumbRow}>
                {order.items.map((item, idx) => (
                  <View key={idx} style={styles.thumbWrap}>
                    <Image source={{ uri: item.image }} style={styles.itemThumb} resizeMode="cover" />
                  </View>
                ))}
                <Text style={styles.totalText}>${order.total.toFixed(2)}</Text>
              </View>

              {/* Admin action row */}
              {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                <View style={styles.adminActions}>
                  <Pressable
                    onPress={() => handleAdvanceStatus(order)}
                    style={({ pressed }) => [styles.advanceBtn, pressed && styles.pressed]}>
                    <ShoIcon name="arrow_forward" size={15} color={ShoColors.onPrimaryFixed} />
                    <Text style={styles.advanceBtnText}>Advance Status</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => handleCancelOrder(order)}
                    style={({ pressed }) => [styles.cancelBtn, pressed && styles.pressed]}>
                    <ShoIcon name="close" size={14} color={ShoColors.error} />
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </Pressable>
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: ShoColors.surface },
  scrollContent: {
    paddingHorizontal: ShoSpacing.margin,
    paddingTop: ShoSpacing.sm,
    gap: ShoSpacing.md,
  },
  pageHeader: { gap: 4 },
  eyebrow: {
    fontSize: 10, fontWeight: '700', color: ShoColors.secondary,
    textTransform: 'uppercase', letterSpacing: 1.5,
  },
  title: { fontFamily: 'serif', fontSize: 24, fontWeight: '600', color: ShoColors.primary },
  subtitle: { fontSize: 12, color: ShoColors.onSurfaceVariant, lineHeight: 18 },
  kpiRow: { flexDirection: 'row', gap: 8 },
  kpiCard: {
    flex: 1, backgroundColor: ShoColors.surfaceContainer, borderRadius: ShoRadius.default,
    padding: ShoSpacing.sm, alignItems: 'center', borderWidth: 1, borderColor: ShoColors.borderSubtle,
  },
  kpiValue: { fontFamily: 'serif', fontSize: 20, fontWeight: '700', color: ShoColors.primaryFixed },
  kpiLabel: { fontSize: 10, color: ShoColors.textMuted, textTransform: 'uppercase', marginTop: 2 },
  filterRow: { gap: 8, paddingVertical: 4 },
  filterPill: {
    paddingHorizontal: 12, height: 32, borderRadius: ShoRadius.full,
    backgroundColor: ShoColors.surfaceContainer, borderWidth: 1,
    borderColor: ShoColors.borderSubtle, alignItems: 'center', justifyContent: 'center',
  },
  filterPillActive: { backgroundColor: ShoColors.primaryFixed, borderColor: ShoColors.primaryFixed },
  filterPillText: { fontSize: 11, color: ShoColors.onSurfaceVariant },
  filterPillTextActive: { color: ShoColors.onPrimaryFixed, fontWeight: '700' },
  ordersList: { gap: 10 },
  orderCard: {
    backgroundColor: ShoColors.surfaceContainer, borderRadius: ShoRadius.default,
    padding: ShoSpacing.md, borderWidth: 1, borderColor: ShoColors.borderSubtle, gap: 10,
  },
  orderHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  orderNumber: { fontFamily: 'serif', fontSize: 15, fontWeight: '700', color: ShoColors.onSurface },
  orderDate: { fontSize: 11, color: ShoColors.textMuted, marginTop: 1 },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: ShoRadius.full, borderWidth: 1,
    backgroundColor: 'rgba(8,22,19,0.5)',
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  thumbRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  thumbWrap: {
    width: 44, height: 44, borderRadius: ShoRadius.sm,
    backgroundColor: ShoColors.surfaceContainerLow, overflow: 'hidden',
  },
  itemThumb: { width: '100%', height: '100%' },
  totalText: {
    marginLeft: 'auto', fontSize: 15, fontWeight: '800', color: ShoColors.primaryFixed,
  },
  adminActions: { flexDirection: 'row', gap: 8 },
  advanceBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, height: 36, borderRadius: ShoRadius.full, backgroundColor: ShoColors.primaryFixed,
  },
  advanceBtnText: { fontSize: 12, fontWeight: '700', color: ShoColors.onPrimaryFixed },
  cancelBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 4, height: 36, paddingHorizontal: 14, borderRadius: ShoRadius.full,
    borderWidth: 1, borderColor: 'rgba(255,180,171,0.3)',
    backgroundColor: 'rgba(147,0,10,0.1)',
  },
  cancelBtnText: { fontSize: 12, fontWeight: '600', color: ShoColors.error },
  pressed: { opacity: 0.8, transform: [{ scale: 0.97 }] },
});
