import React from 'react';
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
import { ShoFloatingBottomNav } from '@/components/sho-bottom-nav';
import { ShoIcon, ShoIconName } from '@/components/sho-icon';
import { useSho } from '@/context/sho-context';

export default function UserProfileScreen() {
  const { user, logout, orders, wishlist, isAdmin } = useSho();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you wish to exit your SHO. salon account?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/auth/sign-in');
        },
      },
    ]);
  };

  const menuSections: {
    title: string;
    items: { icon: ShoIconName; label: string; sub?: string; onPress: () => void; badge?: string }[];
  }[] = [
    {
      title: 'Acquisitions & Curation',
      items: [
        {
          icon: 'receipt_long',
          label: 'Order Archive',
          sub: `${orders.length} historical parcels recorded`,
          onPress: () => router.push('/orders'),
        },
        {
          icon: 'favorite',
          label: 'Curated Wishlist',
          sub: 'Personal footwear bookmarks',
          onPress: () => router.push('/wishlist'),
        },
        {
          icon: 'shopping_bag',
          label: 'Shopping Bag',
          sub: 'Active reserved silhouettes',
          onPress: () => router.push('/cart'),
        },
      ],
    },
    {
      title: 'Salon Privileges & Settings',
      items: [
        ...(isAdmin
          ? [
              {
                icon: 'admin_panel_settings' as const,
                label: 'Admin Control Center',
                sub: 'Manage products, orders, inventory & patrons',
                badge: 'STAFF',
                onPress: () => router.push('/admin'),
              },
              {
                icon: 'calendar_today' as const,
                label: 'Barber Bookings Manager',
                sub: 'Approve, reject, and schedule appointments',
                badge: 'ADMIN',
                onPress: () => router.push('/admin/bookings' as any),
              },
            ]
          : []),
        {
          icon: 'event' as const,
          label: 'My Salon Appointments',
          sub: 'Track status of your barber bookings',
          onPress: () => router.push('/booking-tracking' as any),
        },
        {
          icon: 'content_cut' as const,
          label: 'Book Barber Appointment',
          sub: 'Schedule bespoke haircut, beard trim & styling',
          onPress: () => router.push('/booking' as any),
        },
        {
          icon: 'notifications' as const,
          label: 'Drop Alerts & Notifications',
          sub: 'Private Salon and release calendar',
          onPress: () => router.push('/notifications'),
        },
        {
          icon: 'location_on' as const,
          label: 'Shipping Destinations',
          sub: user?.address.street || 'Set default delivery address',
          onPress: () => Alert.alert('Saved Address', `${user?.address.street}, ${user?.address.city}`),
        },
        {
          icon: 'credit_card' as const,
          label: 'Payment Instruments',
          sub: 'Mastercard •••• 4242',
          onPress: () => Alert.alert('Payment Method', 'Mastercard ending in 4242 is active and encrypted.'),
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ShoHeader title="Client Profile" showBack />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Profile Identity Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarRow}>
            <View style={styles.avatarWrapper}>
              {user?.avatar ? (
                <Image
                  source={{ uri: user.avatar }}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarInitials}>
                    {(user?.name || 'Patron')
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()}
                  </Text>
                </View>
              )}
              <View style={styles.verifiedDot}>
                <ShoIcon name="check" size={10} color={ShoColors.onPrimaryFixed} />
              </View>
            </View>

            <View style={styles.identityDetails}>
              <View style={styles.nameRow}>
                <Text style={styles.userName}>{user?.name || 'Guest Patron'}</Text>
                <View style={styles.patronPill}>
                  <Text style={styles.patronPillText}>VIP</Text>
                </View>
              </View>
              <Text style={styles.userEmail}>{user?.email || 'guest@sho.luxury'}</Text>
              <Text style={styles.userTier}>{user?.tier || 'VIP Patron (Private Salon)'}</Text>
            </View>
          </View>

          {/* Quick Metrics Bar */}
          <View style={styles.metricsBar}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{orders.length}</Text>
              <Text style={styles.metricLabel}>Orders</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{wishlist.length}</Text>
              <Text style={styles.metricLabel}>Wishlisted</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>Tier I</Text>
              <Text style={styles.metricLabel}>Salon Access</Text>
            </View>
          </View>
        </View>

        {/* Menu Groups */}
        {menuSections.map((group, gIdx) => (
          <View key={gIdx} style={styles.groupContainer}>
            <Text style={styles.groupHeader}>{group.title}</Text>
            <View style={styles.groupCard}>
              {group.items.map((item, iIdx) => (
                <Pressable
                  key={iIdx}
                  onPress={item.onPress}
                  style={({ pressed }) => [
                    styles.menuRow,
                    iIdx < group.items.length - 1 && styles.menuRowBorder,
                    pressed && styles.pressed,
                  ]}>
                  <View style={styles.menuLeft}>
                    <View style={styles.menuIconCircle}>
                      <ShoIcon name={item.icon} size={18} color={ShoColors.secondary} />
                    </View>
                    <View>
                      <View style={styles.labelWithBadge}>
                        <Text style={styles.menuLabel}>{item.label}</Text>
                        {item.badge && (
                          <View style={styles.adminBadge}>
                            <Text style={styles.adminBadgeText}>{item.badge}</Text>
                          </View>
                        )}
                      </View>
                      {item.sub && <Text style={styles.menuSub}>{item.sub}</Text>}
                    </View>
                  </View>

                  <ShoIcon name="chevron_right" size={16} color={ShoColors.textMuted} />
                </Pressable>
              ))}
            </View>
          </View>
        ))}

        {/* Sign Out / Switch Account */}
        <Pressable
          accessibilityLabel="Sign Out"
          onPress={handleSignOut}
          style={({ pressed }) => [styles.signOutBtn, pressed && styles.pressed]}>
          <ShoIcon name="logout" size={18} color={ShoColors.error} />
          <Text style={styles.signOutText}>Sign Out from SHO.</Text>
        </Pressable>

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
    gap: ShoSpacing.lg,
  },
  profileCard: {
    backgroundColor: ShoColors.surfaceContainer,
    borderRadius: ShoRadius.lg,
    padding: ShoSpacing.md,
    borderWidth: 1,
    borderColor: ShoColors.borderSubtle,
    gap: ShoSpacing.md,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: ShoColors.primaryFixed,
    position: 'relative',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: ShoColors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontFamily: 'serif',
    fontSize: 20,
    fontWeight: '700',
    color: ShoColors.primaryFixed,
    letterSpacing: 1,
  },
  verifiedDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: ShoColors.primaryFixed,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  identityDetails: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontFamily: 'serif',
    fontSize: 18,
    fontWeight: '700',
    color: ShoColors.onSurface,
  },
  patronPill: {
    backgroundColor: ShoColors.primaryFixed,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: ShoRadius.full,
  },
  patronPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: ShoColors.onPrimaryFixed,
  },
  userEmail: {
    fontSize: 12,
    color: ShoColors.textMuted,
  },
  userTier: {
    fontSize: 11,
    color: ShoColors.secondary,
    fontWeight: '600',
    marginTop: 2,
  },
  metricsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: ShoColors.surfaceContainerLow,
    borderRadius: ShoRadius.default,
    paddingVertical: 10,
  },
  metricItem: {
    alignItems: 'center',
    gap: 2,
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '800',
    color: ShoColors.primaryFixed,
  },
  metricLabel: {
    fontSize: 10,
    color: ShoColors.textMuted,
    textTransform: 'uppercase',
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: ShoColors.surfaceContainerHighest,
  },
  groupContainer: {
    gap: 8,
  },
  groupHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: ShoColors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  groupCard: {
    backgroundColor: ShoColors.surfaceContainer,
    borderRadius: ShoRadius.default,
    borderWidth: 1,
    borderColor: ShoColors.borderSubtle,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: ShoSpacing.md,
  },
  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: ShoColors.borderSubtle,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  menuIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: ShoColors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: ShoColors.onSurface,
  },
  adminBadge: {
    backgroundColor: 'rgba(233, 226, 209, 0.25)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: ShoRadius.full,
  },
  adminBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: ShoColors.primaryFixed,
  },
  menuSub: {
    fontSize: 11,
    color: ShoColors.textMuted,
    marginTop: 1,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: ShoRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 180, 171, 0.3)',
    backgroundColor: 'rgba(147, 0, 10, 0.1)',
  },
  signOutText: {
    fontSize: 13,
    fontWeight: '700',
    color: ShoColors.error,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
