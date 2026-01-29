// ScheduleNodeCard Component - A real (non-filler) schedule node

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { ScheduleNode } from '../../types';
import { colors, NodeColorKey } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { layout, spacing } from '../../theme/spacing';
import { formatDuration, getNodeStartTime, minutesToTime } from '../../utils/helpers';

interface ScheduleNodeCardProps {
  node: ScheduleNode;
  height: number;
  startMinutes: number;
  isEditMode: boolean;
  onPress: () => void;
  onLongPress?: () => void;
}

export const ScheduleNodeCard: React.FC<ScheduleNodeCardProps> = ({
  node,
  height,
  startMinutes,
  isEditMode,
  onPress,
  onLongPress,
}) => {
  const nodeColor = colors.nodeColors[node.color as NodeColorKey] || colors.nodeColors.blue;
  const endMinutes = startMinutes + node.durationMinutes;
  
  // Determine if we should show compact layout
  const isCompact = height < 80;
  const isVeryCompact = height < 55;
  const isTiny = height < 40;
  
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        { height },
        pressed && styles.pressed,
        isEditMode && styles.editMode,
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      {/* Color indicator bar */}
      <View style={[styles.colorBar, { backgroundColor: nodeColor }]} />
      
      <View style={styles.content}>
        {isTiny ? (
          // Tiny layout - just name
          <Text style={styles.titleTiny} numberOfLines={1}>
            {node.name}
          </Text>
        ) : (
          <>
            <View style={styles.header}>
              <Text 
                style={[styles.title, isVeryCompact && styles.titleCompact]} 
                numberOfLines={1}
              >
                {node.name}
              </Text>
              <Text style={styles.duration}>{formatDuration(node.durationMinutes)}</Text>
            </View>
            
            {!isCompact && (
              <View style={styles.timeRow}>
                <Text style={styles.timeText}>
                  {minutesToTime(startMinutes)} → {minutesToTime(endMinutes)}
                </Text>
              </View>
            )}
            
            {!isCompact && node.notes && (
              <Text style={styles.notes} numberOfLines={1}>
                {node.notes}
              </Text>
            )}
          </>
        )}
      </View>
      
      {/* Indicators */}
      <View style={styles.indicators}>
        {/* Repeat indicator */}
        {node.repeatRule.type !== 'none' && (
          <View style={[styles.indicator, { backgroundColor: nodeColor + '40' }]}>
            <Text style={[styles.indicatorIcon, { color: nodeColor }]}>↻</Text>
          </View>
        )}
        
        {/* Reminder indicator */}
        {node.reminder.enabled && (
          <View style={[styles.indicator, styles.reminderIndicator]}>
            <Text style={styles.indicatorIcon}>🔔</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    minHeight: layout.nodeMinHeight,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  pressed: {
    backgroundColor: colors.surfaceElevated,
  },
  editMode: {
    borderWidth: 1,
    borderColor: colors.buttonPrimary,
    borderStyle: 'dashed',
  },
  colorBar: {
    width: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    ...typography.nodeTitle,
    color: colors.textPrimary,
    flex: 1,
    fontSize: 14,
  },
  titleCompact: {
    fontSize: 13,
  },
  titleTiny: {
    ...typography.nodeTitle,
    color: colors.textPrimary,
    fontSize: 12,
  },
  duration: {
    ...typography.caption1,
    color: colors.textSecondary,
    marginLeft: spacing.md,
  },
  timeRow: {
    marginTop: spacing.xs,
  },
  timeText: {
    ...typography.caption2,
    color: colors.textTertiary,
    fontSize: 11,
  },
  notes: {
    ...typography.caption2,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  indicators: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingTop: spacing.sm,
    paddingRight: spacing.sm,
    gap: 4,
  },
  indicator: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reminderIndicator: {
    backgroundColor: 'transparent',
  },
  indicatorIcon: {
    fontSize: 11,
  },
});
