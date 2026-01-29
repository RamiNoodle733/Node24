// SettingsScreen - App settings and premium features

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, layout } from '../../theme/spacing';
import { useScheduleStore } from '../../store/scheduleStore';

interface SettingsScreenProps {
  onClose: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onClose }) => {
  const { isPremium, setPremium } = useScheduleStore();
  
  const handlePremiumPress = () => {
    Alert.alert(
      'Node24 Premium',
      'Unlock all premium features:\n\n✨ AI-powered scheduling suggestions\n📊 Advanced analytics & insights\n🔄 Cloud sync across devices\n🎨 Custom themes & colors\n📅 Calendar integrations\n⏰ Smart reminders\n\nComing soon to the App Store!',
      [{ text: 'Got it', style: 'default' }]
    );
  };
  
  const handleAIPress = () => {
    Alert.alert(
      'AI Assistant',
      '🤖 Your personal scheduling AI:\n\n• "Schedule my workout for optimal energy"\n• "Find time for a 2-hour deep work session"\n• "Balance my work-life schedule"\n• "Suggest breaks based on my patterns"\n\nComing soon with Node24 Premium!',
      [{ text: 'Exciting!', style: 'default' }]
    );
  };
  
  const handleAnalyticsPress = () => {
    Alert.alert(
      'Analytics & Insights',
      '📊 Understand your time better:\n\n• Weekly/monthly time breakdowns\n• Category distribution charts\n• Productivity patterns\n• Sleep & rest tracking\n• Goal progress visualization\n\nComing soon with Node24 Premium!',
      [{ text: 'Nice!', style: 'default' }]
    );
  };
  
  const handleSyncPress = () => {
    Alert.alert(
      'Cloud Sync',
      '☁️ Your schedule everywhere:\n\n• Sync across all your devices\n• Automatic backups\n• Share schedules with family\n• Export to other calendars\n\nComing soon with Node24 Premium!',
      [{ text: 'Cool!', style: 'default' }]
    );
  };
  
  const handleAboutPress = () => {
    Alert.alert(
      'About Node24',
      'Version 1.0.0\n\nNode24 helps you visualize and plan your entire day. Every moment matters—your 24 hours are always accounted for.\n\n© 2025 Node24',
      [{ text: 'OK', style: 'default' }]
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={onClose} hitSlop={8}>
          <Text style={styles.backButton}>← Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerSpacer} />
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Premium Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PREMIUM</Text>
          
          <Pressable style={styles.premiumCard} onPress={handlePremiumPress}>
            <View style={styles.premiumContent}>
              <Text style={styles.premiumTitle}>⭐ Node24 Premium</Text>
              <Text style={styles.premiumSubtitle}>
                Unlock AI scheduling, analytics, and more
              </Text>
            </View>
            <Text style={styles.premiumBadge}>COMING SOON</Text>
          </Pressable>
        </View>
        
        {/* AI Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI FEATURES</Text>
          
          <Pressable style={styles.settingRow} onPress={handleAIPress}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🤖</Text>
              <View>
                <Text style={styles.settingLabel}>AI Assistant</Text>
                <Text style={styles.settingDescription}>
                  Get intelligent scheduling suggestions
                </Text>
              </View>
            </View>
            <Text style={styles.lockedBadge}>🔒</Text>
          </Pressable>
          
          <Pressable style={styles.settingRow} onPress={handleAnalyticsPress}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>📊</Text>
              <View>
                <Text style={styles.settingLabel}>Analytics</Text>
                <Text style={styles.settingDescription}>
                  Insights into your time usage
                </Text>
              </View>
            </View>
            <Text style={styles.lockedBadge}>🔒</Text>
          </Pressable>
        </View>
        
        {/* Sync Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SYNC & BACKUP</Text>
          
          <Pressable style={styles.settingRow} onPress={handleSyncPress}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>☁️</Text>
              <View>
                <Text style={styles.settingLabel}>Cloud Sync</Text>
                <Text style={styles.settingDescription}>
                  Sync across all your devices
                </Text>
              </View>
            </View>
            <Text style={styles.lockedBadge}>🔒</Text>
          </Pressable>
        </View>
        
        {/* General Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GENERAL</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🔔</Text>
              <View>
                <Text style={styles.settingLabel}>Notifications</Text>
                <Text style={styles.settingDescription}>
                  Reminders and alerts
                </Text>
              </View>
            </View>
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{ false: colors.surface, true: colors.buttonPrimary }}
              thumbColor={colors.textPrimary}
            />
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🌙</Text>
              <View>
                <Text style={styles.settingLabel}>Dark Mode</Text>
                <Text style={styles.settingDescription}>
                  Always on
                </Text>
              </View>
            </View>
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{ false: colors.surface, true: colors.buttonPrimary }}
              thumbColor={colors.textPrimary}
              disabled
            />
          </View>
        </View>
        
        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ABOUT</Text>
          
          <Pressable style={styles.settingRow} onPress={handleAboutPress}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>ℹ️</Text>
              <View>
                <Text style={styles.settingLabel}>About Node24</Text>
                <Text style={styles.settingDescription}>
                  Version 1.0.0
                </Text>
              </View>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        </View>
        
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with ❤️ for productivity</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: layout.headerHeight,
    paddingHorizontal: spacing.md,
    borderBottomWidth: layout.dividerHeight,
    borderBottomColor: colors.divider,
  },
  backButton: {
    ...typography.body,
    color: colors.buttonPrimary,
  },
  headerTitle: {
    ...typography.headline,
    color: colors.textPrimary,
  },
  headerSpacer: {
    width: 60,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  sectionTitle: {
    ...typography.caption1,
    color: colors.textTertiary,
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  premiumCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.buttonPrimary,
  },
  premiumContent: {
    flex: 1,
  },
  premiumTitle: {
    ...typography.headline,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  premiumSubtitle: {
    ...typography.caption1,
    color: colors.textSecondary,
  },
  premiumBadge: {
    ...typography.caption2,
    color: colors.buttonPrimary,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  settingRow: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 24,
    marginRight: spacing.sm,
    width: 32,
    textAlign: 'center',
  },
  settingLabel: {
    ...typography.body,
    color: colors.textPrimary,
  },
  settingDescription: {
    ...typography.caption2,
    color: colors.textTertiary,
    marginTop: 2,
  },
  lockedBadge: {
    fontSize: 16,
  },
  chevron: {
    ...typography.title2,
    color: colors.textTertiary,
  },
  footer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  footerText: {
    ...typography.caption2,
    color: colors.textTertiary,
  },
});
