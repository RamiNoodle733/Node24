// AddNodeButton Component - Bottom button to add new nodes

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { layout, spacing } from '../../theme/spacing';

interface AddNodeButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

export const AddNodeButton: React.FC<AddNodeButtonProps> = ({ onPress, disabled }) => {
  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
          disabled && styles.buttonDisabled,
        ]}
        onPress={onPress}
        disabled={disabled}
      >
        <View style={styles.iconContainer}>
          <Text style={[styles.icon, disabled && styles.iconDisabled]}>+</Text>
        </View>
        <Text style={[styles.text, disabled && styles.textDisabled]}>ADD NODE</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: layout.bottomBarHeight,
    backgroundColor: colors.background,
    borderTopWidth: layout.dividerHeight,
    borderTopColor: colors.divider,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonPressed: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.buttonPrimary,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  icon: {
    fontSize: 20,
    color: colors.buttonPrimary,
    fontWeight: '300',
  },
  iconDisabled: {
    color: colors.textTertiary,
  },
  text: {
    ...typography.subheadBold,
    color: colors.textPrimary,
    letterSpacing: 1,
  },
  textDisabled: {
    color: colors.textTertiary,
  },
});
