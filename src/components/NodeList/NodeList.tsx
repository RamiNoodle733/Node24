// NodeList Component - The main scrollable list of nodes

import React, { useMemo } from 'react';
import { View, ScrollView, StyleSheet, useWindowDimensions, Text } from 'react-native';
import { ScheduleNode, MINUTES_IN_DAY } from '../../types';
import { FillerNode } from '../FillerNode';
import { ScheduleNodeCard } from '../ScheduleNodeCard';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { layout, spacing } from '../../theme/spacing';
import { getNodeStartTime, minutesToTime } from '../../utils/helpers';

interface NodeListProps {
  nodes: ScheduleNode[];
  isEditMode: boolean;
  onNodePress: (node: ScheduleNode) => void;
  onNodeLongPress?: (node: ScheduleNode) => void;
}

export const NodeList: React.FC<NodeListProps> = ({
  nodes,
  isEditMode,
  onNodePress,
  onNodeLongPress,
}) => {
  const { height: windowHeight } = useWindowDimensions();
  
  // Calculate available height for nodes
  // Subtract header, bottom bar, and some padding
  const availableHeight = Math.max(windowHeight - layout.headerHeight - layout.bottomBarHeight - 120, 400);
  
  // Calculate height per minute
  const heightPerMinute = availableHeight / MINUTES_IN_DAY;
  
  // Calculate node heights and start times
  const nodesWithLayout = useMemo(() => {
    let currentStartMinutes = 0;
    return nodes.map((node, index) => {
      const startMinutes = currentStartMinutes;
      const height = Math.max(
        node.durationMinutes * heightPerMinute,
        node.isFiller ? 8 : layout.nodeMinHeight
      );
      currentStartMinutes += node.durationMinutes;
      return { node, height, startMinutes, endMinutes: currentStartMinutes };
    });
  }, [nodes, heightPerMinute]);
  
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* 12:00 AM marker */}
      <View style={styles.dayStartMarker}>
        <Text style={styles.dayMarkerText}>12:00 AM</Text>
        <View style={styles.dayMarkerLine} />
      </View>
      
      {nodesWithLayout.map(({ node, height, startMinutes, endMinutes }, index) => (
        <View key={node.id} style={styles.nodeRow}>
          {/* Time column */}
          <View style={styles.timeColumn}>
            {height > 24 && (
              <Text style={styles.timeText}>{minutesToTime(startMinutes)}</Text>
            )}
          </View>
          
          {/* Node column */}
          <View style={styles.nodeColumn}>
            {node.isFiller ? (
              <FillerNode node={node} height={height} />
            ) : (
              <ScheduleNodeCard
                node={node}
                height={height}
                startMinutes={startMinutes}
                isEditMode={isEditMode}
                onPress={() => onNodePress(node)}
                onLongPress={() => onNodeLongPress?.(node)}
              />
            )}
          </View>
        </View>
      ))}
      
      {/* End of day marker */}
      <View style={styles.dayEndMarker}>
        <Text style={styles.dayMarkerText}>12:00 AM</Text>
        <View style={styles.dayMarkerLine} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  nodeRow: {
    flexDirection: 'row',
    marginHorizontal: spacing.md,
  },
  timeColumn: {
    width: 56,
    paddingRight: spacing.sm,
    alignItems: 'flex-end',
    paddingTop: 2,
  },
  timeText: {
    ...typography.caption2,
    color: colors.textTertiary,
    fontSize: 10,
  },
  nodeColumn: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: colors.divider,
  },
  dayStartMarker: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
  },
  dayEndMarker: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginTop: spacing.xs,
  },
  dayMarkerText: {
    ...typography.caption2,
    color: colors.textTertiary,
    width: 52,
    textAlign: 'right',
    paddingRight: spacing.sm,
    fontSize: 10,
  },
  dayMarkerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
});
