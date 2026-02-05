// DayHeader Component - Shows current date with navigation

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { layout, spacing } from '../../theme/spacing';
import { formatDateDisplay, isToday, parseDate } from '../../utils/helpers';

interface DayHeaderProps {
  dateString: string;
  onPreviousDay: () => void;
  onNextDay: () => void;
  onToday: () => void;
  onDatePress?: () => void; // Opens calendar popup
}

const formatDateForHeader = (dateString: string): { day: string; month: string; year: string } => {
  const date = parseDate(dateString);
  const day = date.getDate().toString();
  const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const year = date.getFullYear().toString();
  return { day, month, year };
};

export const DayHeader: React.FC<DayHeaderProps> = ({
  dateString,
  onPreviousDay,
  onNextDay,
  onToday,
  onDatePress,
}) => {
  const isTodayDate = isToday(dateString);
  const { day, month, year } = formatDateForHeader(dateString);

  const handleDatePress = () => {
    if (onDatePress) {
      onDatePress();
    } else {
      onToday();
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [styles.navButton, pressed && styles.navButtonPressed]}
        onPress={onPreviousDay}
        hitSlop={8}
      >
        <Text style={styles.navIcon}>‹</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [styles.dateContainer, pressed && styles.datePressed]}
        onPress={handleDatePress}
        onLongPress={onToday}
      >
        <View style={styles.dateContent}>
          <Text style={styles.dayNumber}>{day}</Text>
          <View style={styles.dateRight}>
            <Text style={styles.monthText}>{month}</Text>
            <Text style={styles.yearText}>{year}</Text>
          </View>
        </View>
        {isTodayDate && (
          <View style={styles.todayBadge}>
            <Text style={styles.todayText}>TODAY</Text>
          </View>
        )}
      </Pressable>

      <Pressable
        style={({ pressed }) => [styles.navButton, pressed && styles.navButtonPressed]}
        onPress={onNextDay}
        hitSlop={8}
      >
        <Text style={styles.navIcon}>›</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonPressed: {
    opacity: 0.5,
  },
  navIcon: {
    fontSize: 36,
    color: colors.textSecondary,
    fontWeight: '200',
  },
  dateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },
  datePressed: {
    opacity: 0.6,
  },
  dateContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayNumber: {
    fontSize: 36,
    fontWeight: '200',
    color: colors.textPrimary,
    marginRight: spacing.sm,
  },
  dateRight: {
    justifyContent: 'center',
  },
  monthText: {
    ...typography.caption1,
    color: colors.textSecondary,
    fontWeight: '600',
    letterSpacing: 1,
  },
  yearText: {
    ...typography.caption2,
    color: colors.textTertiary,
  },
  todayBadge: {
    backgroundColor: colors.buttonPrimary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    marginTop: 4,
  },
  todayText: {
    ...typography.caption2,
    color: colors.textPrimary,
    fontWeight: '600',
    letterSpacing: 1,
  },
});
