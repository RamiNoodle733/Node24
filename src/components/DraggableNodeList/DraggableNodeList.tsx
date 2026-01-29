// DraggableNodeList Component - Main schedule view with drag-to-resize

import React, { useMemo, useCallback, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  useWindowDimensions, 
  Text,
  Pressable,
} from 'react-native';
import { 
  GestureDetector, 
  Gesture,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { ScheduleNode, MINUTES_IN_DAY } from '../../types';
import { FillerNode } from '../FillerNode';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { layout, spacing } from '../../theme/spacing';
import { minutesToTime } from '../../utils/helpers';

interface DraggableNodeListProps {
  nodes: ScheduleNode[];
  isEditMode: boolean;
  onNodePress: (node: ScheduleNode) => void;
  onNodeLongPress?: (node: ScheduleNode) => void;
  onResizeNode: (nodeId: string, newStartMinutes: number, newDuration: number) => void;
  onToggleLock: (nodeId: string) => void;
}

const HANDLE_HEIGHT = 24;
const MIN_NODE_MINUTES = 15; // Minimum 15 minutes per node

export const DraggableNodeList: React.FC<DraggableNodeListProps> = ({
  nodes,
  isEditMode,
  onNodePress,
  onNodeLongPress,
  onResizeNode,
  onToggleLock,
}) => {
  const { height: windowHeight } = useWindowDimensions();
  
  // Calculate available height for the 24-hour view
  // Full height minus header and bottom bar
  const availableHeight = windowHeight - layout.headerHeight - layout.bottomBarHeight - 80;
  
  // Height per minute
  const heightPerMinute = availableHeight / MINUTES_IN_DAY;
  
  // Minimum height for a node (15 minutes worth)
  const minNodeHeight = MIN_NODE_MINUTES * heightPerMinute;

  // Convert minutes to pixels
  const minutesToPixels = (minutes: number) => minutes * heightPerMinute;
  // Convert pixels to minutes
  const pixelsToMinutes = (pixels: number) => Math.round(pixels / heightPerMinute);

  // Calculate cumulative start positions
  const nodesWithLayout = useMemo(() => {
    let currentStartMinutes = 0;
    return nodes.map((node) => {
      const startMinutes = currentStartMinutes;
      const height = minutesToPixels(node.durationMinutes);
      currentStartMinutes += node.durationMinutes;
      return { 
        node, 
        height: Math.max(height, node.isFiller ? 2 : minNodeHeight),
        startMinutes,
        endMinutes: currentStartMinutes,
      };
    });
  }, [nodes, heightPerMinute, minNodeHeight]);

  // Trigger haptic feedback
  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={[styles.container, { height: availableHeight }]}>
      {/* Time labels on the left */}
      <View style={styles.timeColumn}>
        {[3, 6, 9, 12, 15, 18, 21].map((hour) => (
          <View 
            key={hour} 
            style={[
              styles.timeLabel, 
              { top: minutesToPixels(hour * 60) - 6 }
            ]}
          >
            <Text style={styles.timeLabelText}>
              {minutesToTime(hour * 60)}
            </Text>
          </View>
        ))}
        {/* End of day label (midnight) */}
        <View style={[styles.timeLabel, { top: availableHeight - 6 }]}>
          <Text style={styles.timeLabelText}>12:00 AM</Text>
        </View>
      </View>

      {/* Nodes column */}
      <View style={styles.nodesColumn}>
        {/* Hour grid lines */}
        {[0, 3, 6, 9, 12, 15, 18, 21, 24].map((hour) => (
          <View 
            key={hour}
            style={[
              styles.gridLine,
              { top: minutesToPixels(hour * 60) }
            ]}
          />
        ))}

        {/* Render nodes */}
        {nodesWithLayout.map(({ node, height, startMinutes, endMinutes }, index) => (
          <NodeItem
            key={node.id}
            node={node}
            height={height}
            top={minutesToPixels(startMinutes)}
            startMinutes={startMinutes}
            endMinutes={endMinutes}
            isEditMode={isEditMode}
            heightPerMinute={heightPerMinute}
            minNodeHeight={minNodeHeight}
            onPress={() => onNodePress(node)}
            onLongPress={() => onNodeLongPress?.(node)}
            onToggleLock={() => onToggleLock(node.id)}
            onResize={(newStart, newDuration) => {
              triggerHaptic();
              onResizeNode(node.id, newStart, newDuration);
            }}
            prevNode={index > 0 ? nodesWithLayout[index - 1] : null}
            nextNode={index < nodesWithLayout.length - 1 ? nodesWithLayout[index + 1] : null}
            totalHeight={availableHeight}
          />
        ))}
      </View>
    </View>
  );
};

