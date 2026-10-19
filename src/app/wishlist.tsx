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
import { ShoFloatingBottomNav } from '@/components/sho-bottom-nav';
import { ShoProductCard } from '@/components/sho-product-card';
import { ShoIcon } from '@/components/sho-icon';
import { useSho } from '@/context/sho-context';

export default function WishlistScreen() {
  const { wishlist, products } = useSho();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <SafeAreaView style={styles.safeArea}>
      <ShoHeader title="Curated Wishlist" showBack />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Editorial Heading */}
        <View style={styles.headingBlock}>
          <Text style={styles.eyebrow}>Personal Archive</Text>
          <Text style={styles.title}>Saved Silhouettes</Text>
          <Text style={styles.subtitle}>
            Your reserved catalog choices and watchlisted limited edition releases.
          </Text>
        </View>

        {wishlistedProducts.length === 0 ? (
          <View style={styles.emptyCard}>
            <ShoIcon name="favorite" size={40} color={ShoColors.textMuted} />
            <Text style={styles.emptyTitle}>Your Wishlist is Empty</Text>
            <Text style={styles.emptySubtitle}>
              Tap the heart on any shoe to reserve it here for future curation.
            </Text>
            <Pressable
              onPress={() => router.push('/explore')}
              style={({ pressed }) => [styles.exploreBtn, pressed && styles.pressed]}>
              <Text style={styles.exploreBtnText}>Browse Catalogue</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.grid}>
            {wishlistedProducts.map((p) => (
              <View key={p.id} style={styles.gridItem}>
                <ShoProductCard product={p} />
              </View>
            ))}
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
  headingBlock: {
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {
    width: '48%',
    flexGrow: 1,
  },
  emptyCard: {
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
  exploreBtn: {
    marginTop: 10,
    backgroundColor: ShoColors.primaryFixed,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: ShoRadius.full,
  },
  exploreBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: ShoColors.onPrimaryFixed,
    textTransform: 'uppercase',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
});
