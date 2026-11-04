import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
  StyleSheet,
} from 'react-native';
import {
  Award,
  BookOpen,
  Bell,
  LogOut,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  HelpCircle,
  Clock,
} from 'lucide-react-native';
import { StudentEnrollment, UserProfile } from '../shared/types';
import { ApiService } from '../shared/services/apiService';
import { AuthService } from '../shared/services/authService';
import { NotificationService } from '../shared/services/notificationService';
import { AuroraBackground, GlassCard, LiquidGlassTokens } from '../shared/components/glass';

export const StudentDashboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [enrollments, setEnrollments] = useState<StudentEnrollment[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [pushEnabled, setPushEnabled] = useState(true);

  const api = ApiService.getInstance();
  const auth = AuthService.getInstance();
  const notif = NotificationService.getInstance();

  useEffect(() => {
    const session = auth.getSession();
    if (session) {
      setUser(session.user);
    }
    api.getStudentEnrollments().then(data => setEnrollments(data));
    setPushEnabled(notif.areNotificationsEnabled());
  }, []);

  const handleToggleNotifications = (value: boolean) => {
    setPushEnabled(value);
    notif.toggleNotifications(value);
  };

  const handleSignOut = () => {
    auth.signOut();
  };

  return (
    <AuroraBackground variant="student">
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Liquid Glass Header */}
        <GlassCard
          glowColor={LiquidGlassTokens.colors.accentCyan}
          glowPosition="top-right"
          style={styles.profileGlass}
        >
          <View style={styles.profileRow}>
            <View style={styles.avatarContainer}>
              <Image
                source={{
                  uri:
                    user?.avatarUrl ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
                }}
                style={styles.avatar}
              />
              <View style={styles.badgeOnline} />
            </View>
            <View style={styles.profileText}>
              <Text style={styles.name}>{user?.name || 'Vikram'}</Text>
              <Text style={styles.email}>{user?.email || 'student@mathnotes.courses'}</Text>
              <View style={styles.oauthBadge}>
                <ShieldCheck color="#10B981" size={13} />
                <Text style={styles.oauthText}>Google OAuth Verified</Text>
              </View>
            </View>
          </View>
        </GlassCard>

        {/* Learning Analytics Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Learning Analytics</Text>
          <View style={styles.statsRow}>
            <GlassCard
              style={styles.statBox}
              contentStyle={styles.statContent}
              glowColor="rgba(56, 189, 248, 0.2)"
            >
              <BookOpen color="#38BDF8" size={20} />
              <Text style={styles.statNum}>{enrollments.length}</Text>
              <Text style={styles.statLabel}>Enrolled Courses</Text>
            </GlassCard>

            <GlassCard
              style={styles.statBox}
              contentStyle={styles.statContent}
              glowColor="rgba(16, 185, 129, 0.2)"
            >
              <Award color="#10B981" size={20} />
              <Text style={styles.statNum}>12</Text>
              <Text style={styles.statLabel}>Lessons Done</Text>
            </GlassCard>

            <GlassCard
              style={styles.statBox}
              contentStyle={styles.statContent}
              glowColor="rgba(245, 158, 11, 0.2)"
            >
              <Clock color="#F59E0B" size={20} />
              <Text style={styles.statNum}>8.5h</Text>
              <Text style={styles.statLabel}>Time Spent</Text>
            </GlassCard>
          </View>
        </View>

        {/* Enrolled Courses & Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Courses Progress</Text>
          {enrollments.map(enr => (
            <GlassCard
              key={enr.id}
              onPress={() => navigation.navigate('CourseDetail', { courseId: enr.courseId })}
              style={styles.courseProgressGlass}
              glowColor="rgba(56, 189, 248, 0.25)"
            >
              <View style={styles.courseProgressHeader}>
                <Text style={styles.courseName}>{enr.course.title}</Text>
                <Text style={styles.progressPercent}>{enr.progressPercent}%</Text>
              </View>

              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${enr.progressPercent}%` }]} />
              </View>

              <View style={styles.courseProgressFooter}>
                <Text style={styles.footerNote}>
                  {enr.completedLessonsCount} / {enr.course.totalLessons} Lessons
                </Text>
                <Text style={styles.resumeText}>Continue Lesson →</Text>
              </View>
            </GlassCard>
          ))}
        </View>

        {/* Preferences & Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <GlassCard style={styles.settingsGlass} contentStyle={{ padding: 0 }}>
            <View style={styles.settingItem}>
              <View style={styles.settingIconText}>
                <Bell color="#38BDF8" size={18} />
                <View>
                  <Text style={styles.settingLabel}>Expo Push Notifications</Text>
                  <Text style={styles.settingDesc}>Quiz deadlines and mentor replies</Text>
                </View>
              </View>
              <Switch
                value={pushEnabled}
                onValueChange={handleToggleNotifications}
                trackColor={{ false: '#334155', true: '#2563EB' }}
                thumbColor={pushEnabled ? '#38BDF8' : '#94A3B8'}
              />
            </View>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => navigation.navigate('MathNotesAI')}
            >
              <View style={styles.settingIconText}>
                <Sparkles color="#A855F7" size={18} />
                <View>
                  <Text style={styles.settingLabel}>MathNotes AI Chat History</Text>
                  <Text style={styles.settingDesc}>Review past doubts & proofs</Text>
                </View>
              </View>
              <ChevronRight color="#64748B" size={18} />
            </TouchableOpacity>
          </GlassCard>
        </View>

        {/* Sign Out */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleSignOut} activeOpacity={0.8}>
            <LogOut color="#EF4444" size={18} />
            <Text style={styles.logoutText}>Sign Out from Mathnotes</Text>
          </TouchableOpacity>
          <Text style={styles.supportNote}>Support: care@mathnotes.courses</Text>
        </View>
      </ScrollView>
    </AuroraBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  profileGlass: {
    margin: 16,
    marginTop: 12,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 2,
    borderColor: '#38BDF8',
  },
  badgeOnline: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    position: 'absolute',
    bottom: 2,
    right: 2,
    borderWidth: 2,
    borderColor: '#0F172A',
  },
  profileText: {
    flex: 1,
  },
  name: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '800',
  },
  email: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  oauthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 6,
  },
  oauthText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 22,
  },
  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    flex: 1,
  },
  statContent: {
    alignItems: 'center',
    padding: 14,
    gap: 4,
  },
  statNum: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '900',
  },
  statLabel: {
    color: '#94A3B8',
    fontSize: 10.5,
    fontWeight: '600',
    textAlign: 'center',
  },
  courseProgressGlass: {
    marginBottom: 12,
  },
  courseProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  courseName: {
    color: '#F8FAFC',
    fontSize: 14.5,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  progressPercent: {
    color: '#38BDF8',
    fontSize: 14,
    fontWeight: '800',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 3,
    overflow: 'hidden',
    marginVertical: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#38BDF8',
    borderRadius: 3,
  },
  courseProgressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  footerNote: {
    color: '#94A3B8',
    fontSize: 11,
  },
  resumeText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
  },
  settingsGlass: {
    borderRadius: LiquidGlassTokens.radius.lg,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  settingIconText: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingLabel: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
  },
  settingDesc: {
    color: '#64748B',
    fontSize: 11,
  },
  logoutSection: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    alignItems: 'center',
    gap: 12,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.35)',
    borderRadius: 14,
    paddingVertical: 13,
    width: '100%',
    gap: 8,
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '700',
  },
  supportNote: {
    color: '#64748B',
    fontSize: 11,
  },
});
