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
import { GraduationCap, ShieldCheck, CheckCircle2, Award } from 'lucide-react-native';
import { AuthService } from '../shared/services/authService';

export const TeacherLoginScreen: React.FC<{ navigation: any; onLoginSuccess?: () => void }> = ({
  navigation,
  onLoginSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const authService = AuthService.getInstance();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await authService.handleGoogleSignIn(
        {
          idToken: 'mock_teacher_google_token_' + Date.now(),
          user: {
            id: 'g_educator_9876',
            email: 'mentor@mathnotes.courses',
            name: 'Webxpro Digital',
            photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
          }
        },
        'instructor'
      );

      if (onLoginSuccess) {
        onLoginSuccess();
      } else if (navigation) {
        navigation.replace('TeacherTabs');
      }
    } catch (error) {
      console.error('Teacher Google Sign-In Error:', error);
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
            <Text style={styles.logoEmoji}>🎓</Text>
          </View>
          <Text style={styles.brandTitle}>Mathnotes Teacher</Text>
          <Text style={styles.brandTagline}>Empowering Educators • Scaling Reach</Text>
        </View>

        {/* Benefits Card */}
        <View style={styles.benefitsCard}>
          <Text style={styles.benefitsTitle}>Educator Portal Access:</Text>
          
          <View style={styles.benefitRow}>
            <CheckCircle2 color="#10B981" size={18} />
            <Text style={styles.benefitText}>Create and publish modular math courses</Text>
          </View>

          <View style={styles.benefitRow}>
            <CheckCircle2 color="#10B981" size={18} />
            <Text style={styles.benefitText}>**Teachers AI Copilot** for active lesson plans & JEE quizzes</Text>
          </View>

          <View style={styles.benefitRow}>
            <CheckCircle2 color="#10B981" size={18} />
            <Text style={styles.benefitText}>Manage enrolled students, grade quizzes & review analytics</Text>
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
              <ActivityIndicator color="#090D16" />
            ) : (
              <>
                <Image
                  source={{ uri: 'https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png' }}
                  style={styles.googleIcon}
                />
                <Text style={styles.googleButtonText}>Educator Sign In with Google</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.securityNote}>
            <ShieldCheck color="#64748B" size={14} />
            <Text style={styles.securityText}>Instructor Verification • Encrypted OAuth</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Teacher partnerships & onboarding questions: teachers@mathnotes.courses
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090D16',
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
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#10B981',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  logoEmoji: {
    fontSize: 32,
  },
  brandTitle: {
    color: '#F8FAFC',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  brandTagline: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  benefitsCard: {
    backgroundColor: '#131B2E',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1E293B',
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
    color: '#090D16',
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

