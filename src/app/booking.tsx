import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { ShoColors, ShoRadius, ShoSpacing } from '@/constants/sho-theme';
import { ShoHeader } from '@/components/sho-header';
import { ShoIcon } from '@/components/sho-icon';
import { useSho, BarberService } from '@/context/sho-context';

const AVAILABLE_TIMES = [
  '09:00 AM',
  '10:30 AM',
  '12:00 PM',
  '01:30 PM',
  '03:00 PM',
  '04:30 PM',
  '06:00 PM',
];

export default function MemberBookingScreen() {
  const { services, isLoadingServices, createBooking, user, isAuthenticated } = useSho();

  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-28');
  const [selectedDateLabel, setSelectedDateLabel] = useState<string>('Wednesday, 28 Oct 2026');
  const [selectedTime, setSelectedTime] = useState<string>('02:30 PM');
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'atelier'>('atelier');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toggle service selection
  const toggleService = (serviceId: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const selectedServices = services.filter((s) => selectedServiceIds.includes(s.id));
  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration_minutes, 0);

  // Quick dates (next 5 days)
  const quickDates = [
    { date: '2026-10-28', label: 'Wed, 28 Oct', fullLabel: 'Wednesday, 28 Oct 2026' },
    { date: '2026-10-29', label: 'Thu, 29 Oct', fullLabel: 'Thursday, 29 Oct 2026' },
    { date: '2026-10-30', label: 'Fri, 30 Oct', fullLabel: 'Friday, 30 Oct 2026' },
    { date: '2026-10-31', label: 'Sat, 31 Oct', fullLabel: 'Saturday, 31 Oct 2026' },
    { date: '2026-11-01', label: 'Sun, 01 Nov', fullLabel: 'Sunday, 01 Nov 2026' },
  ];

  const handleBooking = async () => {
    if (selectedServiceIds.length === 0) {
      Alert.alert('Service Required', 'Please select at least one grooming ritual.');
      return;
    }
    if (!customerName.trim()) {
      Alert.alert('Name Required', 'Please enter your name for the booking.');
      return;
    }
    if (!customerEmail.trim()) {
      Alert.alert('Email Required', 'Please enter your email address for appointment confirmation.');
      return;
    }

    setIsSubmitting(true);
    const result = await createBooking({
      bookingDate: selectedDate,
      bookingDateLabel: selectedDateLabel,
      bookingTime: selectedTime,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      customerPhone: customerPhone.trim(),
      totalPrice,
      paymentMethod,
      serviceIds: selectedServiceIds,
    });
    setIsSubmitting(false);

    if (result.error) {
      Alert.alert('Booking Error', result.error);
      return;
    }

    Alert.alert(
      'Appointment Reserved',
      `Your bespoke appointment is confirmed for ${selectedDateLabel} at ${selectedTime}.`,
      [
        {
          text: 'View My Appointments',
          onPress: () => router.replace('/booking-tracking' as any),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ShoHeader title="Salon Appointment" showBack onBackPress={() => router.back()} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Editorial Header */}
        <View style={styles.headerBlock}>
          <Text style={styles.eyebrow}>Private Grooming Salon</Text>
          <Text style={styles.title}>Book Master Barber</Text>
          <Text style={styles.subtitle}>
            Experience bespoke grooming, razor contouring, and hot towel rituals in the SHO. private salon.
          </Text>
        </View>

        {/* Step 1: Select Grooming Services */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <ShoIcon name="content_cut" size={18} color={ShoColors.secondary} />
            <Text style={styles.sectionTitle}>1. Select Services</Text>
          </View>

          {isLoadingServices ? (
            <ActivityIndicator size="small" color={ShoColors.primaryFixed} style={{ marginVertical: 20 }} />
          ) : (
            services.map((service: BarberService) => {
              const isSelected = selectedServiceIds.includes(service.id);
              return (
                <Pressable
                  key={service.id}
                  onPress={() => toggleService(service.id)}
                  style={[
                    styles.serviceOption,
                    isSelected && styles.serviceOptionSelected,
                  ]}>
                  <View style={styles.serviceInfo}>
                    <Text style={[styles.serviceName, isSelected && styles.serviceTextSelected]}>
                      {service.name}
                    </Text>
                    <Text style={styles.serviceDesc}>{service.description}</Text>
                    <Text style={styles.serviceDuration}>
                      Est. {service.duration_minutes} mins
                    </Text>
                  </View>
                  <View style={styles.serviceRight}>
                    <Text style={[styles.servicePrice, isSelected && styles.serviceTextSelected]}>
                      ₦{service.price.toLocaleString()}
                    </Text>
                    <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                      {isSelected && <ShoIcon name="check" size={12} color={ShoColors.onPrimaryFixed} />}
                    </View>
                  </View>
                </Pressable>
              );
            })
          )}
        </View>

        {/* Step 2: Date Selection */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <ShoIcon name="calendar_today" size={18} color={ShoColors.secondary} />
            <Text style={styles.sectionTitle}>2. Choose Date</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateRow}>
            {quickDates.map((item) => {
              const isSelected = selectedDate === item.date;
              return (
                <Pressable
                  key={item.date}
                  onPress={() => {
                    setSelectedDate(item.date);
                    setSelectedDateLabel(item.fullLabel);
                  }}
                  style={[styles.dateChip, isSelected && styles.dateChipSelected]}>
                  <Text style={[styles.dateText, isSelected && styles.dateTextSelected]}>
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Step 3: Time Slot Selection */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <ShoIcon name="event" size={18} color={ShoColors.secondary} />
            <Text style={styles.sectionTitle}>3. Select Appointment Time</Text>
          </View>
          <View style={styles.timeGrid}>
            {AVAILABLE_TIMES.map((time) => {
              const isSelected = selectedTime === time;
              return (
                <Pressable
                  key={time}
                  onPress={() => setSelectedTime(time)}
                  style={[styles.timeChip, isSelected && styles.timeChipSelected]}>
                  <Text style={[styles.timeText, isSelected && styles.timeTextSelected]}>
                    {time}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Step 4: Patron Details */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <ShoIcon name="person" size={18} color={ShoColors.secondary} />
            <Text style={styles.sectionTitle}>4. Patron Credentials</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.textInput}
              value={customerName}
              onChangeText={setCustomerName}
              placeholder="e.g. Master Member"
              placeholderTextColor={ShoColors.textMuted}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={styles.textInput}
              value={customerEmail}
              onChangeText={setCustomerEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="member@gmail.com"
              placeholderTextColor={ShoColors.textMuted}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Contact Phone (Optional)</Text>
            <TextInput
              style={styles.textInput}
              value={customerPhone}
              onChangeText={setCustomerPhone}
              keyboardType="phone-pad"
              placeholder="+234 800 000 0000"
              placeholderTextColor={ShoColors.textMuted}
            />
          </View>
        </View>

        {/* Step 5: Payment Method */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <ShoIcon name="credit_card" size={18} color={ShoColors.secondary} />
            <Text style={styles.sectionTitle}>5. Payment Protocol</Text>
          </View>

          <Pressable
            onPress={() => setPaymentMethod('atelier')}
            style={[
              styles.paymentOption,
              paymentMethod === 'atelier' && styles.paymentOptionSelected,
            ]}>
            <View>
              <Text style={styles.paymentName}>Pay at Atelier</Text>
              <Text style={styles.paymentDesc}>Settle in person via cash or POS upon service completion</Text>
            </View>
            <View style={[styles.radioCircle, paymentMethod === 'atelier' && styles.radioCircleActive]}>
              {paymentMethod === 'atelier' && <View style={styles.radioDot} />}
            </View>
          </Pressable>

          <Pressable
            onPress={() => setPaymentMethod('card')}
            style={[
              styles.paymentOption,
              paymentMethod === 'card' && styles.paymentOptionSelected,
            ]}>
            <View>
              <Text style={styles.paymentName}>Pay Online with Card</Text>
              <Text style={styles.paymentDesc}>Secure checkout via Paystack / Debit Card</Text>
            </View>
            <View style={[styles.radioCircle, paymentMethod === 'card' && styles.radioCircleActive]}>
              {paymentMethod === 'card' && <View style={styles.radioDot} />}
            </View>
          </Pressable>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Duration</Text>
            <Text style={styles.summaryValue}>{totalDuration} mins</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Ritual Fee</Text>
            <Text style={styles.summaryPrice}>₦{totalPrice.toLocaleString()}</Text>
          </View>
          <Text style={styles.summarySlot}>
            {selectedDateLabel} at {selectedTime}
          </Text>

          <Pressable
            onPress={handleBooking}
            disabled={isSubmitting}
            style={({ pressed }) => [
              styles.bookBtn,
              pressed && styles.pressed,
              isSubmitting && { opacity: 0.7 },
            ]}>
            {isSubmitting ? (
              <ActivityIndicator color={ShoColors.onPrimaryFixed} />
            ) : (
              <>
                <Text style={styles.bookBtnText}>Confirm Salon Booking</Text>
                <ShoIcon name="arrow_forward" size={18} color={ShoColors.onPrimaryFixed} />
              </>
            )}
          </Pressable>
        </View>
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
    gap: ShoSpacing.lg,
    paddingBottom: 80,
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
  sectionCard: {
    backgroundColor: ShoColors.surfaceContainer,
    borderRadius: ShoRadius.lg,
    padding: ShoSpacing.md,
    borderWidth: 1,
    borderColor: ShoColors.borderSubtle,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: ShoColors.borderSubtle,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: ShoColors.textIvory,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  serviceOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: ShoColors.surfaceContainerLow,
    borderRadius: ShoRadius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: ShoColors.borderSubtle,
  },
  serviceOptionSelected: {
    borderColor: ShoColors.primaryFixed,
    backgroundColor: 'rgba(234, 179, 8, 0.08)',
  },
  serviceInfo: {
    flex: 1,
    gap: 2,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '700',
    color: ShoColors.textIvory,
  },
  serviceDesc: {
    fontSize: 11,
    color: ShoColors.onSurfaceVariant,
  },
  serviceDuration: {
    fontSize: 10,
    color: ShoColors.textMuted,
    marginTop: 2,
  },
  serviceRight: {
    alignItems: 'flex-end',
    gap: 6,
    marginLeft: 8,
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: '700',
    color: ShoColors.secondary,
  },
  serviceTextSelected: {
    color: ShoColors.primaryFixed,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: ShoColors.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: ShoColors.primaryFixed,
    borderColor: ShoColors.primaryFixed,
  },
  dateRow: {
    gap: 8,
  },
  dateChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: ShoRadius.full,
    backgroundColor: ShoColors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: ShoColors.borderSubtle,
  },
  dateChipSelected: {
    backgroundColor: ShoColors.primaryFixed,
    borderColor: ShoColors.primaryFixed,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '600',
    color: ShoColors.textMuted,
  },
  dateTextSelected: {
    color: ShoColors.onPrimaryFixed,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: ShoRadius.sm,
    backgroundColor: ShoColors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: ShoColors.borderSubtle,
  },
  timeChipSelected: {
    backgroundColor: ShoColors.primaryFixed,
    borderColor: ShoColors.primaryFixed,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
    color: ShoColors.textMuted,
  },
  timeTextSelected: {
    color: ShoColors.onPrimaryFixed,
  },
  inputGroup: {
    gap: 4,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: ShoColors.onSurfaceVariant,
    textTransform: 'uppercase',
  },
  textInput: {
    height: 44,
    backgroundColor: ShoColors.surfaceContainerLow,
    borderRadius: ShoRadius.default,
    paddingHorizontal: 12,
    color: ShoColors.onSurface,
    fontSize: 13,
    borderWidth: 1,
    borderColor: ShoColors.borderSubtle,
  },
  paymentOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: ShoRadius.default,
    backgroundColor: ShoColors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: ShoColors.borderSubtle,
  },
  paymentOptionSelected: {
    borderColor: ShoColors.primaryFixed,
    backgroundColor: 'rgba(234, 179, 8, 0.08)',
  },
  paymentName: {
    fontSize: 13,
    fontWeight: '700',
    color: ShoColors.textIvory,
  },
  paymentDesc: {
    fontSize: 11,
    color: ShoColors.textMuted,
    marginTop: 2,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: ShoColors.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: ShoColors.primaryFixed,
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ShoColors.primaryFixed,
  },
  summaryCard: {
    backgroundColor: ShoColors.surfaceContainerHigh,
    borderRadius: ShoRadius.lg,
    padding: ShoSpacing.md,
    borderWidth: 1,
    borderColor: ShoColors.primaryFixed,
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: ShoColors.onSurfaceVariant,
    textTransform: 'uppercase',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: ShoColors.textIvory,
  },
  summaryPrice: {
    fontFamily: 'serif',
    fontSize: 20,
    fontWeight: '700',
    color: ShoColors.primaryFixed,
  },
  summarySlot: {
    fontSize: 11,
    color: ShoColors.textMuted,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  bookBtn: {
    height: 48,
    borderRadius: ShoRadius.full,
    backgroundColor: ShoColors.primaryFixed,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 6,
  },
  bookBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: ShoColors.onPrimaryFixed,
  },
  pressed: {
    opacity: 0.8,
  },
});
