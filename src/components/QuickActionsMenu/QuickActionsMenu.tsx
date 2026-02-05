import React from 'react';
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

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  destructive?: boolean;
  premium?: boolean;
}

interface QuickActionsMenuProps {
  visible: boolean;
  onClose: () => void;
  onAction: (actionId: string) => void;
  nodeName?: string;
  isPremium: boolean;
}

const QUICK_ACTIONS: QuickAction[] = [
  { id: 'edit', label: 'Edit Node', icon: '✎' },
  { id: 'duplicate', label: 'Duplicate', icon: '⎘' },
  { id: 'lock', label: 'Lock/Unlock', icon: '🔒' },
  { id: 'reminder', label: 'Set Reminder', icon: '🔔', premium: true },
  { id: 'repeat', label: 'Set Repeat', icon: '🔄', premium: true },
  { id: 'delete', label: 'Delete Node', icon: '✕', destructive: true },
];

export const QuickActionsMenu: React.FC<QuickActionsMenuProps> = ({
  visible,
  onClose,
  onAction,
  nodeName,
  isPremium,
}) => {
  const handleAction = (action: QuickAction) => {
    if (action.premium && !isPremium) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      onAction('premium_required');
      return;
    }

    if (action.destructive) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    onAction(action.id);
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
          {nodeName && (
            <View style={styles.header}>
              <Text style={styles.headerTitle} numberOfLines={1}>
                {nodeName}
              </Text>
            </View>
          )}

          {/* Actions */}
          <View style={styles.actions}>
            {QUICK_ACTIONS.map((action, index) => (
              <TouchableOpacity
                key={action.id}
                style={[
                  styles.actionItem,
                  index === QUICK_ACTIONS.length - 1 && styles.actionItemLast,
                  action.destructive && styles.actionItemDestructive,
                ]}
                onPress={() => handleAction(action)}
                activeOpacity={0.7}
              >
                <Text style={styles.actionIcon}>{action.icon}</Text>
                <Text
                  style={[
                    styles.actionLabel,
                    action.destructive && styles.actionLabelDestructive,
                  ]}
                >
                  {action.label}
                </Text>
                {action.premium && !isPremium && (
                  <View style={styles.premiumBadge}>
                    <Text style={styles.premiumBadgeText}>PRO</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Cancel */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
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
    justifyContent: 'flex-end',
    padding: spacing.md,
  },
  container: {
    gap: spacing.sm,
  },
  header: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.bodyBold,
    color: colors.textSecondary,
  },
  actions: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    overflow: 'hidden',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  actionItemLast: {
    borderBottomWidth: 0,
  },
  actionItemDestructive: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  actionIcon: {
    fontSize: 18,
    width: 28,
    textAlign: 'center',
    marginRight: spacing.md,
  },
  actionLabel: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
  actionLabelDestructive: {
    color: colors.error,
  },
  premiumBadge: {
    backgroundColor: colors.nodeColors.yellow,
    borderRadius: 4,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },
  premiumBadgeText: {
    ...typography.caption,
    color: colors.background,
    fontWeight: '700',
    fontSize: 10,
  },
  cancelButton: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    ...typography.bodyBold,
    color: colors.nodeColors.blue,
  },
});
