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
import { useLocalSearchParams, router } from 'expo-router';
import { ShoColors, ShoRadius, ShoSpacing } from '@/constants/sho-theme';
import { ShoHeader } from '@/components/sho-header';
import { ShoIcon } from '@/components/sho-icon';
import { useSho } from '@/context/sho-context';

export default function ProductDetailScreen() {
  const params = useLocalSearchParams();
  const { products, addToCart, isWishlisted, toggleWishlist } = useSho();

  const product = products.find((p) => p.id === params.id) || products[0];

  const [selectedColor, setSelectedColor] = useState(
    product.colors[0]?.name || 'Slate Grey / Sail'
  );
  const [selectedSize, setSelectedSize] = useState<number>(
    product.sizes[2] || product.sizes[0] || 42
  );
  const [activeImageIndex, setActiveImageIndex] = useState(1);
  const [isRotating, setIsRotating] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedColor, selectedSize, 1);
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 2500);
  };

  const handleRotateToggle = () => {
    setIsRotating((prev) => !prev);
    setActiveImageIndex((prev) => (prev % 5) + 1);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ShoHeader title="Product Detail" showBack />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Media Frame Card */}
        <View style={styles.heroMediaCard}>
          <View style={styles.heroMediaGlow} />

          <Image
            source={{ uri: product.image }}
            style={[
              styles.heroProductImage,
              isRotating && { transform: [{ scale: 1.05 }, { rotate: '8deg' }] },
            ]}
            resizeMode="cover"
          />

          {/* Carousel Index Badge */}
          <View style={styles.carouselBadge}>
            <Text style={styles.carouselBadgeText}>{activeImageIndex}/5</Text>
          </View>

          {/* 360 Rotation Toggle */}
          <Pressable
            accessibilityLabel="360 view"
            onPress={handleRotateToggle}
            style={({ pressed }) => [styles.rotateBtn, pressed && styles.pressed]}>
            <ShoIcon name="360" size={16} color={ShoColors.onSurface} />
            <Text style={styles.rotateBtnText}>Rotate</Text>
          </Pressable>

          {/* Quick Actions Top-Right */}
          <View style={styles.topRightActions}>
            <Pressable
              accessibilityLabel="Wishlist"
              onPress={() => toggleWishlist(product.id)}
              style={({ pressed }) => [styles.iconOverlayBtn, pressed && styles.pressed]}>
              <ShoIcon
                name={wishlisted ? 'favorite' : 'favorite_border'}
                size={18}
                color={wishlisted ? ShoColors.error : ShoColors.onSurface}
              />
            </Pressable>
            <Pressable
              accessibilityLabel="Share"
              onPress={() => Alert.alert('Shared', `Link for ${product.name} copied to clipboard.`)}
              style={({ pressed }) => [styles.iconOverlayBtn, pressed && styles.pressed]}>
              <ShoIcon name="ios_share" size={18} color={ShoColors.onSurface} />
            </Pressable>
          </View>
        </View>

        {/* Primary Spec Block */}
        <View style={styles.specsBlock}>
          {/* Subtitle & Stock status */}
          <View style={styles.metaRow}>
            <Text style={styles.metaCategory}>{product.subtitle}</Text>
            <View style={styles.stockBadge}>
              <View style={styles.stockDot} />
              <Text style={styles.stockText}>
                {product.stockCount > 0 ? `In Stock (${product.stockCount})` : 'Sold Out'}
              </Text>
            </View>
          </View>

          {/* Product Name */}
          <Text style={styles.productTitle}>{product.name}</Text>

          {/* Price & Rating */}
          <View style={styles.priceRatingRow}>
            <View style={styles.priceBlock}>
              <Text style={styles.priceMain}>${product.price.toFixed(2)}</Text>
              {product.originalPrice && (
                <Text style={styles.priceOriginal}>${product.originalPrice.toFixed(2)}</Text>
              )}
            </View>

            <View style={styles.ratingPill}>
              <ShoIcon name="star" size={15} color={ShoColors.primary} />
              <Text style={styles.ratingNumber}>{product.rating}</Text>
              <Text style={styles.reviewsNumber}>({product.reviewsCount} reviews)</Text>
            </View>
          </View>

          {/* Color Palette Selection */}
          <View style={styles.sectionBlock}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionLabel}>Color Palette</Text>
              <Text style={styles.selectedDetailLabel}>{selectedColor}</Text>
            </View>

            <View style={styles.colorChipsRow}>
              {product.colors.map((c) => {
                const isActive = selectedColor === c.name;
                return (
                  <Pressable
                    key={c.name}
                    onPress={() => setSelectedColor(c.name)}
                    style={({ pressed }) => [
                      styles.colorChipBorder,
                      isActive && styles.colorChipBorderActive,
                      pressed && styles.pressed,
                    ]}>
                    <View style={[styles.colorChipInner, { backgroundColor: c.hex }]} />
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Size Picker Block */}
          <View style={styles.sectionBlock}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.sizeGuideLeft}>
                <Text style={styles.sectionLabel}>Size (EU)</Text>
                <Text style={styles.sizeFitHint}>True to Fit</Text>
              </View>
              <Pressable
                onPress={() => Alert.alert('Size Guide', 'SHO. silhouettes correspond directly with standard European shoe sizing (EU 39 - EU 45).')}
                style={({ pressed }) => [styles.sizeGuideBtn, pressed && styles.pressed]}>
                <ShoIcon name="straighten" size={15} color={ShoColors.secondary} />
                <Text style={styles.sizeGuideBtnText}>Size Guide</Text>
              </Pressable>
            </View>

            <View style={styles.sizesGrid}>
              {product.sizes.map((s) => {
                const isActive = selectedSize === s;
                return (
                  <Pressable
                    key={s}
                    onPress={() => setSelectedSize(s)}
                    style={({ pressed }) => [
                      styles.sizeChip,
                      isActive && styles.sizeChipActive,
                      pressed && styles.pressed,
                    ]}>
                    <Text
                      style={[
                        styles.sizeChipText,
                        isActive && styles.sizeChipTextActive,
                      ]}>
                      {s}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Editorial Craft & Materials Accordion Blocks */}
          <View style={styles.craftAccordion}>
            <View style={styles.craftCard}>
              <View style={styles.craftCardHeader}>
                <Text style={styles.craftTitle}>Craft & Materials</Text>
                <ShoIcon name="verified" size={18} color={ShoColors.secondary} />
              </View>
              <Text style={styles.craftDescription}>{product.craftDetails}</Text>
            </View>

            {/* Delivery Assurance Banner */}
            <View style={styles.deliveryCard}>
              <View style={styles.deliveryLeft}>
                <View style={styles.deliveryIconCircle}>
                  <ShoIcon name="local_shipping" size={18} color={ShoColors.secondary} />
                </View>
                <View>
                  <Text style={styles.deliveryTitle}>Complimentary Shipping</Text>
                  <Text style={styles.deliverySubtitle}>Estimated delivery in 2-4 business days</Text>
                </View>
              </View>
              <Text style={styles.deliveryTag}>Free</Text>
            </View>
          </View>
        </View>

        {/* Spacing for sticky bottom bar */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Confirmation Toast */}
      {showConfirmation && (
        <View style={styles.toast}>
          <ShoIcon name="check" size={16} color={ShoColors.onPrimaryFixed} />
          <Text style={styles.toastText}>
            Added {product.name} (EU {selectedSize}) to Bag
          </Text>
        </View>
      )}

      {/* Sticky Bottom Purchase Bar matching Stitch Design */}
      <View style={styles.stickyPurchaseBar}>
        <View style={styles.stickyPriceBox}>
          <Text style={styles.stickyPriceLabel}>Total</Text>
          <Text style={styles.stickyPriceValue}>${product.price.toFixed(2)}</Text>
        </View>

        <Pressable
          accessibilityLabel="Add to Bag"
          onPress={handleAddToCart}
          style={({ pressed }) => [styles.stickyAddBtn, pressed && styles.pressed]}>
          <ShoIcon name="shopping_bag" size={20} color={ShoColors.onPrimaryFixed} />
          <Text style={styles.stickyAddText}>Add to Cart</Text>
        </Pressable>
      </View>
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
    paddingTop: ShoSpacing.xs,
  },
  heroMediaCard: {
    width: '100%',
    aspectRatio: 4 / 3,
    backgroundColor: ShoColors.surfaceContainer,
    borderRadius: ShoRadius.lg,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: ShoColors.borderSubtle,
    marginTop: ShoSpacing.xs,
  },
  heroMediaGlow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    backgroundColor: 'rgba(4, 17, 14, 0.7)',
  },
  heroProductImage: {
    width: '92%',
    height: '92%',
  },
  carouselBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(4, 17, 14, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: ShoRadius.full,
  },
  carouselBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: ShoColors.onSurface,
    letterSpacing: 1,
  },
  rotateBtn: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(4, 17, 14, 0.85)',
    paddingHorizontal: 12,
    height: 32,
    borderRadius: ShoRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rotateBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: ShoColors.onSurface,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  topRightActions: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    gap: 8,
  },
  iconOverlayBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(4, 17, 14, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  specsBlock: {
    marginTop: ShoSpacing.lg,
    gap: ShoSpacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaCategory: {
    fontSize: 12,
    fontWeight: '700',
    color: ShoColors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: ShoColors.surfaceContainerHigh,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: ShoRadius.full,
  },
  stockDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: ShoColors.success,
  },
  stockText: {
    fontSize: 11,
    fontWeight: '600',
    color: ShoColors.onSurface,
  },
  productTitle: {
    fontFamily: 'serif',
    fontSize: 26,
    fontWeight: '600',
    color: ShoColors.onSurface,
  },
  priceRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceBlock: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  priceMain: {
    fontSize: 24,
    fontWeight: '700',
    color: ShoColors.primaryFixed,
  },
  priceOriginal: {
    fontSize: 15,
    color: ShoColors.outline,
    textDecorationLine: 'line-through',
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: ShoColors.surfaceContainer,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: ShoRadius.full,
    borderWidth: 1,
    borderColor: ShoColors.borderSubtle,
  },
  ratingNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: ShoColors.onSurface,
  },
  reviewsNumber: {
    fontSize: 11,
    color: ShoColors.textMuted,
  },
  sectionBlock: {
    gap: ShoSpacing.sm,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: ShoColors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  selectedDetailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: ShoColors.secondary,
  },
  colorChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  colorChipBorder: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ShoColors.surfaceContainerHigh,
    padding: 2,
  },
  colorChipBorderActive: {
    backgroundColor: ShoColors.primaryFixed,
  },
  colorChipInner: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  sizeGuideLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sizeFitHint: {
    fontSize: 11,
    color: ShoColors.tertiaryFixedDim,
  },
  sizeGuideBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sizeGuideBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: ShoColors.secondary,
  },
  sizesGrid: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  sizeChip: {
    flex: 1,
    minWidth: 48,
    height: 48,
    borderRadius: ShoRadius.default,
    backgroundColor: ShoColors.surfaceContainer,
    borderWidth: 1,
    borderColor: ShoColors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeChipActive: {
    backgroundColor: ShoColors.primaryFixed,
    borderColor: ShoColors.primaryFixed,
  },
  sizeChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: ShoColors.onSurface,
  },
  sizeChipTextActive: {
    color: ShoColors.onPrimaryFixed,
    fontWeight: '800',
  },
  craftAccordion: {
    gap: ShoSpacing.xs,
    marginTop: 4,
  },
  craftCard: {
    backgroundColor: ShoColors.surfaceContainer,
    borderRadius: ShoRadius.default,
    padding: ShoSpacing.md,
    borderWidth: 1,
    borderColor: ShoColors.borderSubtle,
    gap: 6,
  },
  craftCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  craftTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: ShoColors.onSurface,
  },
  craftDescription: {
    fontSize: 12,
    color: ShoColors.onSurfaceVariant,
    lineHeight: 18,
  },
  deliveryCard: {
    backgroundColor: ShoColors.surfaceContainer,
    borderRadius: ShoRadius.default,
    padding: ShoSpacing.md,
    borderWidth: 1,
    borderColor: ShoColors.borderSubtle,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deliveryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ShoSpacing.sm,
    flex: 1,
  },
  deliveryIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: ShoColors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliveryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: ShoColors.onSurface,
  },
  deliverySubtitle: {
    fontSize: 11,
    color: ShoColors.textMuted,
  },
  deliveryTag: {
    fontSize: 12,
    fontWeight: '700',
    color: ShoColors.secondary,
    textTransform: 'uppercase',
  },
  stickyPurchaseBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(8, 22, 19, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(31, 48, 43, 0.7)',
    paddingHorizontal: ShoSpacing.margin,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: ShoSpacing.md,
  },
  stickyPriceBox: {
    minWidth: 80,
  },
  stickyPriceLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: ShoColors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  stickyPriceValue: {
    fontFamily: 'serif',
    fontSize: 22,
    fontWeight: '700',
    color: ShoColors.primaryFixed,
  },
  stickyAddBtn: {
    flex: 1,
    height: 52,
    borderRadius: ShoRadius.full,
    backgroundColor: ShoColors.primaryFixed,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  stickyAddText: {
    fontSize: 14,
    fontWeight: '800',
    color: ShoColors.onPrimaryFixed,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  toast: {
    position: 'absolute',
    top: 70,
    alignSelf: 'center',
    backgroundColor: ShoColors.primaryFixed,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: ShoRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    zIndex: 999,
  },
  toastText: {
    fontSize: 12,
    fontWeight: '700',
    color: ShoColors.onPrimaryFixed,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
});