// Individual node item with drag handles
interface NodeItemProps {
  node: ScheduleNode;
  height: number;
  top: number;
  startMinutes: number;
  endMinutes: number;
  isEditMode: boolean;
  heightPerMinute: number;
  minNodeHeight: number;
  onPress: () => void;
  onLongPress: () => void;
  onToggleLock: () => void;
  onResize: (newStartMinutes: number, newDuration: number) => void;
  prevNode: { node: ScheduleNode; height: number; startMinutes: number; endMinutes: number } | null;
  nextNode: { node: ScheduleNode; height: number; startMinutes: number; endMinutes: number } | null;
  totalHeight: number;
}

const NodeItem: React.FC<NodeItemProps> = ({
  node,
  height,
  top,
  startMinutes,
  endMinutes,
  isEditMode,
  heightPerMinute,
  minNodeHeight,
  onPress,
  onLongPress,
  onToggleLock,
  onResize,
  prevNode,
  nextNode,
  totalHeight,
}) => {
  const nodeColor = colors.nodeColors[node.color] || colors.nodeColors.blue;
  
  // Animated values for dragging
  const topOffset = useSharedValue(0);
  const bottomOffset = useSharedValue(0);
  const isDragging = useSharedValue(false);

  // Calculate constraints
  const minTop = prevNode && !prevNode.node.isFiller && !prevNode.node.isLocked 
    ? 0 
    : (prevNode ? -prevNode.height + minNodeHeight : 0);
  const maxTop = height - minNodeHeight;
  
  const minBottom = -(height - minNodeHeight);
  const maxBottom = nextNode && !nextNode.node.isFiller && !nextNode.node.isLocked
    ? 0
    : (nextNode ? nextNode.height - minNodeHeight : 0);

  // Top handle gesture (changes start time)
  const topHandleGesture = Gesture.Pan()
    .enabled(isEditMode && !node.isLocked && !node.isFiller)
    .onStart(() => {
      isDragging.value = true;
    })
    .onUpdate((e) => {
      const newOffset = Math.max(minTop, Math.min(maxTop, e.translationY));
      topOffset.value = newOffset;
    })
    .onEnd(() => {
      isDragging.value = false;
      const deltaMinutes = Math.round(topOffset.value / heightPerMinute);
      const newStart = startMinutes + deltaMinutes;
      const newDuration = endMinutes - newStart;
      topOffset.value = withSpring(0, { damping: 20 });
      if (deltaMinutes !== 0) {
        runOnJS(onResize)(newStart, newDuration);
      }
    });

  // Bottom handle gesture (changes end time/duration)
  const bottomHandleGesture = Gesture.Pan()
    .enabled(isEditMode && !node.isLocked && !node.isFiller)
    .onStart(() => {
      isDragging.value = true;
    })
    .onUpdate((e) => {
      const newOffset = Math.max(minBottom, Math.min(maxBottom, e.translationY));
      bottomOffset.value = newOffset;
    })
    .onEnd(() => {
      isDragging.value = false;
      const deltaMinutes = Math.round(bottomOffset.value / heightPerMinute);
      const newDuration = (endMinutes - startMinutes) + deltaMinutes;
      bottomOffset.value = withSpring(0, { damping: 20 });
      if (deltaMinutes !== 0) {
        runOnJS(onResize)(startMinutes, newDuration);
      }
    });

  // Animated styles
  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: topOffset.value }],
    height: height - topOffset.value + bottomOffset.value,
  }));

  const animatedTopHandleStyle = useAnimatedStyle(() => ({
    opacity: isDragging.value ? 1 : 0.6,
  }));

  const animatedBottomHandleStyle = useAnimatedStyle(() => ({
    opacity: isDragging.value ? 1 : 0.6,
  }));

  if (node.isFiller) {
    return (
      <View style={[styles.nodeContainer, { top, height }]}>
        <FillerNode node={node} height={height} />
      </View>
    );
  }

  const showTimeRange = height > 50;
  const showTitle = height > 30;

  return (
    <Animated.View style={[styles.nodeContainer, { top }, animatedContainerStyle]}>
      <Pressable
        style={[
          styles.nodeContent,
          { backgroundColor: colors.surface },
          node.isLocked && styles.nodeLocked,
        ]}
        onPress={onPress}
        onLongPress={onLongPress}
      >
        {/* Color bar */}
        <View style={[styles.colorBar, { backgroundColor: nodeColor }]} />
        
        {/* Content */}
        <View style={styles.nodeTextContent}>
          {showTitle && (
            <Text style={styles.nodeTitle} numberOfLines={1}>
              {node.name || 'Node'}
            </Text>
          )}
          {showTimeRange && (
            <Text style={styles.nodeTime}>
              {minutesToTime(startMinutes)} → {minutesToTime(endMinutes)}
            </Text>
          )}
        </View>

        {/* Lock indicator */}
        {node.isLocked && (
          <View style={styles.lockIndicator}>
            <Text style={styles.lockIcon}>🔒</Text>
          </View>
        )}

        {/* Edit mode: Lock toggle button */}
        {isEditMode && !node.isFiller && (
          <Pressable 
            style={styles.lockButton}
            onPress={onToggleLock}
            hitSlop={8}
          >
            <Text style={styles.lockButtonText}>
              {node.isLocked ? '🔒' : '🔓'}
            </Text>
          </Pressable>
        )}
      </Pressable>

      {/* Top drag handle */}
      {isEditMode && !node.isLocked && !node.isFiller && (
        <GestureDetector gesture={topHandleGesture}>
          <Animated.View style={[styles.dragHandle, styles.topHandle, animatedTopHandleStyle]}>
            <View style={[styles.handleBar, { backgroundColor: nodeColor }]} />
          </Animated.View>
        </GestureDetector>
      )}

      {/* Bottom drag handle */}
      {isEditMode && !node.isLocked && !node.isFiller && (
        <GestureDetector gesture={bottomHandleGesture}>
          <Animated.View style={[styles.dragHandle, styles.bottomHandle, animatedBottomHandleStyle]}>
            <View style={[styles.handleBar, { backgroundColor: nodeColor }]} />
          </Animated.View>
        </GestureDetector>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.background,
  },
  timeColumn: {
    width: 54,
    position: 'relative',
  },
  timeLabel: {
    position: 'absolute',
    right: spacing.xs,
  },
  timeLabelText: {
    ...typography.caption2,
    color: colors.textTertiary,
    fontSize: 9,
  },
  nodesColumn: {
    flex: 1,
    position: 'relative',
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.divider,
    opacity: 0.3,
  },
  nodeContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  nodeContent: {
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  nodeLocked: {
    opacity: 0.8,
  },
  colorBar: {
    width: 4,
  },
  nodeTextContent: {
    flex: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    justifyContent: 'center',
  },
  nodeTitle: {
    ...typography.subheadBold,
    color: colors.textPrimary,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  nodeTime: {
    ...typography.caption2,
    color: colors.textTertiary,
    fontSize: 10,
    marginTop: 2,
  },
  lockIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  lockIcon: {
    fontSize: 10,
  },
  lockButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    padding: 4,
  },
  lockButtonText: {
    fontSize: 14,
  },
  dragHandle: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: HANDLE_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  topHandle: {
    top: -HANDLE_HEIGHT / 2,
  },
  bottomHandle: {
    bottom: -HANDLE_HEIGHT / 2,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
});
