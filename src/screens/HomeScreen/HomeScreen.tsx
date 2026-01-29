// HomeScreen - The main schedule view

import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useScheduleStore } from '../../store/scheduleStore';
import { ScheduleNode, MINUTES_IN_DAY } from '../../types';
import { DayHeader } from '../../components/DayHeader';
import { NodeList } from '../../components/NodeList';
import { AddNodeButton } from '../../components/AddNodeButton';
import { NodeDetailModal } from '../../components/NodeDetailModal';
import { colors } from '../../theme/colors';

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
  } = useScheduleStore();
  
  const [selectedNode, setSelectedNode] = useState<ScheduleNode | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  const daySchedule = getCurrentDaySchedule();
  
  // Calculate max duration for selected node (its current + available filler space)
  const maxDurationForNode = useMemo(() => {
    if (!selectedNode) return MINUTES_IN_DAY;
    
    // Find total filler time available
    const fillerTime = daySchedule.nodes
      .filter(n => n.isFiller)
      .reduce((sum, n) => sum + n.durationMinutes, 0);
    
    return selectedNode.durationMinutes + fillerTime;
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
        
        <NodeList
          nodes={daySchedule.nodes}
          isEditMode={isEditMode}
          onNodePress={handleNodePress}
          onNodeLongPress={handleNodeLongPress}
        />
        
        <AddNodeButton onPress={handleAddNode} />
      </SafeAreaView>
      
      <NodeDetailModal
        visible={isModalVisible}
        node={selectedNode}
        maxDuration={maxDurationForNode}
        onClose={handleCloseModal}
        onSave={handleSaveNode}
        onDelete={() => handleDeleteNode()}
      />
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
});
