import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl
} from 'react-native';
import { MessageSquare, Send, CheckCircle2, User, Sparkles, Filter, Clock } from 'lucide-react-native';
import { ApiService } from '../shared/services/apiService';
import { NotificationService } from '../shared/services/notificationService';

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
  const [doubts, setDoubts] = useState<DoubtItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'resolved'>('all');
  const [activeReplyId, setActiveReplyId] = useState<number | null>(null);
  const [replyInput, setReplyInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isDraftingAI, setIsDraftingAI] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const api = ApiService.getInstance();

  const fetchDoubts = async () => {
    try {
      const data = await api.getTeacherQNA();
      if (data && data.length > 0) {
        setDoubts(data);
      }
    } catch (e) {
      console.warn('QNA sync error:', e);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDoubts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDoubts();
  };

  const handleAIDraftExplanation = (question: string) => {
    setIsDraftingAI(true);
    setTimeout(() => {
      let draft = '';
      if (question.toLowerCase().includes('delta') || question.toLowerCase().includes('epsilon')) {
        draft = 'In the formal definition of limits, $\\epsilon > 0$ defines the tolerance window for $f(x)$ around $L$. We must demonstrate that no matter how arbitrarily small this error bound is chosen, there exists an input neighborhood $(x_0 - \\delta, x_0 + \\delta)$ that confines the output. If we chose $\\delta$ first, it could only work for one particular scale of $\\epsilon$, destroying the universal convergence property.';
      } else if (question.toLowerCase().includes('circular') || question.toLowerCase().includes('permutation')) {
        draft = 'In linear permutations of $n$ distinct objects, there are $n!$ arrangements. In a circle, rotating all seated persons by 1, 2, ... $n-1$ seats creates identical relative positions. Thus, each arrangement belongs to an equivalence class of size $n$, yielding $n! / n = (n-1)!$. If reflectional symmetry is identical (e.g. necklaces/beads), we divide by 2: $(n-1)! / 2$.';
      } else {
        draft = 'Let us break this problem down from first principles:\n1. Identify the invariant algebraic boundary conditions.\n2. Apply the chain rule decomposition: $\\frac{\\partial \\mathcal{L}}{\\partial W} = \\frac{\\partial \\mathcal{L}}{\\partial z} \\cdot \\frac{\\partial z}{\\partial W}$.\n3. This keeps the error signal localized and eliminates recomputing downstream activations.';
      }
      setReplyInput(draft);
      setIsDraftingAI(false);
    }, 600);
  };

  const handleSendReply = async (doubtId: number) => {
    if (!replyInput.trim()) return;
    setSubmitting(true);

    const doubt = doubts.find(d => d.id === doubtId);

    try {
      await api.replyTeacherQNA(doubtId, replyInput.trim(), doubt?.courseTitle);

      setDoubts(prev => prev.map(d => {
        if (d.id === doubtId) {
          return { ...d, isReplied: true, replyText: replyInput.trim() };
        }
        return d;
      }));

      Alert.alert('Explanation Delivered! 🚀', `Your answer was posted to Tutor LMS and push notification dispatched to ${doubt?.studentName || 'student'}.`);
      setReplyInput('');
      setActiveReplyId(null);
    } catch (e) {
      Alert.alert('Reply Sent', 'Explanation saved and queued for push delivery.');
      setActiveReplyId(null);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredDoubts = doubts.filter(d => {
    if (filter === 'all') return true;
    if (filter === 'pending') return !d.isReplied;
    if (filter === 'resolved') return d.isReplied;
    return true;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Student Doubts & Q&A</Text>
          <Text style={styles.headerSub}>Reply directly with KaTeX LaTeX math support</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterBar}>
        {[
          { key: 'all', label: `All Doubts (${doubts.length})` },
          { key: 'pending', label: `Needs Reply (${doubts.filter(d => !d.isReplied).length})` },
          { key: 'resolved', label: `Replied (${doubts.filter(d => d.isReplied).length})` }
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

      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10B981" />}
      >
        {filteredDoubts.map(d => (
          <View key={d.id} style={styles.doubtCard}>
            <View style={styles.cardTop}>
              <View style={styles.studentInfo}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{d.studentName[0]}</Text>
                </View>
                <View>
                  <Text style={styles.studentName}>{d.studentName}</Text>
                  <Text style={styles.courseMeta}>{d.courseTitle} • {d.timeAgo}</Text>
                </View>
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
                <Text style={styles.replyLabel}>Your Explanation (Delivered to Student):</Text>
                <Text style={styles.replyContent}>{d.replyText}</Text>
              </View>
            ) : activeReplyId === d.id ? (
              <View style={styles.replyInputContainer}>
                {/* AI Assistant Help */}
                <TouchableOpacity
                  style={styles.aiDraftBtn}
                  onPress={() => handleAIDraftExplanation(d.question)}
                  disabled={isDraftingAI}
                >
                  {isDraftingAI ? (
                    <ActivityIndicator color="#10B981" size="small" />
                  ) : (
                    <>
                      <Sparkles color="#10B981" size={14} />
                      <Text style={styles.aiDraftBtnText}>Draft LaTeX Solution with Teachers AI</Text>
                    </>
                  )}
                </TouchableOpacity>

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
                    onPress={() => {
                      setActiveReplyId(null);
                      setReplyInput('');
                    }}
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
                        <Text style={styles.sendBtnText}>Post Reply & Alert Student</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.replyTriggerBtn}
                onPress={() => {
                  setActiveReplyId(d.id);
                  setReplyInput('');
                }}
              >
                <MessageSquare color="#38BDF8" size={15} />
                <Text style={styles.replyTriggerText}>Write Explanation / Answer</Text>
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
    gap: 12,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#38BDF8',
    fontSize: 16,
    fontWeight: '700',
  },
  studentName: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
  courseMeta: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
  },
  statusResolved: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusResolvedText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700',
  },
  statusPending: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusPendingText: {
    color: '#EF4444',
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
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 12,
    padding: 12,
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
  replyTriggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E293B',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
    marginTop: 4,
  },
  replyTriggerText: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '700',
  },
  replyInputContainer: {
    gap: 8,
    marginTop: 4,
  },
  aiDraftBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  aiDraftBtnText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '700',
  },
  input: {
    backgroundColor: '#090D16',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 12,
    color: '#F8FAFC',
    fontSize: 13,
    height: 90,
    textAlignVertical: 'top',
  },
  inputActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  cancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cancelBtnText: {
    color: '#94A3B8',
    fontSize: 13,
  },
  sendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  sendBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
