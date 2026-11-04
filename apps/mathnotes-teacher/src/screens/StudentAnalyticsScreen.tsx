import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { Users, Award, TrendingUp, Bell, CheckCircle } from 'lucide-react-native';
import { NotificationService } from '../../../../shared/services/notificationService';

export const StudentAnalyticsScreen: React.FC = () => {
  const [students, setStudents] = useState([
    { id: 1, name: 'Vikram', email: 'student@mathnotes.courses', course: 'Calculus I', progress: 68, quizScore: 100, lastActive: '10m ago' },
    { id: 2, name: 'Aarav Sharma', email: 'aarav@gmail.com', course: 'Algebra Mastery', progress: 42, quizScore: 85, lastActive: '2h ago' },
    { id: 3, name: 'Priya Patel', email: 'priya@gmail.com', course: 'Vectors & 3D', progress: 91, quizScore: 95, lastActive: '1d ago' },
  ]);

  const handleSendReminder = (studentName: string, courseTitle: string) => {
    NotificationService.getInstance().sendPushNotification(
      NotificationService.buildQuizDeadlineAlert(courseTitle, 'Next Checkpoint Quiz', 24)
    );
    alert(`Expo Push Reminder dispatched to ${studentName}!`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Learner Analytics & Retention</Text>
        <Text style={styles.headerSub}>Monitor engagement, quiz pass rates & send reminders</Text>
      </View>

      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {students.map(s => (
          <View key={s.id} style={styles.studentCard}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.name}>{s.name}</Text>
                <Text style={styles.meta}>{s.course} • Active {s.lastActive}</Text>
              </View>
              <View style={styles.scoreBadge}>
                <Award color="#10B981" size={13} />
                <Text style={styles.scoreText}>{s.quizScore}% Quiz</Text>
              </View>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressTextRow}>
                <Text style={styles.progressLabel}>Course Completion</Text>
                <Text style={styles.progressVal}>{s.progress}%</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${s.progress}%` }]} />
              </View>
            </View>

            <TouchableOpacity
              style={styles.nudgeBtn}
              onPress={() => handleSendReminder(s.name, s.course)}
            >
              <Bell color="#10B981" size={14} />
              <Text style={styles.nudgeBtnText}>Send Study Nudge Push Alert</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090D16',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  headerTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '800',
  },
  headerSub: {
    color: '#94A3B8',
    fontSize: 12,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  studentCard: {
    backgroundColor: '#131B2E',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
  },
  meta: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  scoreText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700',
  },
  progressContainer: {
    gap: 6,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    color: '#94A3B8',
    fontSize: 11,
  },
  progressVal: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#090D16',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#38BDF8',
  },
  nudgeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: 10,
    paddingVertical: 8,
    gap: 6,
  },
  nudgeBtnText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '700',
  },
});
