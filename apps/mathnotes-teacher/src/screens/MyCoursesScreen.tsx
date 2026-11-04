import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { Plus, Users, BookOpen, Star, MoreVertical, Edit, FileText } from 'lucide-react-native';
import { Course } from '../shared/types';
import { ApiService } from '../shared/services/apiService';

export const MyCoursesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const api = ApiService.getInstance();

  useEffect(() => {
    api.getCourses().then(data => setCourses(data));
  }, []);

  return (
    <View style={styles.container}>
      {/* Top Action */}
      <View style={styles.header}>
        <div>
          <Text style={styles.headerTitle}>Curriculum Management</Text>
          <Text style={styles.headerSub}>Manage your modular courses & topics</Text>
        </div>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('TeachersAI')}
        >
          <Plus color="#FFFFFF" size={16} />
          <Text style={styles.addBtnText}>AI Course Builder</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {courses.map(course => (
          <View key={course.id} style={styles.courseCard}>
            <View style={styles.badgeRow}>
              <Text style={styles.subjectBadge}>{course.subject}</Text>
              <Text style={styles.activeBadge}>Live â€¢ Tutor LMS</Text>
            </View>

            <Text style={styles.title}>{course.title}</Text>
            <Text style={styles.excerpt} numberOfLines={2}>{course.excerpt}</Text>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Users color="#38BDF8" size={14} />
                <Text style={styles.statText}>{course.enrolledCount} Students</Text>
              </View>
              <View style={styles.statItem}>
                <BookOpen color="#10B981" size={14} />
                <Text style={styles.statText}>{course.totalLessons} Lessons</Text>
              </View>
              <View style={styles.statItem}>
                <Star color="#F59E0B" size={14} fill="#F59E0B" />
                <Text style={styles.statText}>{course.rating}</Text>
              </View>
            </View>

            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => navigation.navigate('TeachersAI')}
              >
                <Edit color="#E2E8F0" size={14} />
                <Text style={styles.editBtnText}>Edit Curriculum</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quizBtn}
                onPress={() => navigation.navigate('TeachersAI')}
              >
                <FileText color="#10B981" size={14} />
                <Text style={styles.quizBtnText}>AI Quiz Creator</Text>
              </TouchableOpacity>
            </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 32,
  },
  courseCard: {
    backgroundColor: '#131B2E',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    gap: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectBadge: {
    backgroundColor: '#090D16',
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  activeBadge: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  excerpt: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#1E293B',
    marginTop: 4,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    color: '#CBD5E1',
    fontSize: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  editBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E293B',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  editBtnText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '600',
  },
  quizBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: '#10B981',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  quizBtnText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '700',
  },
});

