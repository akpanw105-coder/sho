import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  SafeAreaView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { ShoColors, ShoRadius, ShoSpacing } from '@/constants/sho-theme';
import { ShoHeader } from '@/components/sho-header';
import { ShoFloatingBottomNav } from '@/components/sho-bottom-nav';
import { ShoIcon } from '@/components/sho-icon';
import { ShoProductCard } from '@/components/sho-product-card';
import { useSho } from '@/context/sho-context';

export default function HomeScreen() {
  const { products, selectedCategory, setSelectedCategory } = useSho();

  const categories = [
    {
      name: 'Boots',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD6Dq0j_oFMaEzpDoyopqnviwuhVprvCiUx3pS87unHUMpG5YGGX0_uPFGuVDVKMJq-zzdRupafItBXvIq7EUo6iux9fWamuQrkwXeMVS8KtVilmbOufJXJKsaseJlX-BF-grLVYBd5lg5xR9GHPoFJZyRJg8jxOZymTLlDOapoxNp0kLQdhnqhH8gxPj-gET72Ys-VxYA_sKp7ukoYodUnXDWR2qqTMJml62NJ2n85QkcweLiCOWtS',
    },
    {
      name: 'Sneakers',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCYpqSJaDIQB1GQEY3LwRdEw6g3NPw7s6RevADDUYMiSRWRTTwvKFzbJoH6zlkixVrVwM143fdUG4fXP9OjouFYjhKj6zw5evKsCI_qU0YfHDaes3VyHncpIq8Y0SDvpnQ5f-8e0ul9DEQFe0eO9eS1a9CZtB8gFByvttvpMfRtzf-GVB1WR_H9rzacHucL7XxIMPV2VITNT9n3_ZQPPEBsB8C9zdnKIYCuRvVFCt4g25CZjf3ASdu',
    },
    {
      name: 'Loafers',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuADEkQtatL5yvBNhu2ylq7VgMHMXiMkxb-HsAaHkWO6cqxVbM7R1cXVzULwyHmE0X7-6NiY69FL_fz540g_F_kBdOqVtKptUCgym6Rdj7GVnipZaBSQCKMUi5dar8twaB9iAkmAc-7Q6dve-4TnkzR_IHg8uRt8y5IFa5EhvX6bZlOtXkhLPpue31biYss0a6F5P23Nvbmju12QJUa2CIu4tS7JNKJBkZFTq2LRwjRNCc6pP6eISyXI',
    },
    {
      name: 'Skate & Low',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAQsmjUT5pi7PYKSne3WTFyor2YpK4jD7eXxtq-UsXKEKLFik_P4Zi2krJfSY352ECA26duUaKIDCI2HYvtKo5nfC30wikK0FTZA4Ua_F6ys0gJO77i_p2Hc9LlmaUDVebi1jgUQGOQ_PpyBSsZjJlBwbX9U-F5HvJZI3UJEjJJeulaO34-InhuecxQv9CCBRHIZcPvadzbGjog8MyycJcJfyH5b4jO4rjldDBDVBqUmNyo8h9vUFys',
    },
    {
      name: 'Mules',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC_ASDB2yZmtQUFKnL8y6PvfkX0EdQhIdpOFTu8HrUOZvqHipvQUoTBeFO6FbcKVHpdZX_TyURuIbKCAx0-W0XnC5_hURL6Yign4L8vN3wi8n-RnPywaqoRnoeDexKOYYRPToBpDsTGKtgObaOsg9Z0ALzuv2SkLLvhPy-jASE6vAbKZ4hi6-f-lNQrAsofYvRbcDCR1PC_xyiaBfxpk68sRJQjlrkE8Hadc1NR6fqtkeQUlq1-WuDJ',
    },
  ];

  const heroSneaker = products.find((p) => p.id === 'aj1-retro') || products[0];
  const gridProducts = products.filter((p) => p.id !== 'aj1-retro');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ShoHeader showAdminShortcut />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Search Bar pill matching Stitch Design */}
        <Pressable
          onPress={() => router.push('/search')}
          style={({ pressed }) => [styles.searchBar, pressed && styles.searchPressed]}>
          <ShoIcon name="search" size={20} color={ShoColors.primaryFixedDim} />
          <Text style={styles.searchPlaceholder}>
            Search silhouettes, limited drops, brands...
          </Text>
          <View style={styles.filterIconButton}>
            <ShoIcon name="tune" size={17} color={ShoColors.primaryFixed} />
          </View>
        </Pressable>

        {/* Editorial Hero Showcase Card */}
        <View style={styles.heroCard}>
          <View style={styles.ambientGlow} />

          <View style={styles.heroContent}>
            <View style={styles.heroTextContainer}>
              <View style={styles.heroTag}>
                <View style={styles.heroTagPulse} />
                <Text style={styles.heroTagText}>Drop 04 / Edition</Text>
              </View>

              <Text style={styles.heroTitle}>New Arrivals</Text>
              <Text style={styles.heroSubtitle}>
                Fresh silhouettes. Limited archival stock handcrafted for daily wear.
              </Text>
            </View>

            <Pressable
              accessibilityLabel="Shop Now"
              onPress={() => router.push('/explore')}
              style={({ pressed }) => [styles.heroCtaBtn, pressed && styles.pressed]}>
              <Text style={styles.heroCtaText}>Shop Now</Text>
              <ShoIcon name="arrow_forward" size={16} color={ShoColors.onPrimaryFixed} />
            </Pressable>
          </View>

          {/* Hero Floating Cutout Shoe */}
          <View style={styles.heroShoeFrame}>
            <Image
              source={{
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGiRBdohBwCREd13r9FtivAq4n9cxTZcBcJqQyy9jj4Zu6vplZIhExJXOU9LzW1rk8HmSEE5M-96vv5taxRoaYypAa1dNG_4bdkxweEPpRs2_NHNamsVgy1msY-Tp7tqyORNRMMIudcz7eimaMbM82njU0NWlnjQB1PjOPTyBYDiY81YiPo0H00L8mOdtmV67d0AoQr1pFQfEPITGrZB0kz99SGlvBjly3nm-x1cy69agNJuu9d8Kw',
              }}
              style={styles.heroShoeImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Shop by Category Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <Pressable
            onPress={() => router.push('/explore')}
            style={({ pressed }) => [styles.viewAllRow, pressed && styles.pressed]}>
            <Text style={styles.viewAllText}>View all</Text>
            <ShoIcon name="chevron_right" size={16} color={ShoColors.secondary} />
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <Pressable
                key={cat.name}
                onPress={() => {
                  setSelectedCategory(cat.name);
                  router.push('/explore');
                }}
                style={({ pressed }) => [styles.categoryItem, pressed && styles.pressed]}>
                <View
                  style={[
                    styles.categoryImageSquare,
                    isSelected && styles.categoryImageSquareSelected,
                  ]}>
                  <Image source={{ uri: cat.image }} style={styles.categoryImage} resizeMode="contain" />
                </View>
                <Text
                  style={[
                    styles.categoryName,
                    isSelected && { color: ShoColors.primaryFixed, fontWeight: '700' },
                  ]}>
                  {cat.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Curated Editorial Collections */}
        <View style={styles.curationHeader}>
          <Text style={styles.curationEyebrow}>Curation Edition</Text>
          <Text style={styles.curationHeading}>For The Discerning Walk</Text>
        </View>

        {/* Featured Hero Product Card: Jordan 1 Retro */}
        {heroSneaker && (
          <View style={styles.featuredProductWrap}>
            <ShoProductCard product={heroSneaker} featured />
          </View>
        )}

        {/* Staggered 2-Column Showcase Grid */}
        <View style={styles.productsGrid}>
          {gridProducts.map((p) => (
            <View key={p.id} style={styles.gridItem}>
              <ShoProductCard product={p} />
            </View>
          ))}
        </View>

        {/* Extra Bottom Padding for floating dock */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Bottom Dock Nav */}
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
  },
  searchBar: {
    width: '100%',
    height: 52,
    borderRadius: ShoRadius.full,
    backgroundColor: 'rgba(21, 34, 31, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(73, 71, 63, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: ShoSpacing.md,
  },
  searchPressed: {
    borderColor: 'rgba(233, 226, 209, 0.4)',
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 13,
    color: ShoColors.outline,
    letterSpacing: 0.2,
  },
  filterIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: ShoColors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: 'rgba(73, 71, 63, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCard: {
    width: '100%',
    minHeight: 210,
    backgroundColor: ShoColors.surfaceContainer,
    borderRadius: ShoRadius.lg,
    padding: ShoSpacing.md,
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'space-between',
    marginBottom: ShoSpacing.lg,
    borderWidth: 1,
    borderColor: ShoColors.borderSubtle,
  },
  ambientGlow: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(83, 71, 58, 0.25)',
  },
  heroContent: {
    maxWidth: '56%',
    zIndex: 10,
    justifyContent: 'space-between',
    flex: 1,
  },
  heroTextContainer: {
    alignItems: 'flex-start',
    gap: 4,
  },
  heroTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(83, 71, 58, 0.5)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: ShoRadius.full,
  },
  heroTagPulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: ShoColors.primaryFixed,
  },
  heroTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: ShoColors.secondaryFixed,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontFamily: 'serif',
    fontSize: 26,
    fontWeight: '600',
    color: ShoColors.primary,
    marginTop: 4,
  },
  heroSubtitle: {
    fontSize: 12,
    color: ShoColors.onSurfaceVariant,
    lineHeight: 16,
    marginTop: 2,
  },
  heroCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: ShoColors.primaryFixed,
    paddingHorizontal: 18,
    height: 40,
    borderRadius: ShoRadius.full,
    alignSelf: 'flex-start',
    marginTop: 14,
  },
  heroCtaText: {
    fontSize: 12,
    fontWeight: '700',
    color: ShoColors.onPrimaryFixed,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroShoeFrame: {
    position: 'absolute',
    right: -10,
    bottom: -5,
    width: '56%',
    height: '100%',
    maxHeight: 180,
    justifyContent: 'flex-end',
    pointerEvents: 'none',
  },
  heroShoeImage: {
    width: '100%',
    height: '100%',
    transform: [{ scale: 1.15 }],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: ShoSpacing.xs,
  },
  sectionTitle: {
    fontFamily: 'serif',
    fontSize: 20,
    fontWeight: '600',
    color: ShoColors.onSurface,
  },
  viewAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: ShoColors.secondary,
  },
  categoryScroll: {
    gap: 12,
    paddingVertical: 8,
    paddingRight: ShoSpacing.margin,
  },
  categoryItem: {
    width: 76,
    alignItems: 'center',
    gap: 6,
  },
  categoryImageSquare: {
    width: 72,
    height: 72,
    borderRadius: ShoRadius.default,
    backgroundColor: ShoColors.surfaceContainer,
    borderWidth: 1,
    borderColor: ShoColors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  categoryImageSquareSelected: {
    borderColor: 'rgba(233, 226, 209, 0.4)',
    backgroundColor: ShoColors.surfaceContainerHigh,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryName: {
    fontSize: 11,
    color: ShoColors.onSurfaceVariant,
    textAlign: 'center',
  },
  curationHeader: {
    marginTop: ShoSpacing.lg,
    marginBottom: ShoSpacing.sm,
    gap: 2,
  },
  curationEyebrow: {
    fontSize: 10,
    fontWeight: '700',
    color: ShoColors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  curationHeading: {
    fontFamily: 'serif',
    fontSize: 22,
    fontWeight: '600',
    color: ShoColors.primary,
  },
  featuredProductWrap: {
    marginBottom: ShoSpacing.sm,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 4,
  },
  gridItem: {
    width: '48%',
    flexGrow: 1,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
