import React, { useState } from 'react';
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
import { ShoFloatingBottomNav } from '@/components/sho-bottom-nav';
import { ShoProductCard } from '@/components/sho-product-card';
import { ShoIcon } from '@/components/sho-icon';
import { useSho } from '@/context/sho-context';

export default function ExploreCatalogueScreen() {
  const { products, selectedCategory, setSelectedCategory } = useSho();
  const [activeSort, setActiveSort] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>(
    'featured'
  );

  const categories = ['All', 'Sneakers', 'Boots', 'Loafers', 'Skate & Low', 'Mules'];

  const filteredProducts = products.filter((p) => {
    if (selectedCategory === 'All') return true;
    return p.category === selectedCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (activeSort === 'price-low') return a.price - b.price;
    if (activeSort === 'price-high') return b.price - a.price;
    if (activeSort === 'rating') return b.rating - a.rating;
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ShoHeader title="Catalogue & Archives" showBack />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Editorial Heading */}
        <View style={styles.headingSection}>
          <Text style={styles.eyebrow}>Archival Catalogue</Text>
          <Text style={styles.title}>All Silhouettes</Text>
          <Text style={styles.subtitle}>
            Hand-finished leathers, vulcanized rubber, and bespoke contour profiles.
          </Text>
        </View>

        {/* Category Horizontal Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <Pressable
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={({ pressed }) => [
                  styles.filterPill,
                  isSelected && styles.filterPillSelected,
                  pressed && styles.pressed,
                ]}>
                <Text
                  style={[
                    styles.filterPillText,
                    isSelected && styles.filterPillTextSelected,
                  ]}>
                  {cat}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Sort & Results Bar */}
        <View style={styles.sortBar}>
          <Text style={styles.resultsCountText}>
            Showing <Text style={styles.boldWhite}>{sortedProducts.length}</Text> silhouettes
          </Text>

          <View style={styles.sortOptionsRow}>
            {(['featured', 'price-low', 'price-high'] as const).map((s) => (
              <Pressable
                key={s}
                onPress={() => setActiveSort(s)}
                style={({ pressed }) => [
                  styles.sortBtn,
                  activeSort === s && styles.sortBtnActive,
                  pressed && styles.pressed,
                ]}>
                <Text
                  style={[
                    styles.sortBtnText,
                    activeSort === s && styles.sortBtnTextActive,
                  ]}>
                  {s === 'featured' ? 'Drop' : s === 'price-low' ? '$ Low' : '$ High'}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* 2-Column Product Grid */}
        <View style={styles.grid}>
          {sortedProducts.map((p) => (
            <View key={p.id} style={styles.gridItem}>
              <ShoProductCard product={p} />
            </View>
          ))}
        </View>

        {sortedProducts.length === 0 && (
          <View style={styles.noResultsBox}>
            <ShoIcon name="inventory_2" size={36} color={ShoColors.textMuted} />
            <Text style={styles.noResultsTitle}>No silhouettes in this category</Text>
            <Pressable
              onPress={() => setSelectedCategory('All')}
              style={({ pressed }) => [styles.resetCategoryBtn, pressed && styles.pressed]}>
              <Text style={styles.resetCategoryText}>View All Editions</Text>
            </Pressable>
          </View>
        )}

        <View style={{ height: 110 }} />
      </ScrollView>

      <ShoFloatingBottomNav />
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
  headingSection: {
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
  filterScroll: {
    gap: 8,
    paddingVertical: 4,
  },
  filterPill: {
    paddingHorizontal: 16,
    height: 38,
    borderRadius: ShoRadius.full,
    backgroundColor: ShoColors.surfaceContainer,
    borderWidth: 1,
    borderColor: ShoColors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterPillSelected: {
    backgroundColor: ShoColors.primaryFixed,
    borderColor: ShoColors.primaryFixed,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: ShoColors.onSurfaceVariant,
  },
  filterPillTextSelected: {
    color: ShoColors.onPrimaryFixed,
    fontWeight: '800',
  },
  sortBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: ShoColors.borderSubtle,
  },
  resultsCountText: {
    fontSize: 12,
    color: ShoColors.textMuted,
  },
  boldWhite: {
    color: ShoColors.onSurface,
    fontWeight: '700',
  },
  sortOptionsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  sortBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: ShoRadius.full,
    backgroundColor: ShoColors.surfaceContainerLow,
  },
  sortBtnActive: {
    backgroundColor: ShoColors.surfaceContainerHighest,
  },
  sortBtnText: {
    fontSize: 11,
    color: ShoColors.textMuted,
  },
  sortBtnTextActive: {
    color: ShoColors.primaryFixed,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {
    width: '48%',
    flexGrow: 1,
  },
  noResultsBox: {
    backgroundColor: ShoColors.surfaceContainer,
    borderRadius: ShoRadius.default,
    padding: ShoSpacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  noResultsTitle: {
    fontSize: 14,
    color: ShoColors.onSurfaceVariant,
  },
  resetCategoryBtn: {
    backgroundColor: ShoColors.primaryFixed,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: ShoRadius.full,
    marginTop: 6,
  },
  resetCategoryText: {
    fontSize: 12,
    fontWeight: '700',
    color: ShoColors.onPrimaryFixed,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
});
