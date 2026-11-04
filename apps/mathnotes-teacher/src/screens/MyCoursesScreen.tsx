import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Linking
} from 'react-native';
import {
  Plus,
  Users,
  BookOpen,
  Star,
  Edit3,
  ExternalLink,
  Filter,
  CheckCircle,
  FileText,
  Sparkles
} from 'lucide-react-native';
import { ApiService } from '../shared/services/apiService';

export const MyCoursesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [courses, setCourses] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'publish' | 'draft'>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const api = ApiService.getInstance();

  const fetchCourses = async () => {
    try {
      const data = await api.getTeacherCourses();
      setCourses(data);
    } catch (e) {
      console.warn('Failed to fetch courses:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCourses();
  };

  const filteredCourses = courses.filter(c => {
    if (filter === 'all') return true;
    return (c.status || 'publish') === filter;
  });

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Curriculum Management</Text>
          <Text style={styles.headerSub}>Manage modular courses, topics & DPPs</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('CreateCourse')}
        >
          <Plus color="#FFFFFF" size={16} />
          <Text style={styles.addBtnText}>New Course</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterBar}>
        {[
          { key: 'all', label: `All (${courses.length})` },
          { key: 'publish', label: `Published (${courses.filter(c => c.status === 'publish').length})` },
          { key: 'draft', label: `Drafts (${courses.filter(c => c.status === 'draft').length})` }
        ].map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.filterChip, filter === tab.key && styles.filterChipActive]}
            onPress={() => setFilter(tab.key as any)}
          >
            <Text style={[styles.filterChipText, filter === tab.key && styles.filterChipTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#10B981" size="large" />
          <Text style={styles.loadingText}>Syncing with Tutor LMS...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10B981" />}
        >
          {filteredCourses.map(course => {
            const isDraft = course.status === 'draft';
            return (
              <View key={course.id} style={[styles.courseCard, isDraft && styles.courseCardDraft]}>
                <View style={styles.badgeRow}>
                  <View style={styles.subjectBadge}>
                    <Text style={styles.subjectBadgeText}>{course.subject || 'IIT-JEE'}</Text>
                  </View>
                  <View style={[styles.statusBadge, isDraft ? styles.statusDraft : styles.statusPublish]}>
                    <Text style={[styles.statusBadgeText, isDraft ? styles.statusDraftText : styles.statusPublishText]}>
                      {isDraft ? 'Draft • In Progress' : 'Live • Tutor LMS'}
                    </Text>
                  </View>
                </View>

                <Text style={styles.title}>{course.title}</Text>
                <Text style={styles.excerpt} numberOfLines={2}>
                  {course.excerpt || 'Pedagogical curriculum calibrated for active concept mastery and first-principles derivations.'}
                </Text>

                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Users color="#38BDF8" size={14} />
                    <Text style={styles.statText}>{course.enrolledCount || 0} Students</Text>
                  </View>
                  <View style={styles.statItem}>
                    <BookOpen color="#10B981" size={14} />
                    <Text style={styles.statText}>{course.totalLessons || 12} Lessons</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Star color="#F59E0B" size={14} fill="#F59E0B" />
                    <Text style={styles.statText}>{course.rating || '4.9'}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.priceTag}>
                      {course.isFree || !course.price ? 'Free' : `₹${course.price}`}
                    </Text>
                  </View>
                </View>

                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => navigation.navigate('CreateCourse', {
                      title: course.title,
                      subject: course.subject,
                      description: course.excerpt
                    })}
                  >
                    <Edit3 color="#E2E8F0" size={14} />
                    <Text style={styles.editBtnText}>Edit Curriculum</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.aiAssistBtn}
                    onPress={() => navigation.navigate('TeachersAI')}
                  >
                    <Sparkles color="#10B981" size={14} />
                    <Text style={styles.aiAssistBtnText}>AI Quiz</Text>
                  </TouchableOpacity>

                  {course.editUrl && (
                    <TouchableOpacity
                      style={styles.webBtn}
                      onPress={() => Linking.openURL(course.editUrl)}
                    >
                      <ExternalLink color="#64748B" size={14} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
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
    backgroundColor: '#10B981',
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
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#131B2E',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  filterChipActive: {
    backgroundColor: '#059669',
    borderColor: '#10B981',
  },
  filterChipText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#94A3B8',
    fontSize: 13,
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
    gap: 10,
  },
  courseCardDraft: {
    borderColor: '#334155',
    backgroundColor: '#0f172a',
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectBadge: {
    backgroundColor: '#090D16',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  subjectBadgeText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusPublish: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  statusPublishText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700',
  },
  statusDraft: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  statusDraftText: {
    color: '#F59E0B',
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
  },
  excerpt: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    color: '#94A3B8',
    fontSize: 12,
  },
  priceTag: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '800',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
    fontSize: 13,
    fontWeight: '600',
  },
  aiAssistBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 5,
  },
  aiAssistBtnText: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '700',
  },
  webBtn: {
    backgroundColor: '#1E293B',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
