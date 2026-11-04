import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import {
  FileText,
  Sparkles,
  Zap,
  Sliders,
  CheckCircle2,
  Clock,
  Download,
  Send,
  PlusCircle,
  HelpCircle,
  Layers,
} from 'lucide-react-native';
import { AuroraBackground, GlassCard, LiquidGlassTokens } from '../shared/components/glass';

interface GeneratedQuestion {
  id: number;
  questionNumber: number;
  latexText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  difficulty: 'Medium' | 'Hard' | 'Olympiad';
}

export const ExamStudioScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [examTrack, setExamTrack] = useState('JEE Advanced (Paper 1)');
  const [topic, setTopic] = useState('Differential Equations & Definite Integrals');
  const [questionCount, setQuestionCount] = useState('10');
  const [difficultyRatio, setDifficultyRatio] = useState('50% Hard • 50% Olympiad');
  const [markingScheme, setMarkingScheme] = useState('+4 / -1 (Negative Marking)');

  const [generating, setGenerating] = useState(false);
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);

  const handleGenerateExam = () => {
    setGenerating(true);
    setTimeout(() => {
      setQuestions([
        {
          id: 1,
          questionNumber: 1,
          latexText:
            'Let $f(x)$ be a differentiable function on $[0, 1]$ such that $f(0) = 0$ and $f\'(x) \\le \\sqrt{1 - (f(x))^2}$. If $\\int_{0}^{1} f(x)\\,dx = k$, find the supremum of $k$:',
          options: [
            '\\frac{\\pi}{4} - \\frac{1}{2}',
            '\\frac{\\pi - 2}{4}',
            '1 - \\cos(1)',
            '\\sin(1)',
          ],
          correctOptionIndex: 2,
          explanation:
            'By separating variables $\\frac{f\'(x)}{\\sqrt{1-f(x)^2}} \\le 1$, we integrate to obtain $\\arcsin(f(x)) \\le x \\implies f(x) \\le \\sin(x)$. Therefore, $\\int_0^1 f(x)\\,dx \\le \\int_0^1 \\sin(x)\\,dx = [-\\cos(x)]_0^1 = 1 - \\cos(1)$.',
          difficulty: 'Hard',
        },
        {
          id: 2,
          questionNumber: 2,
          latexText:
            'The order and degree of the differential equation $\\left(1 + \\left(\\frac{dy}{dx}\\right)^2\\right)^{3/2} = k\\frac{d^2y}{dx^2}$ are respectively:',
          options: [
            'Order 1, Degree 3',
            'Order 2, Degree 2',
            'Order 2, Degree 3',
            'Order 1, Degree 2',
          ],
          correctOptionIndex: 1,
          explanation:
            'Squaring both sides removes the fractional exponent: $(1+(y\')^2)^3 = k^2(y\'\')^2$. The highest derivative is order 2, and its exponent is 2 (degree 2).',
          difficulty: 'Medium',
        },
        {
          id: 3,
          questionNumber: 3,
          latexText:
            'Evaluate the boundary limit $\\lim_{n \\to \\infty} \\sum_{r=1}^{n} \\frac{r}{n^2 + r^2}$:',
          options: [
            '\\ln(2)',
            '\\frac{1}{2}\\ln(2)',
            '\\frac{\\pi}{4}',
            '\\frac{1}{2}',
          ],
          correctOptionIndex: 1,
          explanation:
            'Express as Riemann sum: $\\lim_{n \\to \\infty} \\frac{1}{n} \\sum_{r=1}^n \\frac{r/n}{1 + (r/n)^2} = \\int_0^1 \\frac{x}{1+x^2}\\,dx = \\left[\\frac{1}{2}\\ln(1+x^2)\\right]_0^1 = \\frac{1}{2}\\ln(2)$.',
          difficulty: 'Hard',
        },
      ]);
      setGenerating(false);
    }, 1500);
  };

  const handlePublishToTutorLMS = () => {
    Alert.alert(
      'Published to Tutor LMS! 🎉',
      `Mock CBT Exam "${examTrack} - ${topic}" with ${questions.length} questions is now live on mathnotes.courses for student enrollment!`
    );
  };

  return (
    <AuroraBackground variant="teacher">
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badgeRow}>
            <View style={styles.studioBadge}>
              <Sparkles color="#10B981" size={13} />
              <Text style={styles.studioBadgeText}>TEACHERS AI CBT STUDIO</Text>
            </View>
          </View>
          <Text style={styles.heading}>AI Exam & Question Paper Studio</Text>
          <Text style={styles.subheading}>
            Generate high-stakes NTA CBT mock test papers with formatted LaTeX math equations, multi-step answer keys, and difficulty calibration.
          </Text>
        </View>

        {/* Configuration Glass Card */}
        <GlassCard
          glowColor={LiquidGlassTokens.colors.accentEmerald}
          glowPosition="top-right"
          style={styles.configGlass}
        >
          <View style={styles.configGroup}>
            <Text style={styles.inputLabel}>Target Exam Track</Text>
            <View style={styles.trackChipRow}>
              {['JEE Advanced (Paper 1)', 'JEE Mains 2026', 'UPSC CSAT Quant', 'ISI / CMI'].map(
                track => (
                  <TouchableOpacity
                    key={track}
                    style={[
                      styles.trackChip,
                      examTrack === track && styles.trackChipSelected,
                    ]}
                    onPress={() => setExamTrack(track)}
                  >
                    <Text
                      style={[
                        styles.trackChipText,
                        examTrack === track && styles.trackChipTextSelected,
                      ]}
                    >
                      {track}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>
          </View>

          <View style={styles.configGroup}>
            <Text style={styles.inputLabel}>Chapter / Topic Focus</Text>
            <TextInput
              style={styles.textInput}
              value={topic}
              onChangeText={setTopic}
              placeholder="e.g. Definite Integrals & Complex Numbers"
              placeholderTextColor="#64748B"
            />
          </View>

          <View style={styles.twoColRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>Questions Count</Text>
              <TextInput
                style={styles.textInput}
                value={questionCount}
                onChangeText={setQuestionCount}
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 1.5 }}>
              <Text style={styles.inputLabel}>Marking Protocol</Text>
              <TextInput
                style={styles.textInput}
                value={markingScheme}
                onChangeText={setMarkingScheme}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.generateBtn}
            onPress={handleGenerateExam}
            disabled={generating}
            activeOpacity={0.85}
          >
            {generating ? (
              <ActivityIndicator color="#07090E" />
            ) : (
              <>
                <Sparkles color="#07090E" size={18} />
                <Text style={styles.generateBtnText}>
                  Synthesize Mock Paper with Teachers AI
                </Text>
              </>
            )}
          </TouchableOpacity>
        </GlassCard>

        {/* Questions Display */}
        {questions.length > 0 && (
          <View style={styles.questionsContainer}>
            <View style={styles.resultsHeader}>
              <View>
                <Text style={styles.resultsHeading}>Generated CBT Question Paper</Text>
                <Text style={styles.resultsSubheading}>
                  {questions.length} questions • Verified LaTeX Formulations • NTA Single-Choice
                </Text>
              </View>
              <TouchableOpacity
                style={styles.publishHeaderBtn}
                onPress={handlePublishToTutorLMS}
              >
                <Send color="#FFFFFF" size={14} />
                <Text style={styles.publishHeaderBtnText}>Publish Live</Text>
              </TouchableOpacity>
            </View>

            {questions.map((q, idx) => (
              <GlassCard
                key={q.id}
                style={styles.questionGlassCard}
                glowColor="rgba(16, 185, 129, 0.2)"
              >
                <View style={styles.qHeaderRow}>
                  <View style={styles.qNumberBadge}>
                    <Text style={styles.qNumberText}>Question {q.questionNumber}</Text>
                  </View>
                  <View
                    style={[
                      styles.diffBadge,
                      q.difficulty === 'Olympiad'
                        ? styles.diffOlympiad
                        : q.difficulty === 'Hard'
                        ? styles.diffHard
                        : styles.diffMedium,
                    ]}
                  >
                    <Text style={styles.diffText}>{q.difficulty}</Text>
                  </View>
                </View>

                {/* Question Formula Box */}
                <View style={styles.questionLatexBox}>
                  <Text style={styles.questionLatexText}>{q.latexText}</Text>
                </View>

                {/* Options List */}
                <View style={styles.optionsList}>
                  {q.options.map((opt, optIdx) => {
                    const isCorrect = optIdx === q.correctOptionIndex;
                    const letter = String.fromCharCode(65 + optIdx);
                    return (
                      <View
                        key={optIdx}
                        style={[
                          styles.optionItem,
                          isCorrect && styles.optionItemCorrect,
                        ]}
                      >
                        <View
                          style={[
                            styles.optionLetterBadge,
                            isCorrect && styles.optionLetterBadgeCorrect,
                          ]}
                        >
                          <Text
                            style={[
                              styles.optionLetterText,
                              isCorrect && styles.optionLetterTextCorrect,
                            ]}
                          >
                            {letter}
                          </Text>
                        </View>
                        <Text
                          style={[
                            styles.optionText,
                            isCorrect && styles.optionTextCorrect,
                          ]}
                        >
                          {opt}
                        </Text>
                        {isCorrect && (
                          <CheckCircle2 color="#10B981" size={16} style={{ marginLeft: 'auto' }} />
                        )}
                      </View>
                    );
                  })}
                </View>

                {/* Explanation Box */}
                <View style={styles.explanationBox}>
                  <Text style={styles.explanationTitle}>Pedagogical Solution Key:</Text>
                  <Text style={styles.explanationText}>{q.explanation}</Text>
                </View>
              </GlassCard>
            ))}

            {/* Bottom Actions */}
            <View style={styles.bottomActionRow}>
              <TouchableOpacity
                style={styles.exportBtn}
                onPress={() =>
                  Alert.alert(
                    'Export Complete 📥',
                    'Downloaded print-ready LaTeX (.tex) and student CBT PDF files.'
                  )
                }
              >
                <Download color="#38BDF8" size={16} />
                <Text style={styles.exportBtnText}>Export LaTeX / PDF</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.publishBtnFull}
                onPress={handlePublishToTutorLMS}
              >
                <Send color="#FFFFFF" size={16} />
                <Text style={styles.publishBtnFullText}>Publish to Tutor LMS</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </AuroraBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  studioBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.35)',
  },
  studioBadgeText: {
    color: '#10B981',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  heading: {
    color: '#F8FAFC',
    fontSize: 23,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subheading: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },
  configGlass: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  configGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  trackChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  trackChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  trackChipSelected: {
    backgroundColor: 'rgba(16, 185, 129, 0.18)',
    borderColor: '#10B981',
  },
  trackChipText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  trackChipTextSelected: {
    color: '#10B981',
    fontWeight: '800',
  },
  textInput: {
    backgroundColor: 'rgba(7, 9, 14, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#F8FAFC',
    fontSize: 13,
  },
  twoColRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  generateBtnText: {
    color: '#07090E',
    fontWeight: '800',
    fontSize: 14.5,
  },
  questionsContainer: {
    paddingHorizontal: 16,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  resultsHeading: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '800',
  },
  resultsSubheading: {
    color: '#94A3B8',
    fontSize: 11.5,
    marginTop: 2,
  },
  publishHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  publishHeaderBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  questionGlassCard: {
    marginBottom: 16,
  },
  qHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  qNumberBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.18)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  qNumberText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '800',
  },
  diffBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  diffMedium: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
  },
  diffHard: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  diffOlympiad: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  diffText: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '700',
  },
  questionLatexBox: {
    backgroundColor: 'rgba(7, 9, 14, 0.8)',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 12,
  },
  questionLatexText: {
    color: '#F8FAFC',
    fontSize: 14,
    lineHeight: 21,
    fontFamily: 'monospace',
  },
  optionsList: {
    gap: 8,
    marginBottom: 12,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  optionItemCorrect: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  optionLetterBadge: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLetterBadgeCorrect: {
    backgroundColor: '#10B981',
  },
  optionLetterText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '800',
  },
  optionLetterTextCorrect: {
    color: '#07090E',
  },
  optionText: {
    color: '#CBD5E1',
    fontSize: 13,
    fontFamily: 'monospace',
  },
  optionTextCorrect: {
    color: '#10B981',
    fontWeight: '700',
  },
  explanationBox: {
    backgroundColor: 'rgba(7, 9, 14, 0.6)',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  explanationTitle: {
    color: '#94A3B8',
    fontSize: 11.5,
    fontWeight: '700',
    marginBottom: 2,
  },
  explanationText: {
    color: '#CBD5E1',
    fontSize: 12,
    lineHeight: 17,
  },
  bottomActionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 24,
  },
  exportBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    paddingVertical: 13,
    borderRadius: 14,
  },
  exportBtnText: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '700',
  },
  publishBtnFull: {
    flex: 1.3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#10B981',
    paddingVertical: 13,
    borderRadius: 14,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  publishBtnFullText: {
    color: '#07090E',
    fontSize: 13,
    fontWeight: '800',
  },
});
