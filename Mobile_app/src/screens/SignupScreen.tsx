import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

interface SignupScreenProps {
  onNavigateToLogin: () => void;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({ onNavigateToLogin }) => {
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPasswordStrength = (): { label: string; color: string; width: string } => {
    if (password.length === 0) return { label: '', color: '#E5E7EB', width: '0%' };
    if (password.length < 6) return { label: 'Weak', color: '#DC2626', width: '25%' };
    if (password.length < 10) return { label: 'Medium', color: '#F59E0B', width: '60%' };
    return { label: 'Strong', color: '#059669', width: '100%' };
  };

  const strength = getPasswordStrength();

  const handleSignup = async () => {
    setError(null);
    if (!fullName.trim()) { setError('Please enter your full name'); return; }
    if (!email.trim() || !email.includes('@')) { setError('Please enter a valid email address'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }

    setLoading(true);
    const result = await register(fullName.trim(), email.trim().toLowerCase(), password);
    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.heroSection}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🏛️</Text>
          </View>
          <Text style={styles.appName}>Join Dharohar</Text>
          <Text style={styles.appTagline}>Start your Heritage Explorer journey</Text>
        </View>

        {/* Signup Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Create Account</Text>
          <Text style={styles.cardSubtitle}>Unlock your Digital Heritage Passport & virtual stamps</Text>

          {/* Error Banner */}
          {error && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Full Name */}
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>FULL NAME</Text>
            <View style={styles.inputRow}>
              <Text style={styles.inputIcon}>👤</Text>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Rahul Sharma"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>EMAIL ADDRESS</Text>
            <View style={styles.inputRow}>
              <Text style={styles.inputIcon}>✉️</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="your@email.com"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                returnKeyType="next"
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>PASSWORD</Text>
            <View style={styles.inputRow}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Min 6 characters"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                returnKeyType="next"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
            {/* Password Strength Bar */}
            {password.length > 0 && (
              <View style={styles.strengthRow}>
                <View style={styles.strengthBg}>
                  <View style={[styles.strengthFill, { width: strength.width as any, backgroundColor: strength.color }]} />
                </View>
                <Text style={[styles.strengthLabel, { color: strength.color }]}>{strength.label}</Text>
              </View>
            )}
          </View>

          {/* Confirm Password */}
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>CONFIRM PASSWORD</Text>
            <View style={[
              styles.inputRow,
              confirmPassword.length > 0 && {
                borderColor: confirmPassword === password ? '#059669' : '#DC2626',
              },
            ]}>
              <Text style={styles.inputIcon}>🔑</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Re-enter password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                returnKeyType="done"
                onSubmitEditing={handleSignup}
              />
              {confirmPassword.length > 0 && (
                <Text style={styles.matchIcon}>
                  {confirmPassword === password ? '✅' : '❌'}
                </Text>
              )}
            </View>
          </View>

          {/* Benefits Row */}
          <View style={styles.benefitsRow}>
            {['🏛️ Heritage Passport', '🎖️ Explorer Badges', '📍 Nearby Sites'].map((b) => (
              <View key={b} style={styles.benefitPill}>
                <Text style={styles.benefitText}>{b}</Text>
              </View>
            ))}
          </View>

          {/* Signup Button */}
          <TouchableOpacity
            style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
            onPress={handleSignup}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.primaryBtnText}>Create Account  →</Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Back to Login */}
          <TouchableOpacity style={styles.secondaryBtn} onPress={onNavigateToLogin}>
            <Text style={styles.secondaryBtnText}>Already have an account? Sign In</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerText}>
          By creating an account, you agree to the{' '}
          <Text style={styles.footerLink}>Terms of Service</Text>
          {' & '}
          <Text style={styles.footerLink}>Privacy Policy</Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCF9F8' },
  scroll: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 32 },
  heroSection: { alignItems: 'center', paddingTop: 50, paddingBottom: 24 },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#9E2016',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#9E2016',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  logoEmoji: { fontSize: 32 },
  appName: {
    fontFamily: 'serif',
    fontSize: 28,
    fontWeight: '700',
    color: '#9E2016',
    letterSpacing: 0.5,
  },
  appTagline: { fontSize: 13, color: '#6B7280', marginTop: 4, fontWeight: '500' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 20,
  },
  cardTitle: { fontFamily: 'serif', fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 4 },
  cardSubtitle: { fontSize: 13, color: '#6B7280', marginBottom: 20 },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
    gap: 8,
  },
  errorIcon: { fontSize: 16 },
  errorText: { flex: 1, fontSize: 13, color: '#DC2626', fontWeight: '500' },
  fieldWrap: { marginBottom: 16 },
  fieldLabel: { fontSize: 11, fontWeight: '700', color: '#6B7280', letterSpacing: 1, marginBottom: 6 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    height: 52,
  },
  inputIcon: { fontSize: 16, marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: '#111827', fontWeight: '500' },
  eyeBtn: { padding: 4 },
  eyeIcon: { fontSize: 18 },
  matchIcon: { fontSize: 16 },
  strengthRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 10 },
  strengthBg: { flex: 1, height: 4, backgroundColor: '#E5E7EB', borderRadius: 2 },
  strengthFill: { height: 4, borderRadius: 2 },
  strengthLabel: { fontSize: 11, fontWeight: '700' },
  benefitsRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginBottom: 20 },
  benefitPill: {
    backgroundColor: '#FFF5F5',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  benefitText: { fontSize: 11, fontWeight: '600', color: '#9E2016' },
  primaryBtn: {
    backgroundColor: '#9E2016',
    borderRadius: 14,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#9E2016',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryBtnDisabled: { opacity: 0.7 },
  primaryBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 20, gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
  dividerText: { fontSize: 12, color: '#9CA3AF', fontWeight: '600', letterSpacing: 1 },
  secondaryBtn: {
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#9E2016',
  },
  secondaryBtnText: { color: '#9E2016', fontSize: 15, fontWeight: '700' },
  footerText: { textAlign: 'center', fontSize: 12, color: '#9CA3AF', lineHeight: 18 },
  footerLink: { color: '#9E2016', fontWeight: '600' },
});
