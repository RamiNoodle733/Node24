import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { formatDateDisplay, parseDate, formatDate } from '../../utils/helpers';

interface CalendarPopupProps {
  visible: boolean;
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
  onClose: () => void;
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const CalendarPopup: React.FC<CalendarPopupProps> = ({
  visible,
  selectedDate,
  onSelectDate,
  onClose,
}) => {
  const [viewDate, setViewDate] = useState(() => {
    const parsed = parseDate(selectedDate);
    return { year: parsed.getFullYear(), month: parsed.getMonth() };
  });

  const today = useMemo(() => formatDate(new Date()), []);

  const calendarDays = useMemo(() => {
    const { year, month } = viewDate;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days: Array<{ date: string; day: number; isCurrentMonth: boolean; isToday: boolean; isSelected: boolean }> = [];

    // Previous month days
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const date = formatDate(new Date(year, month - 1, day));
      days.push({
        date,
        day,
        isCurrentMonth: false,
        isToday: date === today,
        isSelected: date === selectedDate,
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = formatDate(new Date(year, month, day));
      days.push({
        date,
        day,
        isCurrentMonth: true,
        isToday: date === today,
        isSelected: date === selectedDate,
      });
    }

    // Next month days
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = formatDate(new Date(year, month + 1, day));
      days.push({
        date,
        day,
        isCurrentMonth: false,
        isToday: date === today,
        isSelected: date === selectedDate,
      });
    }

    return days;
  }, [viewDate, selectedDate, today]);

  const monthYearLabel = useMemo(() => {
    const date = new Date(viewDate.year, viewDate.month);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, [viewDate]);

  const goToPreviousMonth = () => {
    Haptics.selectionAsync();
    setViewDate(prev => {
      if (prev.month === 0) {
        return { year: prev.year - 1, month: 11 };
      }
      return { ...prev, month: prev.month - 1 };
    });
  };

  const goToNextMonth = () => {
    Haptics.selectionAsync();
    setViewDate(prev => {
      if (prev.month === 11) {
        return { year: prev.year + 1, month: 0 };
      }
      return { ...prev, month: prev.month + 1 };
    });
  };

  const handleSelectDate = (date: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelectDate(date);
    onClose();
  };

  const goToToday = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const now = new Date();
    setViewDate({ year: now.getFullYear(), month: now.getMonth() });
    onSelectDate(today);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.container} onPress={e => e.stopPropagation()}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={goToPreviousMonth}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.navButtonText}>◀</Text>
            </TouchableOpacity>
            <Text style={styles.monthYearLabel}>{monthYearLabel}</Text>
            <TouchableOpacity
              style={styles.navButton}
              onPress={goToNextMonth}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.navButtonText}>▶</Text>
            </TouchableOpacity>
          </View>

          {/* Days of week */}
          <View style={styles.daysOfWeek}>
            {DAYS_OF_WEEK.map(day => (
              <Text key={day} style={styles.dayOfWeekText}>
                {day}
              </Text>
            ))}
          </View>

          {/* Calendar grid */}
          <View style={styles.calendarGrid}>
            {calendarDays.map((dayInfo, index) => (
              <TouchableOpacity
                key={`${dayInfo.date}-${index}`}
                style={[
                  styles.dayCell,
                  dayInfo.isSelected && styles.selectedDay,
                  dayInfo.isToday && !dayInfo.isSelected && styles.todayDay,
                ]}
                onPress={() => handleSelectDate(dayInfo.date)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.dayText,
                    !dayInfo.isCurrentMonth && styles.otherMonthText,
                    dayInfo.isSelected && styles.selectedDayText,
                    dayInfo.isToday && !dayInfo.isSelected && styles.todayText,
                  ]}
                >
                  {dayInfo.day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Today button */}
          <TouchableOpacity style={styles.todayButton} onPress={goToToday}>
            <Text style={styles.todayButtonText}>Today</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    width: 320,
    maxWidth: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  navButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  monthYearLabel: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  daysOfWeek: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  dayOfWeekText: {
    flex: 1,
    textAlign: 'center',
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  dayText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  otherMonthText: {
    color: colors.textTertiary,
  },
  selectedDay: {
    backgroundColor: colors.nodeColors.blue,
  },
  selectedDayText: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  todayDay: {
    borderWidth: 1,
    borderColor: colors.nodeColors.blue,
  },
  todayText: {
    color: colors.nodeColors.blue,
    fontWeight: '600',
  },
  todayButton: {
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderRadius: 8,
  },
  todayButtonText: {
    ...typography.bodyBold,
    color: colors.nodeColors.blue,
  },
});
