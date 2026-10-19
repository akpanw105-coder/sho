import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  SafeAreaView,
} from 'react-native';
import { ShoColors, ShoRadius, ShoSpacing } from '@/constants/sho-theme';
import { ShoHeader } from '@/components/sho-header';
import { ShoIcon } from '@/components/sho-icon';
import { useSho } from '@/context/sho-context';

export default function NotificationsScreen() {
  const { notifications, markNotificationRead } = useSho();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ShoHeader title="Salon Notifications" showBack />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.headerBlock}>
          <Text style={styles.eyebrow}>Exclusive Dispatch</Text>
          <Text style={styles.title}>Private Bulletins</Text>
          <Text style={styles.subtitle}>
            Order updates, limited edition drop notices, and VIP collector salon briefings.
          </Text>
        </View>

        <View style={styles.list}>
          {notifications.map((n) => (
            <Pressable
              key={n.id}
              onPress={() => markNotificationRead(n.id)}
              style={({ pressed }) => [
                styles.notifCard,
                !n.read && styles.notifUnread,
                pressed && styles.pressed,
              ]}>
              <View style={styles.iconCircle}>
                <ShoIcon
                  name={
                    n.type === 'order'
                      ? 'local_shipping'
                      : n.type === 'drop'
                      ? 'star'
                      : 'verified'
                  }
                  size={18}
                  color={!n.read ? ShoColors.primaryFixed : ShoColors.secondary}
                />
              </View>

              <View style={styles.contentCol}>
                <View style={styles.titleRow}>
                  <Text style={[styles.notifTitle, !n.read && styles.notifTitleUnread]}>
                    {n.title}
                  </Text>
                  {!n.read && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.notifMessage}>{n.message}</Text>
                <Text style={styles.notifDate}>{n.date}</Text>
              </View>
            </Pressable>
          ))}
        </View>

        <View style={{ height: 40 }} />
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
  headerBlock: {
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
  list: {
    gap: 10,
  },
  notifCard: {
    flexDirection: 'row',
    gap: 12,
    padding: ShoSpacing.md,
    backgroundColor: ShoColors.surfaceContainer,
    borderRadius: ShoRadius.default,
    borderWidth: 1,
    borderColor: ShoColors.borderSubtle,
  },
  notifUnread: {
    borderColor: 'rgba(233, 226, 209, 0.4)',
    backgroundColor: ShoColors.surfaceContainerHigh,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: ShoColors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentCol: {
    flex: 1,
    gap: 3,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: ShoColors.onSurface,
  },
  notifTitleUnread: {
    color: ShoColors.primaryFixed,
    fontWeight: '700',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ShoColors.primaryFixed,
  },
  notifMessage: {
    fontSize: 12,
    color: ShoColors.onSurfaceVariant,
    lineHeight: 17,
  },
  notifDate: {
    fontSize: 10,
    color: ShoColors.textMuted,
    marginTop: 2,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
