import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { Search, Star, Clock, BookOpen, Filter } from 'lucide-react-native';
import { Course } from '../../../../shared/types';
import { ApiService } from '../../../../shared/services/apiService';

const SUBJECTS = ['All', 'Calculus', 'Algebra', 'Coordinate Geometry', 'IIT-JEE'];

export const CourseCatalogScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const api = ApiService.getInstance();

  useEffect(() => {
    api.getCourses().then(data => {
      setCourses(data);
      setLoading(false);
    });
  }, []);

  const filteredCourses = courses.filter(c => {
    const matchesSubject = selectedSubject === 'All' || c.subject === selectedSubject;
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchBarContainer}>
        <Search color="#64748B" size={18} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search topics, proofs, or subjects..."
          placeholderTextColor="#64748B"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterList}
      >
        {SUBJECTS.map(subj => {
          const isSelected = selectedSubject === subj;
          return (
            <TouchableOpacity
              key={subj}
              style={[styles.filterChip, isSelected && styles.filterChipActive]}
              onPress={() => setSelectedSubject(subj)}
            >
              <Text style={[styles.filterText, isSelected && styles.filterTextActive]}>
                {subj}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Course List */}
      <ScrollView contentContainerStyle={styles.courseList} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color="#38BDF8" style={{ marginTop: 40 }} />
        ) : filteredCourses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No matching courses found</Text>
            <Text style={styles.emptySubtitle}>Try searching for Calculus, Vectors, or Polynomials</Text>
          </View>
        ) : (
          filteredCourses.map(course => (
            <TouchableOpacity
              key={course.id}
              style={styles.card}
              onPress={() => navigation.navigate('CourseDetail', { courseId: course.id })}
            >
              <Image source={{ uri: course.thumbnailUrl }} style={styles.thumbnail} />
              <View style={styles.cardBody}>
                <View style={styles.badgeRow}>
                  <Text style={styles.subjectBadge}>{course.subject}</Text>
                  <Text style={styles.freeBadge}>Free Access</Text>
                </View>
                <Text style={styles.title} numberOfLines={2}>{course.title}</Text>
                <Text style={styles.excerpt} numberOfLines={2}>{course.excerpt}</Text>
                
                <View style={styles.footerRow}>
                  <View style={styles.metaPair}>
                    <Star color="#F59E0B" size={13} fill="#F59E0B" />
                    <Text style={styles.metaVal}>{course.rating}</Text>
                  </View>
                  <View style={styles.metaPair}>
                    <BookOpen color="#94A3B8" size={13} />
                    <Text style={styles.metaVal}>{course.totalLessons} Lessons</Text>
                  </View>
                  <View style={styles.metaPair}>
                    <Clock color="#94A3B8" size={13} />
                    <Text style={styles.metaVal}>{course.duration}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 14,
    marginHorizontal: 16,
    marginTop: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 14,
    paddingVertical: 12,
  },
  filterList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  filterChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#38BDF8',
  },
  filterText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  courseList: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 16,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
  },
  thumbnail: {
    width: '100%',
    height: 150,
  },
  cardBody: {
    padding: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  subjectBadge: {
    backgroundColor: '#0F172A',
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  freeBadge: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  excerpt: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 10,
  },
  metaPair: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaVal: {
    color: '#94A3B8',
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
  },
  emptySubtitle: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 4,
  },
});
