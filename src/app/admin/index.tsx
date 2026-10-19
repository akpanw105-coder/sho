import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { ShoColors, ShoRadius, ShoSpacing } from '@/constants/sho-theme';
import { ShoHeader } from '@/components/sho-header';
import { ShoIcon } from '@/components/sho-icon';
import { useSho } from '@/context/sho-context';

export default function AdminDashboardScreen() {
  const { products, orders, customers, isAdmin, user } = useSho();

  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === 'Processing' || o.status === 'In Transit');
  const totalStock = products.reduce((acc, p) => acc + p.stockCount, 0);
  const lowStockProducts = products.filter((p) => p.stockCount <= 15);

  const adminNavCards = [
    {
      title: 'Products & Catalogue',
      subtitle: `${products.length} active models listed`,
      count: products.length,
      icon: 'dashboard' as const,
      route: '/admin/products',
      tag: 'Manage',
    },
    {
      title: 'Customer Orders',
      subtitle: `${pendingOrders.length} pending fulfillment`,
      count: orders.length,
      icon: 'receipt_long' as const,
      route: '/admin/orders',
      tag: `${pendingOrders.length} Pending`,
    },
    {
      title: 'Patrons & Customers',
      subtitle: `${customers.length} registered VIP patrons`,
      count: customers.length,
      icon: 'group' as const,
      route: '/admin/customers',
      tag: 'Active',
    },
    {
      title: 'Inventory & Atelier Stock',
      subtitle: `${totalStock} units across sizes`,
      count: totalStock,
      icon: 'inventory_2' as const,
      route: '/admin/inventory',
      tag: `${lowStockProducts.length} Low`,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ShoHeader title="Admin Portal" showBack onBackPress={() => router.push('/')} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Header Block */}
        <View style={styles.headerBlock}>
          <Text style={styles.eyebrow}>Atelier Operations</Text>
          <Text style={styles.title}>SHO. Command Center</Text>
          <Text style={styles.subtitle}>
            Live control over catalog silhouettes, customer fulfillment, real-time stock levels, and collector salon orders.
          </Text>
        </View>

        {/* High-level KPI Row */}
        <View style={styles.kpiRow}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Total Revenue</Text>
            <Text style={styles.kpiValue}>${totalRevenue.toFixed(2)}</Text>
            <Text style={styles.kpiSub}>+18.4% this week</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Active Orders</Text>
            <Text style={styles.kpiValue}>{orders.length}</Text>
            <Text style={styles.kpiSub}>{pendingOrders.length} need dispatch</Text>
          </View>
        </View>

        {/* Operations Navigation Cards */}
        <Text style={styles.sectionHeading}>Management Modules</Text>
        <View style={styles.modulesGrid}>
          {adminNavCards.map((mod, idx) => (
            <Pressable
              key={idx}
              onPress={() => router.push(mod.route as any)}
              style={({ pressed }) => [styles.moduleCard, pressed && styles.pressed]}>
              <View style={styles.moduleHeader}>
                <View style={styles.iconCircle}>
                  <ShoIcon name={mod.icon} size={20} color={ShoColors.primaryFixed} />
                </View>
                <View style={styles.tagBadge}>
                  <Text style={styles.tagBadgeText}>{mod.tag}</Text>
                </View>
              </View>

              <View style={styles.moduleBottom}>
                <Text style={styles.moduleTitle}>{mod.title}</Text>
                <Text style={styles.moduleSubtitle}>{mod.subtitle}</Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Recent Urgent Orders List */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardHeaderTitle}>Live Order Stream</Text>
            <Pressable onPress={() => router.push('/admin/orders')}>
              <Text style={styles.viewAllText}>View All</Text>
            </Pressable>
          </View>

          {orders.slice(0, 3).map((ord) => (
            <Pressable
              key={ord.id}
              onPress={() => router.push('/admin/orders')}
              style={styles.orderStreamRow}>
              <View>
                <Text style={styles.orderStreamNumber}>{ord.orderNumber}</Text>
                <Text style={styles.orderStreamClient}>{ord.shippingAddress.fullName}</Text>
              </View>
              <View style={styles.orderStreamRight}>
                <Text style={styles.orderStreamTotal}>${ord.total.toFixed(2)}</Text>
                <View style={styles.statusPill}>
                  <Text style={styles.statusPillText}>{ord.status}</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Low Inventory Warnings */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardHeaderTitle}>Inventory Restock Alerts</Text>
            <Pressable onPress={() => router.push('/admin/inventory')}>
              <Text style={styles.viewAllText}>Adjust Stock</Text>
            </Pressable>
          </View>

          {lowStockProducts.map((p) => (
            <View key={p.id} style={styles.lowStockRow}>
              <View style={styles.lowStockLeft}>
                <View style={styles.warningDot} />
                <View>
                  <Text style={styles.lowStockName}>{p.name}</Text>
                  <Text style={styles.lowStockCategory}>{p.category}</Text>
                </View>
              </View>
              <Text style={styles.stockRemainingText}>{p.stockCount} pairs remaining</Text>
            </View>
          ))}
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
  kpiRow: {
    flexDirection: 'row',
    gap: 12,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: ShoColors.surfaceContainer,
    borderRadius: ShoRadius.default,
    padding: ShoSpacing.md,
    borderWidth: 1,
    borderColor: ShoColors.borderSubtle,
    gap: 4,
  },
  kpiLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: ShoColors.textMuted,
    textTransform: 'uppercase',
  },
  kpiValue: {
    fontFamily: 'serif',
    fontSize: 22,
    fontWeight: '700',
    color: ShoColors.primaryFixed,
  },
  kpiSub: {
    fontSize: 10,
    color: ShoColors.secondary,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: ShoColors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 4,
  },
  modulesGrid: {
    gap: 10,
  },
  moduleCard: {
    backgroundColor: ShoColors.surfaceContainer,
    borderRadius: ShoRadius.default,
    padding: ShoSpacing.md,
    borderWidth: 1,
    borderColor: ShoColors.borderSubtle,
    gap: 12,
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ShoColors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagBadge: {
    backgroundColor: 'rgba(233, 226, 209, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: ShoRadius.full,
  },
  tagBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: ShoColors.primaryFixed,
  },
  moduleBottom: {
    gap: 2,
  },
  moduleTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: ShoColors.onSurface,
  },
  moduleSubtitle: {
    fontSize: 12,
    color: ShoColors.textMuted,
  },
  card: {
    backgroundColor: ShoColors.surfaceContainer,
    borderRadius: ShoRadius.default,
    padding: ShoSpacing.md,
    borderWidth: 1,
    borderColor: ShoColors.borderSubtle,
    gap: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardHeaderTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: ShoColors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: ShoColors.secondary,
  },
  orderStreamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: ShoColors.borderSubtle,
  },
  orderStreamNumber: {
    fontFamily: 'serif',
    fontSize: 14,
    fontWeight: '700',
    color: ShoColors.onSurface,
  },
  orderStreamClient: {
    fontSize: 11,
    color: ShoColors.textMuted,
  },
  orderStreamRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  orderStreamTotal: {
    fontSize: 13,
    fontWeight: '700',
    color: ShoColors.primaryFixed,
  },
  statusPill: {
    backgroundColor: ShoColors.surfaceContainerHigh,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: ShoRadius.full,
  },
  statusPillText: {
    fontSize: 9,
    fontWeight: '700',
    color: ShoColors.onSurfaceVariant,
    textTransform: 'uppercase',
  },
  lowStockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: ShoColors.borderSubtle,
  },
  lowStockLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  warningDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ShoColors.warning,
  },
  lowStockName: {
    fontSize: 13,
    fontWeight: '600',
    color: ShoColors.onSurface,
  },
  lowStockCategory: {
    fontSize: 11,
    color: ShoColors.textMuted,
  },
  stockRemainingText: {
    fontSize: 12,
    fontWeight: '700',
    color: ShoColors.warning,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
