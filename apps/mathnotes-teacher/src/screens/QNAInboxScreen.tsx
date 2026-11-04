import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { MessageSquare, Send, CheckCircle2, User, Sparkles } from 'lucide-react-native';
import { NotificationService } from '../../../../shared/services/notificationService';

interface DoubtItem {
  id: number;
  courseTitle: string;
  lessonTitle: string;
  studentName: string;
  studentAvatar?: string;
  question: string;
  timeAgo: string;
  isReplied: boolean;
  replyText?: string;
}

export const QNAInboxScreen: React.FC = () => {
  const [doubts, setDoubts] = useState<DoubtItem[]>([
    {
      id: 1,
      courseTitle: 'Calculus I: Intuitive Foundations',
      lessonTitle: 'Visualizing Limits as Convergence',
      studentName: 'Vikram',
      question: 'Why does the epsilon-delta proof require delta to be chosen after epsilon? What breaks if we pick delta first?',
      timeAgo: '15m ago',
      isReplied: false,
    },
    {
      id: 2,
      courseTitle: 'Algebra & Polynomials Mastery',
      lessonTitle: 'Complex Roots & Conjugate Pairs',
      studentName: 'Aarav',
      question: 'Do polynomial equations always have roots occurring in conjugate pairs even if the coefficients are imaginary?',
      timeAgo: '2h ago',
      isReplied: true,
      replyText: 'Great question! The complex conjugate root theorem strictly requires real coefficients. If any coefficient is imaginary, roots do not have to pair conjugates.'
    }
  ]);
  const [activeReplyId, setActiveReplyId] = useState<number | null>(null);
  const [replyInput, setReplyInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSendReply = async (doubtId: number) => {
    if (!replyInput.trim()) return;
    setSubmitting(true);

    const doubt = doubts.find(d => d.id === doubtId);

    setTimeout(() => {
      setDoubts(prev => prev.map(d => {
        if (d.id === doubtId) {
          return { ...d, isReplied: true, replyText: replyInput.trim() };
        }
        return d;
      }));

      // Trigger Student Push Notification
      NotificationService.getInstance().sendPushNotification(
        NotificationService.buildStudentQNAReplyAlert(doubt?.courseTitle || 'Calculus I', 'Webxpro Digital')
      );

      setReplyInput('');
      setActiveReplyId(null);
      setSubmitting(false);
    }, 400);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Student Doubts & Q&A</Text>
        <Text style={styles.headerSub}>Reply directly to keep students making progress</Text>
      </View>

      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {doubts.map(d => (
          <View key={d.id} style={styles.doubtCard}>
            <View style={styles.cardTop}>
              <View style={styles.studentInfo}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{d.studentName[0]}</Text>
                </View>
                <div>
                  <Text style={styles.studentName}>{d.studentName}</Text>
                  <Text style={styles.courseMeta}>{d.courseTitle} • {d.timeAgo}</Text>
                </div>
              </View>
              {d.isReplied ? (
                <View style={styles.statusResolved}>
                  <CheckCircle2 color="#10B981" size={13} />
                  <Text style={styles.statusResolvedText}>Replied</Text>
                </View>
              ) : (
                <View style={styles.statusPending}>
                  <Text style={styles.statusPendingText}>Needs Reply</Text>
                </View>
              )}
            </View>

            <Text style={styles.questionText}>{d.question}</Text>

            {d.isReplied && d.replyText ? (
              <View style={styles.replyBox}>
                <Text style={styles.replyLabel}>Your Explanation:</Text>
                <Text style={styles.replyContent}>{d.replyText}</Text>
              </View>
            ) : activeReplyId === d.id ? (
              <View style={styles.replyInputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Type conceptual answer (supports LaTeX $...$)..."
                  placeholderTextColor="#64748B"
                  value={replyInput}
                  onChangeText={setReplyInput}
                  multiline
                />
                <View style={styles.inputActions}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => setActiveReplyId(null)}
                  >
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.sendBtn}
                    onPress={() => handleSendReply(d.id)}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <>
                        <Send color="#FFFFFF" size={14} />
                        <Text style={styles.sendBtnText}>Post Reply</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.openReplyBtn}
                onPress={() => {
                  setActiveReplyId(d.id);
                  setReplyInput('');
                }}
              >
                <MessageSquare color="#10B981" size={14} />
                <Text style={styles.openReplyBtnText}>Answer Student</Text>
              </TouchableOpacity>
            )}
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
    gap: 16,
    paddingBottom: 32,
  },
  doubtCard: {
    backgroundColor: '#131B2E',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    gap: 10,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '700',
  },
  studentName: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
  },
  courseMeta: {
    color: '#64748B',
    fontSize: 11,
  },
  statusResolved: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusResolvedText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700',
  },
  statusPending: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusPendingText: {
    color: '#F59E0B',
    fontSize: 11,
    fontWeight: '700',
  },
  questionText: {
    color: '#E2E8F0',
    fontSize: 14,
    lineHeight: 20,
  },
  replyBox: {
    backgroundColor: '#090D16',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#10B981',
    gap: 4,
  },
  replyLabel: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700',
  },
  replyContent: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 18,
  },
  openReplyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: '#10B981',
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
    marginTop: 4,
  },
  openReplyBtnText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '700',
  },
  replyInputContainer: {
    backgroundColor: '#090D16',
    borderRadius: 12,
    padding: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  input: {
    color: '#F8FAFC',
    fontSize: 13,
    minHeight: 60,
  },
  inputActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  cancelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  cancelBtnText: {
    color: '#94A3B8',
    fontSize: 12,
  },
  sendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  sendBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
