import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Animated,
  Keyboard,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface AIAssistantBarProps {
  onSuggestionSelect?: (suggestion: string) => void;
  onVoiceInput?: () => void;
  onTextSubmit?: (text: string) => void;
  isPremium: boolean;
  onPremiumRequired: () => void;
}

const SMART_SUGGESTIONS = [
  'Add gym workout',
  'Schedule lunch break',
  'Add focus time',
  'Block sleep hours',
];

export const AIAssistantBar: React.FC<AIAssistantBarProps> = ({
  onSuggestionSelect,
  onVoiceInput,
  onTextSubmit,
  isPremium,
  onPremiumRequired,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputText, setInputText] = useState('');
  const [expandAnim] = useState(new Animated.Value(0));

  const handleToggle = () => {
    if (!isPremium) {
      onPremiumRequired();
      return;
    }

    Haptics.selectionAsync();
    const toValue = isExpanded ? 0 : 1;
    setIsExpanded(!isExpanded);
    Animated.spring(expandAnim, {
      toValue,
      useNativeDriver: false,
      tension: 100,
      friction: 10,
    }).start();
  };

  const handleSuggestion = (suggestion: string) => {
    if (!isPremium) {
      onPremiumRequired();
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSuggestionSelect?.(suggestion);
  };

  const handleVoice = () => {
    if (!isPremium) {
      onPremiumRequired();
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onVoiceInput?.();
  };

  const handleSubmit = () => {
    if (!isPremium) {
      onPremiumRequired();
      return;
    }
    if (inputText.trim()) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onTextSubmit?.(inputText.trim());
      setInputText('');
      Keyboard.dismiss();
    }
  };

  const expandedHeight = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [56, 180],
  });

  return (
    <Animated.View style={[styles.container, { height: expandedHeight }]}>
      {/* Collapsed bar */}
      <TouchableOpacity
        style={styles.collapsedBar}
        onPress={handleToggle}
        activeOpacity={0.7}
      >
        <View style={styles.aiIcon}>
          <Text style={styles.aiIconText}>✨</Text>
        </View>
        <Text style={styles.aiLabel}>
          {isPremium ? 'AI Assistant' : 'AI Assistant (Premium)'}
        </Text>
        <TouchableOpacity
          style={styles.voiceButton}
          onPress={handleVoice}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.voiceIcon}>🎤</Text>
        </TouchableOpacity>
        <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▲'}</Text>
      </TouchableOpacity>

      {/* Expanded content */}
      {isExpanded && (
        <View style={styles.expandedContent}>
          {/* Input field */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Try: 'Add 2 hour gym session'"
              placeholderTextColor={colors.textTertiary}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSubmit}
              returnKeyType="send"
            />
            <TouchableOpacity
              style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
              onPress={handleSubmit}
              disabled={!inputText.trim()}
            >
              <Text style={styles.sendIcon}>→</Text>
            </TouchableOpacity>
          </View>

          {/* Quick suggestions */}
          <View style={styles.suggestions}>
            {SMART_SUGGESTIONS.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionChip}
                onPress={() => handleSuggestion(suggestion)}
              >
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceElevated,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    overflow: 'hidden',
  },
  collapsedBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    height: 56,
  },
  aiIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  aiIconText: {
    fontSize: 16,
  },
  aiLabel: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
  },
  voiceButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceIcon: {
    fontSize: 20,
  },
  expandIcon: {
    ...typography.caption,
    color: colors.textTertiary,
    marginLeft: spacing.xs,
  },
  expandedContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    paddingVertical: spacing.sm,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.nodeColors.blue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.textTertiary,
  },
  sendIcon: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  suggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  suggestionChip: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  suggestionText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
