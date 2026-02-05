// HomeScreen - The main schedule view

import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, StatusBar, Alert, TouchableOpacity, Text, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useScheduleStore } from '../../store/scheduleStore';
import { ScheduleNode, MINUTES_IN_DAY } from '../../types';
import { DayHeader } from '../../components/DayHeader';
import { DraggableNodeList } from '../../components/DraggableNodeList';
import { AddNodeButton } from '../../components/AddNodeButton';
import { NodeDetailModal } from '../../components/NodeDetailModal';
import { CalendarPopup } from '../../components/CalendarPopup';
import { PremiumModal } from '../../components/PremiumModal';
import { Onboarding } from '../../components/Onboarding';
import { AIAssistantBar } from '../../components/AIAssistantBar';
import { QuickActionsMenu } from '../../components/QuickActionsMenu';
import { SettingsScreen } from '../SettingsScreen';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

// Freemium limits
const FREE_NODE_LIMIT = 5;

export const HomeScreen: React.FC = () => {
  const {
    currentDate,
    isEditMode,
    isPremium,
    setCurrentDate,
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

  // Modal states
  const [selectedNode, setSelectedNode] = useState<ScheduleNode | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [isPremiumModalVisible, setIsPremiumModalVisible] = useState(false);
  const [premiumTrigger, setPremiumTrigger] = useState<string | undefined>();
  const [quickActionNode, setQuickActionNode] = useState<ScheduleNode | null>(null);
  const [isQuickActionsVisible, setIsQuickActionsVisible] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  const daySchedule = getCurrentDaySchedule();

  // Count non-filler nodes for freemium limit
  const realNodeCount = useMemo(() => {
    return daySchedule.nodes.filter(n => !n.isFiller).length;
  }, [daySchedule.nodes]);

  // Calculate time constraints for selected node's time pickers
  const { minStartMinutes, maxEndMinutes } = useMemo(() => {
    if (!selectedNode) return { minStartMinutes: 0, maxEndMinutes: MINUTES_IN_DAY };

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

  // Premium gate check
  const showPremiumGate = useCallback((feature: string) => {
    setPremiumTrigger(feature);
    setIsPremiumModalVisible(true);
  }, []);

  const handleNodePress = useCallback((node: ScheduleNode) => {
    if (node.isFiller) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedNode(node);
    setIsModalVisible(true);
  }, []);

  const handleNodeLongPress = useCallback((node: ScheduleNode) => {
    if (node.isFiller) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setQuickActionNode(node);
    setIsQuickActionsVisible(true);
  }, []);

  const handleQuickAction = useCallback((actionId: string) => {
    if (!quickActionNode) return;

    switch (actionId) {
      case 'edit':
        setSelectedNode(quickActionNode);
        setIsModalVisible(true);
        break;
      case 'duplicate':
        if (!isPremium && realNodeCount >= FREE_NODE_LIMIT) {
          showPremiumGate('unlimited nodes');
          return;
        }
        // Create a duplicate with slightly different name
        const duplicate = {
          ...quickActionNode,
          name: `${quickActionNode.name} (copy)`,
        };
        // For now, just add a new node - it won't be exact duplicate but shows the feature
        addNode();
        break;
      case 'lock':
        toggleNodeLock(quickActionNode.id);
        break;
      case 'reminder':
        if (!isPremium) {
          showPremiumGate('reminders');
          return;
        }
        setSelectedNode(quickActionNode);
        setIsModalVisible(true);
        break;
      case 'repeat':
        if (!isPremium) {
          showPremiumGate('repeating nodes');
          return;
        }
        setSelectedNode(quickActionNode);
        setIsModalVisible(true);
        break;
      case 'delete':
        Alert.alert(
          'Delete Node',
          `Are you sure you want to delete "${quickActionNode.name}"?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => removeNode(quickActionNode.id),
            },
          ]
        );
        break;
      case 'premium_required':
        showPremiumGate('this feature');
        break;
    }
    setQuickActionNode(null);
  }, [quickActionNode, isPremium, realNodeCount, addNode, toggleNodeLock, removeNode, showPremiumGate]);

  const handleAddNode = useCallback(() => {
    // Check freemium limit
    if (!isPremium && realNodeCount >= FREE_NODE_LIMIT) {
      showPremiumGate('unlimited nodes');
      return;
    }

    // Check if there's filler space available
    const fillerTime = daySchedule.nodes
      .filter(n => n.isFiller)
      .reduce((sum, n) => sum + n.durationMinutes, 0);

    if (fillerTime < 60) {
      Alert.alert('No Space', 'There is not enough free time to add a new node. Resize existing nodes to make room.');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    addNode();
  }, [daySchedule.nodes, addNode, isPremium, realNodeCount, showPremiumGate]);

  const handleSaveNode = useCallback((updates: Partial<ScheduleNode>) => {
    if (selectedNode) {
      // Check premium features
      if (!isPremium) {
        if (updates.reminder?.enabled) {
          showPremiumGate('reminders');
          return;
        }
        if (updates.repeatRule?.type && updates.repeatRule.type !== 'none') {
          showPremiumGate('repeating nodes');
          return;
        }
      }
      updateNode(selectedNode.id, updates);
    }
    setIsModalVisible(false);
    setSelectedNode(null);
  }, [selectedNode, updateNode, isPremium, showPremiumGate]);

  const handleDeleteNode = useCallback((nodeId?: string) => {
    const idToDelete = nodeId || selectedNode?.id;
    if (idToDelete) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleNodeLock(nodeId);
  }, [toggleNodeLock]);

  const handleDatePress = useCallback(() => {
    Haptics.selectionAsync();
    setIsCalendarVisible(true);
  }, []);

  const handleSelectDate = useCallback((date: string) => {
    setCurrentDate(date);
  }, [setCurrentDate]);

  const handleAISuggestion = useCallback((suggestion: string) => {
    // In the future, this would actually parse and create nodes
    Alert.alert('AI Feature Coming Soon', `This will create a node from: "${suggestion}"`);
  }, []);

  const handleVoiceInput = useCallback(() => {
    Alert.alert('Voice Input Coming Soon', 'Speak your schedule and AI will create nodes automatically.');
  }, []);

  const handleEditModeToggle = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleEditMode();
  }, [toggleEditMode]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* Onboarding */}
      <Onboarding onComplete={() => setOnboardingComplete(true)} />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header with settings button */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => setIsSettingsVisible(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.settingsIcon}>⚙</Text>
          </TouchableOpacity>

          <DayHeader
            dateString={currentDate}
            onPreviousDay={goToPreviousDay}
            onNextDay={goToNextDay}
            onToday={goToToday}
            onDatePress={handleDatePress}
          />

          <TouchableOpacity
            style={[styles.editToggle, isEditMode && styles.editToggleActive]}
            onPress={handleEditModeToggle}
            activeOpacity={0.7}
          >
            <Text style={styles.editToggleText}>{isEditMode ? '✓' : '✎'}</Text>
          </TouchableOpacity>
        </View>

        {/* Node count indicator for free users */}
        {!isPremium && (
          <View style={styles.nodeLimitIndicator}>
            <Text style={styles.nodeLimitText}>
              {realNodeCount}/{FREE_NODE_LIMIT} nodes
            </Text>
            {realNodeCount >= FREE_NODE_LIMIT && (
              <TouchableOpacity onPress={() => showPremiumGate('unlimited nodes')}>
                <Text style={styles.upgradeLink}>Upgrade</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Main schedule view */}
        <DraggableNodeList
          nodes={daySchedule.nodes}
          isEditMode={isEditMode}
          onNodePress={handleNodePress}
          onNodeLongPress={handleNodeLongPress}
          onResizeNode={handleResizeNode}
          onToggleLock={handleToggleLock}
        />

        {/* AI Assistant Bar - always visible at bottom */}
        <AIAssistantBar
          isPremium={isPremium}
          onSuggestionSelect={handleAISuggestion}
          onVoiceInput={handleVoiceInput}
          onTextSubmit={handleAISuggestion}
          onPremiumRequired={() => showPremiumGate('AI Assistant')}
        />

        <AddNodeButton onPress={handleAddNode} />
      </SafeAreaView>

      {/* Modals */}
      <NodeDetailModal
        visible={isModalVisible}
        node={selectedNode}
        minStartMinutes={minStartMinutes}
        maxEndMinutes={maxEndMinutes}
        onClose={handleCloseModal}
        onSave={handleSaveNode}
        onDelete={() => handleDeleteNode()}
      />

      <CalendarPopup
        visible={isCalendarVisible}
        selectedDate={currentDate}
        onSelectDate={handleSelectDate}
        onClose={() => setIsCalendarVisible(false)}
      />

      <PremiumModal
        visible={isPremiumModalVisible}
        onClose={() => setIsPremiumModalVisible(false)}
        triggeredBy={premiumTrigger}
      />

      <QuickActionsMenu
        visible={isQuickActionsVisible}
        onClose={() => setIsQuickActionsVisible(false)}
        onAction={handleQuickAction}
        nodeName={quickActionNode?.name}
        isPremium={isPremium}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  settingsButton: {
    backgroundColor: colors.surface,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingsIcon: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  editToggle: {
    backgroundColor: colors.surface,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  editToggleActive: {
    backgroundColor: colors.buttonPrimary,
    borderColor: colors.buttonPrimary,
  },
  editToggleText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  nodeLimitIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    gap: spacing.sm,
  },
  nodeLimitText: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  upgradeLink: {
    ...typography.caption,
    color: colors.nodeColors.blue,
    fontWeight: '600',
  },
});
