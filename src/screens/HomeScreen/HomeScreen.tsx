// HomeScreen - The main schedule view

import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, StatusBar, Alert, TouchableOpacity, Text, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useScheduleStore } from '../../store/scheduleStore';
import { ScheduleNode, MINUTES_IN_DAY } from '../../types';
import { DayHeader } from '../../components/DayHeader';
import { DraggableNodeList } from '../../components/DraggableNodeList';
import { AddNodeButton } from '../../components/AddNodeButton';
import { NodeDetailModal } from '../../components/NodeDetailModal';
import { SettingsScreen } from '../SettingsScreen';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

export const HomeScreen: React.FC = () => {
  const {
    currentDate,
    isEditMode,
    goToPreviousDay,
    goToNextDay,
    goToToday,
    getCurrentDaySchedule,
    addNode,
    removeNode,
    updateNode,
    resizeNode,
    toggleNodeLock,
    toggleEditMode,
  } = useScheduleStore();
  
  const [selectedNode, setSelectedNode] = useState<ScheduleNode | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  
  const daySchedule = getCurrentDaySchedule();
  
  // Calculate time constraints for selected node's time pickers
  const { minStartMinutes, maxEndMinutes } = useMemo(() => {
    if (!selectedNode) return { minStartMinutes: 0, maxEndMinutes: MINUTES_IN_DAY };
    
    // Find the node's position in the list
    const nodeIndex = daySchedule.nodes.findIndex(n => n.id === selectedNode.id);
    if (nodeIndex === -1) return { minStartMinutes: 0, maxEndMinutes: MINUTES_IN_DAY };
    
    // Find previous non-filler node's end time
    let minStart = 0;
    for (let i = nodeIndex - 1; i >= 0; i--) {
      const prevNode = daySchedule.nodes[i];
      if (!prevNode.isFiller) {
        minStart = (prevNode.startMinutes || 0) + prevNode.durationMinutes;
        break;
      }
    }
    
    // Find next non-filler node's start time
    let maxEnd = MINUTES_IN_DAY;
    let currentMinutes = 0;
    for (let i = 0; i <= nodeIndex; i++) {
      currentMinutes += daySchedule.nodes[i].durationMinutes;
    }
    for (let i = nodeIndex + 1; i < daySchedule.nodes.length; i++) {
      const nextNode = daySchedule.nodes[i];
      if (!nextNode.isFiller) {
        maxEnd = currentMinutes + (nextNode.isFiller ? nextNode.durationMinutes : 0);
        // Actually, we need to find the total filler space after this node before next real node
        let fillerAfter = 0;
        for (let j = nodeIndex + 1; j < daySchedule.nodes.length; j++) {
          if (daySchedule.nodes[j].isFiller) {
            fillerAfter += daySchedule.nodes[j].durationMinutes;
          } else {
            break;
          }
        }
        maxEnd = currentMinutes + fillerAfter;
        break;
      }
    }
    
    return { minStartMinutes: minStart, maxEndMinutes: maxEnd };
  }, [selectedNode, daySchedule.nodes]);
  
  const handleNodePress = useCallback((node: ScheduleNode) => {
    if (node.isFiller) return; // Don't open filler nodes
    setSelectedNode(node);
    setIsModalVisible(true);
  }, []);
  
  const handleNodeLongPress = useCallback((node: ScheduleNode) => {
    if (node.isFiller) return;
    // Show quick actions
    Alert.alert(
      node.name,
      'Quick Actions',
      [
        { text: 'Edit', onPress: () => handleNodePress(node) },
        { text: 'Delete', style: 'destructive', onPress: () => handleDeleteNode(node.id) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  }, []);
  
  const handleAddNode = useCallback(() => {
    // Check if there's filler space available
    const fillerTime = daySchedule.nodes
      .filter(n => n.isFiller)
      .reduce((sum, n) => sum + n.durationMinutes, 0);
    
    if (fillerTime < 60) { // Need at least 1 hour of filler
      Alert.alert('No Space', 'There is not enough free time to add a new node.');
      return;
    }
    
    addNode();
  }, [daySchedule.nodes, addNode]);
  
  const handleSaveNode = useCallback((updates: Partial<ScheduleNode>) => {
    if (selectedNode) {
      updateNode(selectedNode.id, updates);
    }
    setIsModalVisible(false);
    setSelectedNode(null);
  }, [selectedNode, updateNode]);
  
  const handleDeleteNode = useCallback((nodeId?: string) => {
    const idToDelete = nodeId || selectedNode?.id;
    if (idToDelete) {
      removeNode(idToDelete);
    }
    setIsModalVisible(false);
    setSelectedNode(null);
  }, [selectedNode, removeNode]);
  
  const handleCloseModal = useCallback(() => {
    setIsModalVisible(false);
    setSelectedNode(null);
  }, []);
  
  const handleResizeNode = useCallback((nodeId: string, newStart: number, newDuration: number) => {
    resizeNode(nodeId, newStart, newDuration);
  }, [resizeNode]);
  
  const handleToggleLock = useCallback((nodeId: string) => {
    toggleNodeLock(nodeId);
  }, [toggleNodeLock]);
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <DayHeader
          dateString={currentDate}
          onPreviousDay={goToPreviousDay}
          onNextDay={goToNextDay}
          onToday={goToToday}
        />
        
        <DraggableNodeList
          nodes={daySchedule.nodes}
          isEditMode={isEditMode}
          onNodePress={handleNodePress}
          onResizeNode={handleResizeNode}
          onToggleLock={handleToggleLock}
        />
        
        {/* Edit Mode Toggle Button */}
        <TouchableOpacity
          style={[styles.editToggle, isEditMode && styles.editToggleActive]}
          onPress={toggleEditMode}
          activeOpacity={0.7}
        >
          <Text style={styles.editToggleText}>{isEditMode ? '✓ Done' : '✎ Edit'}</Text>
        </TouchableOpacity>
        
        <AddNodeButton onPress={handleAddNode} />
        
        {/* Settings Button */}
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => setIsSettingsVisible(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </SafeAreaView>
      
      <NodeDetailModal
        visible={isModalVisible}
        node={selectedNode}
        minStartMinutes={minStartMinutes}
        maxEndMinutes={maxEndMinutes}
        onClose={handleCloseModal}
        onSave={handleSaveNode}
        onDelete={() => handleDeleteNode()}
      />
      
      {/* Settings Modal */}
      <Modal
        visible={isSettingsVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsSettingsVisible(false)}
      >
        <SettingsScreen onClose={() => setIsSettingsVisible(false)} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
  },
  editToggle: {
    position: 'absolute',
    top: 100,
    right: spacing.md,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  editToggleActive: {
    backgroundColor: colors.buttonPrimary,
    borderColor: colors.buttonPrimary,
  },
  editToggleText: {
    ...typography.caption1,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  settingsButton: {
    position: 'absolute',
    top: 100,
    left: spacing.md,
    backgroundColor: colors.surface,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingsIcon: {
    fontSize: 20,
  },
});
