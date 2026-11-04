import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import {
  Camera,
  Sparkles,
  Zap,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Bookmark,
  Share2,
  RotateCcw,
  BookOpen,
} from 'lucide-react-native';
import { AuroraBackground, GlassCard, LiquidGlassTokens } from '../shared/components/glass';

interface SolvedStep {
  stepNumber: number;
  title: string;
  latex: string;
  explanation: string;
}

export const VisionMathLensScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [hasCaptured, setHasCaptured] = useState(false);
  const [sampleImageUri, setSampleImageUri] = useState<string | null>(null);

  // Pre-loaded high-yield sample problem (JEE Advanced Calculus)
  const [parsedLatex, setParsedLatex] = useState<string>(
    '\\int_{0}^{\\pi/2} \\frac{\\sin^3(x)}{\\sin^3(x) + \\cos^3(x)}\\,dx'
  );
  const [identifiedTopic, setIdentifiedTopic] = useState('Definite Integrals • King\'s Property');
  const [difficultyLevel, setDifficultyLevel] = useState('JEE Advanced • 4 Marks');

  const [steps, setSteps] = useState<SolvedStep[]>([
    {
      stepNumber: 1,
      title: 'State the Definite Integral & Apply King\'s Property',
      latex: 'I = \\int_{a}^{b} f(x)\\,dx = \\int_{a}^{b} f(a+b-x)\\,dx',
      explanation:
        'Let the given integral be $I$. Here, the limits are $a = 0$ and $b = \\pi/2$, so $a+b-x = \\pi/2 - x$.',
    },
    {
      stepNumber: 2,
      title: 'Substitute $x \\to \\pi/2 - x$',
      latex: 'I = \\int_{0}^{\\pi/2} \\frac{\\sin^3(\\pi/2 - x)}{\\sin^3(\\pi/2 - x) + \\cos^3(\\pi/2 - x)}\\,dx = \\int_{0}^{\\pi/2} \\frac{\\cos^3(x)}{\\cos^3(x) + \\sin^3(x)}\\,dx',
      explanation:
        'Using co-function identities $\\sin(\\pi/2 - x) = \\cos(x)$ and $\\cos(\\pi/2 - x) = \\sin(x)$.',
    },
    {
      stepNumber: 3,
      title: 'Sum Equations (1) and (2)',
      latex: '2I = \\int_{0}^{\\pi/2} \\frac{\\sin^3(x) + \\cos^3(x)}{\\sin^3(x) + \\cos^3(x)}\\,dx = \\int_{0}^{\\pi/2} 1\\,dx',
      explanation:
        'The identical denominators allow us to combine the numerators directly into 1.',
    },
    {
      stepNumber: 4,
      title: 'Evaluate the Trivial Boundary Integral',
      latex: '2I = [x]_{0}^{\\pi/2} = \\frac{\\pi}{2} \\implies I = \\frac{\\pi}{4}',
      explanation:
        'Dividing both sides by 2 yields the exact analytical result $I = \\pi/4$.',
    },
  ]);

  const handleSimulateCapture = () => {
    setAnalyzing(true);
    setSampleImageUri('https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80');

    setTimeout(() => {
      setAnalyzing(false);
      setHasCaptured(true);
    }, 1200);
  };

  const handleSaveToDeck = () => {
    Alert.alert(
      'Saved to Revision Deck 🧠',
      'This problem has been added to your Spaced Repetition deck. Mathnotes AI will prompt you to re-solve it in 3 days.'
    );
  };

  return (
    <AuroraBackground variant="student">
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Title */}
        <View style={styles.header}>
          <View style={styles.titleBadge}>
            <Zap color="#38BDF8" size={13} />
            <Text style={styles.titleBadgeText}>AI VISION MATH LENS 2.0</Text>
          </View>
          <Text style={styles.heading}>Handwritten Math Solver</Text>
          <Text style={styles.subheading}>
            Snap any handwritten theorem, equation, or graph. Get first-principles derivations in seconds.
          </Text>
        </View>

        {/* Camera Viewfinder / Capture Glass Card */}
        <GlassCard
          glowColor={LiquidGlassTokens.colors.accentCyan}
          glowPosition="top-right"
          style={styles.viewfinderGlass}
        >
          {sampleImageUri ? (
            <View style={styles.previewContainer}>
              <Image source={{ uri: sampleImageUri }} style={styles.previewImage} />
              <View style={styles.ocrOverlay}>
                <View style={styles.ocrScanningBadge}>
                  <CheckCircle2 color="#10B981" size={14} />
                  <Text style={styles.ocrText}>OCR Extraction Verified</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.emptyViewfinder}>
              <View style={styles.cameraIconCircle}>
                <Camera color="#38BDF8" size={32} />
              </View>
              <Text style={styles.emptyTitle}>Point Camera at Math Problem</Text>
              <Text style={styles.emptySubtitle}>
                Supports handwritten algebra, calculus integrals, coordinate geometry, and matrices.
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.captureButton}
            onPress={handleSimulateCapture}
            disabled={analyzing}
            activeOpacity={0.85}
          >
            {analyzing ? (
              <ActivityIndicator color="#07090E" />
            ) : (
              <>
                <Camera color="#07090E" size={18} />
                <Text style={styles.captureButtonText}>
                  {hasCaptured ? 'Scan Another Problem' : 'Scan Handwritten Problem'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </GlassCard>

        {/* Results Section */}
        {hasCaptured && (
          <View style={styles.resultsSection}>
            {/* Metadata Card */}
            <GlassCard
              glowColor={LiquidGlassTokens.colors.accentSapphire}
              style={styles.metaGlass}
            >
              <View style={styles.metaRow}>
                <View style={styles.metaBadge}>
                  <Text style={styles.metaBadgeText}>{identifiedTopic}</Text>
                </View>
                <Text style={styles.difficultyText}>{difficultyLevel}</Text>
              </View>

              <Text style={styles.detectedHeading}>Recognized Problem Formulation:</Text>
              <View style={styles.formulaWafer}>
                <Text style={styles.formulaLatex}>{parsedLatex}</Text>
              </View>
            </GlassCard>

            {/* Socratic Step-by-Step Proof Breakdown */}
            <View style={styles.stepsHeader}>
              <Sparkles color="#38BDF8" size={18} />
              <Text style={styles.stepsHeading}>Socratic First-Principles Derivation</Text>
            </View>

            {steps.map(step => (
              <GlassCard
                key={step.stepNumber}
                style={styles.stepGlassCard}
                glowColor="rgba(56, 189, 248, 0.18)"
              >
                <View style={styles.stepHeaderRow}>
                  <View style={styles.stepNumBadge}>
                    <Text style={styles.stepNumText}>Step {step.stepNumber}</Text>
                  </View>
                  <Text style={styles.stepTitleText}>{step.title}</Text>
                </View>

                {/* Formula Highlight Wafer */}
                <View style={styles.stepFormulaWafer}>
                  <Text style={styles.stepLatexText}>{step.latex}</Text>
                </View>

                <Text style={styles.stepExplanation}>{step.explanation}</Text>
              </GlassCard>
            ))}

            {/* Common Pitfall Caution Wafer */}
            <GlassCard
              glowColor="rgba(245, 158, 11, 0.35)"
              style={styles.pitfallGlass}
            >
              <View style={styles.pitfallHeader}>
                <AlertTriangle color="#F59E0B" size={18} />
                <Text style={styles.pitfallTitle}>Common Student Pitfall in JEE:</Text>
              </View>
              <Text style={styles.pitfallText}>
                Do not forget to divide by 2 in the final step! When summing $I + I = 2I$, students frequently write $I = \pi/2$ instead of $\pi/4$.
              </Text>
            </GlassCard>

            {/* Action Bar */}
            <View style={styles.actionGrid}>
              <TouchableOpacity
                style={styles.actionBtnOutline}
                onPress={handleSaveToDeck}
                activeOpacity={0.8}
              >
                <Bookmark color="#38BDF8" size={16} />
                <Text style={styles.actionBtnOutlineText}>Save to Flashcards</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionBtnPrimary}
                onPress={() =>
                  navigation.navigate('MathNotesAI', {
                    initialQuery: `Can you show me an alternative method to solve ${parsedLatex}?`,
                  })
                }
                activeOpacity={0.8}
              >
                <Sparkles color="#FFFFFF" size={16} />
                <Text style={styles.actionBtnPrimaryText}>Ask Follow-up Doubt</Text>
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
  titleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    marginBottom: 8,
  },
  titleBadgeText: {
    color: '#38BDF8',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  heading: {
    color: '#F8FAFC',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subheading: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },
  viewfinderGlass: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  emptyViewfinder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  cameraIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    marginBottom: 14,
  },
  emptyTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  emptySubtitle: {
    color: '#64748B',
    fontSize: 12,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 17,
  },
  previewContainer: {
    position: 'relative',
    height: 180,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 14,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  ocrOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  ocrScanningBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  ocrText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700',
  },
  captureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#38BDF8',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  captureButtonText: {
    color: '#07090E',
    fontWeight: '800',
    fontSize: 14.5,
  },
  resultsSection: {
    paddingHorizontal: 16,
  },
  metaGlass: {
    marginBottom: 20,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  metaBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  metaBadgeText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
  },
  difficultyText: {
    color: '#F59E0B',
    fontSize: 11.5,
    fontWeight: '700',
  },
  detectedHeading: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 6,
  },
  formulaWafer: {
    backgroundColor: 'rgba(7, 9, 14, 0.75)',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  formulaLatex: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  stepsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  stepsHeading: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  stepGlassCard: {
    marginBottom: 14,
  },
  stepHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  stepNumBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.18)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  stepNumText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '800',
  },
  stepTitleText: {
    color: '#F8FAFC',
    fontSize: 13.5,
    fontWeight: '700',
    flex: 1,
  },
  stepFormulaWafer: {
    backgroundColor: 'rgba(7, 9, 14, 0.8)',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
    marginVertical: 6,
  },
  stepLatexText: {
    color: '#38BDF8',
    fontSize: 13,
    fontFamily: 'monospace',
  },
  stepExplanation: {
    color: '#94A3B8',
    fontSize: 12.5,
    lineHeight: 18,
    marginTop: 4,
  },
  pitfallGlass: {
    marginBottom: 20,
  },
  pitfallHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  pitfallTitle: {
    color: '#F59E0B',
    fontSize: 13,
    fontWeight: '800',
  },
  pitfallText: {
    color: '#CBD5E1',
    fontSize: 12,
    lineHeight: 18,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionBtnOutline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.35)',
    paddingVertical: 13,
    borderRadius: 14,
  },
  actionBtnOutlineText: {
    color: '#38BDF8',
    fontSize: 12.5,
    fontWeight: '700',
  },
  actionBtnPrimary: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#2563EB',
    paddingVertical: 13,
    borderRadius: 14,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  actionBtnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
  },
});
