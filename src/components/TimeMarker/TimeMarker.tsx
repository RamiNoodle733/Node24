// TimeMarker Component - Shows time indicators alongside nodes

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { minutesToTime } from '../../utils/helpers';

interface TimeMarkerProps {
  startMinutes: number;
  height: number;
  showEnd?: boolean;
  endMinutes?: number;
}

export const TimeMarker: React.FC<TimeMarkerProps> = ({
  startMinutes,
  height,
  showEnd = false,
  endMinutes = 0,
}) => {
  // Only show marker if height is sufficient
  const showStartTime = height > 30;
  
  return (
    <View style={[styles.container, { height }]}>
      {showStartTime && (
        <Text style={styles.timeText}>{minutesToTime(startMinutes)}</Text>
      )}
      {showEnd && showStartTime && (
        <Text style={[styles.timeText, styles.endTime]}>
          {minutesToTime(endMinutes)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 60,
    paddingRight: spacing.sm,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  timeText: {
    ...typography.caption2,
    color: colors.textTertiary,
  },
  endTime: {
    position: 'absolute',
    bottom: 0,
  },
});
