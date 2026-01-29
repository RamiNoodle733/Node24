// ColorPicker Component - For selecting node colors

import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { colors, NodeColorKey, nodeColorKeys } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface ColorPickerProps {
  selectedColor: NodeColorKey;
  onSelectColor: (color: NodeColorKey) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onSelectColor,
}) => {
  return (
    <View style={styles.container}>
      {nodeColorKeys.map((colorKey) => (
        <Pressable
          key={colorKey}
          style={[
            styles.colorOption,
            { backgroundColor: colors.nodeColors[colorKey] },
            selectedColor === colorKey && styles.colorSelected,
          ]}
          onPress={() => onSelectColor(colorKey)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 0, // Sharp edges
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: colors.textPrimary,
  },
});
