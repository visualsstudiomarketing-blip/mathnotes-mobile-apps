import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { BookOpen, Sparkles, Award, ArrowRight, Star, Clock } from 'lucide-react-native';
import { ApiService } from '../../../../shared/services/apiService';
import { Course } from '../../../../shared/types';

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const api = ApiService.getInstance();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await api.getCourses();
        setCourses(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Banner */}
      <View style={styles.heroCard}>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>CONCEPTUAL MASTERY</Text>
          </View>
        </View>
        <Text style={styles.heroTitle}>Learn. Practice. Understand. Achieve.</Text>
        <Text style={styles.heroSubtitle}>
          Master complex mathematics from first principles. Visual derivations, deliberate practice, and 24/7 AI mentoring.
        </Text>
        <TouchableOpacity
          style={styles.heroCTA}
          onPress={() => navigation.navigate('MathNotesAI')}
        >
          <Sparkles color="#FFFFFF" size={18} />
          <Text style={styles.heroCTAText}>Ask MathNotes AI Mentor</Text>
        </TouchableOpacity>
      </View>

      {/* 4 Pillars Highlight */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>The 4-Pillar Pedagogical System</Text>
        <View style={styles.pillarsGrid}>
          <View style={styles.pillarItem}>
            <Text style={styles.pillarNumber}>01</Text>
            <Text style={styles.pillarName}>Learn</Text>
            <Text style={styles.pillarDesc}>Visual intuition before mechanical equations</Text>
          </View>
          <View style={styles.pillarItem}>
            <Text style={styles.pillarNumber}>02</Text>
            <Text style={styles.pillarName}>Practice</Text>
            <Text style={styles.pillarDesc}>Deliberate, multi-variation problem solving</Text>
          </View>
          <View style={styles.pillarItem}>
            <Text style={styles.pillarNumber}>03</Text>
            <Text style={styles.pillarName}>Understand</Text>
            <Text style={styles.pillarDesc}>Feynman explanations & error analysis</Text>
          </View>
          <View style={styles.pillarItem}>
            <Text style={styles.pillarNumber}>04</Text>
            <Text style={styles.pillarName}>Achieve</Text>
            <Text style={styles.pillarDesc}>Exam resilience & analytical thinking</Text>
          </View>
        </View>
      </View>

      {/* Featured Courses */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Courses</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Catalog')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#38BDF8" style={{ marginTop: 20 }} />
        ) : (
          courses.map(course => (
            <TouchableOpacity
              key={course.id}
              style={styles.courseCard}
              onPress={() => navigation.navigate('CourseDetail', { courseId: course.id })}
            >
              <Image source={{ uri: course.thumbnailUrl }} style={styles.thumbnail} />
              <View style={styles.courseContent}>
                <View style={styles.subjectTag}>
                  <Text style={styles.subjectTagText}>{course.subject}</Text>
                </View>
                <Text style={styles.courseTitle} numberOfLines={2}>
                  {course.title}
                </Text>
                <Text style={styles.courseExcerpt} numberOfLines={2}>
                  {course.excerpt}
                </Text>
                <View style={styles.courseMeta}>
                  <View style={styles.metaItem}>
                    <Star color="#F59E0B" size={14} fill="#F59E0B" />
                    <Text style={styles.metaText}>{course.rating}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Clock color="#94A3B8" size={14} />
                    <Text style={styles.metaText}>{course.duration}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <BookOpen color="#94A3B8" size={14} />
                    <Text style={styles.metaText}>{course.totalLessons} Lessons</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  heroCard: {
    margin: 16,
    padding: 24,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  badge: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  badgeText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#F8FAFC',
    lineHeight: 32,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 22,
    marginBottom: 18,
  },
  heroCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    gap: 8,
  },
  heroCTAText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 14,
  },
  viewAllText: {
    color: '#38BDF8',
    fontWeight: '600',
    fontSize: 14,
  },
  pillarsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  pillarItem: {
    width: '48%',
    backgroundColor: '#1E293B',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  pillarNumber: {
    fontSize: 12,
    fontWeight: '800',
    color: '#38BDF8',
    marginBottom: 4,
  },
  pillarName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  pillarDesc: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 16,
  },
  courseCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  thumbnail: {
    width: '100%',
    height: 160,
  },
  courseContent: {
    padding: 16,
  },
  subjectTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  subjectTagText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '600',
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 6,
  },
  courseExcerpt: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 18,
    marginBottom: 12,
  },
  courseMeta: {
    flexDirection: 'row',
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '500',
  },
});
