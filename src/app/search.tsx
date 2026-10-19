import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  SafeAreaView,
} from 'react-native';
import { ShoColors, ShoRadius, ShoSpacing } from '@/constants/sho-theme';
import { ShoHeader } from '@/components/sho-header';
import { ShoIcon } from '@/components/sho-icon';
import { ShoProductCard } from '@/components/sho-product-card';
import { useSho } from '@/context/sho-context';

export default function SearchAndFiltersScreen() {
  const { products } = useSho();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(300);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);

  const categories = ['All', 'Sneakers', 'Boots', 'Loafers', 'Skate & Low', 'Mules'];
  const sizes = [39, 40, 41, 42, 43, 44, 45];

  const searchResults = products.filter((p) => {
    const matchesQuery =
      query.trim() === '' ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase());

    const matchesCategory =
      activeCategory === 'All' || p.category === activeCategory;

    const matchesPrice = p.price <= maxPrice;

    const matchesSize =
      selectedSize === null || p.sizes.includes(selectedSize);

    return matchesQuery && matchesCategory && matchesPrice && matchesSize;
  });

  const clearFilters = () => {
    setQuery('');
    setActiveCategory('All');
    setMaxPrice(300);
    setSelectedSize(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ShoHeader title="Search & Filter" showBack />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Full Interactive Search Input */}
        <View style={styles.searchBox}>
          <ShoIcon name="search" size={20} color={ShoColors.primaryFixedDim} />
          <TextInput
            placeholder="Search by name, silhouette, material..."
            placeholderTextColor={ShoColors.outline}
            value={query}
            onChangeText={setQuery}
            style={styles.inputField}
            autoFocus
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} style={styles.clearIconBtn}>
              <ShoIcon name="close" size={16} color={ShoColors.onSurfaceVariant} />
            </Pressable>
          )}
        </View>

        {/* Filter Section: Category */}
        <View style={styles.filterSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.filterSectionTitle}>Categories</Text>
            {(activeCategory !== 'All' || selectedSize !== null || maxPrice < 300) && (
              <Pressable onPress={clearFilters}>
                <Text style={styles.resetText}>Reset All</Text>
              </Pressable>
            )}
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsRow}>
            {categories.map((c) => {
              const active = activeCategory === c;
              return (
                <Pressable
                  key={c}
                  onPress={() => setActiveCategory(c)}
                  style={[styles.pillBtn, active && styles.pillBtnActive]}>
                  <Text style={[styles.pillBtnText, active && styles.pillBtnTextActive]}>
                    {c}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Filter Section: Sizes */}
        <View style={styles.filterSection}>
          <Text style={styles.filterSectionTitle}>Filter by Size (EU)</Text>
          <View style={styles.sizesRow}>
            {sizes.map((s) => {
              const active = selectedSize === s;
              return (
                <Pressable
                  key={s}
                  onPress={() => setSelectedSize(active ? null : s)}
                  style={[styles.sizeBox, active && styles.sizeBoxActive]}>
                  <Text style={[styles.sizeBoxText, active && styles.sizeBoxTextActive]}>
                    {s}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Filter Section: Price Range */}
        <View style={styles.filterSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.filterSectionTitle}>Max Budget</Text>
            <Text style={styles.priceCapText}>${maxPrice}.00</Text>
          </View>
          <View style={styles.priceButtonsRow}>
            {[100, 150, 200, 300].map((pr) => (
              <Pressable
                key={pr}
                onPress={() => setMaxPrice(pr)}
                style={[styles.priceTagBtn, maxPrice === pr && styles.priceTagBtnActive]}>
                <Text
                  style={[
                    styles.priceTagBtnText,
                    maxPrice === pr && styles.priceTagBtnTextActive,
                  ]}>
                  Under ${pr}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Search Results Summary */}
        <View style={styles.resultsHeaderRow}>
          <Text style={styles.resultsCount}>
            Found <Text style={styles.boldWhite}>{searchResults.length}</Text> matching silhouttes
          </Text>
        </View>

        {/* Search Results Grid */}
        <View style={styles.grid}>
          {searchResults.map((p) => (
            <View key={p.id} style={styles.gridItem}>
              <ShoProductCard product={p} />
            </View>
          ))}
        </View>

        {searchResults.length === 0 && (
          <View style={styles.emptyResultsBox}>
            <ShoIcon name="search" size={40} color={ShoColors.textMuted} />
            <Text style={styles.emptyResultsTitle}>No silhouettes matched</Text>
            <Text style={styles.emptyResultsSubtitle}>
              Try broadening your query or selecting another category filter.
            </Text>
            <Pressable onPress={clearFilters} style={styles.clearFiltersBtn}>
              <Text style={styles.clearFiltersBtnText}>Reset All Filters</Text>
            </Pressable>
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
  searchBox: {
    height: 52,
    borderRadius: ShoRadius.full,
    backgroundColor: ShoColors.surfaceContainer,
    borderWidth: 1,
    borderColor: 'rgba(73, 71, 63, 0.4)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  inputField: {
    flex: 1,
    color: ShoColors.onSurface,
    fontSize: 14,
  },
  clearIconBtn: {
    padding: 4,
  },
  filterSection: {
    gap: 8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterSectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: ShoColors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  resetText: {
    fontSize: 11,
    color: ShoColors.secondary,
    fontWeight: '600',
  },
  pillsRow: {
    gap: 8,
    paddingVertical: 4,
  },
  pillBtn: {
    paddingHorizontal: 16,
    height: 36,
    borderRadius: ShoRadius.full,
    backgroundColor: ShoColors.surfaceContainer,
    borderWidth: 1,
    borderColor: ShoColors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillBtnActive: {
    backgroundColor: ShoColors.primaryFixed,
    borderColor: ShoColors.primaryFixed,
  },
  pillBtnText: {
    fontSize: 12,
    color: ShoColors.onSurfaceVariant,
  },
  pillBtnTextActive: {
    color: ShoColors.onPrimaryFixed,
    fontWeight: '700',
  },
  sizesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sizeBox: {
    width: 44,
    height: 44,
    borderRadius: ShoRadius.default,
    backgroundColor: ShoColors.surfaceContainer,
    borderWidth: 1,
    borderColor: ShoColors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeBoxActive: {
    backgroundColor: ShoColors.primaryFixed,
    borderColor: ShoColors.primaryFixed,
  },
  sizeBoxText: {
    fontSize: 13,
    color: ShoColors.onSurface,
    fontWeight: '600',
  },
  sizeBoxTextActive: {
    color: ShoColors.onPrimaryFixed,
    fontWeight: '800',
  },
  priceCapText: {
    fontSize: 13,
    fontWeight: '700',
    color: ShoColors.primaryFixed,
  },
  priceButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  priceTagBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: ShoRadius.default,
    backgroundColor: ShoColors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: ShoColors.borderSubtle,
  },
  priceTagBtnActive: {
    backgroundColor: ShoColors.surfaceContainerHigh,
    borderColor: ShoColors.primaryFixed,
  },
  priceTagBtnText: {
    fontSize: 11,
    color: ShoColors.onSurfaceVariant,
  },
  priceTagBtnTextActive: {
    color: ShoColors.primaryFixed,
    fontWeight: '700',
  },
  resultsHeaderRow: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: ShoColors.borderSubtle,
  },
  resultsCount: {
    fontSize: 12,
    color: ShoColors.textMuted,
  },
  boldWhite: {
    color: ShoColors.onSurface,
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
  emptyResultsBox: {
    backgroundColor: ShoColors.surfaceContainer,
    borderRadius: ShoRadius.default,
    padding: ShoSpacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: ShoColors.borderSubtle,
    marginTop: 12,
  },
  emptyResultsTitle: {
    fontFamily: 'serif',
    fontSize: 18,
    fontWeight: '600',
    color: ShoColors.onSurface,
  },
  emptyResultsSubtitle: {
    fontSize: 12,
    color: ShoColors.textMuted,
    textAlign: 'center',
    maxWidth: 260,
    lineHeight: 18,
  },
  clearFiltersBtn: {
    backgroundColor: ShoColors.primaryFixed,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: ShoRadius.full,
    marginTop: 8,
  },
  clearFiltersBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: ShoColors.onPrimaryFixed,
  },
});
