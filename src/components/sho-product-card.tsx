import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { router } from 'expo-router';
import { ShoColors, ShoRadius, ShoSpacing } from '@/constants/sho-theme';
import { ShoIcon } from '@/components/sho-icon';
import { Product } from '@/constants/sho-mock-data';
import { useSho } from '@/context/sho-context';

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

export function ShoProductCard({ product, featured = false }: ProductCardProps) {
  const { isWishlisted, toggleWishlist, addToCart } = useSho();
  const wishlisted = isWishlisted(product.id);

  const handleCardPress = () => {
    router.push({
      pathname: '/product/[id]' as any,
      params: { id: product.id },
    });
  };

  const handleQuickAdd = (e: any) => {
    e.stopPropagation?.();
    addToCart(product, product.colors[0]?.name || 'Standard', product.sizes[2] || product.sizes[0] || 42, 1);
  };

  const handleToggleWishlist = (e: any) => {
    e.stopPropagation?.();
    toggleWishlist(product.id);
  };

  if (featured) {
    return (
      <Pressable
        onPress={handleCardPress}
        style={({ pressed }) => [styles.featuredContainer, pressed && styles.cardPressed]}>
        {/* Top Badges & Wishlist */}
        <View style={styles.cardHeader}>
          <View style={styles.ratingBadge}>
            <ShoIcon name="star" size={13} color={ShoColors.secondaryFixed} />
            <Text style={styles.ratingText}>{product.rating}</Text>
            <Text style={styles.reviewsText}>({product.reviewsCount})</Text>
          </View>
          <Pressable
            accessibilityLabel="Wishlist"
            onPress={handleToggleWishlist}
            style={({ pressed }) => [styles.wishlistCircle, pressed && styles.pressed]}>
            <ShoIcon
              name={wishlisted ? 'favorite' : 'favorite_border'}
              size={18}
              color={wishlisted ? ShoColors.error : ShoColors.textMuted}
            />
          </Pressable>
        </View>

        {/* Big Product Image */}
        <View style={styles.featuredImageWrapper}>
          <View style={styles.imageAmbientGlow} />
          <Image
            source={{ uri: product.image }}
            style={styles.featuredProductImage}
            resizeMode="contain"
          />
        </View>

        {/* Bottom Details & Add */}
        <View style={styles.featuredBottomRow}>
          <View style={styles.detailsColumn}>
            <Text style={styles.productSubtitle}>{product.subtitle}</Text>
            <Text style={styles.featuredTitle} numberOfLines={1}>
              {product.name}
            </Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceText}>${product.price.toFixed(2)}</Text>
              {product.originalPrice && (
                <Text style={styles.originalPriceText}>${product.originalPrice.toFixed(2)}</Text>
              )}
            </View>
          </View>
          <Pressable
            accessibilityLabel="Add to bag"
            onPress={handleQuickAdd}
            style={({ pressed }) => [styles.addPillBtn, pressed && styles.pressed]}>
            <ShoIcon name="add" size={16} color={ShoColors.onPrimaryFixed} />
            <Text style={styles.addPillText}>Add</Text>
          </Pressable>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={handleCardPress}
      style={({ pressed }) => [styles.compactCard, pressed && styles.cardPressed]}>
      {/* Top Bar with Badge & Wishlist */}
      <View style={styles.cardHeaderCompact}>
        {product.badge ? (
          <View style={styles.tagBadge}>
            <Text style={styles.tagBadgeText}>{product.badge}</Text>
          </View>
        ) : <View />}
        <Pressable
          accessibilityLabel="Wishlist"
          onPress={handleToggleWishlist}
          style={({ pressed }) => [styles.wishlistSmallCircle, pressed && styles.pressed]}>
          <ShoIcon
            name={wishlisted ? 'favorite' : 'favorite_border'}
            size={15}
            color={wishlisted ? ShoColors.error : ShoColors.textMuted}
          />
        </Pressable>
      </View>

      {/* Image */}
      <View style={styles.compactImageWrapper}>
        <Image
          source={{ uri: product.image }}
          style={styles.compactProductImage}
          resizeMode="contain"
        />
      </View>

      {/* Details */}
      <View style={styles.compactDetails}>
        <Text style={styles.compactTitle} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.compactCategory} numberOfLines={1}>
          {product.subtitle}
        </Text>
        <View style={styles.compactPriceRow}>
          <Text style={styles.compactPrice}>${product.price.toFixed(2)}</Text>
          <Pressable
            accessibilityLabel="Add to Cart"
            onPress={handleQuickAdd}
            style={({ pressed }) => [styles.quickAddCircle, pressed && styles.pressed]}>
            <ShoIcon name="add" size={15} color={ShoColors.onSurface} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  featuredContainer: {
    backgroundColor: ShoColors.surfaceContainer,
    borderRadius: ShoRadius.default,
    padding: ShoSpacing.md,
    borderWidth: 1,
    borderColor: ShoColors.borderSubtle,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(31, 45, 41, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: ShoRadius.full,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: ShoColors.onSurface,
  },
  reviewsText: {
    fontSize: 11,
    color: ShoColors.textMuted,
  },
  wishlistCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(31, 45, 41, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredImageWrapper: {
    width: '100%',
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: ShoSpacing.xs,
    position: 'relative',
  },
  imageAmbientGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(42, 56, 52, 0.35)',
  },
  featuredProductImage: {
    width: '100%',
    height: '100%',
    zIndex: 5,
  },
  featuredBottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: ShoSpacing.xs,
  },
  detailsColumn: {
    flex: 1,
    marginRight: ShoSpacing.sm,
  },
  productSubtitle: {
    fontSize: 12,
    color: ShoColors.textMuted,
  },
  featuredTitle: {
    fontFamily: 'serif',
    fontSize: 18,
    fontWeight: '600',
    color: ShoColors.onSurface,
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginTop: 4,
  },
  priceText: {
    fontSize: 15,
    fontWeight: '700',
    color: ShoColors.primaryFixed,
  },
  originalPriceText: {
    fontSize: 12,
    color: ShoColors.outline,
    textDecorationLine: 'line-through',
  },
  addPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 38,
    paddingHorizontal: 16,
    borderRadius: ShoRadius.full,
    backgroundColor: ShoColors.primaryFixed,
  },
  addPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: ShoColors.onPrimaryFixed,
  },
  compactCard: {
    backgroundColor: ShoColors.surfaceContainer,
    borderRadius: ShoRadius.default,
    padding: 12,
    borderWidth: 1,
    borderColor: ShoColors.borderSubtle,
    flex: 1,
    justifyContent: 'space-between',
  },
  cardHeaderCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  tagBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: ShoRadius.full,
    backgroundColor: ShoColors.surfaceContainerHigh,
  },
  tagBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: ShoColors.secondary,
    textTransform: 'uppercase',
  },
  wishlistSmallCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(31, 45, 41, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactImageWrapper: {
    width: '100%',
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
  compactProductImage: {
    width: '100%',
    height: '100%',
  },
  compactDetails: {
    marginTop: 4,
  },
  compactTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: ShoColors.onSurface,
  },
  compactCategory: {
    fontSize: 11,
    color: ShoColors.textMuted,
    marginTop: 1,
  },
  compactPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  compactPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: ShoColors.primaryFixed,
  },
  quickAddCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: ShoColors.surfaceContainerHighest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    transform: [{ scale: 0.94 }],
    opacity: 0.85,
  },
  cardPressed: {
    opacity: 0.9,
  },
});
