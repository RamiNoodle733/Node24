// DurationPicker Component - For selecting node duration

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { formatDuration } from '../../utils/helpers';

interface DurationPickerProps {
  durationMinutes: number;
  onChangeDuration: (minutes: number) => void;
  minDuration?: number;
  maxDuration?: number;
}

export const DurationPicker: React.FC<DurationPickerProps> = ({
  durationMinutes,
  onChangeDuration,
  minDuration = 15,
  maxDuration = 1440,
}) => {
  const adjustDuration = (delta: number) => {
    const newDuration = Math.max(minDuration, Math.min(maxDuration, durationMinutes + delta));
    onChangeDuration(newDuration);
  };
  
  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={() => adjustDuration(-60)}
        disabled={durationMinutes <= minDuration}
      >
        <Text style={styles.buttonText}>−1hr</Text>
      </Pressable>
      
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={() => adjustDuration(-15)}
        disabled={durationMinutes <= minDuration}
      >
        <Text style={styles.buttonText}>−15m</Text>
      </Pressable>
      
      <View style={styles.durationDisplay}>
        <Text style={styles.durationText}>{formatDuration(durationMinutes)}</Text>
      </View>
      
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={() => adjustDuration(15)}
        disabled={durationMinutes >= maxDuration}
      >
        <Text style={styles.buttonText}>+15m</Text>
      </Pressable>
      
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={() => adjustDuration(60)}
        disabled={durationMinutes >= maxDuration}
      >
        <Text style={styles.buttonText}>+1hr</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: colors.buttonSecondary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  buttonPressed: {
    backgroundColor: colors.surfaceElevated,
  },
  buttonText: {
    ...typography.caption1,
    color: colors.textPrimary,
  },
  durationDisplay: {
    paddingHorizontal: spacing.lg,
  },
  durationText: {
    ...typography.title3,
    color: colors.textPrimary,
  },
});
