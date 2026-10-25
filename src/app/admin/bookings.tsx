import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { ShoColors, ShoRadius, ShoSpacing } from '@/constants/sho-theme';
import { ShoHeader } from '@/components/sho-header';
import { ShoIcon } from '@/components/sho-icon';
import { useSho, BarberBooking } from '@/context/sho-context';

type StatusFilter = 'all' | 'pending' | 'confirmed' | 'cancelled';

export default function AdminBookingsScreen() {
  const {
    bookings,
    isLoadingBookings,
    fetchBookings,
    approveBooking,
    rejectBooking,
    isAdmin,
  } = useSho();

  const [activeFilter, setActiveFilter] = useState<StatusFilter>('all');
  const [actionInProgressId, setActionInProgressId] = useState<string | null>(null);

  const filteredBookings = bookings.filter((b) => {
    if (activeFilter === 'all') return true;
    return b.status === activeFilter;
  });

  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
  const cancelledCount = bookings.filter((b) => b.status === 'cancelled').length;

  const handleApprove = async (booking: BarberBooking) => {
    Alert.alert(
      'Confirm Appointment',
      `Approve booking #${booking.reference} for ${booking.customer_name} on ${booking.booking_date_label} at ${booking.booking_time}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: async () => {
            setActionInProgressId(booking.id);
            const res = await approveBooking(booking.id);
            setActionInProgressId(null);
            if (!res.success) {
              Alert.alert('Operation Failed', res.error || 'Could not approve booking.');
            }
          },
        },
      ]
    );
  };

  const handleReject = async (booking: BarberBooking) => {
    Alert.alert(
      'Reject Appointment',
      `Reject booking #${booking.reference} for ${booking.customer_name}? This action cannot be reversed.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject Booking',
          style: 'destructive',
          onPress: async () => {
            setActionInProgressId(booking.id);
            const res = await rejectBooking(booking.id);
            setActionInProgressId(null);
            if (!res.success) {
              Alert.alert('Operation Failed', res.error || 'Could not reject booking.');
            }
          },
        },
      ]
    );
  };

  if (!isAdmin) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ShoHeader title="Restricted Access" showBack />
        <View style={styles.emptyContainer}>
          <ShoIcon name="admin_panel_settings" size={48} color={ShoColors.error} />
          <Text style={styles.emptyTitle}>Admin Access Only</Text>
          <Text style={styles.emptySubtitle}>
            This console is reserved for admin credentials. Please sign in as admin@gmail.com.
          </Text>
          <Pressable
            onPress={() => router.replace('/auth/sign-in')}
            style={styles.signInRedirectBtn}>
            <Text style={styles.signInRedirectText}>Go to Sign In</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ShoHeader
        title="Barber Appointments"
        showBack
        onBackPress={() => router.back()}
      />

      {/* Filter Tabs */}
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {[
            { key: 'all', label: `All (${bookings.length})` },
            { key: 'pending', label: `Pending (${pendingCount})` },
            { key: 'confirmed', label: `Confirmed (${confirmedCount})` },
            { key: 'cancelled', label: `Cancelled (${cancelledCount})` },
          ].map((tab) => {
            const active = activeFilter === tab.key;
            return (
              <Pressable
                key={tab.key}
                onPress={() => setActiveFilter(tab.key as StatusFilter)}
                style={[styles.filterChip, active && styles.filterChipActive]}>
                <Text
                  style={[
                    styles.filterChipText,
                    active && styles.filterChipTextActive,
                  ]}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoadingBookings}
            onRefresh={fetchBookings}
            tintColor={ShoColors.primaryFixed}
          />
        }>
        {/* KPI Banner */}
        <View style={styles.kpiContainer}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Pending Requests</Text>
            <Text style={[styles.kpiValue, { color: '#EAB308' }]}>{pendingCount}</Text>
            <Text style={styles.kpiSub}>Awaiting salon review</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Confirmed</Text>
            <Text style={[styles.kpiValue, { color: '#22C55E' }]}>{confirmedCount}</Text>
            <Text style={styles.kpiSub}>Active appointments</Text>
          </View>
        </View>

        {filteredBookings.length === 0 ? (
          <View style={styles.emptyContainer}>
            <ShoIcon name="event" size={40} color={ShoColors.textMuted} />
            <Text style={styles.emptyTitle}>No Appointments Found</Text>
            <Text style={styles.emptySubtitle}>
              {activeFilter === 'all'
                ? 'No client bookings have been placed yet.'
                : `No appointments currently marked as ${activeFilter}.`}
            </Text>
          </View>
        ) : (
          filteredBookings.map((booking) => {
            const isProcessing = actionInProgressId === booking.id;
            const isPending = booking.status === 'pending';
            const isConfirmed = booking.status === 'confirmed';
            const isCancelled = booking.status === 'cancelled';

            const statusBg = isConfirmed
              ? 'rgba(34, 197, 94, 0.15)'
              : isPending
              ? 'rgba(234, 179, 8, 0.15)'
              : 'rgba(239, 68, 68, 0.15)';
            const statusTextColor = isConfirmed
              ? '#22C55E'
              : isPending
              ? '#EAB308'
              : '#EF4444';

            return (
              <View key={booking.id} style={styles.bookingCard}>
                {/* Header row */}
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.bookingRef}>{booking.reference}</Text>
                    <Text style={styles.customerName}>{booking.customer_name}</Text>
                    <Text style={styles.customerMeta}>
                      {booking.customer_email}
                      {booking.customer_phone ? ` • ${booking.customer_phone}` : ''}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
                    <Text style={[styles.statusText, { color: statusTextColor }]}>
                      {booking.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                {/* Appointment Schedule Details */}
                <View style={styles.scheduleRow}>
                  <View style={styles.scheduleItem}>
                    <ShoIcon name="calendar_today" size={14} color={ShoColors.secondary} />
                    <Text style={styles.scheduleText}>{booking.booking_date_label}</Text>
                  </View>
                  <View style={styles.scheduleItem}>
                    <ShoIcon name="event" size={14} color={ShoColors.secondary} />
                    <Text style={styles.scheduleText}>{booking.booking_time}</Text>
                  </View>
                </View>

                {/* Services List */}
                {booking.items && booking.items.length > 0 && (
                  <View style={styles.servicesSection}>
                    <Text style={styles.servicesTitle}>Selected Grooming Services:</Text>
                    {booking.items.map((item, idx) => (
                      <View key={idx} style={styles.serviceRow}>
                        <Text style={styles.serviceName}>• {item.service_name}</Text>
                        <Text style={styles.servicePrice}>₦{item.price.toLocaleString()}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Price and Payment Summary */}
                <View style={styles.footerRow}>
                  <View>
                    <Text style={styles.paymentMethod}>
                      Payment: {booking.payment_method === 'atelier' ? 'Pay at Atelier' : 'Card / Online'}
                    </Text>
                    <Text style={styles.paymentStatus}>Status: {booking.payment_status}</Text>
                  </View>
                  <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>Total</Text>
                    <Text style={styles.priceValue}>₦{booking.total_price.toLocaleString()}</Text>
                  </View>
                </View>

                {/* Action Controls for Admin */}
                {isPending && (
                  <View style={styles.actionsContainer}>
                    <Pressable
                      onPress={() => handleReject(booking)}
                      disabled={isProcessing}
                      style={({ pressed }) => [
                        styles.rejectBtn,
                        pressed && styles.pressed,
                        isProcessing && { opacity: 0.6 },
                      ]}>
                      <ShoIcon name="close" size={16} color="#EF4444" />
                      <Text style={styles.rejectBtnText}>Reject</Text>
                    </Pressable>

                    <Pressable
                      onPress={() => handleApprove(booking)}
                      disabled={isProcessing}
                      style={({ pressed }) => [
                        styles.approveBtn,
                        pressed && styles.pressed,
                        isProcessing && { opacity: 0.6 },
                      ]}>
                      {isProcessing ? (
                        <ActivityIndicator size="small" color={ShoColors.onPrimaryFixed} />
                      ) : (
                        <>
                          <ShoIcon name="check" size={16} color={ShoColors.onPrimaryFixed} />
                          <Text style={styles.approveBtnText}>Approve Appointment</Text>
                        </>
                      )}
                    </Pressable>
                  </View>
                )}

                {isConfirmed && (
                  <View style={styles.actionsContainer}>
                    <Pressable
                      onPress={() => handleReject(booking)}
                      disabled={isProcessing}
                      style={({ pressed }) => [
                        styles.rejectBtn,
                        { flex: 1 },
                        pressed && styles.pressed,
                        isProcessing && { opacity: 0.6 },
                      ]}>
                      <ShoIcon name="close" size={16} color="#EF4444" />
                      <Text style={styles.rejectBtnText}>Cancel / Revoke Appointment</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ShoColors.surface,
  },
  filterBar: {
    borderBottomWidth: 1,
    borderBottomColor: ShoColors.borderSubtle,
    backgroundColor: ShoColors.surfaceContainerLow,
    paddingVertical: 10,
  },
  filterScroll: {
    paddingHorizontal: ShoSpacing.margin,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: ShoRadius.full,
    backgroundColor: ShoColors.surfaceContainer,
    borderWidth: 1,
    borderColor: ShoColors.borderSubtle,
  },
  filterChipActive: {
    backgroundColor: ShoColors.primaryFixed,
    borderColor: ShoColors.primaryFixed,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: ShoColors.textMuted,
  },
  filterChipTextActive: {
    color: ShoColors.onPrimaryFixed,
  },
  scrollContent: {
    padding: ShoSpacing.margin,
    gap: ShoSpacing.md,
    paddingBottom: 60,
  },
  kpiContainer: {
    flexDirection: 'row',
    gap: ShoSpacing.md,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: ShoColors.surfaceContainer,
    borderRadius: ShoRadius.md,
    padding: ShoSpacing.md,
    borderWidth: 1,
    borderColor: ShoColors.borderSubtle,
  },
  kpiLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: ShoColors.onSurfaceVariant,
    textTransform: 'uppercase',
  },
  kpiValue: {
    fontFamily: 'serif',
    fontSize: 24,
    fontWeight: '700',
    marginVertical: 4,
  },
  kpiSub: {
    fontSize: 11,
    color: ShoColors.textMuted,
  },
  bookingCard: {
    backgroundColor: ShoColors.surfaceContainer,
    borderRadius: ShoRadius.lg,
    padding: ShoSpacing.md,
    borderWidth: 1,
    borderColor: ShoColors.borderSubtle,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bookingRef: {
    fontSize: 11,
    fontWeight: '700',
    color: ShoColors.secondary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  customerName: {
    fontSize: 16,
    fontWeight: '700',
    color: ShoColors.textIvory,
    marginTop: 2,
  },
  customerMeta: {
    fontSize: 12,
    color: ShoColors.onSurfaceVariant,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: ShoRadius.full,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  scheduleRow: {
    flexDirection: 'row',
    gap: 16,
    backgroundColor: ShoColors.surfaceContainerLow,
    padding: 10,
    borderRadius: ShoRadius.sm,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scheduleText: {
    fontSize: 12,
    fontWeight: '600',
    color: ShoColors.onSurface,
  },
  servicesSection: {
    borderTopWidth: 1,
    borderTopColor: ShoColors.borderSubtle,
    paddingTop: 8,
    gap: 4,
  },
  servicesTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: ShoColors.onSurfaceVariant,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  serviceName: {
    fontSize: 13,
    color: ShoColors.onSurface,
  },
  servicePrice: {
    fontSize: 13,
    fontWeight: '600',
    color: ShoColors.secondary,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: ShoColors.borderSubtle,
    paddingTop: 10,
  },
  paymentMethod: {
    fontSize: 12,
    color: ShoColors.textMuted,
  },
  paymentStatus: {
    fontSize: 11,
    color: ShoColors.onSurfaceVariant,
    textTransform: 'capitalize',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 10,
    color: ShoColors.textMuted,
    textTransform: 'uppercase',
  },
  priceValue: {
    fontFamily: 'serif',
    fontSize: 18,
    fontWeight: '700',
    color: ShoColors.textIvory,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  rejectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 42,
    borderRadius: ShoRadius.md,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  rejectBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EF4444',
  },
  approveBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 42,
    borderRadius: ShoRadius.md,
    backgroundColor: ShoColors.primaryFixed,
  },
  approveBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: ShoColors.onPrimaryFixed,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
    paddingHorizontal: ShoSpacing.lg,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: ShoColors.textIvory,
  },
  emptySubtitle: {
    fontSize: 13,
    color: ShoColors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  signInRedirectBtn: {
    marginTop: 12,
    backgroundColor: ShoColors.primaryFixed,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: ShoRadius.full,
  },
  signInRedirectText: {
    color: ShoColors.onPrimaryFixed,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.8,
  },
});
