import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import {
  Play,
  Pause,
  CheckCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  FileText
} from 'lucide-react-native';
import { Lesson } from '../../../../shared/types';
import { ApiService } from '../../../../shared/services/apiService';

export const LessonViewerScreen: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation
}) => {
  const { lesson, courseTitle } = route.params || {};
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(lesson?.isCompleted || false);
  const [completing, setCompleting] = useState(false);
  const api = ApiService.getInstance();

  const handleMarkComplete = async () => {
    if (!lesson) return;
    setCompleting(true);
    try {
      await api.markLessonComplete(lesson.id);
      setIsCompleted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setCompleting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Video Player Simulator */}
      <View style={styles.videoPlayer}>
        <View style={styles.videoOverlay}>
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <Pause color="#FFFFFF" size={24} />
            ) : (
              <Play color="#FFFFFF" size={24} style={{ marginLeft: 3 }} />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.videoControls}>
          <Text style={styles.timeText}>{isPlaying ? '04:12' : '00:00'} / {lesson?.duration || '15:00'}</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: isPlaying ? '28%' : '0%' }]} />
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Title & Metadata */}
        <View style={styles.metaHeader}>
          <Text style={styles.courseName}>{courseTitle}</Text>
          <Text style={styles.lessonTitle}>{lesson?.title || 'Lesson Title'}</Text>
        </View>

        {/* Content & Conceptual Notes */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <FileText color="#38BDF8" size={16} />
            <Text style={styles.cardHeaderText}>First-Principles Lecture Notes</Text>
          </View>
          <Text style={styles.contentText}>
            {lesson?.content || 'No text content available.'}
          </Text>
        </View>

        {/* Ask AI Doubt Button */}
        <TouchableOpacity
          style={styles.aiButton}
          onPress={() => navigation.navigate('MathNotesAI')}
        >
          <Sparkles color="#38BDF8" size={18} />
          <Text style={styles.aiButtonText}>
            Stuck on this proof? Ask MathNotes AI
          </Text>
        </TouchableOpacity>

        {/* Action Controls */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.completeButton, isCompleted && styles.completedButton]}
            onPress={handleMarkComplete}
            disabled={completing || isCompleted}
          >
            {completing ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : isCompleted ? (
              <>
                <CheckCircle color="#FFFFFF" size={18} />
                <Text style={styles.buttonText}>Completed</Text>
              </>
            ) : (
              <Text style={styles.buttonText}>Mark as Complete</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  videoPlayer: {
    width: '100%',
    height: 220,
    backgroundColor: '#000000',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(37, 99, 235, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    gap: 6,
  },
  timeText: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '600',
  },
  progressBar: {
    height: 3,
    backgroundColor: '#334155',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#38BDF8',
  },
  scrollContent: {
    padding: 18,
    gap: 16,
    paddingBottom: 40,
  },
  metaHeader: {
    gap: 4,
  },
  courseName: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
  },
  lessonTitle: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '800',
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  cardHeaderText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  contentText: {
    color: '#E2E8F0',
    fontSize: 14,
    lineHeight: 22,
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderWidth: 1,
    borderColor: '#38BDF8',
    paddingVertical: 12,
    borderRadius: 14,
  },
  aiButtonText: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '700',
  },
  actionsContainer: {
    marginTop: 8,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  completedButton: {
    backgroundColor: '#059669',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
