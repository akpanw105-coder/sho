import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  SafeAreaView,
  RefreshControl,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { ShoColors, ShoRadius, ShoSpacing } from '@/constants/sho-theme';
import { ShoHeader } from '@/components/sho-header';
import { ShoIcon } from '@/components/sho-icon';
import { useSho, BarberBooking } from '@/context/sho-context';

export default function BookingTrackingScreen() {
  const { bookings, isLoadingBookings, fetchBookings, cancelBooking, user } = useSho();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleCancel = (booking: BarberBooking) => {
    Alert.alert(
      'Cancel Appointment',
      `Are you sure you want to cancel your booking #${booking.reference} for ${booking.booking_date_label}?`,
      [
        { text: 'Keep Appointment', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            setCancellingId(booking.id);
            const res = await cancelBooking(booking.id);
            setCancellingId(null);
            if (!res.success) {
              Alert.alert('Cancellation Failed', res.error || 'Could not cancel booking.');
            } else {
              Alert.alert('Cancelled', 'Your appointment has been cancelled.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ShoHeader
        title="My Salon Bookings"
        showBack
        onBackPress={() => router.back()}
      />

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
        {/* Header Block */}
        <View style={styles.headerBlock}>
          <Text style={styles.eyebrow}>Appointment Status</Text>
          <Text style={styles.title}>Salon Reservations</Text>
          <Text style={styles.subtitle}>
            Track your reserved grooming times, master barber allocations, and status updates in real-time.
          </Text>
        </View>

        {/* Quick New Booking Button */}
        <Pressable
          onPress={() => router.push('/booking' as any)}
          style={({ pressed }) => [styles.newBookingBtn, pressed && styles.pressed]}>
          <ShoIcon name="add" size={18} color={ShoColors.onPrimaryFixed} />
          <Text style={styles.newBookingBtnText}>Book New Appointment</Text>
        </Pressable>

        {bookings.length === 0 ? (
          <View style={styles.emptyContainer}>
            <ShoIcon name="event" size={44} color={ShoColors.textMuted} />
            <Text style={styles.emptyTitle}>No Reservations Found</Text>
            <Text style={styles.emptySubtitle}>
              You have no active salon bookings on file. Schedule a bespoke appointment with our master barbers.
            </Text>
            <Pressable
              onPress={() => router.push('/booking' as any)}
              style={styles.bookFirstBtn}>
              <Text style={styles.bookFirstBtnText}>Book An Appointment</Text>
            </Pressable>
          </View>
        ) : (
          bookings.map((booking) => {
            const isPending = booking.status === 'pending';
            const isConfirmed = booking.status === 'confirmed';
            const isCancelled = booking.status === 'cancelled';
            const isCancelling = cancellingId === booking.id;

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
                    <Text style={styles.bookingDateText}>{booking.booking_date_label}</Text>
                    <Text style={styles.bookingTimeText}>{booking.booking_time}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
                    <Text style={[styles.statusText, { color: statusTextColor }]}>
                      {booking.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                {/* Status Guidance */}
                <View style={styles.guidanceBox}>
                  {isPending && (
                    <Text style={styles.guidanceText}>
                      ⏳ Awaiting Salon Master approval. You will receive notification once confirmed.
                    </Text>
                  )}
                  {isConfirmed && (
                    <Text style={[styles.guidanceText, { color: '#22C55E' }]}>
                      ✓ Confirmed! Please arrive 5 minutes before your scheduled ritual.
                    </Text>
                  )}
                  {isCancelled && (
                    <Text style={[styles.guidanceText, { color: '#EF4444' }]}>
                      ✕ This booking was cancelled.
                    </Text>
                  )}
                </View>

                {/* Services List */}
                {booking.items && booking.items.length > 0 && (
                  <View style={styles.servicesSection}>
                    <Text style={styles.servicesTitle}>Reserved Services:</Text>
                    {booking.items.map((item, idx) => (
                      <View key={idx} style={styles.serviceRow}>
                        <Text style={styles.serviceName}>• {item.service_name}</Text>
                        <Text style={styles.servicePrice}>₦{item.price.toLocaleString()}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Footer details */}
                <View style={styles.footerRow}>
                  <View>
                    <Text style={styles.paymentMethod}>
                      Method: {booking.payment_method === 'atelier' ? 'Pay at Atelier' : 'Card'}
                    </Text>
                    <Text style={styles.customerDetail}>Patron: {booking.customer_name}</Text>
                  </View>
                  <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>Fee</Text>
                    <Text style={styles.priceValue}>₦{booking.total_price.toLocaleString()}</Text>
                  </View>
                </View>

                {/* Member Cancel Action */}
                {isPending && (
                  <Pressable
                    onPress={() => handleCancel(booking)}
                    disabled={isCancelling}
                    style={({ pressed }) => [
                      styles.cancelBtn,
                      pressed && styles.pressed,
                      isCancelling && { opacity: 0.6 },
                    ]}>
                    <ShoIcon name="close" size={14} color="#EF4444" />
                    <Text style={styles.cancelBtnText}>
                      {isCancelling ? 'Cancelling...' : 'Cancel Appointment Request'}
                    </Text>
                  </Pressable>
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
  scrollContent: {
    padding: ShoSpacing.margin,
    gap: ShoSpacing.md,
    paddingBottom: 60,
  },
  headerBlock: {
    gap: 6,
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
  subtitle: {
    fontSize: 13,
    color: ShoColors.onSurfaceVariant,
    lineHeight: 18,
  },
  newBookingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: ShoColors.primaryFixed,
    borderRadius: ShoRadius.full,
    paddingVertical: 12,
  },
  newBookingBtnText: {
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
  bookFirstBtn: {
    marginTop: 12,
    backgroundColor: ShoColors.primaryFixed,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: ShoRadius.full,
  },
  bookFirstBtnText: {
    color: ShoColors.onPrimaryFixed,
    fontWeight: '700',
    fontSize: 14,
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
  },
  bookingDateText: {
    fontSize: 15,
    fontWeight: '700',
    color: ShoColors.textIvory,
    marginTop: 2,
  },
  bookingTimeText: {
    fontSize: 13,
    color: ShoColors.onSurfaceVariant,
    marginTop: 1,
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
  guidanceBox: {
    backgroundColor: ShoColors.surfaceContainerLow,
    padding: 10,
    borderRadius: ShoRadius.sm,
  },
  guidanceText: {
    fontSize: 12,
    color: ShoColors.onSurface,
    lineHeight: 16,
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
  customerDetail: {
    fontSize: 11,
    color: ShoColors.onSurfaceVariant,
    marginTop: 2,
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
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 38,
    borderRadius: ShoRadius.md,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    marginTop: 4,
  },
  cancelBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EF4444',
  },
  pressed: {
    opacity: 0.8,
  },
});
