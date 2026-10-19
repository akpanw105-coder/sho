import React from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle, StyleProp } from 'react-native';
import { router } from 'expo-router';
import { ShoColors, ShoRadius, ShoSpacing } from '@/constants/sho-theme';
import { ShoIcon } from '@/components/sho-icon';
import { useSho } from '@/context/sho-context';

interface ShoHeaderProps {
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
  showCart?: boolean;
  showNotifications?: boolean;
  showProfile?: boolean;
  showAdminShortcut?: boolean;
  onBackPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function ShoHeader({
  title,
  showBack = false,
  showSearch = true,
  showCart = true,
  showNotifications = true,
  showProfile = true,
  showAdminShortcut = false,
  onBackPress,
  style,
}: ShoHeaderProps) {
  const { cartCount, unreadNotificationsCount } = useSho();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <View style={[styles.headerContainer, style]}>
      {/* Left section: Back button or Logo */}
      <View style={styles.leftSection}>
        {showBack ? (
          <Pressable
            accessibilityLabel="Back"
            onPress={handleBack}
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
            <ShoIcon name="arrow_back" size={20} color={ShoColors.onSurfaceVariant} />
          </Pressable>
        ) : null}

        {/* Wordmark SHO. Logo */}
        <Pressable onPress={() => router.push('/')} style={styles.logoPressable}>
          <Text style={styles.logoText}>SHO<Text style={styles.logoDot}>.</Text></Text>
        </Pressable>

        {title && (
          <Text style={styles.headerTitle} numberOfLines={1}>
            {title}
          </Text>
        )}
      </View>

      {/* Right Actions */}
      <View style={styles.rightSection}>
        {showAdminShortcut && (
          <Pressable
            accessibilityLabel="Admin Portal"
            onPress={() => router.push('/admin')}
            style={({ pressed }) => [styles.adminPill, pressed && styles.pressed]}>
            <ShoIcon name="admin_panel_settings" size={14} color={ShoColors.onPrimaryFixed} />
            <Text style={styles.adminPillText}>ADMIN</Text>
          </Pressable>
        )}

        {showSearch && (
          <Pressable
            accessibilityLabel="Search"
            onPress={() => router.push('/search')}
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
            <ShoIcon name="search" size={20} color={ShoColors.onSurfaceVariant} />
          </Pressable>
        )}

        {showNotifications && (
          <Pressable
            accessibilityLabel="Notifications"
            onPress={() => router.push('/notifications')}
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
            <ShoIcon name="notifications" size={20} color={ShoColors.onSurfaceVariant} />
            {unreadNotificationsCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadNotificationsCount}</Text>
              </View>
            )}
          </Pressable>
        )}

        {showCart && (
          <Pressable
            accessibilityLabel="Shopping Bag"
            onPress={() => router.push('/cart')}
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
            <ShoIcon name="shopping_bag" size={20} color={ShoColors.onSurfaceVariant} />
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </Pressable>
        )}

        {showProfile && (
          <Pressable
            accessibilityLabel="Profile"
            onPress={() => router.push('/profile')}
            style={({ pressed }) => [styles.profileAvatarButton, pressed && styles.pressed]}>
            <ShoIcon name="person" size={18} color={ShoColors.onSurfaceVariant} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ShoSpacing.margin,
    backgroundColor: 'rgba(8, 22, 19, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(31, 48, 43, 0.6)',
    zIndex: 100,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ShoSpacing.sm,
    flex: 1,
  },
  logoPressable: {
    paddingVertical: 4,
    paddingRight: 6,
  },
  logoText: {
    fontFamily: 'serif',
    fontSize: 22,
    fontWeight: '800',
    color: ShoColors.textIvory,
    letterSpacing: 2,
  },
  logoDot: {
    color: ShoColors.primaryFixed,
  },
  headerTitle: {
    fontFamily: 'serif',
    fontSize: 16,
    fontWeight: '600',
    color: ShoColors.onSurface,
    marginLeft: ShoSpacing.xs,
    flexShrink: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: ShoRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  profileAvatarButton: {
    width: 34,
    height: 34,
    borderRadius: ShoRadius.full,
    backgroundColor: ShoColors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(73, 71, 63, 0.4)',
    marginLeft: 4,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: ShoRadius.full,
    backgroundColor: ShoColors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: ShoColors.onPrimaryFixed,
  },
  adminPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ShoColors.primaryFixed,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: ShoRadius.full,
    marginRight: 4,
  },
  adminPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: ShoColors.onPrimaryFixed,
    letterSpacing: 0.5,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.96 }],
  },
});
