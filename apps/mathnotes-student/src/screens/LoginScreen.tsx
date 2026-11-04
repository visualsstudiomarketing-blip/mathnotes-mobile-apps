import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react-native';
import { AuthService } from '../shared/services/authService';

export const LoginScreen: React.FC<{ navigation: any; onLoginSuccess?: () => void }> = ({
  navigation,
  onLoginSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const authService = AuthService.getInstance();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      // In production: const result = await GoogleSignin.signIn();
      // Simulating native Google OAuth response
      await authService.handleGoogleSignIn(
        {
          idToken: 'mock_google_id_token_' + Date.now(),
          user: {
            id: 'g_123456789',
            email: 'student@mathnotes.courses',
            name: 'Vikram',
            photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
          }
        },
        'student'
      );

      if (onLoginSuccess) {
        onLoginSuccess();
      } else if (navigation) {
        navigation.replace('MainTabs');
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo & Brand */}
        <View style={styles.brandContainer}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoEmoji}>ðŸ“</Text>
          </View>
          <Text style={styles.brandTitle}>Mathnotes</Text>
          <Text style={styles.brandTagline}>Learn • Practice • Understand • Achieve</Text>
        </View>

        {/* Benefits Card */}
        <View style={styles.benefitsCard}>
          <Text style={styles.benefitsTitle}>Sign in to unlock full learning access:</Text>
          
          <View style={styles.benefitRow}>
            <CheckCircle2 color="#38BDF8" size={18} />
            <Text style={styles.benefitText}>Unlimited queries with **MathNotes AI Mentor**</Text>
          </View>

          <View style={styles.benefitRow}>
            <CheckCircle2 color="#38BDF8" size={18} />
            <Text style={styles.benefitText}>Sync course progress, quizzes & certificates</Text>
          </View>

          <View style={styles.benefitRow}>
            <CheckCircle2 color="#38BDF8" size={18} />
            <Text style={styles.benefitText}>Direct doubt clearance in Tutor LMS Q&A</Text>
          </View>
        </View>

        {/* Google OAuth Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#0F172A" />
            ) : (
              <>
                <Image
                  source={{ uri: 'https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png' }}
                  style={styles.googleIcon}
                />
                <Text style={styles.googleButtonText}>Continue with Google</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.securityNote}>
            <ShieldCheck color="#64748B" size={14} />
            <Text style={styles.securityText}>Verified Google OAuth • Encrypted Session</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By signing in, you agree to Mathnotes Terms and Privacy Policy. General enquiries: care@mathnotes.courses
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingVertical: 32,
  },
  brandContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  logoBadge: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#38BDF8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#38BDF8',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  logoEmoji: {
    fontSize: 32,
  },
  brandTitle: {
    color: '#F8FAFC',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  brandTagline: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  benefitsCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 14,
  },
  benefitsTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  benefitText: {
    color: '#CBD5E1',
    fontSize: 13,
    flex: 1,
  },
  buttonContainer: {
    gap: 12,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  googleIcon: {
    width: 22,
    height: 22,
  },
  googleButtonText: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '700',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  securityText: {
    color: '#64748B',
    fontSize: 11,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    color: '#64748B',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
});

