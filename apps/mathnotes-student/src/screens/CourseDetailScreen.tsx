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
import {
  PlayCircle,
  HelpCircle,
  CheckCircle,
  Sparkles,
  Star,
  Users,
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react-native';
import { Course, CourseTopic, Lesson } from '../shared/types';
import { ApiService } from '../shared/services/apiService';

export const CourseDetailScreen: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation
}) => {
  const { courseId } = route.params || { courseId: 739 };
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedTopics, setExpandedTopics] = useState<Record<number, boolean>>({ 1: true });
  const api = ApiService.getInstance();

  useEffect(() => {
    api.getCourseById(courseId).then(data => {
      setCourse(data);
      setLoading(false);
    });
  }, [courseId]);

  const toggleTopic = (id: number) => {
    setExpandedTopics(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading || !course) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#38BDF8" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Course Banner */}
        <Image source={{ uri: course.thumbnailUrl }} style={styles.banner} />

        <View style={styles.body}>
          <View style={styles.badgeRow}>
            <Text style={styles.subjectBadge}>{course.subject}</Text>
            <View style={styles.ratingBadge}>
              <Star color="#F59E0B" size={13} fill="#F59E0B" />
              <Text style={styles.ratingText}>{course.rating} ({course.reviewsCount} reviews)</Text>
            </View>
          </View>

          <Text style={styles.title}>{course.title}</Text>
          <Text style={styles.description}>{course.excerpt}</Text>

          {/* Quick Metrics */}
          <View style={styles.statsCard}>
            <View style={styles.statCol}>
              <Clock color="#38BDF8" size={16} />
              <Text style={styles.statVal}>{course.duration}</Text>
              <Text style={styles.statLabel}>Duration</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <PlayCircle color="#10B981" size={16} />
              <Text style={styles.statVal}>{course.totalLessons}</Text>
              <Text style={styles.statLabel}>Lessons</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Users color="#F59E0B" size={16} />
              <Text style={styles.statVal}>{course.enrolledCount}</Text>
              <Text style={styles.statLabel}>Enrolled</Text>
            </View>
          </View>

          {/* AI Doubt Clearer Promo */}
          <TouchableOpacity
            style={styles.aiHelpCard}
            onPress={() => navigation.navigate('MathNotesAI')}
          >
            <Sparkles color="#38BDF8" size={20} />
            <View style={{ flex: 1 }}>
              <Text style={styles.aiHelpTitle}>Have Doubts in this Course?</Text>
              <Text style={styles.aiHelpDesc}>Ask MathNotes AI for instant visual proofs and step-by-step guidance.</Text>
            </View>
          </TouchableOpacity>

          {/* Curriculum Accordion */}
          <View style={styles.curriculumSection}>
            <Text style={styles.sectionTitle}>Course Curriculum</Text>
            
            {course.topics && course.topics.map((topic: CourseTopic) => {
              const isExpanded = !!expandedTopics[topic.id];
              return (
                <View key={topic.id} style={styles.topicCard}>
                  <TouchableOpacity
                    style={styles.topicHeader}
                    onPress={() => toggleTopic(topic.id)}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.topicTitle}>{topic.title}</Text>
                      <Text style={styles.topicMeta}>{topic.lessons.length} Lessons â€¢ 1 Quiz</Text>
                    </View>
                    {isExpanded ? (
                      <ChevronUp color="#94A3B8" size={18} />
                    ) : (
                      <ChevronDown color="#94A3B8" size={18} />
                    )}
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={styles.lessonsList}>
                      {topic.lessons.map((lesson: Lesson) => (
                        <TouchableOpacity
                          key={lesson.id}
                          style={styles.lessonRow}
                          onPress={() => navigation.navigate('LessonViewer', { lesson, courseTitle: course.title })}
                        >
                          <PlayCircle color="#38BDF8" size={16} />
                          <View style={{ flex: 1 }}>
                            <Text style={styles.lessonTitle}>{lesson.title}</Text>
                            <Text style={styles.lessonDuration}>{lesson.duration}</Text>
                          </View>
                          {lesson.isCompleted && (
                            <CheckCircle color="#10B981" size={16} />
                          )}
                        </TouchableOpacity>
                      ))}

                      {/* Quizzes */}
                      {topic.quizzes && topic.quizzes.map(quiz => (
                        <TouchableOpacity
                          key={quiz.id}
                          style={[styles.lessonRow, styles.quizRow]}
                          onPress={() => navigation.navigate('Quiz', { quiz, courseTitle: course.title })}
                        >
                          <HelpCircle color="#F59E0B" size={16} />
                          <View style={{ flex: 1 }}>
                            <Text style={styles.quizTitle}>Quiz: {quiz.title}</Text>
                            <Text style={styles.quizMeta}>{quiz.questionsCount} Questions â€¢ Checkpoint</Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Floating CTA with Razorpay Payment Support */}
      <View style={styles.ctaBar}>
        <View>
          <Text style={styles.ctaPrice}>
            {course.isFree || !course.price ? '100% Free' : `â‚¹${course.price}`}
          </Text>
          <Text style={styles.ctaGuarantee}>
            {course.isFree || !course.price ? 'Full Lifetime Access' : 'Inclusive of 18% GST â€¢ 7-Day Guarantee'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.enrollBtn}
          onPress={() => {
            if (!course.isFree && course.price > 0) {
              navigation.navigate('Checkout', { course });
            } else {
              const firstLesson = course.topics?.[0]?.lessons?.[0];
              if (firstLesson) {
                navigation.navigate('LessonViewer', { lesson: firstLesson, courseTitle: course.title });
              }
            }
          }}
        >
          <Text style={styles.enrollBtnText}>
            {!course.isFree && course.price > 0 ? 'Enroll Now (UPI / Cards)' : 'Start Learning Free'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 90,
  },
  banner: {
    width: '100%',
    height: 200,
  },
  body: {
    padding: 18,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  subjectBadge: {
    backgroundColor: '#1E293B',
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    color: '#94A3B8',
    fontSize: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F8FAFC',
    lineHeight: 28,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
    marginBottom: 18,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 18,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statCol: {
    alignItems: 'center',
    gap: 4,
  },
  statVal: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
  statLabel: {
    color: '#64748B',
    fontSize: 11,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#334155',
  },
  aiHelpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    borderRadius: 16,
    padding: 14,
    gap: 12,
    marginBottom: 24,
  },
  aiHelpTitle: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '700',
  },
  aiHelpDesc: {
    color: '#CBD5E1',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
  },
  curriculumSection: {
    gap: 12,
  },
  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  topicCard: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
  },
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  topicTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
  topicMeta: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  lessonsList: {
    borderTopWidth: 1,
    borderTopColor: '#334155',
    backgroundColor: '#162032',
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  quizRow: {
    backgroundColor: 'rgba(245, 158, 11, 0.05)',
  },
  lessonTitle: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '600',
  },
  lessonDuration: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
  },
  quizTitle: {
    color: '#FCD34D',
    fontSize: 13,
    fontWeight: '600',
  },
  quizMeta: {
    color: '#94A3B8',
    fontSize: 11,
  },
  ctaBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0F172A',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ctaPrice: {
    color: '#10B981',
    fontSize: 18,
    fontWeight: '800',
  },
  ctaGuarantee: {
    color: '#64748B',
    fontSize: 11,
  },
  enrollBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 14,
  },
  enrollBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

