import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface PremiumModalProps {
  visible: boolean;
  onClose: () => void;
  onSubscribe?: () => void;
  triggeredBy?: string; // What feature triggered the modal
}

const PREMIUM_FEATURES = [
  {
    icon: '∞',
    title: 'Unlimited Nodes',
    description: 'Create as many schedule blocks as you need',
  },
  {
    icon: '🔔',
    title: 'Smart Reminders',
    description: 'Get notified before your scheduled activities',
  },
  {
    icon: '🔄',
    title: 'Repeating Nodes',
    description: 'Set daily, weekly, or custom repeat patterns',
  },
  {
    icon: '🎨',
    title: 'All Colors & Themes',
    description: 'Full palette of colors and custom themes',
  },
  {
    icon: '🤖',
    title: 'AI Assistant',
    description: 'Smart suggestions and voice scheduling',
  },
  {
    icon: '☁️',
    title: 'Cloud Sync',
    description: 'Sync across all your devices seamlessly',
  },
  {
    icon: '📊',
    title: 'Analytics',
    description: 'Track your time and improve productivity',
  },
];

export const PremiumModal: React.FC<PremiumModalProps> = ({
  visible,
  onClose,
  onSubscribe,
  triggeredBy,
}) => {
  const handleSubscribe = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // In a real app, this would open the payment flow
    onSubscribe?.();
    onClose();
  };

  const handleRestore = () => {
    Haptics.selectionAsync();
    // In a real app, this would restore purchases
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Title */}
          <View style={styles.titleSection}>
            <Text style={styles.premiumBadge}>PREMIUM</Text>
            <Text style={styles.title}>Unlock Your Full Potential</Text>
            {triggeredBy && (
              <Text style={styles.triggerText}>
                Upgrade to access {triggeredBy}
              </Text>
            )}
          </View>

          {/* Features */}
          <ScrollView
            style={styles.featuresScroll}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.featuresGrid}>
              {PREMIUM_FEATURES.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Text style={styles.featureIcon}>{feature.icon}</Text>
                  <View style={styles.featureText}>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDescription}>
                      {feature.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Pricing */}
          <View style={styles.pricingSection}>
            <View style={styles.priceOption}>
              <View style={styles.priceHeader}>
                <Text style={styles.pricePeriod}>Monthly</Text>
                <Text style={styles.priceAmount}>$2.99</Text>
              </View>
              <Text style={styles.priceSubtext}>per month</Text>
            </View>

            <View style={[styles.priceOption, styles.priceOptionBest]}>
              <View style={styles.bestValueBadge}>
                <Text style={styles.bestValueText}>BEST VALUE</Text>
              </View>
              <View style={styles.priceHeader}>
                <Text style={styles.pricePeriod}>Yearly</Text>
                <Text style={styles.priceAmount}>$19.99</Text>
              </View>
              <Text style={styles.priceSubtext}>$1.67/month · Save 44%</Text>
            </View>
          </View>

          {/* CTA Buttons */}
          <TouchableOpacity
            style={styles.subscribeButton}
            onPress={handleSubscribe}
            activeOpacity={0.8}
          >
            <Text style={styles.subscribeButtonText}>Start Free Trial</Text>
            <Text style={styles.subscribeSubtext}>7 days free, then $19.99/year</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.restoreButton}
            onPress={handleRestore}
          >
            <Text style={styles.restoreButtonText}>Restore Purchases</Text>
          </TouchableOpacity>

          <Text style={styles.termsText}>
            Cancel anytime. Terms & Privacy Policy apply.
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: spacing.md,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  premiumBadge: {
    ...typography.caption,
    color: colors.nodeColors.yellow,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  triggerText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  featuresScroll: {
    maxHeight: 200,
  },
  featuresGrid: {
    gap: spacing.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderRadius: 12,
    padding: spacing.md,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: spacing.md,
    width: 32,
    textAlign: 'center',
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  featureDescription: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  pricingSection: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  priceOption: {
    flex: 1,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  priceOptionBest: {
    borderColor: colors.nodeColors.blue,
    position: 'relative',
  },
  bestValueBadge: {
    position: 'absolute',
    top: -10,
    backgroundColor: colors.nodeColors.blue,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 10,
  },
  bestValueText: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 10,
  },
  priceHeader: {
    alignItems: 'center',
  },
  pricePeriod: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  priceAmount: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  priceSubtext: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  subscribeButton: {
    backgroundColor: colors.nodeColors.blue,
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  subscribeButtonText: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    fontSize: 17,
  },
  subscribeSubtext: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  restoreButton: {
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  restoreButtonText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  termsText: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
