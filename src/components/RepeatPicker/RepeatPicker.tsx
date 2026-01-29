// RepeatPicker Component - For selecting repeat options

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { RepeatRule, RepeatType } from '../../types';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface RepeatPickerProps {
  repeatRule: RepeatRule;
  onChangeRepeat: (rule: RepeatRule) => void;
}

const repeatOptions: { type: RepeatType; label: string }[] = [
  { type: 'none', label: 'Never' },
  { type: 'daily', label: 'Every Day' },
  { type: 'weekdays', label: 'Weekdays' },
  { type: 'weekends', label: 'Weekends' },
  { type: 'weekly', label: 'Weekly' },
  { type: 'monthly', label: 'Monthly' },
  { type: 'yearly', label: 'Yearly' },
];

export const RepeatPicker: React.FC<RepeatPickerProps> = ({
  repeatRule,
  onChangeRepeat,
}) => {
  return (
    <View style={styles.container}>
      {repeatOptions.map((option) => (
        <Pressable
          key={option.type}
          style={({ pressed }) => [
            styles.option,
            repeatRule.type === option.type && styles.optionSelected,
            pressed && styles.optionPressed,
          ]}
          onPress={() => onChangeRepeat({ type: option.type })}
        >
          <Text
            style={[
              styles.optionText,
              repeatRule.type === option.type && styles.optionTextSelected,
            ]}
          >
            {option.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  option: {
    backgroundColor: colors.buttonSecondary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  optionSelected: {
    backgroundColor: colors.buttonPrimary,
  },
  optionPressed: {
    opacity: 0.8,
  },
  optionText: {
    ...typography.caption1,
    color: colors.textSecondary,
  },
  optionTextSelected: {
    color: colors.textPrimary,
  },
});
