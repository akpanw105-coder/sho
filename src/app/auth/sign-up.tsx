import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  SafeAreaView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { ShoColors, ShoRadius, ShoSpacing } from '@/constants/sho-theme';
import { ShoIcon } from '@/components/sho-icon';
import { useSho } from '@/context/sho-context';

export default function SignUpScreen() {
  const { signup } = useSho();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Required Fields', 'Please specify your full name and email address.');
      return;
    }
    if (!password || password.length < 6) {
      Alert.alert('Password Requirement', 'Please choose a password with at least 6 characters.');
      return;
    }

    setIsLoading(true);
    const { error } = await signup(name.trim(), email.trim(), password, phone.trim());
    setIsLoading(false);

    if (error) {
      Alert.alert('Enrollment Error', error.message || 'Unable to register your patron account.');
      return;
    }

    Alert.alert(
      'Welcome to SHO.',
      'Your patron account has been created. You now have access to the Salon collections.',
      [{ text: 'Enter Boutique', onPress: () => router.replace('/') }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Top Header */}
        <View style={styles.topBar}>
          <Pressable onPress={() => router.push('/auth/sign-in')} style={styles.backBtn}>
            <ShoIcon name="arrow_back" size={20} color={ShoColors.onSurfaceVariant} />
          </Pressable>
          <Text style={styles.wordmark}>SHO.</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.headerBlock}>
          <Text style={styles.eyebrow}>Exclusive Enrollment</Text>
          <Text style={styles.title}>Join The Archive</Text>
          <Text style={styles.subtitle}>
            Register for priority notifications on archival restocks, bespoke sizes, and private salon viewings.
          </Text>
        </View>

        {/* Input Form */}
        <View style={styles.formCard}>
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Full Legal Name</Text>
            <View style={styles.inputBox}>
              <ShoIcon name="person" size={18} color={ShoColors.textMuted} />
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Julian Sterling"
                placeholderTextColor={ShoColors.outline}
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Email Address</Text>
            <View style={styles.inputBox}>
              <ShoIcon name="mail" size={18} color={ShoColors.textMuted} />
              <TextInput
                style={styles.textInput}
                placeholder="julian@sterling.com"
                placeholderTextColor={ShoColors.outline}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Mobile Phone</Text>
            <View style={styles.inputBox}>
              <ShoIcon name="call" size={18} color={ShoColors.textMuted} />
              <TextInput
                style={styles.textInput}
                placeholder="+1 (555) 019-2831"
                placeholderTextColor={ShoColors.outline}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Password</Text>
            <View style={styles.inputBox}>
              <ShoIcon name="lock" size={18} color={ShoColors.textMuted} />
              <TextInput
                style={styles.textInput}
                placeholder="Create secure passcode"
                placeholderTextColor={ShoColors.outline}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          {/* Sign Up CTA */}
          <Pressable
            accessibilityLabel="Create Account"
            onPress={handleSignUp}
            disabled={isLoading}
            style={({ pressed }) => [
              styles.signUpBtn,
              pressed && styles.pressed,
              isLoading && { opacity: 0.7 },
            ]}>
            <Text style={styles.signUpBtnText}>
              {isLoading ? 'Creating Account...' : 'Request Salon Account'}
            </Text>
            <ShoIcon
              name={isLoading ? 'verified' : 'arrow_forward'}
              size={18}
              color={ShoColors.onPrimaryFixed}
            />
          </Pressable>
        </View>

        {/* Existing Member */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already enrolled?</Text>
          <Pressable onPress={() => router.push('/auth/sign-in')}>
            <Text style={styles.signInLink}>Sign In to Salon</Text>
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
    paddingHorizontal: ShoSpacing.margin,
    paddingTop: ShoSpacing.sm,
    gap: ShoSpacing.xl,
    justifyContent: 'center',
    minHeight: '90%',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmark: {
    fontFamily: 'serif',
    fontSize: 22,
    fontWeight: '800',
    color: ShoColors.textIvory,
    letterSpacing: 2,
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
    fontSize: 30,
    fontWeight: '600',
    color: ShoColors.primary,
  },
  subtitle: {
    fontSize: 13,
    color: ShoColors.onSurfaceVariant,
    lineHeight: 20,
  },
  formCard: {
    backgroundColor: ShoColors.surfaceContainer,
    borderRadius: ShoRadius.lg,
    padding: ShoSpacing.lg,
    borderWidth: 1,
    borderColor: ShoColors.borderSubtle,
    gap: ShoSpacing.md,
  },
  fieldWrap: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: ShoColors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: ShoColors.surfaceContainerLow,
    borderRadius: ShoRadius.default,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: ShoColors.borderSubtle,
  },
  textInput: {
    flex: 1,
    color: ShoColors.onSurface,
    fontSize: 14,
  },
  signUpBtn: {
    height: 52,
    borderRadius: ShoRadius.full,
    backgroundColor: ShoColors.primaryFixed,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  signUpBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: ShoColors.onPrimaryFixed,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: ShoColors.textMuted,
  },
  signInLink: {
    fontSize: 12,
    fontWeight: '700',
    color: ShoColors.primaryFixed,
    textDecorationLine: 'underline',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
