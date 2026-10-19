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

export default function AdminInventoryScreen() {
  const { products, updateProduct } = useSho();
  const [showLowOnly, setShowLowOnly] = useState(false);

  const LOW_THRESHOLD = 15;
  const RESTOCK_AMOUNT = 20;

  const visible = showLowOnly
    ? products.filter((p) => p.stockCount <= LOW_THRESHOLD)
    : [...products].sort((a, b) => a.stockCount - b.stockCount);

  const lowStockCount = products.filter((p) => p.stockCount <= LOW_THRESHOLD).length;
  const outOfStockCount = products.filter((p) => p.stockCount === 0).length;
  const totalUnits = products.reduce((a, p) => a + p.stockCount, 0);

  const stockStatus = (count: number): { label: string; color: string } => {
    if (count === 0) return { label: 'Out of Stock', color: ShoColors.error };
    if (count <= 5) return { label: 'Critical', color: ShoColors.error };
    if (count <= LOW_THRESHOLD) return { label: 'Low Stock', color: ShoColors.warning };
    return { label: 'In Stock', color: ShoColors.success };
  };

  const handleRestock = (productId: string, productName: string, current: number) => {
    Alert.alert(
      'Restock Silhouette',
      `Add ${RESTOCK_AMOUNT} units to "${productName}"?\nCurrent: ${current} → New: ${current + RESTOCK_AMOUNT}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: `Add ${RESTOCK_AMOUNT} Units`,
          onPress: () => updateProduct(productId, { stockCount: current + RESTOCK_AMOUNT }),
        },
      ]
    );
  };

  const handleAdjust = (productId: string, productName: string, current: number) => {
    Alert.alert(
      'Adjust Stock',
      `Current stock: ${current} units`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: '+5',
          onPress: () => updateProduct(productId, { stockCount: current + 5 }),
        },
        {
          text: '-5',
          onPress: () => updateProduct(productId, { stockCount: Math.max(0, current - 5) }),
        },
      ]
    );
  };

  const stockPercent = (count: number) =>
    Math.min(1, count / 50); // Assume 50 = max expected units for UI

  return (
    <SafeAreaView style={styles.safeArea}>
      <ShoHeader title="Inventory Control" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.pageHeader}>
          <Text style={styles.eyebrow}>Warehouse Operations</Text>
          <Text style={styles.title}>Inventory Management</Text>
          <Text style={styles.subtitle}>
            Monitor stock levels, trigger replenishment, and ensure every silhouette is always available.
          </Text>
        </View>

        {/* KPI Row */}
        <View style={styles.kpiRow}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>{totalUnits}</Text>
            <Text style={styles.kpiLabel}>Total Units</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={[styles.kpiValue, { color: ShoColors.warning }]}>{lowStockCount}</Text>
            <Text style={styles.kpiLabel}>Low Stock</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={[styles.kpiValue, { color: ShoColors.error }]}>{outOfStockCount}</Text>
            <Text style={styles.kpiLabel}>Out of Stock</Text>
          </View>
        </View>

        {/* Restock Alert Banner */}
        {lowStockCount > 0 && (
          <View style={styles.alertBanner}>
            <ShoIcon name="star" size={16} color={ShoColors.warning} />
            <Text style={styles.alertText}>
              {lowStockCount} silhouette{lowStockCount > 1 ? 's' : ''} need replenishment
            </Text>
          </View>
        )}

        {/* Filter Toggle */}
        <View style={styles.filterToggleRow}>
          <Text style={styles.filterLabel}>
            {showLowOnly ? `Showing Low Stock (${lowStockCount})` : `All Silhouettes (${products.length})`}
          </Text>
          <Pressable
            onPress={() => setShowLowOnly(!showLowOnly)}
            style={({ pressed }) => [styles.toggleBtn, showLowOnly && styles.toggleBtnActive, pressed && styles.pressed]}>
            <ShoIcon name="star" size={14} color={showLowOnly ? ShoColors.onPrimaryFixed : ShoColors.secondary} />
            <Text style={[styles.toggleBtnText, showLowOnly && styles.toggleBtnTextActive]}>
              Low Stock Only
            </Text>
          </Pressable>
        </View>

        {/* Inventory List */}
        <View style={styles.inventoryList}>
          {visible.map((p) => {
            const status = stockStatus(p.stockCount);
            const percent = stockPercent(p.stockCount);
            return (
              <View key={p.id} style={styles.inventoryRow}>
                {/* Thumbnail */}
                <Image source={{ uri: p.image }} style={styles.productThumb} resizeMode="cover" />

                {/* Product info */}
                <View style={styles.productInfo}>
                  <View style={styles.productNameRow}>
                    <Text style={styles.productName} numberOfLines={1}>{p.name}</Text>
                    <View style={[styles.stockStatusBadge, { borderColor: status.color + '40' }]}>
                      <Text style={[styles.stockStatusText, { color: status.color }]}>
                        {status.label}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.productCategory}>{p.category}</Text>

                  {/* Stock bar */}
                  <View style={styles.stockBarWrap}>
                    <View style={styles.stockBarBg}>
                      <View
                        style={[
                          styles.stockBarFill,
                          {
                            width: `${percent * 100}%` as any,
                            backgroundColor: status.color,
                          },
                        ]}
                      />
                    </View>
                    <Text style={[styles.stockCount, { color: status.color }]}>{p.stockCount}</Text>
                  </View>

                  {/* Action buttons */}
                  <View style={styles.actionRow}>
                    <Pressable
                      onPress={() => handleRestock(p.id, p.name, p.stockCount)}
                      style={({ pressed }) => [styles.restockBtn, pressed && styles.pressed]}>
                      <ShoIcon name="add" size={13} color={ShoColors.onPrimaryFixed} />
                      <Text style={styles.restockBtnText}>Restock +{RESTOCK_AMOUNT}</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleAdjust(p.id, p.name, p.stockCount)}
                      style={({ pressed }) => [styles.adjustBtn, pressed && styles.pressed]}>
                      <ShoIcon name="tune" size={13} color={ShoColors.secondary} />
                      <Text style={styles.adjustBtnText}>Adjust</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            );
          })}
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
  alertBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(255,193,7,0.1)', borderRadius: ShoRadius.default,
    borderWidth: 1, borderColor: 'rgba(255,193,7,0.25)', padding: ShoSpacing.sm,
  },
  alertText: { fontSize: 12, color: ShoColors.warning, fontWeight: '600' },
  filterToggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  filterLabel: { fontSize: 12, color: ShoColors.textMuted },
  toggleBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, height: 32, borderRadius: ShoRadius.full,
    backgroundColor: ShoColors.surfaceContainer, borderWidth: 1, borderColor: ShoColors.borderSubtle,
  },
  toggleBtnActive: { backgroundColor: ShoColors.primaryFixed, borderColor: ShoColors.primaryFixed },
  toggleBtnText: { fontSize: 11, color: ShoColors.secondary, fontWeight: '600' },
  toggleBtnTextActive: { color: ShoColors.onPrimaryFixed },
  inventoryList: { gap: 10 },
  inventoryRow: {
    flexDirection: 'row', gap: 12,
    backgroundColor: ShoColors.surfaceContainer, borderRadius: ShoRadius.default,
    padding: ShoSpacing.sm, borderWidth: 1, borderColor: ShoColors.borderSubtle,
  },
  productThumb: {
    width: 68, height: 68, borderRadius: ShoRadius.sm,
    backgroundColor: ShoColors.surfaceContainerLow,
  },
  productInfo: { flex: 1, gap: 4 },
  productNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  productName: { fontSize: 13, fontWeight: '700', color: ShoColors.onSurface, flexShrink: 1 },
  stockStatusBadge: {
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: ShoRadius.full, borderWidth: 1,
  },
  stockStatusText: { fontSize: 9, fontWeight: '700', textTransform: 'uppercase' },
  productCategory: { fontSize: 10, color: ShoColors.textMuted },
  stockBarWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stockBarBg: {
    flex: 1, height: 4, borderRadius: 2,
    backgroundColor: ShoColors.surfaceContainerHigh, overflow: 'hidden',
  },
  stockBarFill: { height: '100%', borderRadius: 2 },
  stockCount: { fontSize: 12, fontWeight: '800', minWidth: 20, textAlign: 'right' },
  actionRow: { flexDirection: 'row', gap: 6 },
  restockBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 4, height: 30, borderRadius: ShoRadius.full, backgroundColor: ShoColors.primaryFixed,
  },
  restockBtnText: { fontSize: 11, fontWeight: '700', color: ShoColors.onPrimaryFixed },
  adjustBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    height: 30, paddingHorizontal: 10, borderRadius: ShoRadius.full,
    backgroundColor: ShoColors.surfaceContainerHigh, borderWidth: 1,
    borderColor: ShoColors.borderSubtle,
  },
  adjustBtnText: { fontSize: 11, fontWeight: '600', color: ShoColors.secondary },
  pressed: { opacity: 0.8, transform: [{ scale: 0.97 }] },
});
