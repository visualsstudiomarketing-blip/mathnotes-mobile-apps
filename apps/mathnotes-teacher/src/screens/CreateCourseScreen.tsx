import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { Sparkles, Plus, CheckCircle2, ArrowRight, BookOpen } from 'lucide-react-native';

export const CreateCourseScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Calculus');
  const [description, setDescription] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [topics, setTopics] = useState<string[]>([
    'Topic 1: Foundational Limits & Graphical Squeeze Theorem',
    'Topic 2: Instantaneous Rates of Change & Tangent Lines'
  ]);

  const handleGenerateAICurriculum = () => {
    setIsGeneratingAI(true);
    setTimeout(() => {
      setTopics([
        'Topic 1: Intuitive Conceptual Foundations & Visual Proofs',
        'Topic 2: First-Principles Derivation of Core Theorems',
        'Topic 3: Graded Deliberate Problem Sets (JEE Main Level)',
        'Topic 4: Diagnostic Checkpoint Quiz & Feynman Explanations'
      ]);
      setIsGeneratingAI(false);
    }, 700);
  };

  const handlePublish = () => {
    alert('Course created and submitted to Tutor LMS successfully!');
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>New Course Builder</Text>
        <Text style={styles.headerSub}>Create modular curricula for Mathnotes</Text>
      </View>

      {/* Form Fields */}
      <View style={styles.card}>
        <Text style={styles.label}>Course Title</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Differential Equations from First Principles"
          placeholderTextColor="#64748B"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Primary Subject</Text>
        <View style={styles.subjectRow}>
          {['Calculus', 'Algebra', 'Coordinate Geometry', 'IIT-JEE'].map(s => (
            <TouchableOpacity
              key={s}
              style={[styles.subjectChip, subject === s && styles.subjectChipActive]}
              onPress={() => setSubject(s)}
            >
              <Text style={[styles.subjectText, subject === s && styles.subjectTextActive]}>
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Pedagogical Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe how visual proofs and active intuition are used..."
          placeholderTextColor="#64748B"
          value={description}
          onChangeText={setDescription}
          multiline
        />
      </View>

      {/* AI Curriculum Generator Card */}
      <View style={styles.aiCard}>
        <View style={styles.aiHeader}>
          <Sparkles color="#10B981" size={18} />
          <Text style={styles.aiTitle}>Teachers AI Curriculum Assistant</Text>
        </View>
        <Text style={styles.aiDesc}>
          Auto-structure 4 topics aligned with the Mathnotes 4-Pillar Pedagogical System.
        </Text>
        <TouchableOpacity
          style={styles.aiBtn}
          onPress={handleGenerateAICurriculum}
          disabled={isGeneratingAI}
        >
          {isGeneratingAI ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              <Sparkles color="#FFFFFF" size={14} />
              <Text style={styles.aiBtnText}>Auto-Generate Curriculum Flow</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Topics Hierarchy */}
      <View style={styles.card}>
        <Text style={styles.cardSectionTitle}>Curriculum Structure</Text>
        {topics.map((t, i) => (
          <View key={i} style={styles.topicItem}>
            <BookOpen color="#38BDF8" size={16} />
            <Text style={styles.topicText}>{t}</Text>
          </View>
        ))}
      </View>

      {/* Publish CTA */}
      <TouchableOpacity style={styles.publishBtn} onPress={handlePublish}>
        <CheckCircle2 color="#FFFFFF" size={18} />
        <Text style={styles.publishBtnText}>Publish to Mathnotes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090D16',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 4,
  },
  headerTitle: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '800',
  },
  headerSub: {
    color: '#94A3B8',
    fontSize: 12,
  },
  card: {
    backgroundColor: '#131B2E',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    gap: 10,
  },
  label: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#090D16',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    color: '#F8FAFC',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
  },
  textArea: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  subjectRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  subjectChip: {
    backgroundColor: '#090D16',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  subjectChipActive: {
    backgroundColor: '#059669',
    borderColor: '#10B981',
  },
  subjectText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  subjectTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  aiCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aiTitle: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '700',
  },
  aiDesc: {
    color: '#CBD5E1',
    fontSize: 12,
    lineHeight: 18,
  },
  aiBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    borderRadius: 10,
    paddingVertical: 10,
    gap: 6,
    marginTop: 4,
  },
  aiBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  cardSectionTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  topicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#090D16',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  topicText: {
    color: '#E2E8F0',
    fontSize: 13,
    flex: 1,
  },
  publishBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 14,
    gap: 8,
  },
  publishBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
