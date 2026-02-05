import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingProps {
  onComplete: () => void;
}

const ONBOARDING_STEPS = [
  {
    title: 'Welcome to Node24',
    description: 'Your day, simplified into 24 hours of structured blocks.',
    visual: '◐━━━━━━━━━━━━━━◑',
    subtext: 'Every node adds up to exactly 24 hours',
  },
  {
    title: 'Add Your Activities',
    description: 'Tap the + button to create a new node. Name it, pick a color, and set when it starts and ends.',
    visual: '┌────────────────┐\n│  + Add Node    │\n└────────────────┘',
    subtext: 'Filler space adjusts automatically',
  },
  {
    title: 'Drag to Resize',
    description: 'Enter Edit Mode to drag the edges of any node up or down. Your schedule adapts instantly.',
    visual: '≡ ─────────── ≡\n  ↕ WORKOUT ↕\n≡ ─────────── ≡',
    subtext: 'Lock nodes to keep them fixed',
  },
  {
    title: 'Set Reminders',
    description: 'Never miss an activity. Set reminders that alert you before each node begins.',
    visual: '🔔  5 min before\n     10 min before\n     15 min before',
    subtext: 'Premium feature',
  },
  {
    title: 'You\'re All Set',
    description: 'Start planning your perfect day. Tap anywhere to begin.',
    visual: '✓',
    subtext: 'Let\'s go!',
  },
];

const STORAGE_KEY = '@node24_onboarding_complete';

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [visible, setVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, currentStep]);

  const checkOnboardingStatus = async () => {
    try {
      const completed = await AsyncStorage.getItem(STORAGE_KEY);
      if (completed !== 'true') {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  };

  const handleNext = () => {
    Haptics.selectionAsync();
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      fadeAnim.setValue(0);
      setCurrentStep(prev => prev + 1);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    Haptics.selectionAsync();
    handleComplete();
  };

  const handleComplete = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // Ignore storage errors
    }
    setVisible(false);
    onComplete();
  };

  const step = ONBOARDING_STEPS[currentStep];
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
          {/* Progress dots */}
          <View style={styles.progressDots}>
            {ONBOARDING_STEPS.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentStep && styles.dotActive,
                  index < currentStep && styles.dotCompleted,
                ]}
              />
            ))}
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.visualText}>{step.visual}</Text>
            <Text style={styles.title}>{step.title}</Text>
            <Text style={styles.description}>{step.description}</Text>
            {step.subtext && (
              <Text style={styles.subtext}>{step.subtext}</Text>
            )}
          </View>

          {/* Buttons */}
          <View style={styles.buttons}>
            {!isLastStep && (
              <TouchableOpacity
                style={styles.skipButton}
                onPress={handleSkip}
              >
                <Text style={styles.skipButtonText}>Skip</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.nextButton, isLastStep && styles.nextButtonFull]}
              onPress={handleNext}
            >
              <Text style={styles.nextButtonText}>
                {isLastStep ? 'Get Started' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

// Hook to manually trigger onboarding
export const useResetOnboarding = () => {
  return async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
  };
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  container: {
    width: '100%',
    maxWidth: 340,
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surfaceElevated,
  },
  dotActive: {
    backgroundColor: colors.nodeColors.blue,
    width: 24,
  },
  dotCompleted: {
    backgroundColor: colors.textTertiary,
  },
  content: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  visualText: {
    fontFamily: 'monospace',
    fontSize: 16,
    color: colors.nodeColors.blue,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 24,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.sm,
  },
  subtext: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  buttons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  skipButton: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: colors.surfaceElevated,
  },
  skipButtonText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  nextButton: {
    flex: 2,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: colors.nodeColors.blue,
  },
  nextButtonFull: {
    flex: 1,
  },
  nextButtonText: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
});
