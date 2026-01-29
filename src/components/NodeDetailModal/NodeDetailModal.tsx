// NodeDetailModal Component - Full-screen modal for editing a node

import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { ScheduleNode } from '../../types';
import { colors, NodeColorKey } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, layout } from '../../theme/spacing';
import { ColorPicker } from '../ColorPicker';
import { DurationPicker } from '../DurationPicker';
import { RepeatPicker } from '../RepeatPicker';

interface NodeDetailModalProps {
  visible: boolean;
  node: ScheduleNode | null;
  maxDuration: number;
  onClose: () => void;
  onSave: (updates: Partial<ScheduleNode>) => void;
  onDelete: () => void;
}

export const NodeDetailModal: React.FC<NodeDetailModalProps> = ({
  visible,
  node,
  maxDuration,
  onClose,
  onSave,
  onDelete,
}) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState<NodeColorKey>('blue');
  const [notes, setNotes] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(240);
  const [repeatRule, setRepeatRule] = useState(node?.repeatRule || { type: 'none' as const });
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderMinutes, setReminderMinutes] = useState(10);
  
  // Reset form when node changes
  useEffect(() => {
    if (node) {
      setName(node.name);
      setColor(node.color);
      setNotes(node.notes || '');
      setDurationMinutes(node.durationMinutes);
      setRepeatRule(node.repeatRule);
      setReminderEnabled(node.reminder.enabled);
      setReminderMinutes(node.reminder.minutesBefore);
    }
  }, [node]);
  
  const handleSave = () => {
    onSave({
      name: name.trim() || 'Untitled',
      color,
      notes: notes.trim(),
      durationMinutes,
      repeatRule,
      reminder: {
        enabled: reminderEnabled,
        minutesBefore: reminderMinutes,
      },
    });
  };
  
  if (!node) return null;
  
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
        >
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={onClose} hitSlop={8}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </Pressable>
            <Text style={styles.headerTitle}>Edit Node</Text>
            <Pressable onPress={handleSave} hitSlop={8}>
              <Text style={styles.saveButton}>Save</Text>
            </Pressable>
          </View>
          
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Name Input */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>NAME</Text>
              <TextInput
                style={styles.nameInput}
                value={name}
                onChangeText={setName}
                placeholder="Enter node name"
                placeholderTextColor={colors.textTertiary}
                autoFocus
              />
            </View>
            
            {/* Color Picker */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>COLOR</Text>
              <ColorPicker selectedColor={color} onSelectColor={setColor} />
            </View>
            
            {/* Duration */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>DURATION</Text>
              <DurationPicker
                durationMinutes={durationMinutes}
                onChangeDuration={setDurationMinutes}
                maxDuration={maxDuration}
              />
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
                <Text style={styles.sectionLabel}>REMINDER</Text>
                <Switch
                  value={reminderEnabled}
                  onValueChange={setReminderEnabled}
                  trackColor={{ false: colors.border, true: colors.buttonPrimary }}
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
              onPress={onDelete}
            >
              <Text style={styles.deleteButtonText}>Delete Node</Text>
            </Pressable>
            
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
    height: 40,
  },
});
