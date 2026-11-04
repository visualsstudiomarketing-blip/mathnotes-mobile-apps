import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet
} from 'react-native';
import { Send, GraduationCap, RefreshCw, Clipboard, FileText, CheckCircle2 } from 'lucide-react-native';
import { AIAssistantService, BOTS_CONFIG } from '../../../../shared/services/aiAssistantService';
import { ChatMessage } from '../../../../shared/types';

export const TeachersAIScreen: React.FC = () => {
  const botConfig = BOTS_CONFIG['mathnotes_teacher_ai'];
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `### Welcome to MathNotes Teachers AI! 🎓\n\nI am your dedicated **Educator Copilot** at Mathnotes.courses.\n\nI can help you:\n- **Draft 60-Minute Active Learning Lesson Plans** with the 4-Pillar framework.\n- **Generate Graded Math Quizzes & JEE/Board Exam Problems** with LaTeX.\n- **Diagnose Student Misconceptions** & structure step-by-step rubrics.\n\nWhat would you like to prepare for your students today?`,
      timestamp: new Date().toISOString(),
      suggestedFollowups: botConfig.starters
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const aiService = AIAssistantService.getInstance();

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    setInputText('');
    setIsLoading(true);

    const tempUserMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMsg]);

    try {
      const response = await aiService.sendMessage('mathnotes_teacher_ai', text);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        content: `Error connecting to Teacher RAG Assistant. Please retry.`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 150);
  }, [messages]);

  const renderMessageItem = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.messageWrapper, isUser ? styles.userWrapper : styles.assistantWrapper]}>
        {!isUser && (
          <View style={styles.botAvatar}>
            <Text style={styles.avatarEmoji}>🎓</Text>
          </View>
        )}
        <View style={[styles.bubble, isUser ? styles.userBubble : styles.assistantBubble]}>
          <Text style={[styles.messageText, isUser ? styles.userText : styles.assistantText]}>
            {item.content}
          </Text>
          {item.suggestedFollowups && item.suggestedFollowups.length > 0 && (
            <View style={styles.followupsContainer}>
              <Text style={styles.followupHeader}>⚡ Quick Copilot Actions:</Text>
              {item.suggestedFollowups.map((suggestion, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.suggestionChip}
                  onPress={() => handleSend(suggestion)}
                >
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIconBg}>
            <GraduationCap color="#10B981" size={20} />
          </View>
          <View>
            <Text style={styles.headerTitle}>MathNotes Teachers AI</Text>
            <Text style={styles.headerSubtitle}>Curriculum & Assessment RAG Copilot</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.resetBtn}
          onPress={() => setMessages([messages[0]])}
        >
          <RefreshCw color="#94A3B8" size={18} />
        </TouchableOpacity>
      </View>

      {/* Message Stream */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessageItem}
        contentContainerStyle={styles.listContent}
      />

      {/* Typing Indicator */}
      {isLoading && (
        <View style={styles.typingIndicator}>
          <ActivityIndicator size="small" color="#10B981" />
          <Text style={styles.typingText}>Teachers AI is structuring your curriculum...</Text>
        </View>
      )}

      {/* Input Bar */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask to create quizzes, lesson plans, or rubrics..."
          placeholderTextColor="#64748B"
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={() => handleSend()}
          disabled={!inputText.trim() || isLoading}
        >
          <Send color="#FFFFFF" size={18} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    backgroundColor: '#090D16',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconBg: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  headerTitle: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
  },
  resetBtn: {
    padding: 8,
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '92%',
  },
  userWrapper: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  assistantWrapper: {
    alignSelf: 'flex-start',
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginTop: 4,
  },
  avatarEmoji: {
    fontSize: 16,
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userBubble: {
    backgroundColor: '#059669',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: '#131B2E',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 22,
  },
  userText: {
    color: '#FFFFFF',
  },
  assistantText: {
    color: '#F1F5F9',
  },
  followupsContainer: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  followupHeader: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  suggestionChip: {
    backgroundColor: '#090D16',
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 6,
  },
  suggestionText: {
    color: '#D1FAE5',
    fontSize: 13,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  typingText: {
    color: '#94A3B8',
    fontSize: 13,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#131B2E',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#090D16',
    color: '#F8FAFC',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#334155',
  },
});
