import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert
} from 'react-native';
import {
  Clock,
  Award,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Grid,
  BookmarkCheck,
  Delete,
  ChevronRight,
  ChevronLeft,
  AlertTriangle
} from 'lucide-react-native';
import { Quiz, QuizQuestion, QuestionStatus } from '../../../../shared/types';
import { NotificationService } from '../../../../shared/services/notificationService';

export const QuizScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { quiz, courseTitle } = route.params || {};

  // Default Full-Scale JEE CBT Exam Questions with Section A (MCQs) and Section B (NAT)
  const examQuestions: QuizQuestion[] = quiz?.questions || [
    {
      id: 1,
      question: 'Evaluate the limit using first-principles expansion: $\\lim_{x \\to 0} \\frac{x - \\sin(x)}{x^3}$',
      type: 'single_choice',
      difficulty: 'JEE Advanced',
      topicTag: 'Calculus: Limits',
      points: 4,
      negativePoints: 1,
      options: [
        { id: 'A', text: '$\\frac{1}{6}$', isCorrect: true },
        { id: 'B', text: '$\\frac{1}{3}$', isCorrect: false },
        { id: 'C', text: '$0$', isCorrect: false },
        { id: 'D', text: 'Does not exist', isCorrect: false }
      ],
      explanation: 'Using Taylor expansion: $\\sin(x) = x - \\frac{x^3}{6} + \\mathcal{O}(x^5)$. Thus $\\frac{x - (x - x^3/6)}{x^3} = \\frac{1}{6}$.'
    },
    {
      id: 2,
      question: 'Find the remainder when $2^{2026}$ is divided by $7$ (UPSC CSAT / Modular Arithmetic):',
      type: 'single_choice',
      difficulty: 'Moderate',
      topicTag: 'Number Systems',
      points: 2.5,
      negativePoints: 0.83,
      options: [
        { id: 'A', text: '$1$', isCorrect: false },
        { id: 'B', text: '$2$', isCorrect: true },
        { id: 'C', text: '$4$', isCorrect: false },
        { id: 'D', text: '$6$', isCorrect: false }
      ],
      explanation: 'Since $2^3 \\equiv 1 \\pmod 7$, $2^{2026} = 2^{3 \\times 675 + 1} = (2^3)^{675} \\times 2 \\equiv 1 \\times 2 = 2 \\pmod 7$.'
    },
    {
      id: 3,
      question: 'For $f(x) = x^2$, what is the gradient descent step update $x_{t+1}$ with learning rate $\\eta = 0.1$ starting at $x_0 = 10$?',
      type: 'single_choice',
      difficulty: 'Easy',
      topicTag: 'Mathematics of AI',
      points: 4,
      negativePoints: 1,
      options: [
        { id: 'A', text: '$8.0$', isCorrect: true },
        { id: 'B', text: '$9.0$', isCorrect: false },
        { id: 'C', text: '$7.5$', isCorrect: false },
        { id: 'D', text: '$10.2$', isCorrect: false }
      ],
      explanation: 'Gradient is $f\'(x) = 2x$. At $x_0 = 10$, $f\'(10) = 20$. Step: $x_1 = 10 - 0.1(20) = 8.0$.'
    },
    {
      id: 4,
      question: 'Evaluate the definite integral using King\'s Property: $\\int_0^{\\pi/2} \\frac{\\sin^3(x)}{\\sin^3(x) + \\cos^3(x)} \\, dx$',
      type: 'single_choice',
      difficulty: 'JEE Advanced',
      topicTag: 'Definite Integrals',
      points: 4,
      negativePoints: 1,
      options: [
        { id: 'A', text: '$\\frac{\\pi}{2}$', isCorrect: false },
        { id: 'B', text: '$\\frac{\\pi}{4}$', isCorrect: true },
        { id: 'C', text: '$\\frac{\\pi}{8}$', isCorrect: false },
        { id: 'D', text: '$1$', isCorrect: false }
      ],
      explanation: 'By King\'s Theorem $\\int_a^b f(x)dx = \\int_a^b f(a+b-x)dx$, adding $2I = \\int_0^{\\pi/2} 1 \\, dx = \\frac{\\pi}{2} \\implies I = \\frac{\\pi}{4}$.'
    },
    {
      id: 5,
      question: '[Numerical Section B] Let $A$ be a $2 \\times 2$ matrix with eigenvalues $\\lambda_1 = 3$ and $\\lambda_2 = 5$. Compute the trace of $A^2$:',
      type: 'numerical',
      difficulty: 'JEE Advanced',
      topicTag: 'Linear Algebra / AI Foundations',
      points: 4,
      negativePoints: 0, // In JEE Main Section B, NAT questions have 0 or -1 depending on year
      options: [
        { id: 'NAT', text: '34', isCorrect: true }
      ],
      explanation: 'Eigenvalues of $A^2$ are $\\lambda_1^2 = 9$ and $\\lambda_2^2 = 25$. Trace is sum of eigenvalues: $\\text{Tr}(A^2) = 9 + 25 = 34$.'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [questionStatuses, setQuestionStatuses] = useState<Record<number, QuestionStatus>>({
    1: 'not_answered'
  });
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes in seconds
  const [showPalette, setShowPalette] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [examResult, setExamResult] = useState<any>(null);

  const currentQ = examQuestions[currentIndex];

  // Timer countdown
  useEffect(() => {
    if (isSubmitted || timeRemaining <= 0) return;
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted, timeRemaining]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optId: string) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [currentQ.id]: optId }));
    setQuestionStatuses(prev => ({ ...prev, [currentQ.id]: 'answered' }));
  };

  const handleKeypadPress = (val: string) => {
    if (isSubmitted) return;
    const currentVal = selectedAnswers[currentQ.id] || '';
    if (val === 'CLEAR') {
      const updated = { ...selectedAnswers };
      delete updated[currentQ.id];
      setSelectedAnswers(updated);
      setQuestionStatuses(prev => ({ ...prev, [currentQ.id]: 'not_answered' }));
    } else if (val === 'BACKSPACE') {
      const newVal = currentVal.slice(0, -1);
      if (newVal) {
        setSelectedAnswers(prev => ({ ...prev, [currentQ.id]: newVal }));
      } else {
        const updated = { ...selectedAnswers };
        delete updated[currentQ.id];
        setSelectedAnswers(updated);
        setQuestionStatuses(prev => ({ ...prev, [currentQ.id]: 'not_answered' }));
      }
    } else {
      // Append number or decimal point
      if (val === '.' && currentVal.includes('.')) return;
      if (currentVal.length >= 7) return;
      const newVal = currentVal + val;
      setSelectedAnswers(prev => ({ ...prev, [currentQ.id]: newVal }));
      setQuestionStatuses(prev => ({ ...prev, [currentQ.id]: 'answered' }));
    }
  };

  const handleMarkForReviewAndNext = () => {
    const isAnswered = !!selectedAnswers[currentQ.id];
    setQuestionStatuses(prev => ({
      ...prev,
      [currentQ.id]: isAnswered ? 'answered_marked_for_review' : 'marked_for_review'
    }));
    goToNextQuestion();
  };

  const handleClearResponse = () => {
    const updated = { ...selectedAnswers };
    delete updated[currentQ.id];
    setSelectedAnswers(updated);
    setQuestionStatuses(prev => ({ ...prev, [currentQ.id]: 'not_answered' }));
  };

  const handleSaveAndNext = () => {
    if (selectedAnswers[currentQ.id]) {
      setQuestionStatuses(prev => ({ ...prev, [currentQ.id]: 'answered' }));
    } else {
      setQuestionStatuses(prev => ({ ...prev, [currentQ.id]: 'not_answered' }));
    }
    goToNextQuestion();
  };

  const goToNextQuestion = () => {
    if (currentIndex < examQuestions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      const nextQId = examQuestions[nextIdx].id;
      if (!questionStatuses[nextQId]) {
        setQuestionStatuses(prev => ({ ...prev, [nextQId]: 'not_answered' }));
      }
    }
  };

  const goToPrevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const jumpToQuestion = (idx: number) => {
    setCurrentIndex(idx);
    setShowPalette(false);
    const qId = examQuestions[idx].id;
    if (!questionStatuses[qId]) {
      setQuestionStatuses(prev => ({ ...prev, [qId]: 'not_answered' }));
    }
  };

  const handleAutoSubmit = () => {
    calculateResults();
  };

  const handleConfirmSubmit = () => {
    Alert.alert(
      'Submit Final Exam?',
      `You have answered ${Object.keys(selectedAnswers).length} out of ${examQuestions.length} questions. Are you sure you want to finalize and grade your test?`,
      [
        { text: 'Review Questions', style: 'cancel' },
        { text: 'Submit Test', style: 'default', onPress: calculateResults }
      ]
    );
  };

  const calculateResults = () => {
    let earned = 0;
    let max = 0;
    let correct = 0;
    let wrong = 0;
    let unattempted = 0;

    examQuestions.forEach(q => {
      max += q.points;
      const userAns = selectedAnswers[q.id];
      if (!userAns) {
        unattempted++;
      } else {
        if (q.type === 'numerical') {
          const expected = q.options[0].text.trim();
          if (userAns.trim() === expected) {
            earned += q.points;
            correct++;
          } else {
            earned -= (q.negativePoints || 0);
            wrong++;
          }
        } else {
          const correctOpt = q.options.find(o => o.isCorrect)?.id;
          if (userAns === correctOpt) {
            earned += q.points;
            correct++;
          } else {
            earned -= (q.negativePoints || 1);
            wrong++;
          }
        }
      }
    });

    const netScore = Math.max(0, earned);
    const percent = Math.round((netScore / max) * 100);
    // Simulated National Rank Percentile based on score
    const simulatedPercentile = (85 + (percent * 0.145)).toFixed(2);

    const resultPayload = {
      earnedPoints: earned,
      maxPoints: max,
      netScore,
      percentage: percent,
      percentile: simulatedPercentile,
      correctCount: correct,
      wrongCount: wrong,
      unattemptedCount: unattempted,
      isPassed: percent >= 50
    };

    setExamResult(resultPayload);
    setIsSubmitted(true);

    // Dispatch teacher notification
    NotificationService.getInstance().sendPushNotification(
      NotificationService.buildTeacherNewSubmissionAlert(
        'Student Vikram',
        quiz?.title || 'JEE / UPSC Mock Exam',
        percent
      )
    );
  };

  const getStatusColor = (status?: QuestionStatus) => {
    switch (status) {
      case 'answered': return '#10B981'; // Green
      case 'not_answered': return '#EF4444'; // Red
      case 'marked_for_review': return '#8B5CF6'; // Purple
      case 'answered_marked_for_review': return '#D946EF'; // Magenta/Purple with check
      default: return '#64748B'; // Not Visited (Grey)
    }
  };

  return (
    <View style={styles.container}>
      {/* Top CBT Header */}
      <View style={styles.cbtHeader}>
        <View>
          <Text style={styles.cbtTitle}>{quiz?.title || 'NTA CBT Mock Test Series'}</Text>
          <Text style={styles.cbtSubtitle}>{courseTitle || 'IIT-JEE Main & Advanced 2026'}</Text>
        </View>
        <View style={styles.timerContainer}>
          <Clock color="#38BDF8" size={16} />
          <Text style={styles.timerText}>{formatTimer(timeRemaining)}</Text>
        </View>
        <TouchableOpacity style={styles.paletteToggleBtn} onPress={() => setShowPalette(true)}>
          <Grid color="#FFFFFF" size={18} />
          <Text style={styles.paletteToggleText}>Grid</Text>
        </TouchableOpacity>
      </View>

      {/* Marking Scheme Banner */}
      <View style={styles.markingBanner}>
        <Text style={styles.markingText}>
          Marking Scheme: <Text style={styles.greenText}>+{currentQ.points} for Correct</Text> | <Text style={styles.redText}>-{currentQ.negativePoints || 0} for Wrong</Text>
        </Text>
        <View style={styles.sectionBadge}>
          <Text style={styles.sectionBadgeText}>
            {currentQ.type === 'numerical' ? 'SECTION B: NAT' : 'SECTION A: MCQ'}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Results Screen if Submitted */}
        {isSubmitted && examResult && (
          <View style={styles.resultContainer}>
            <View style={styles.scoreHero}>
              <Award color="#38BDF8" size={44} />
              <Text style={styles.scoreHeroTitle}>All India Mock Analysis</Text>
              <Text style={styles.scoreHeroPoints}>{examResult.netScore} / {examResult.maxPoints} pts</Text>
              <View style={styles.percentilePill}>
                <Text style={styles.percentileText}>Predicted National Percentile: {examResult.percentile}%ile</Text>
              </View>
            </View>

            <View style={styles.statGrid}>
              <View style={[styles.statBox, { borderColor: '#10B981' }]}>
                <Text style={[styles.statVal, { color: '#10B981' }]}>{examResult.correctCount}</Text>
                <Text style={styles.statLabel}>Correct (+{currentQ.points})</Text>
              </View>
              <View style={[styles.statBox, { borderColor: '#EF4444' }]}>
                <Text style={[styles.statVal, { color: '#EF4444' }]}>{examResult.wrongCount}</Text>
                <Text style={styles.statLabel}>Incorrect (-{currentQ.negativePoints || 1})</Text>
              </View>
              <View style={[styles.statBox, { borderColor: '#94A3B8' }]}>
                <Text style={[styles.statVal, { color: '#94A3B8' }]}>{examResult.unattemptedCount}</Text>
                <Text style={styles.statLabel}>Unattempted (0)</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.retakeButton} onPress={() => {
              setIsSubmitted(false);
              setSelectedAnswers({});
              setQuestionStatuses({ 1: 'not_answered' });
              setTimeRemaining(1800);
              setCurrentIndex(0);
            }}>
              <RotateCcw color="#FFFFFF" size={16} />
              <Text style={styles.retakeButtonText}>Retake Test</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Current Question View */}
        <View style={styles.questionContainer}>
          <View style={styles.qTopBar}>
            <Text style={styles.qIndexText}>Question {currentIndex + 1} of {examQuestions.length}</Text>
            <View style={styles.difficultyTag}>
              <Text style={styles.difficultyText}>{currentQ.difficulty}</Text>
            </View>
          </View>

          <Text style={styles.questionText}>{currentQ.question}</Text>

          {/* MCQ Options Rendering */}
          {currentQ.type === 'single_choice' && (
            <View style={styles.optionsList}>
              {currentQ.options.map(opt => {
                const isSelected = selectedAnswers[currentQ.id] === opt.id;
                let optStyle: any = {};
                if (isSubmitted) {
                  if (opt.isCorrect) optStyle = styles.optionCorrect;
                  else if (isSelected && !opt.isCorrect) optStyle = styles.optionWrong;
                } else if (isSelected) {
                  optStyle = styles.optionSelected;
                }

                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[styles.optionBase, optStyle]}
                    onPress={() => handleSelectOption(opt.id)}
                    disabled={isSubmitted}
                  >
                    <View style={styles.optionLetterBadge}>
                      <Text style={styles.optionLetter}>{opt.id}</Text>
                    </View>
                    <Text style={styles.optionText}>{opt.text}</Text>
                    {isSubmitted && opt.isCorrect && <CheckCircle2 color="#10B981" size={18} />}
                    {isSubmitted && isSelected && !opt.isCorrect && <XCircle color="#EF4444" size={18} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* NAT Virtual Keypad Section */}
          {currentQ.type === 'numerical' && (
            <View style={styles.natSection}>
              <Text style={styles.natLabel}>Type your numerical decimal/integer answer:</Text>
              <View style={styles.natDisplayBox}>
                <Text style={styles.natDisplayText}>
                  {selectedAnswers[currentQ.id] || 'Type value...'}
                </Text>
              </View>

              {!isSubmitted && (
                <View style={styles.keypadGrid}>
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '-'].map(key => (
                    <TouchableOpacity
                      key={key}
                      style={styles.keypadKey}
                      onPress={() => handleKeypadPress(key)}
                    >
                      <Text style={styles.keypadKeyText}>{key}</Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity
                    style={[styles.keypadKey, styles.keypadActionKey]}
                    onPress={() => handleKeypadPress('BACKSPACE')}
                  >
                    <Delete color="#94A3B8" size={18} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.keypadKey, styles.keypadClearKey]}
                    onPress={() => handleKeypadPress('CLEAR')}
                  >
                    <Text style={styles.clearKeyText}>CLEAR</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {/* Pedagogical Explanation when Submitted */}
          {isSubmitted && currentQ.explanation && (
            <View style={styles.explanationBox}>
              <View style={styles.explanationHeader}>
                <HelpCircle color="#38BDF8" size={18} />
                <Text style={styles.explanationTitle}>First-Principles Solution & Invariant:</Text>
              </View>
              <Text style={styles.explanationBody}>{currentQ.explanation}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* CBT Action Bar */}
      {!isSubmitted && (
        <View style={styles.cbtActionBar}>
          <TouchableOpacity style={styles.actionBtnSecondary} onPress={handleClearResponse}>
            <Text style={styles.actionBtnSecText}>Clear</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtnReview} onPress={handleMarkForReviewAndNext}>
            <BookmarkCheck color="#C084FC" size={16} />
            <Text style={styles.actionBtnReviewText}>Review & Next</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtnPrimary} onPress={handleSaveAndNext}>
            <Text style={styles.actionBtnPrimText}>Save & Next</Text>
            <ChevronRight color="#FFFFFF" size={16} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtnSubmit} onPress={handleConfirmSubmit}>
            <Text style={styles.actionBtnSubmitText}>Submit Test</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* CBT Palette Modal */}
      <Modal visible={showPalette} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.paletteModalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Question Navigation Palette</Text>
              <TouchableOpacity onPress={() => setShowPalette(false)}>
                <Text style={styles.modalCloseText}>Done</Text>
              </TouchableOpacity>
            </View>

            {/* Legend */}
            <View style={styles.paletteLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
                <Text style={styles.legendLabel}>Answered</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
                <Text style={styles.legendLabel}>Not Answered</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#8B5CF6' }]} />
                <Text style={styles.legendLabel}>Review</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#64748B' }]} />
                <Text style={styles.legendLabel}>Not Visited</Text>
              </View>
            </View>

            {/* Palette Grid */}
            <View style={styles.paletteGrid}>
              {examQuestions.map((q, idx) => {
                const status = questionStatuses[q.id];
                const isCurrent = currentIndex === idx;
                const bgColor = getStatusColor(status);

                return (
                  <TouchableOpacity
                    key={q.id}
                    style={[
                      styles.paletteCell,
                      { backgroundColor: bgColor },
                      isCurrent && styles.paletteCellActive
                    ]}
                    onPress={() => jumpToQuestion(idx)}
                  >
                    <Text style={styles.paletteCellText}>{idx + 1}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  cbtHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  cbtTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '800',
  },
  cbtSubtitle: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderWidth: 1,
    borderColor: '#38BDF8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 6,
  },
  timerText: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  paletteToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  paletteToggleText: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '700',
  },
  markingBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  markingText: {
    color: '#CBD5E1',
    fontSize: 12,
  },
  greenText: {
    color: '#10B981',
    fontWeight: '700',
  },
  redText: {
    color: '#EF4444',
    fontWeight: '700',
  },
  sectionBadge: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  sectionBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  questionContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 14,
  },
  qTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qIndexText: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '700',
  },
  difficultyTag: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  difficultyText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
  },
  questionText: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  optionsList: {
    gap: 10,
  },
  optionBase: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    gap: 12,
  },
  optionLetterBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLetter: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '800',
  },
  optionText: {
    color: '#E2E8F0',
    fontSize: 14,
    flex: 1,
  },
  optionSelected: {
    borderColor: '#38BDF8',
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
  },
  optionCorrect: {
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  optionWrong: {
    borderColor: '#EF4444',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  natSection: {
    gap: 10,
  },
  natLabel: {
    color: '#94A3B8',
    fontSize: 12,
  },
  natDisplayBox: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#38BDF8',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  natDisplayText: {
    color: '#38BDF8',
    fontSize: 22,
    fontWeight: '800',
  },
  keypadGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  keypadKey: {
    width: '31%',
    backgroundColor: '#334155',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keypadKeyText: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
  },
  keypadActionKey: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#475569',
  },
  keypadClearKey: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  clearKeyText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '800',
  },
  explanationBox: {
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
    borderColor: '#0284C7',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    gap: 6,
    marginTop: 8,
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  explanationTitle: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '800',
  },
  explanationBody: {
    color: '#E2E8F0',
    fontSize: 13,
    lineHeight: 20,
  },
  cbtActionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1E293B',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 6,
  },
  actionBtnSecondary: {
    backgroundColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  actionBtnSecText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '700',
  },
  actionBtnReview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderWidth: 1,
    borderColor: '#8B5CF6',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 4,
  },
  actionBtnReviewText: {
    color: '#C084FC',
    fontSize: 12,
    fontWeight: '700',
  },
  actionBtnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 4,
  },
  actionBtnPrimText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  actionBtnSubmit: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  actionBtnSubmitText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    padding: 20,
  },
  paletteModalContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '800',
  },
  modalCloseText: {
    color: '#38BDF8',
    fontSize: 14,
    fontWeight: '700',
  },
  paletteLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendLabel: {
    color: '#94A3B8',
    fontSize: 11,
  },
  paletteGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'flex-start',
  },
  paletteCell: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paletteCellActive: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  paletteCellText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  resultContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 16,
    marginBottom: 16,
  },
  scoreHero: {
    alignItems: 'center',
    gap: 6,
  },
  scoreHeroTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '800',
  },
  scoreHeroPoints: {
    color: '#38BDF8',
    fontSize: 32,
    fontWeight: '900',
  },
  percentilePill: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  percentileText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '800',
  },
  statGrid: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
    backgroundColor: '#0F172A',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  statVal: {
    fontSize: 18,
    fontWeight: '800',
  },
  statLabel: {
    color: '#94A3B8',
    fontSize: 10,
    marginTop: 4,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  retakeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
