import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { ShoColors, ShoRadius, ShoSpacing } from '@/constants/sho-theme';
import { ShoIcon } from '@/components/sho-icon';

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Discerning Footwear',
      eyebrow: 'Edition 01 / Curation',
      description:
        'Crafted in limited archival batches. Hand-selected Parisian calfskin, double-stitched duck canvas, and anatomical cork footbeds.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDsdiEnqx6xwjnBG-zP8jKSWBgPx8KxBJcNB2yy2g-hGZ0Vp4SDScVuugjnpU1F40zzbJ_pFRK3HlSyaU4U0uvfMsSjS6dotpqc88Jyjyvd7y9WrdtZQUG4hpJMt5WY6N_YD9giIa0IMuSQKW0zFQ6NWEttz3UerXhG7VLpbRU66ozDE7JQDRFb_A7h4eSRyQrVgzwCHznC4CKQJV9gISNQrsgH_towB-8KUCk0HmkvNaaJJ7y0oD2E',
    },
    {
      title: 'Cedar Box Packaging',
      eyebrow: 'Edition 02 / Authenticity',
      description:
        'Every pair is hand-inspected in our atelier, accompanied by certified pedigree documentation, and encased in zero-emission cedar packaging.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCeSKIUyGGS2XQChFZ9O315jmHdeXL2ZToeeB-v-A04pe5fLuIcuLdWztnIEaDrl8u4vbWUErEBZG6UNM6VftBSLZA7OrKqMLmgmOEKrlOISQPEM1B9FXkcppblo2MTdAW0dM2fZkMj-0Yl-p4dDTCPTrO22WAJQUCMpc9kj1-xbHmGH8xV2b8qPicpnb6lWh9YUgB_zco-NCFaeyRo1ox33Uaj9atnYD-Cab0W_EB5RCrrlOWlIitc',
    },
    {
      title: 'Private Collector Salon',
      eyebrow: 'Edition 03 / Exclusivity',
      description:
        'Gain access to discreet midnight drops, bespoke tailoring services, and personalized size reservations for our discerning patrons.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCYpqSJaDIQB1GQEY3LwRdEw6g3NPw7s6RevADDUYMiSRWRTTwvKFzbJoH6zlkixVrVwM143fdUG4fXP9OjouFYjhKj6zw5evKsCI_qU0YfHDaes3VyHncpIq8Y0SDvpnQ5f-8e0ul9DEQFe0eO9eS1a9CZtB8gFByvttvpMfRtzf-GVB1WR_H9rzacHucL7XxIMPV2VITNT9n3_ZQPPEBsB8C9zdnKIYCuRvVFCt4g25CZjf3ASdu',
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      router.replace('/');
    }
  };

  const slide = slides[currentSlide];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.topHeader}>
          <Text style={styles.wordmark}>SHO.</Text>
          <Pressable onPress={() => router.replace('/')}>
            <Text style={styles.skipBtnText}>Skip</Text>
          </Pressable>
        </View>

        {/* Hero Visual Card */}
        <View style={styles.heroCard}>
          <View style={styles.glow} />
          <Image source={{ uri: slide.image }} style={styles.shoeImage} resizeMode="contain" />
        </View>

        {/* Content Details */}
        <View style={styles.contentCard}>
          <Text style={styles.eyebrow}>{slide.eyebrow}</Text>
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.description}>{slide.description}</Text>

          {/* Stepper Indicators */}
          <View style={styles.indicatorRow}>
            {slides.map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.dot,
                  currentSlide === idx && styles.dotActive,
                ]}
              />
            ))}
          </View>

          {/* Action Button */}
          <Pressable
            accessibilityLabel="Continue"
            onPress={handleNext}
            style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}>
            <Text style={styles.actionBtnText}>
              {currentSlide === slides.length - 1 ? 'Enter Boutique' : 'Next Discovery'}
            </Text>
            <ShoIcon name="arrow_forward" size={18} color={ShoColors.onPrimaryFixed} />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ShoColors.surface,
  },
  container: {
    flex: 1,
    paddingHorizontal: ShoSpacing.margin,
    justifyContent: 'space-between',
    paddingVertical: ShoSpacing.md,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  wordmark: {
    fontFamily: 'serif',
    fontSize: 24,
    fontWeight: '800',
    color: ShoColors.textIvory,
    letterSpacing: 2,
  },
  skipBtnText: {
    fontSize: 13,
    color: ShoColors.secondary,
    fontWeight: '600',
  },
  heroCard: {
    width: '100%',
    height: Dimensions.get('window').height * 0.4,
    backgroundColor: ShoColors.surfaceContainer,
    borderRadius: ShoRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: ShoColors.borderSubtle,
  },
  glow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(83, 71, 58, 0.25)',
  },
  shoeImage: {
    width: '90%',
    height: '90%',
  },
  contentCard: {
    gap: 8,
    marginBottom: 20,
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
    fontSize: 28,
    fontWeight: '600',
    color: ShoColors.primary,
  },
  description: {
    fontSize: 13,
    color: ShoColors.onSurfaceVariant,
    lineHeight: 20,
    marginTop: 2,
  },
  indicatorRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 14,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ShoColors.surfaceContainerHighest,
  },
  dotActive: {
    width: 24,
    backgroundColor: ShoColors.primaryFixed,
  },
  actionBtn: {
    height: 52,
    borderRadius: ShoRadius.full,
    backgroundColor: ShoColors.primaryFixed,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: ShoColors.onPrimaryFixed,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
