// NodeDetailModal Component - Full-screen modal for editing a node

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Modal,
  SafeAreaView,
  ScrollView,
  Switch,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { ScheduleNode, MINUTES_IN_DAY } from '../../types';
import { colors, NodeColorKey } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, layout } from '../../theme/spacing';
import { ColorPicker } from '../ColorPicker';
import { RepeatPicker } from '../RepeatPicker';
import { TimePicker } from '../TimePicker';
import { minutesToTime } from '../../utils/helpers';

interface NodeDetailModalProps {
  visible: boolean;
  node: ScheduleNode | null;
  maxEndMinutes: number;
  minStartMinutes: number;
  onClose: () => void;
  onSave: (updates: Partial<ScheduleNode>) => void;
  onDelete: () => void;
  isNewNode?: boolean;
}

export const NodeDetailModal: React.FC<NodeDetailModalProps> = ({
  visible,
  node,
  maxEndMinutes,
  minStartMinutes,
  onClose,
  onSave,
  onDelete,
  isNewNode = false,
}) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState<NodeColorKey>('blue');
  const [notes, setNotes] = useState('');
  const [startMinutes, setStartMinutes] = useState(0);
  const [endMinutes, setEndMinutes] = useState(240);
  const [repeatRule, setRepeatRule] = useState(node?.repeatRule || { type: 'none' as const });
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderMinutes, setReminderMinutes] = useState(10);
  
  const nameInputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Reset form when node changes
  useEffect(() => {
    if (node) {
      // For new nodes, start with empty name. For existing, keep name.
      setName(isNewNode ? '' : node.name);
      setColor(node.color);
      setNotes(node.notes || '');
      setStartMinutes(node.startMinutes || 0);
      setEndMinutes((node.startMinutes || 0) + node.durationMinutes);
      setRepeatRule(node.repeatRule);
      setReminderEnabled(node.reminder.enabled);
      setReminderMinutes(node.reminder.minutesBefore);
    }
  }, [node, isNewNode]);
  
  // Auto focus on name input when modal opens
  useEffect(() => {
    if (visible && nameInputRef.current) {
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
    }
  }, [visible]);
  
  const handleSave = () => {
    const duration = endMinutes - startMinutes;
    onSave({
      name: name.trim() || 'Node', // Default to "Node" if empty
      color,
      notes: notes.trim(),
      startMinutes,
      durationMinutes: duration,
      repeatRule,
      reminder: {
        enabled: reminderEnabled,
        minutesBefore: reminderMinutes,
      },
    });
  };
  
  // Handle start time change - adjust end time if needed
  const handleStartChange = (newStart: number) => {
    setStartMinutes(newStart);
    // Ensure end is after start (minimum 15 minutes)
    if (endMinutes <= newStart + 15) {
      setEndMinutes(Math.min(newStart + 60, maxEndMinutes));
    }
  };
  
  // Handle end time change - adjust start time if needed
  const handleEndChange = (newEnd: number) => {
    setEndMinutes(newEnd);
    // Ensure start is before end (minimum 15 minutes)
    if (startMinutes >= newEnd - 15) {
      setStartMinutes(Math.max(newEnd - 60, minStartMinutes));
    }
  };
  
  const handleDeletePress = () => {
    Keyboard.dismiss();
    // Small delay to let keyboard dismiss before delete
    setTimeout(() => {
      onDelete();
    }, 100);
  };
  
  if (!node) return null;
  
  const duration = endMinutes - startMinutes;
  const durationHours = Math.floor(duration / 60);
  const durationMins = duration % 60;
  const durationText = durationHours > 0 
    ? (durationMins > 0 ? `${durationHours}hr ${durationMins}min` : `${durationHours}hr`)
    : `${durationMins}min`;
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
          keyboardVerticalOffset={0}
        >
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={onClose} hitSlop={8}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </Pressable>
            <Text style={styles.headerTitle}>{isNewNode ? 'New Node' : 'Edit Node'}</Text>
            <Pressable onPress={handleSave} hitSlop={8}>
              <Text style={styles.saveButton}>Save</Text>
            </Pressable>
          </View>
          
          <ScrollView 
            ref={scrollViewRef}
            style={styles.content} 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            {/* Name Input */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>NAME</Text>
              <TextInput
                ref={nameInputRef}
                style={styles.nameInput}
                value={name}
                onChangeText={setName}
                placeholder="Node"
                placeholderTextColor={colors.textTertiary}
                selectTextOnFocus={true}
                clearButtonMode="while-editing"
              />
            </View>
            
            {/* Color Picker */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>COLOR</Text>
              <ColorPicker selectedColor={color} onSelectColor={setColor} />
            </View>
            
            {/* Time Pickers */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>TIME</Text>
              <View style={styles.timePickerRow}>
                <TimePicker
                  label="START"
                  minutes={startMinutes}
                  onChange={handleStartChange}
                  minMinutes={minStartMinutes}
                  maxMinutes={endMinutes - 15}
                />
                <View style={styles.timeSeparator}>
                  <Text style={styles.timeSeparatorText}>→</Text>
                </View>
                <TimePicker
                  label="END"
                  minutes={endMinutes}
                  onChange={handleEndChange}
                  minMinutes={startMinutes + 15}
                  maxMinutes={maxEndMinutes}
                />
              </View>
              <View style={styles.durationDisplay}>
                <Text style={styles.durationText}>Duration: {durationText}</Text>
              </View>
            </View>
            
            {/* Notes */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>NOTES</Text>
              <TextInput
                style={styles.notesInput}
                value={notes}
                onChangeText={setNotes}
                placeholder="Add notes..."
                placeholderTextColor={colors.textTertiary}
                multiline
                numberOfLines={3}
              />
            </View>
            
            {/* Repeat */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>REPEAT</Text>
              <RepeatPicker repeatRule={repeatRule} onChangeRepeat={setRepeatRule} />
            </View>
            
            {/* Reminder */}
            <View style={styles.section}>
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>REMINDER</Text>
                <Switch
                  value={reminderEnabled}
                  onValueChange={setReminderEnabled}
                  trackColor={{ false: colors.border, true: colors.buttonPrimary }}
                  thumbColor={colors.textPrimary}
                />
              </View>
              {reminderEnabled && (
                <View style={styles.reminderOptions}>
                  {[5, 10, 15, 30, 60].map((mins) => (
                    <Pressable
                      key={mins}
                      style={[
                        styles.reminderOption,
                        reminderMinutes === mins && styles.reminderOptionSelected,
                      ]}
                      onPress={() => setReminderMinutes(mins)}
                    >
                      <Text
                        style={[
                          styles.reminderOptionText,
                          reminderMinutes === mins && styles.reminderOptionTextSelected,
                        ]}
                      >
                        {mins < 60 ? `${mins}min` : '1hr'} before
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
            
            {/* Delete Button */}
            <Pressable
              style={({ pressed }) => [styles.deleteButton, pressed && styles.deleteButtonPressed]}
              onPress={handleDeletePress}
            >
              <Text style={styles.deleteButtonText}>Delete Node</Text>
            </Pressable>
            
            {/* Extra spacer for scrolling past keyboard */}
            <View style={styles.bottomSpacer} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: layout.dividerHeight,
    borderBottomColor: colors.divider,
  },
  headerTitle: {
    ...typography.headline,
    color: colors.textPrimary,
  },
  cancelButton: {
    ...typography.body,
    color: colors.textSecondary,
  },
  saveButton: {
    ...typography.bodyBold,
    color: colors.buttonPrimary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  scrollContent: {
    paddingBottom: 100, // Extra padding for keyboard
  },
  section: {
    marginTop: spacing.xl,
  },
  sectionLabel: {
    ...typography.caption1,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    letterSpacing: 1,
  },
  nameInput: {
    ...typography.title3,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timePickerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timeSeparator: {
    paddingHorizontal: spacing.md,
    paddingTop: 36,
  },
  timeSeparatorText: {
    ...typography.title3,
    color: colors.textSecondary,
  },
  durationDisplay: {
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    alignSelf: 'flex-start',
  },
  durationText: {
    ...typography.caption1,
    color: colors.textSecondary,
  },
  notesInput: {
    ...typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  switchLabel: {
    ...typography.caption1,
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  reminderOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  reminderOption: {
    backgroundColor: colors.buttonSecondary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  reminderOptionSelected: {
    backgroundColor: colors.buttonPrimary,
  },
  reminderOptionText: {
    ...typography.caption1,
    color: colors.textSecondary,
  },
  reminderOptionTextSelected: {
    color: colors.textPrimary,
  },
  deleteButton: {
    marginTop: spacing.xxxl,
    marginBottom: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.error,
  },
  deleteButtonPressed: {
    backgroundColor: colors.error,
  },
  deleteButtonText: {
    ...typography.bodyBold,
    color: colors.error,
  },
  bottomSpacer: {
    height: 150, // Large spacer for scrolling with keyboard
  },
});
