import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  RefreshControl,
} from 'react-native';
import {
  Users,
  BookOpen,
  IndianRupee,
  Star,
  PlusCircle,
  Sparkles,
  Video,
  Bell,
  CheckCircle2,
  Calendar,
  Send,
  Layers,
  HelpCircle,
  ArrowRight,
} from 'lucide-react-native';
import { TeacherAnalytics } from '../shared/types';
import { ApiService } from '../shared/services/apiService';
import { NotificationService } from '../shared/services/notificationService';
import { AuroraBackground, GlassCard, LiquidGlassTokens } from '../shared/components/glass';

export const TeacherDashboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [courses, setCourses] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<TeacherAnalytics>({
    totalStudents: 1420,
    activeCourses: 5,
    totalEarnings: 184500, // In INR ₹
    monthlyRevenue: 46200, // In INR ₹
    averageRating: 4.94,
    pendingReviewsCount: 8,
    unansweredQuestionsCount: 2,
    allIndiaTopRankersCount: 18,
  });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Live session modal fields
  const [showLiveModal, setShowLiveModal] = useState(false);
  const [liveTopic, setLiveTopic] = useState('JEE Advanced King\'s Property Deep-Dive');
  const [liveTime, setLiveTime] = useState('Tomorrow, 6:00 PM IST');
  const [liveLink, setLiveLink] = useState('https://mathnotes.courses/live/jee-batch-1');

  // Broadcast modal fields
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');

  const api = ApiService.getInstance();

  const loadData = async () => {
    try {
      const [analyticsData, coursesData] = await Promise.all([
        api.getTeacherAnalytics(),
        api.getTeacherCourses(),
      ]);
      if (analyticsData) setAnalytics(analyticsData);
      if (coursesData) setCourses(coursesData);
    } catch (e) {
      console.warn('Dashboard sync error:', e);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleScheduleLiveClass = () => {
    if (!liveTopic.trim()) return;
    setShowLiveModal(false);

    NotificationService.getInstance().sendPushNotification({
      title: `🔴 Live Class Scheduled: ${liveTopic}`,
      body: `Join Mentor Vikramaditya live on ${liveTime}. Click to add to your calendar!`,
      data: { liveLink },
    });

    Alert.alert(
      'Live Session Broadcasted! 🚀',
      `Push alert sent to ${analytics.totalStudents} enrolled students for "${liveTopic}" at ${liveTime}.`
    );
  };

  const handleSendBroadcast = () => {
    if (!broadcastMessage.trim()) return;
    setShowBroadcastModal(false);

    NotificationService.getInstance().sendPushNotification({
      title: '📢 Instructor Announcement',
      body: broadcastMessage,
    });

    Alert.alert(
      'Broadcast Dispatched! 📡',
      `Sent to ${analytics.totalStudents} active student devices via Expo Push Cloud.`
    );
    setBroadcastMessage('');
  };

  return (
    <AuroraBackground variant="teacher">
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10B981" />}
      >
        {/* Header Banner */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeSubtitle}>EDUCATOR PORTAL • MATHNOTES INDIA 2026</Text>
            <Text style={styles.welcomeTitle}>Welcome back, Mentor</Text>
          </View>
          <TouchableOpacity
            style={styles.aiCopilotBtn}
            onPress={() => navigation.navigate('TeachersAI')}
            activeOpacity={0.8}
          >
            <Sparkles color="#10B981" size={16} />
            <Text style={styles.aiCopilotText}>Teachers AI</Text>
          </TouchableOpacity>
        </View>

        {/* Liquid Glass KPI Stats Grid */}
        <View style={styles.statsGrid}>
          <GlassCard
            style={styles.statGlassCard}
            contentStyle={styles.statContent}
            glowColor="rgba(56, 189, 248, 0.25)"
          >
            <View style={[styles.statIconBg, { backgroundColor: 'rgba(56, 189, 248, 0.15)' }]}>
              <Users color="#38BDF8" size={19} />
            </View>
            <Text style={styles.statNumber}>{analytics.totalStudents}</Text>
            <Text style={styles.statLabel}>Enrolled Students</Text>
          </GlassCard>

          <GlassCard
            style={styles.statGlassCard}
            contentStyle={styles.statContent}
            glowColor="rgba(16, 185, 129, 0.25)"
          >
            <View style={[styles.statIconBg, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
              <IndianRupee color="#10B981" size={19} />
            </View>
            <Text style={styles.statNumber}>₹{(analytics.monthlyRevenue / 1000).toFixed(1)}k</Text>
            <Text style={styles.statLabel}>This Month (Net)</Text>
          </GlassCard>

          <GlassCard
            style={styles.statGlassCard}
            contentStyle={styles.statContent}
            glowColor="rgba(245, 158, 11, 0.25)"
          >
            <View style={[styles.statIconBg, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
              <Star color="#F59E0B" size={19} fill="#F59E0B" />
            </View>
            <Text style={styles.statNumber}>{analytics.averageRating}</Text>
            <Text style={styles.statLabel}>Avg Rating</Text>
          </GlassCard>

          <GlassCard
            style={styles.statGlassCard}
            contentStyle={styles.statContent}
            glowColor="rgba(168, 85, 247, 0.25)"
          >
            <View style={[styles.statIconBg, { backgroundColor: 'rgba(168, 85, 247, 0.15)' }]}>
              <BookOpen color="#A855F7" size={19} />
            </View>
            <Text style={styles.statNumber}>{analytics.activeCourses}</Text>
            <Text style={styles.statLabel}>Live Courses</Text>
          </GlassCard>
        </View>

        {/* Quick Operations Row */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Live Operations & Batch Management</Text>
          <View style={styles.actionRow}>
            <GlassCard
              style={styles.actionGlassCard}
              onPress={() => setShowLiveModal(true)}
              glowColor="rgba(239, 68, 68, 0.25)"
            >
              <Video color="#EF4444" size={22} />
              <Text style={styles.actionTitle}>Schedule Live</Text>
              <Text style={styles.actionDesc}>Host Zoom / Jitsi class</Text>
            </GlassCard>

            <GlassCard
              style={styles.actionGlassCard}
              onPress={() => setShowBroadcastModal(true)}
              glowColor="rgba(245, 158, 11, 0.25)"
            >
              <Bell color="#F59E0B" size={22} />
              <Text style={styles.actionTitle}>Push Broadcast</Text>
              <Text style={styles.actionDesc}>Alert batch students</Text>
            </GlassCard>
          </View>
        </View>

        {/* Curriculum Creation Studio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Curriculum Creation Studio</Text>
          <View style={styles.actionRow}>
            <GlassCard
              style={styles.actionGlassCard}
              onPress={() => navigation.navigate('CreateCourse')}
              glowColor="rgba(16, 185, 129, 0.3)"
            >
              <PlusCircle color="#10B981" size={22} />
              <Text style={styles.actionTitle}>New Course</Text>
              <Text style={styles.actionDesc}>Create Tutor LMS curriculum</Text>
            </GlassCard>

            <GlassCard
              style={styles.actionGlassCard}
              onPress={() => navigation.navigate('ExamStudio')}
              glowColor="rgba(56, 189, 248, 0.3)"
            >
              <Sparkles color="#38BDF8" size={22} />
              <Text style={styles.actionTitle}>AI Exam Studio</Text>
              <Text style={styles.actionDesc}>Auto-generate tests & DPPs</Text>
            </GlassCard>
          </View>
        </View>

        {/* Course Performance List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Active Courses</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Courses')}>
              <Text style={styles.viewAllText}>Manage All ({courses.length}) →</Text>
            </TouchableOpacity>
          </View>

          {courses.slice(0, 4).map(course => (
            <GlassCard
              key={course.id}
              style={styles.courseGlassItem}
              onPress={() => navigation.navigate('Courses')}
              glowColor="rgba(16, 185, 129, 0.2)"
            >
              <View style={styles.courseHeaderRow}>
                <View style={styles.subjectBadge}>
                  <Text style={styles.subjectBadgeText}>{course.subject || 'Math'}</Text>
                </View>
                <Text style={styles.studentCountText}>{course.enrolledCount || 240} enrolled</Text>
              </View>
              <Text style={styles.courseItemTitle}>{course.title}</Text>
              <View style={styles.courseItemFooter}>
                <Text style={styles.courseItemMeta}>{course.totalLessons || 12} Lessons • 3 Quizzes</Text>
                <View style={styles.ratingBadge}>
                  <Star color="#F59E0B" size={13} fill="#F59E0B" />
                  <Text style={styles.ratingText}>{course.rating || '4.9'}</Text>
                </View>
              </View>
            </GlassCard>
          ))}
        </View>

        {/* Indian Taxation & Payouts Card */}
        <GlassCard style={styles.taxGlass} glowColor="rgba(148, 163, 184, 0.15)">
          <Text style={styles.taxTitle}>🇮🇳 Indian Taxation & Payout Summary</Text>
          <Text style={styles.taxDesc}>
            Compliant with Section 194-O (1% TDS deducted and filed against PAN). Payouts are credited directly to your verified UPI/NEFT account on the 1st of every month.
          </Text>
          <Text style={styles.supportEmail}>Inquiries: teachers@mathnotes.courses</Text>
        </GlassCard>

        {/* Schedule Live Class Modal */}
        <Modal visible={showLiveModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <GlassCard style={styles.modalGlassBox} glowColor="rgba(239, 68, 68, 0.3)">
              <Text style={styles.modalHeading}>Schedule Live Interactive Class</Text>
              <Text style={styles.modalSubheading}>
                Enrolled students will receive an instant Push Notification alert.
              </Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Session Topic</Text>
                <TextInput
                  style={styles.modalInput}
                  value={liveTopic}
                  onChangeText={setLiveTopic}
                  placeholder="e.g. JEE Conics & Hyperbola Shortcuts"
                  placeholderTextColor="#64748B"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Date & Time</Text>
                <TextInput
                  style={styles.modalInput}
                  value={liveTime}
                  onChangeText={setLiveTime}
                  placeholder="e.g. Tomorrow, 6:00 PM IST"
                  placeholderTextColor="#64748B"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Live Classroom URL (Zoom / Jitsi)</Text>
                <TextInput
                  style={styles.modalInput}
                  value={liveLink}
                  onChangeText={setLiveLink}
                  placeholder="https://mathnotes.courses/live/..."
                  placeholderTextColor="#64748B"
                />
              </View>

              <View style={styles.modalActionRow}>
                <TouchableOpacity
                  style={styles.modalCancelBtn}
                  onPress={() => setShowLiveModal(false)}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalConfirmBtn}
                  onPress={handleScheduleLiveClass}
                >
                  <Video color="#FFFFFF" size={16} />
                  <Text style={styles.modalConfirmText}>Broadcast Class</Text>
                </TouchableOpacity>
              </View>
            </GlassCard>
          </View>
        </Modal>

        {/* Push Broadcast Modal */}
        <Modal visible={showBroadcastModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <GlassCard style={styles.modalGlassBox} glowColor="rgba(245, 158, 11, 0.3)">
              <Text style={styles.modalHeading}>Dispatch Batch Push Notification</Text>
              <Text style={styles.modalSubheading}>
                Delivers directly to the lock screens of {analytics.totalStudents} students.
              </Text>

              <TextInput
                style={[styles.modalInput, styles.modalTextArea]}
                value={broadcastMessage}
                onChangeText={setBroadcastMessage}
                placeholder="e.g. Revision alert: Chapter 4 Limit Continuity DPP solutions are uploaded. Test is live on Sunday!"
                placeholderTextColor="#64748B"
                multiline
              />

              <View style={styles.modalActionRow}>
                <TouchableOpacity
                  style={styles.modalCancelBtn}
                  onPress={() => setShowBroadcastModal(false)}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalConfirmBtn}
                  onPress={handleSendBroadcast}
                >
                  <Send color="#FFFFFF" size={16} />
                  <Text style={styles.modalConfirmText}>Send Push Alert</Text>
                </TouchableOpacity>
              </View>
            </GlassCard>
          </View>
        </Modal>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  welcomeSubtitle: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  welcomeTitle: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 2,
    letterSpacing: -0.3,
  },
  aiCopilotBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.35)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    gap: 6,
  },
  aiCopilotText: {
    color: '#10B981',
    fontWeight: '700',
    fontSize: 13,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 10,
    marginBottom: 20,
  },
  statGlassCard: {
    flex: 1,
    minWidth: '46%',
  },
  statContent: {
    padding: 14,
    gap: 4,
  },
  statIconBg: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  statNumber: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '900',
  },
  statLabel: {
    color: '#94A3B8',
    fontSize: 11.5,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  viewAllText: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionGlassCard: {
    flex: 1,
  },
  actionTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 6,
  },
  actionDesc: {
    color: '#64748B',
    fontSize: 11.5,
  },
  courseGlassItem: {
    marginBottom: 10,
  },
  courseHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
  },
  subjectBadgeText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
  },
  studentCountText: {
    color: '#64748B',
    fontSize: 12,
  },
  courseItemTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
    marginVertical: 4,
  },
  courseItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  courseItemMeta: {
    color: '#94A3B8',
    fontSize: 12,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '700',
  },
  taxGlass: {
    marginHorizontal: 16,
    marginBottom: 28,
  },
  taxTitle: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  taxDesc: {
    color: '#64748B',
    fontSize: 12,
    lineHeight: 18,
  },
  supportEmail: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.78)',
    justifyContent: 'center',
    padding: 20,
  },
  modalGlassBox: {
    borderRadius: 22,
  },
  modalHeading: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  modalSubheading: {
    color: '#94A3B8',
    fontSize: 13,
    marginBottom: 14,
  },
  inputGroup: {
    gap: 6,
    marginBottom: 12,
  },
  inputLabel: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '700',
  },
  modalInput: {
    backgroundColor: 'rgba(9, 13, 22, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#F8FAFC',
    fontSize: 13,
  },
  modalTextArea: {
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  modalActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  modalCancelBtn: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#CBD5E1',
    fontWeight: '700',
    fontSize: 14,
  },
  modalConfirmBtn: {
    flex: 2,
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  modalConfirmText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
