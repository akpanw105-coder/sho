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
import { Product } from '@/constants/sho-mock-data';

export default function AdminProductsScreen() {
  const { products, updateProduct, deleteProduct } = useSho();
  const [filter, setFilter] = useState<'All' | 'Sneakers' | 'Boots' | 'Loafers' | 'Skate & Low' | 'Mules'>('All');

  const categories = ['All', 'Sneakers', 'Boots', 'Loafers', 'Skate & Low', 'Mules'] as const;

  const visible = filter === 'All' ? products : products.filter((p) => p.category === filter);

  const handleToggleFeatured = (p: Product) => {
    updateProduct(p.id, { featured: !p.featured });
  };

  const handleDeleteProduct = (p: Product) => {
    Alert.alert(
      'Delete Silhouette',
      `Remove "${p.name}" from the catalogue permanently?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteProduct(p.id),
        },
      ]
    );
  };

  const handleEditPrice = (p: Product) => {
    Alert.alert(
      'Adjust Price',
      `Current price: $${p.price.toFixed(2)}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: '+$10',
          onPress: () => updateProduct(p.id, { price: p.price + 10 }),
        },
        {
          text: '-$10',
          onPress: () => updateProduct(p.id, { price: Math.max(0, p.price - 10) }),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ShoHeader title="Products Catalogue" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.pageHeader}>
          <Text style={styles.eyebrow}>Atelier Operations</Text>
          <Text style={styles.title}>Product Management</Text>
          <Text style={styles.subtitle}>
            Modify pricing, featured state, stock counts, and visibility for all footwear silhouettes.
          </Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{products.length}</Text>
            <Text style={styles.statLabel}>Total Models</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{products.filter((p) => p.featured).length}</Text>
            <Text style={styles.statLabel}>Featured</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{products.filter((p) => p.stockCount <= 15).length}</Text>
            <Text style={styles.statLabel}>Low Stock</Text>
          </View>
        </View>

        {/* Category Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}>
          {categories.map((cat) => (
            <Pressable
              key={cat}
              onPress={() => setFilter(cat as any)}
              style={[styles.filterPill, filter === cat && styles.filterPillActive]}>
              <Text style={[styles.filterPillText, filter === cat && styles.filterPillTextActive]}>
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Product List */}
        <View style={styles.productList}>
          {visible.map((p) => (
            <View key={p.id} style={styles.productRow}>
              {/* Thumbnail */}
              <Image source={{ uri: p.image }} style={styles.productThumb} resizeMode="cover" />

              {/* Info */}
              <View style={styles.productInfo}>
                <View style={styles.productNameRow}>
                  <Text style={styles.productName} numberOfLines={1}>{p.name}</Text>
                  {p.featured && (
                    <View style={styles.featuredBadge}>
                      <Text style={styles.featuredBadgeText}>Featured</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.productCategory}>{p.category}</Text>

                {/* Price & Stock Row */}
                <View style={styles.priceStockRow}>
                  <Text style={styles.productPrice}>${p.price.toFixed(2)}</Text>
                  <Text style={[
                    styles.stockInfo,
                    p.stockCount <= 10 && { color: ShoColors.error },
                    p.stockCount > 10 && p.stockCount <= 15 && { color: ShoColors.warning },
                  ]}>
                    {p.stockCount} units
                  </Text>
                </View>

                {/* Admin Actions */}
                <View style={styles.actionRow}>
                  <Pressable
                    onPress={() => handleEditPrice(p)}
                    style={({ pressed }) => [styles.adminActionBtn, pressed && styles.pressed]}>
                    <ShoIcon name="credit_card" size={14} color={ShoColors.secondary} />
                    <Text style={styles.adminActionText}>Price</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => handleToggleFeatured(p)}
                    style={({ pressed }) => [
                      styles.adminActionBtn,
                      p.featured && styles.adminActionBtnActive,
                      pressed && styles.pressed,
                    ]}>
                    <ShoIcon
                      name="star"
                      size={14}
                      color={p.featured ? ShoColors.onPrimaryFixed : ShoColors.secondary}
                    />
                    <Text style={[
                      styles.adminActionText,
                      p.featured && { color: ShoColors.onPrimaryFixed },
                    ]}>
                      {p.featured ? 'Unfeature' : 'Feature'}
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => handleDeleteProduct(p)}
                    style={({ pressed }) => [styles.adminActionBtn, styles.deleteBtn, pressed && styles.pressed]}>
                    <ShoIcon name="delete" size={14} color={ShoColors.error} />
                  </Pressable>
                </View>
              </View>
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
  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: {
    flex: 1, backgroundColor: ShoColors.surfaceContainer,
    borderRadius: ShoRadius.default, padding: ShoSpacing.sm,
    alignItems: 'center', borderWidth: 1, borderColor: ShoColors.borderSubtle,
  },
  statValue: { fontFamily: 'serif', fontSize: 22, fontWeight: '700', color: ShoColors.primaryFixed },
  statLabel: { fontSize: 10, color: ShoColors.textMuted, textTransform: 'uppercase', marginTop: 2 },
  filterRow: { gap: 8, paddingVertical: 4 },
  filterPill: {
    paddingHorizontal: 14, height: 34, borderRadius: ShoRadius.full,
    backgroundColor: ShoColors.surfaceContainer, borderWidth: 1,
    borderColor: ShoColors.borderSubtle, alignItems: 'center', justifyContent: 'center',
  },
  filterPillActive: { backgroundColor: ShoColors.primaryFixed, borderColor: ShoColors.primaryFixed },
  filterPillText: { fontSize: 12, color: ShoColors.onSurfaceVariant },
  filterPillTextActive: { color: ShoColors.onPrimaryFixed, fontWeight: '700' },
  productList: { gap: 10 },
  productRow: {
    flexDirection: 'row', gap: 12, backgroundColor: ShoColors.surfaceContainer,
    borderRadius: ShoRadius.default, padding: ShoSpacing.sm,
    borderWidth: 1, borderColor: ShoColors.borderSubtle,
  },
  productThumb: {
    width: 72, height: 72, borderRadius: ShoRadius.sm,
    backgroundColor: ShoColors.surfaceContainerLow,
  },
  productInfo: { flex: 1, gap: 4 },
  productNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  productName: { flex: 1, fontSize: 13, fontWeight: '700', color: ShoColors.onSurface },
  featuredBadge: {
    backgroundColor: 'rgba(233,226,209,0.15)', paddingHorizontal: 6,
    paddingVertical: 1, borderRadius: ShoRadius.full,
  },
  featuredBadgeText: { fontSize: 9, fontWeight: '700', color: ShoColors.primaryFixed },
  productCategory: { fontSize: 11, color: ShoColors.textMuted },
  priceStockRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  productPrice: { fontSize: 13, fontWeight: '700', color: ShoColors.primaryFixed },
  stockInfo: { fontSize: 11, color: ShoColors.secondary, fontWeight: '600' },
  actionRow: { flexDirection: 'row', gap: 6, marginTop: 4 },
  adminActionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: ShoRadius.full, backgroundColor: ShoColors.surfaceContainerHigh,
    borderWidth: 1, borderColor: ShoColors.borderSubtle,
  },
  adminActionBtnActive: { backgroundColor: ShoColors.primaryFixed, borderColor: ShoColors.primaryFixed },
  adminActionText: { fontSize: 11, color: ShoColors.secondary, fontWeight: '600' },
  deleteBtn: { borderColor: 'rgba(255,180,171,0.3)', backgroundColor: 'rgba(147,0,10,0.1)' },
  pressed: { opacity: 0.8, transform: [{ scale: 0.97 }] },
});
