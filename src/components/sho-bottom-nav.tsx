import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { router, usePathname } from 'expo-router';
import { ShoColors, ShoRadius, ShoSpacing } from '@/constants/sho-theme';
import { ShoIcon } from '@/components/sho-icon';
import { useSho } from '@/context/sho-context';

export function ShoFloatingBottomNav() {
  const pathname = usePathname();
  const { cartCount, unreadNotificationsCount } = useSho();

  const isTabActive = (route: string) => {
    if (route === '/' && (pathname === '/' || pathname === '/index')) return true;
    if (route === '/explore' && pathname.startsWith('/explore')) return true;
    if (route === '/wishlist' && pathname.startsWith('/wishlist')) return true;
    if (route === '/cart' && pathname.startsWith('/cart')) return true;
    if (route === '/profile' && pathname.startsWith('/profile')) return true;
    return false;
  };

  const navItems = [
    { label: 'Home', icon: 'home' as const, route: '/' },
    { label: 'Catalogue', icon: 'explore' as const, route: '/explore' },
    { label: 'Wishlist', icon: 'favorite' as const, route: '/wishlist' },
    { label: 'Bag', icon: 'shopping_bag' as const, route: '/cart', badge: cartCount },
    { label: 'Profile', icon: 'person' as const, route: '/profile' },
  ];

  return (
    <View pointerEvents="box-none" style={styles.outerContainer}>
      <View style={styles.dockContainer}>
        {navItems.map((item) => {
          const active = isTabActive(item.route);
          return (
            <Pressable
              key={item.route}
              accessibilityLabel={item.label}
              onPress={() => router.push(item.route as any)}
              style={({ pressed }) => [
                styles.navButton,
                active && styles.navButtonActive,
                pressed && styles.pressed,
              ]}>
              <View style={styles.iconContainer}>
                <ShoIcon
                  name={item.icon}
                  size={20}
                  color={active ? ShoColors.primaryFixed : ShoColors.textMuted}
                />
                {item.badge !== undefined && item.badge > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                )}
              </View>
              <Text
                style={[
                  styles.navLabel,
                  { color: active ? ShoColors.primaryFixed : ShoColors.textMuted },
                ]}>
                {item.label}
              </Text>
              {active && <View style={styles.activeDot} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'web' ? 16 : 24,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  dockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(18, 28, 25, 0.92)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: ShoRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(244, 240, 232, 0.12)',
    maxWidth: 420,
    width: '92%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 12,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: ShoRadius.full,
    position: 'relative',
    minWidth: 54,
  },
  navButtonActive: {
    backgroundColor: 'rgba(42, 56, 52, 0.4)',
  },
  iconContainer: {
    position: 'relative',
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
    letterSpacing: 0.2,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: ShoColors.primaryFixed,
    marginTop: 2,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: ShoColors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: ShoColors.onPrimaryFixed,
  },
  pressed: {
    transform: [{ scale: 0.92 }],
    opacity: 0.8,
  },
});
