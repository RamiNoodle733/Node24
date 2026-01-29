// TimePicker Component - For selecting start/end times

import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { minutesToTime } from '../../utils/helpers';

interface TimePickerProps {
  label: string;
  minutes: number;
  onChange: (minutes: number) => void;
  minMinutes?: number;
  maxMinutes?: number;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  label,
  minutes,
  onChange,
  minMinutes = 0,
  maxMinutes = 1440,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Generate time options in 15-minute increments
  const timeOptions: number[] = [];
  for (let m = minMinutes; m <= maxMinutes && m < 1440; m += 15) {
    timeOptions.push(m);
  }
  
  const handleSelect = (newMinutes: number) => {
    onChange(newMinutes);
    setIsExpanded(false);
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        style={({ pressed }) => [
          styles.selector,
          pressed && styles.selectorPressed,
          isExpanded && styles.selectorActive,
        ]}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text style={styles.selectorText}>{minutesToTime(minutes)}</Text>
        <Text style={styles.chevron}>{isExpanded ? '▲' : '▼'}</Text>
      </Pressable>
      
      {isExpanded && (
        <View style={styles.dropdown}>
          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
          >
            {timeOptions.map((m) => (
              <Pressable
                key={m}
                style={[
                  styles.option,
                  m === minutes && styles.optionSelected,
                ]}
                onPress={() => handleSelect(m)}
              >
                <Text
                  style={[
                    styles.optionText,
                    m === minutes && styles.optionTextSelected,
                  ]}
                >
                  {minutesToTime(m)}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    ...typography.caption1,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    letterSpacing: 1,
  },
  selector: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectorPressed: {
    backgroundColor: colors.surfaceElevated,
  },
  selectorActive: {
    borderColor: colors.buttonPrimary,
  },
  selectorText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  chevron: {
    ...typography.caption1,
    color: colors.textSecondary,
  },
  dropdown: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: colors.border,
    maxHeight: 200,
  },
  scrollView: {
    maxHeight: 200,
  },
  option: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  optionSelected: {
    backgroundColor: colors.buttonPrimary,
  },
  optionText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  optionTextSelected: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
});
