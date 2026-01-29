// FillerNode Component - The grayed out "empty time" node

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ScheduleNode } from '../../types';
import { colors } from '../../theme/colors';
import { layout } from '../../theme/spacing';

interface FillerNodeProps {
  node: ScheduleNode;
  height: number;
}

export const FillerNode: React.FC<FillerNodeProps> = ({ node, height }) => {
  if (height < 2) return null; // Don't render tiny fillers
  
  // Calculate number of stripes based on height
  const stripeSpacing = 6;
  const numStripes = Math.ceil((height + 100) / stripeSpacing);
  
  return (
    <View style={[styles.container, { height }]}>
      <View style={styles.patternContainer}>
        {/* Subtle diagonal stripe pattern */}
        {Array.from({ length: numStripes }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.stripe,
              {
                top: i * stripeSpacing - 50,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.fillerBackground,
    overflow: 'hidden',
  },
  patternContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  stripe: {
    position: 'absolute',
    width: 800,
    height: 1,
    backgroundColor: colors.fillerPattern,
    opacity: 0.5,
    transform: [{ rotate: '45deg' }],
    left: -200,
  },
});
