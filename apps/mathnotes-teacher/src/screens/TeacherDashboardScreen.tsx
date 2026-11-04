import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert
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
  Send
} from 'lucide-react-native';
import { Course, TeacherAnalytics } from '../shared/types';
import { ApiService } from '../shared/services/apiService';
import { NotificationService } from '../shared/services/notificationService';

export const TeacherDashboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [showLiveModal, setShowLiveModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

  // Live session fields
  const [liveTopic, setLiveTopic] = useState('JEE Advanced King\'s Property Deep-Dive');
  const [liveTime, setLiveTime] = useState('Tomorrow, 6:00 PM IST');
  const [liveLink, setLiveLink] = useState('https://mathnotes.courses/live/jee-batch-1');

  // Broadcast fields
  const [broadcastMessage, setBroadcastMessage] = useState('');

  const api = ApiService.getInstance();

  const analytics: TeacherAnalytics = {
    totalStudents: 1420,
    activeCourses: 4,
    totalEarnings: 184500, // In INR
    monthlyRevenue: 46200, // In INR
    averageRating: 4.94,
    pendingReviewsCount: 12,
    unansweredQuestionsCount: 2,
    allIndiaTopRankersCount: 18,
  };

  useEffect(() => {
    api.getCourses().then(data => setCourses(data));
  }, []);

  const handleScheduleLiveClass = () => {
    if (!liveTopic.trim()) return;
    setShowLiveModal(false);

    // Send Push Notification to all enrolled students
    NotificationService.getInstance().sendPushNotification({
      title: `ðŸ”´ Live Class Scheduled: ${liveTopic}`,
      body: `Join Mentor Vikramaditya live on ${liveTime}. Click to add to your calendar!`,
      data: { liveLink }
    });

    Alert.alert(
      'Live Session Broadcasted! ðŸš€',
      `Push alert sent to ${analytics.totalStudents} enrolled students for "${liveTopic}" at ${liveTime}.`
    );
  };

  const handleSendBroadcast = () => {
    if (!broadcastMessage.trim()) return;
    setShowBroadcastModal(false);

    NotificationService.getInstance().sendPushNotification({
      title: 'ðŸ“¢ Announcement from Instructor',
      body: broadcastMessage,
      data: { type: 'batch_announcement' }
    });

    setBroadcastMessage('');
    Alert.alert(
      'Broadcast Sent!',
      `Your announcement was delivered to all ${analytics.totalStudents} active students.`
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Banner */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeSubtitle}>Educator Portal â€¢ Mathnotes India 2026</Text>
          <Text style={styles.welcomeTitle}>Welcome back, Mentor</Text>
        </View>
        <TouchableOpacity
          style={styles.aiCopilotBtn}
          onPress={() => navigation.navigate('TeachersAI')}
        >
          <Sparkles color="#10B981" size={18} />
          <Text style={styles.aiCopilotText}>Teachers AI</Text>
        </TouchableOpacity>
      </View>

      {/* KPI Stats Grid (Indian Rupees & Performance) */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={[styles.statIconBg, { backgroundColor: 'rgba(56, 189, 248, 0.15)' }]}>
            <Users color="#38BDF8" size={20} />
          </View>
          <Text style={styles.statNumber}>{analytics.totalStudents}</Text>
          <Text style={styles.statLabel}>Enrolled Students</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIconBg, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
            <IndianRupee color="#10B981" size={20} />
          </View>
          <Text style={styles.statNumber}>â‚¹{(analytics.monthlyRevenue / 1000).toFixed(1)}k</Text>
          <Text style={styles.statLabel}>This Month (Net)</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIconBg, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
            <Star color="#F59E0B" size={20} fill="#F59E0B" />
          </View>
          <Text style={styles.statNumber}>{analytics.averageRating}</Text>
          <Text style={styles.statLabel}>Avg Rating</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIconBg, { backgroundColor: 'rgba(168, 85, 247, 0.15)' }]}>
            <BookOpen color="#A855F7" size={20} />
          </View>
          <Text style={styles.statNumber}>{analytics.activeCourses}</Text>
          <Text style={styles.statLabel}>Live Courses</Text>
        </View>
      </View>

      {/* Educator Operations Action Row */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Live Operations & Batch Management</Text>
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => setShowLiveModal(true)}
          >
            <Video color="#EF4444" size={22} />
            <Text style={styles.actionTitle}>Schedule Live</Text>
            <Text style={styles.actionDesc}>Host Zoom / Jitsi class</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => setShowBroadcastModal(true)}
          >
            <Bell color="#F59E0B" size={22} />
            <Text style={styles.actionTitle}>Push Broadcast</Text>
            <Text style={styles.actionDesc}>Alert batch students</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Curriculum & Course Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Curriculum Synthesis</Text>
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('TeachersAI')}
          >
            <Sparkles color="#10B981" size={22} />
            <Text style={styles.actionTitle}>Curriculum AI</Text>
            <Text style={styles.actionDesc}>Auto-generate JEE/UPSC tests</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('MyCourses')}
          >
            <PlusCircle color="#38BDF8" size={22} />
            <Text style={styles.actionTitle}>New Course</Text>
            <Text style={styles.actionDesc}>Publish modular lessons</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Course Performance List */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Active Courses</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MyCourses')}>
            <Text style={styles.viewAllText}>Manage All</Text>
          </TouchableOpacity>
        </View>

        {courses.map(course => (
          <View key={course.id} style={styles.courseItem}>
            <View style={styles.courseHeaderRow}>
              <View style={styles.subjectBadge}>
                <Text style={styles.subjectBadgeText}>{course.subject}</Text>
              </View>
              <Text style={styles.studentCountText}>{course.enrolledCount} enrolled</Text>
            </View>
            <Text style={styles.courseItemTitle}>{course.title}</Text>
            <View style={styles.courseItemFooter}>
              <Text style={styles.courseItemMeta}>{course.totalLessons} Lessons â€¢ {course.totalQuizzes} Mock CBTs</Text>
              <View style={styles.ratingBadge}>
                <Star color="#F59E0B" size={13} fill="#F59E0B" />
                <Text style={styles.ratingText}>{course.rating}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Payout & Financials Summary (India Tax Compliant) */}
      <View style={styles.taxCard}>
        <Text style={styles.taxTitle}>ðŸ‡®ðŸ‡³ Indian Taxation & Payout Summary</Text>
        <Text style={styles.taxDesc}>
          Compliant with Section 194-O (1% TDS deducted and filed against PAN). Payouts are credited directly to your verified UPI/NEFT account on the 1st of every month.
        </Text>
        <Text style={styles.supportEmail}>Inquiries: teachers@mathnotes.courses</Text>
      </View>

      {/* Schedule Live Class Modal */}
      <Modal visible={showLiveModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
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
              <Text style={styles.inputLabel}>Date & Time (IST)</Text>
              <TextInput
                style={styles.modalInput}
                value={liveTime}
                onChangeText={setLiveTime}
                placeholder="e.g. Tomorrow 6:00 PM IST"
                placeholderTextColor="#64748B"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Live Stream / Meeting Link</Text>
              <TextInput
                style={styles.modalInput}
                value={liveLink}
                onChangeText={setLiveLink}
                placeholder="Zoom, Google Meet, or Jitsi URL"
                placeholderTextColor="#64748B"
              />
            </View>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowLiveModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSubmitBtn}
                onPress={handleScheduleLiveClass}
              >
                <Calendar color="#FFFFFF" size={16} />
                <Text style={styles.modalSubmitText}>Broadcast to Batch</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Push Broadcast Modal */}
      <Modal visible={showBroadcastModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalHeading}>Send Batch Broadcast Push Alert</Text>
            <Text style={styles.modalSubheading}>
              Directly delivers a push notification to all {analytics.totalStudents} enrolled students.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Announcement Message</Text>
              <TextInput
                style={[styles.modalInput, { height: 90, textAlignVertical: 'top' }]}
                value={broadcastMessage}
                onChangeText={setBroadcastMessage}
                placeholder="e.g. Reminder: Sunday National CBT Mock starts at 10 AM. Revise Taylor Series!"
                placeholderTextColor="#64748B"
                multiline
              />
            </View>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowBroadcastModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSubmitBtn, !broadcastMessage.trim() && { opacity: 0.5 }]}
                onPress={handleSendBroadcast}
                disabled={!broadcastMessage.trim()}
              >
                <Send color="#FFFFFF" size={16} />
                <Text style={styles.modalSubmitText}>Send Push Alert</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090D16',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 14,
  },
  welcomeSubtitle: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '700',
  },
  welcomeTitle: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 2,
  },
  aiCopilotBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  aiCopilotText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '800',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
    marginTop: 6,
  },
  statCard: {
    flex: 1,
    minWidth: '46%',
    backgroundColor: '#131B2E',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    gap: 4,
  },
  statIconBg: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statNumber: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '800',
  },
  statLabel: {
    color: '#94A3B8',
    fontSize: 12,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 22,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '800',
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
  actionCard: {
    flex: 1,
    backgroundColor: '#131B2E',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    gap: 4,
  },
  actionTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  actionDesc: {
    color: '#94A3B8',
    fontSize: 11,
  },
  courseItem: {
    backgroundColor: '#131B2E',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    gap: 8,
  },
  courseHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  subjectBadgeText: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '800',
  },
  studentCountText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  courseItemTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
  },
  courseItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courseItemMeta: {
    color: '#94A3B8',
    fontSize: 11,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: '700',
  },
  taxCard: {
    margin: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    gap: 8,
    marginBottom: 40,
  },
  taxTitle: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '800',
  },
  taxDesc: {
    color: '#CBD5E1',
    fontSize: 12,
    lineHeight: 18,
  },
  supportEmail: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    padding: 20,
  },
  modalBox: {
    backgroundColor: '#131B2E',
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: '#1E293B',
    gap: 14,
  },
  modalHeading: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '800',
  },
  modalSubheading: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 18,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '600',
  },
  modalInput: {
    backgroundColor: '#090D16',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 10,
    padding: 12,
    color: '#F8FAFC',
    fontSize: 13,
  },
  modalBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 6,
  },
  modalCancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  modalCancelText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '700',
  },
  modalSubmitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  modalSubmitText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});

