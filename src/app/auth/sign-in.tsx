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

export default function SignInScreen() {
  const { login } = useSho();
  const [email, setEmail] = useState('wisdom@example.com');
  const [password, setPassword] = useState('Password123!');
  const [secure, setSecure] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email) {
      Alert.alert('Required', 'Please enter your email address.');
      return;
    }
    if (!password) {
      Alert.alert('Required', 'Please enter your account password.');
      return;
    }
    setIsLoading(true);
    const { error } = await login(email, password);
    setIsLoading(false);

    if (error) {
      Alert.alert('Access Denied', error.message || 'Unable to authenticate with provided credentials.');
      return;
    }

    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Top Bar with Dismiss */}
        <View style={styles.topBar}>
          <Pressable onPress={() => router.push('/')} style={styles.backBtn}>
            <ShoIcon name="arrow_back" size={20} color={ShoColors.onSurfaceVariant} />
          </Pressable>
          <Text style={styles.wordmark}>SHO.</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.headerBlock}>
          <Text style={styles.eyebrow}>Client Access</Text>
          <Text style={styles.title}>Enter The Salon</Text>
          <Text style={styles.subtitle}>
            Authenticate your patron credentials to access bespoke acquisitions, private drops, and reserved shopping bags.
          </Text>
        </View>

        {/* Input Fields */}
        <View style={styles.formCard}>
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Patron Email</Text>
            <View style={styles.inputBox}>
              <ShoIcon name="mail" size={18} color={ShoColors.textMuted} />
              <TextInput
                style={styles.textInput}
                placeholder="patron@domain.com"
                placeholderTextColor={ShoColors.outline}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Password</Text>
            <View style={styles.inputBox}>
              <ShoIcon name="lock" size={18} color={ShoColors.textMuted} />
              <TextInput
                style={styles.textInput}
                placeholder="Password"
                placeholderTextColor={ShoColors.outline}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={secure}
              />
              <Pressable onPress={() => setSecure(!secure)} style={styles.eyeBtn}>
                <ShoIcon
                  name={secure ? 'visibility' : 'visibility_off'}
                  size={18}
                  color={ShoColors.textMuted}
                />
              </Pressable>
            </View>
          </View>

          {/* Sign In CTA */}
          <Pressable
            accessibilityLabel="Sign In"
            onPress={handleSignIn}
            disabled={isLoading}
            style={({ pressed }) => [
              styles.signInBtn,
              pressed && styles.pressed,
              isLoading && { opacity: 0.7 },
            ]}>
            <Text style={styles.signInBtnText}>
              {isLoading ? 'Verifying Credentials...' : 'Enter Salon'}
            </Text>
            <ShoIcon
              name={isLoading ? 'verified' : 'arrow_forward'}
              size={18}
              color={ShoColors.onPrimaryFixed}
            />
          </Pressable>
        </View>

        {/* Footnote / Link to Sign Up */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>New to SHO.?</Text>
          <Pressable onPress={() => router.push('/auth/sign-up')}>
            <Text style={styles.signUpLink}>Request Salon Invitation</Text>
          </Pressable>
        </View>

        {/* Fast Guest Demo Shortcut */}
        <Pressable
          onPress={() => {
            login('collector@sho.luxury');
            router.replace('/');
          }}
          style={styles.guestBtn}>
          <Text style={styles.guestBtnText}>Continue as Guest Collector</Text>
        </Pressable>
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
  eyeBtn: {
    padding: 4,
  },
  signInBtn: {
    height: 52,
    borderRadius: ShoRadius.full,
    backgroundColor: ShoColors.primaryFixed,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  signInBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: ShoColors.onPrimaryFixed,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 12,
    color: ShoColors.textMuted,
  },
  signUpLink: {
    fontSize: 12,
    fontWeight: '700',
    color: ShoColors.primaryFixed,
    textDecorationLine: 'underline',
  },
  guestBtn: {
    alignSelf: 'center',
    paddingVertical: 8,
  },
  guestBtnText: {
    fontSize: 12,
    color: ShoColors.secondary,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
