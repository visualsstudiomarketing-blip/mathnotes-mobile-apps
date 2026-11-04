import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert
} from 'react-native';
import { Users, Award, TrendingUp, Bell, CheckCircle, Search, Filter } from 'lucide-react-native';
import { NotificationService } from '../shared/services/notificationService';

export const StudentAnalyticsScreen: React.FC = () => {
  const [search, setSearch] = useState('');
  const [students, setStudents] = useState([
    { id: 1, name: 'Vikram', email: 'student@mathnotes.courses', course: 'Calculus I: Intuitive Foundations', progress: 68, quizScore: 100, lastActive: '10m ago', track: 'IIT-JEE' },
    { id: 2, name: 'Aarav Sharma', email: 'aarav@gmail.com', course: 'Mathematics of AI: Neural Networks', progress: 42, quizScore: 85, lastActive: '2h ago', track: 'AI & Python' },
    { id: 3, name: 'Priya Patel', email: 'priya@gmail.com', course: 'UPSC CSAT 2026: Quantitative Aptitude', progress: 91, quizScore: 95, lastActive: '1d ago', track: 'UPSC CSAT' },
    { id: 4, name: 'Rohan Gupta', email: 'rohan.g@gmail.com', course: 'Calculus I: Intuitive Foundations', progress: 24, quizScore: 60, lastActive: '3d ago', track: 'IIT-JEE' },
  ]);

  const handleSendReminder = (studentName: string, courseTitle: string) => {
    NotificationService.getInstance().sendPushNotification(
      NotificationService.buildQuizDeadlineAlert(courseTitle, 'Next Checkpoint Quiz', 24)
    );
    Alert.alert(
      'Study Nudge Dispatched! 🔔',
      `Expo Push Notification reminder sent to ${studentName} for "${courseTitle}".`
    );
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.course.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Learner Analytics & Retention</Text>
        <Text style={styles.headerSub}>Monitor engagement, quiz pass rates & send reminders</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBox}>
        <Search color="#64748B" size={16} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search students by name or course..."
          placeholderTextColor="#64748B"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {filteredStudents.map(s => (
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
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131B2E',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 13,
    paddingVertical: 10,
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
    backgroundColor: '#10B981',
    borderRadius: 3,
  },
  nudgeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E293B',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  nudgeBtnText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '700',
  },
});
