import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  SafeAreaView,
  Alert,
} from 'react-native';
import { ShoColors, ShoRadius, ShoSpacing } from '@/constants/sho-theme';
import { ShoHeader } from '@/components/sho-header';
import { ShoIcon } from '@/components/sho-icon';
import { useSho } from '@/context/sho-context';
import { Customer } from '@/constants/sho-mock-data';

export default function AdminCustomersScreen() {
  const { customers, orders } = useSho();
  const [selectedTier, setSelectedTier] = useState<'All' | Customer['status']>('All');

  const tiers: (Customer['status'] | 'All')[] = ['All', 'VIP Patron', 'Active', 'Dormant'];

  const visible =
    selectedTier === 'All'
      ? customers
      : customers.filter((c) => c.status === selectedTier);

  const totalRevenue = customers.reduce((a, c) => a + c.totalSpent, 0);
  const vipCount = customers.filter((c) => c.status === 'VIP Patron').length;

  const tierColor = (tier: Customer['status']) => {
    switch (tier) {
      case 'VIP Patron': return ShoColors.primaryFixed;
      case 'Active': return ShoColors.success;
      case 'Dormant': return ShoColors.textMuted;
    }
  };

  const handleViewCustomer = (customer: Customer) => {
    const custOrders = orders.filter((o) =>
      o.shippingAddress.fullName.toLowerCase().includes(customer.name.split(' ')[0].toLowerCase())
    );
    Alert.alert(
      customer.name,
      `Email: ${customer.email}\nPhone: ${customer.phone}\nJoined: ${customer.joinedDate}\nOrders: ${customer.ordersCount}\nTotal Spent: $${customer.totalSpent.toFixed(2)}\nLinked Orders: ${custOrders.length}`
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ShoHeader title="Customer Patrons" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.pageHeader}>
          <Text style={styles.eyebrow}>Patron Relations</Text>
          <Text style={styles.title}>Customer Registry</Text>
          <Text style={styles.subtitle}>
            Manage collector profiles, VIP salon tiers, and purchase history for every SHO. patron.
          </Text>
        </View>

        {/* KPIs */}
        <View style={styles.kpiRow}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>{customers.length}</Text>
            <Text style={styles.kpiLabel}>Registered</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={[styles.kpiValue, { color: ShoColors.primaryFixed }]}>{vipCount}</Text>
            <Text style={styles.kpiLabel}>VIP Patrons</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>${totalRevenue.toFixed(0)}</Text>
            <Text style={styles.kpiLabel}>Revenue</Text>
          </View>
        </View>

        {/* Tier Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}>
          {tiers.map((t) => (
            <Pressable
              key={t}
              onPress={() => setSelectedTier(t as any)}
              style={[styles.filterPill, selectedTier === t && styles.filterPillActive]}>
              <Text style={[styles.filterPillText, selectedTier === t && styles.filterPillTextActive]}>
                {t}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Customer List */}
        <View style={styles.customerList}>
          {visible.map((customer) => (
            <Pressable
              key={customer.id}
              onPress={() => handleViewCustomer(customer)}
              style={({ pressed }) => [styles.customerCard, pressed && styles.pressed]}>
              {/* Avatar Placeholder */}
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarInitial}>
                  {customer.name.charAt(0).toUpperCase()}
                </Text>
              </View>

              <View style={styles.customerInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.customerName}>{customer.name}</Text>
                  <View style={[styles.tierBadge, { borderColor: tierColor(customer.status) + '50' }]}>
                    <Text style={[styles.tierBadgeText, { color: tierColor(customer.status) }]}>
                      {customer.status}
                    </Text>
                  </View>
                </View>
                <Text style={styles.customerEmail}>{customer.email}</Text>
                <View style={styles.metricsRow}>
                  <Text style={styles.metricText}>{customer.ordersCount} orders</Text>
                  <Text style={styles.metricDot}>·</Text>
                  <Text style={styles.metricText}>${customer.totalSpent.toFixed(0)} spent</Text>
                  <Text style={styles.metricDot}>·</Text>
                  <Text style={styles.metricText}>Joined {customer.joinedDate}</Text>
                </View>
              </View>

              <ShoIcon name="chevron_right" size={16} color={ShoColors.textMuted} />
            </Pressable>
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
    paddingHorizontal: ShoSpacing.margin, paddingTop: ShoSpacing.sm, gap: ShoSpacing.md,
  },
  pageHeader: { gap: 4 },
  eyebrow: {
    fontSize: 10, fontWeight: '700', color: ShoColors.secondary,
    textTransform: 'uppercase', letterSpacing: 1.5,
  },
  title: { fontFamily: 'serif', fontSize: 24, fontWeight: '600', color: ShoColors.primary },
  subtitle: { fontSize: 12, color: ShoColors.onSurfaceVariant, lineHeight: 18 },
  kpiRow: { flexDirection: 'row', gap: 10 },
  kpiCard: {
    flex: 1, backgroundColor: ShoColors.surfaceContainer, borderRadius: ShoRadius.default,
    padding: ShoSpacing.sm, alignItems: 'center', borderWidth: 1, borderColor: ShoColors.borderSubtle,
  },
  kpiValue: { fontFamily: 'serif', fontSize: 20, fontWeight: '700', color: ShoColors.primaryFixed },
  kpiLabel: { fontSize: 10, color: ShoColors.textMuted, textTransform: 'uppercase', marginTop: 2 },
  filterRow: { gap: 8, paddingVertical: 4 },
  filterPill: {
    paddingHorizontal: 14, height: 34, borderRadius: ShoRadius.full,
    backgroundColor: ShoColors.surfaceContainer, borderWidth: 1,
    borderColor: ShoColors.borderSubtle, alignItems: 'center', justifyContent: 'center',
  },
  filterPillActive: { backgroundColor: ShoColors.primaryFixed, borderColor: ShoColors.primaryFixed },
  filterPillText: { fontSize: 12, color: ShoColors.onSurfaceVariant },
  filterPillTextActive: { color: ShoColors.onPrimaryFixed, fontWeight: '700' },
  customerList: { gap: 10 },
  customerCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: ShoColors.surfaceContainer, borderRadius: ShoRadius.default,
    padding: ShoSpacing.md, borderWidth: 1, borderColor: ShoColors.borderSubtle,
  },
  avatarCircle: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: ShoColors.surfaceContainerHigh,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: ShoColors.primaryFixed,
  },
  avatarInitial: {
    fontFamily: 'serif', fontSize: 18, fontWeight: '700', color: ShoColors.primaryFixed,
  },
  customerInfo: { flex: 1, gap: 2 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  customerName: { fontFamily: 'serif', fontSize: 15, fontWeight: '700', color: ShoColors.onSurface },
  tierBadge: {
    paddingHorizontal: 7, paddingVertical: 2, borderRadius: ShoRadius.full, borderWidth: 1,
  },
  tierBadgeText: { fontSize: 9, fontWeight: '700', textTransform: 'uppercase' },
  customerEmail: { fontSize: 11, color: ShoColors.textMuted },
  metricsRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2, flexWrap: 'wrap' },
  metricText: { fontSize: 10, color: ShoColors.secondary },
  metricDot: { fontSize: 10, color: ShoColors.textMuted },
  pressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
});
