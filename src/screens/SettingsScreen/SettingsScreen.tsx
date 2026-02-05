// SettingsScreen - App settings and premium features

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, layout } from '../../theme/spacing';
import { useScheduleStore } from '../../store/scheduleStore';
import { requestNotificationPermissions } from '../../utils/notifications';

interface SettingsScreenProps {
  onClose: () => void;
}

const ONBOARDING_KEY = '@node24_onboarding_complete';
const NOTIFICATIONS_KEY = '@node24_notifications_enabled';

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onClose }) => {
  const { isPremium, setPremium } = useScheduleStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    loadNotificationSetting();
  }, []);

  const loadNotificationSetting = async () => {
    try {
      const value = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
      setNotificationsEnabled(value === 'true');
    } catch {
      // Default to false
    }
  };

  const handleNotificationToggle = async (enabled: boolean) => {
    Haptics.selectionAsync();
    if (enabled) {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        Alert.alert(
          'Notifications Disabled',
          'Please enable notifications in your device settings to receive reminders.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
        return;
      }
    }
    setNotificationsEnabled(enabled);
    await AsyncStorage.setItem(NOTIFICATIONS_KEY, enabled.toString());
  };

  const handlePremiumPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      'Node24 Premium',
      'Unlock all premium features:\n\n✨ Unlimited nodes\n🔔 Smart reminders\n🔄 Repeating schedules\n🤖 AI-powered suggestions\n📊 Time analytics\n☁️ Cloud sync\n🎨 Custom themes\n\nComing soon to the App Store!',
      [
        { text: 'Not Now', style: 'cancel' },
        { text: 'Notify Me', onPress: () => Alert.alert('Coming Soon', "We'll let you know when Premium launches!") },
      ]
    );
  };

  const handleAIPress = () => {
    Haptics.selectionAsync();
    Alert.alert(
      'AI Assistant',
      '🤖 Your personal scheduling AI:\n\n• "Schedule my workout for optimal energy"\n• "Find time for a 2-hour deep work session"\n• "Balance my work-life schedule"\n• Voice-to-schedule commands\n\nComing soon with Node24 Premium!',
      [{ text: 'Exciting!', style: 'default' }]
    );
  };

  const handleAnalyticsPress = () => {
    Haptics.selectionAsync();
    Alert.alert(
      'Analytics & Insights',
      '📊 Understand your time better:\n\n• Weekly/monthly time breakdowns\n• Category distribution charts\n• Productivity patterns\n• Goal progress tracking\n\nComing soon with Node24 Premium!',
      [{ text: 'Nice!', style: 'default' }]
    );
  };

  const handleSyncPress = () => {
    Haptics.selectionAsync();
    Alert.alert(
      'Cloud Sync',
      '☁️ Your schedule everywhere:\n\n• Sync across all your devices\n• Automatic backups\n• Export to other calendars\n• Share schedules\n\nComing soon with Node24 Premium!',
      [{ text: 'Cool!', style: 'default' }]
    );
  };

  const handleResetOnboarding = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await AsyncStorage.removeItem(ONBOARDING_KEY);
    Alert.alert('Onboarding Reset', 'The tutorial will show next time you open the app.');
  };

  const handleClearData = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      'Clear All Data',
      'This will delete all your schedules and reset the app. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            Alert.alert('Data Cleared', 'Please restart the app.');
          },
        },
      ]
    );
  };

  const handleAboutPress = () => {
    Haptics.selectionAsync();
    Alert.alert(
      'About Node24',
      'Version 1.0.0\n\nNode24 reimagines daily planning. Your 24 hours, visualized as flexible blocks that always add up to a complete day.\n\nNo time goes unaccounted for.\n\n© 2025 Node24',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const handleRateApp = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Rate Node24', 'Coming soon to the App Store!');
  };

  const handleFeedback = () => {
    Haptics.selectionAsync();
    Linking.openURL('mailto:feedback@node24.app?subject=Node24 Feedback');
  };

  // Dev mode toggle for testing premium
  const handleDevPremiumToggle = () => {
    if (__DEV__) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setPremium(!isPremium);
    }
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

          <Pressable
            style={({ pressed }) => [styles.premiumCard, pressed && styles.pressed]}
            onPress={handlePremiumPress}
            onLongPress={handleDevPremiumToggle}
          >
            <View style={styles.premiumContent}>
              <Text style={styles.premiumTitle}>⭐ Node24 Premium</Text>
              <Text style={styles.premiumSubtitle}>
                {isPremium ? 'All features unlocked' : 'Unlock AI scheduling, analytics, and more'}
              </Text>
            </View>
            <Text style={styles.premiumBadge}>{isPremium ? 'ACTIVE' : 'COMING SOON'}</Text>
          </Pressable>
        </View>

        {/* AI Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI FEATURES</Text>

          <Pressable
            style={({ pressed }) => [styles.settingRow, pressed && styles.pressed]}
            onPress={handleAIPress}
          >
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🤖</Text>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>AI Assistant</Text>
                <Text style={styles.settingDescription}>
                  Get intelligent scheduling suggestions
                </Text>
              </View>
            </View>
            <Text style={styles.lockedBadge}>{isPremium ? '›' : '🔒'}</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.settingRow, pressed && styles.pressed]}
            onPress={handleAnalyticsPress}
          >
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>📊</Text>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Analytics</Text>
                <Text style={styles.settingDescription}>
                  Insights into your time usage
                </Text>
              </View>
            </View>
            <Text style={styles.lockedBadge}>{isPremium ? '›' : '🔒'}</Text>
          </Pressable>
        </View>

        {/* Sync Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SYNC & BACKUP</Text>

          <Pressable
            style={({ pressed }) => [styles.settingRow, pressed && styles.pressed]}
            onPress={handleSyncPress}
          >
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>☁️</Text>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Cloud Sync</Text>
                <Text style={styles.settingDescription}>
                  Sync across all your devices
                </Text>
              </View>
            </View>
            <Text style={styles.lockedBadge}>{isPremium ? '›' : '🔒'}</Text>
          </Pressable>
        </View>

        {/* General Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GENERAL</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🔔</Text>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Notifications</Text>
                <Text style={styles.settingDescription}>
                  Reminders and alerts
                </Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleNotificationToggle}
              trackColor={{ false: colors.surfaceElevated, true: colors.buttonPrimary }}
              thumbColor={colors.textPrimary}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🌙</Text>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Dark Mode</Text>
                <Text style={styles.settingDescription}>
                  Always on (more themes coming soon)
                </Text>
              </View>
            </View>
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{ false: colors.surfaceElevated, true: colors.buttonPrimary }}
              thumbColor={colors.textPrimary}
              disabled
            />
          </View>

          <Pressable
            style={({ pressed }) => [styles.settingRow, pressed && styles.pressed]}
            onPress={handleResetOnboarding}
          >
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>📖</Text>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Show Tutorial</Text>
                <Text style={styles.settingDescription}>
                  View the onboarding guide again
                </Text>
              </View>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ABOUT</Text>

          <Pressable
            style={({ pressed }) => [styles.settingRow, pressed && styles.pressed]}
            onPress={handleAboutPress}
          >
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>ℹ️</Text>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>About Node24</Text>
                <Text style={styles.settingDescription}>
                  Version 1.0.0
                </Text>
              </View>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.settingRow, pressed && styles.pressed]}
            onPress={handleRateApp}
          >
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>⭐</Text>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Rate Node24</Text>
                <Text style={styles.settingDescription}>
                  Help us improve with your feedback
                </Text>
              </View>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.settingRow, pressed && styles.pressed]}
            onPress={handleFeedback}
          >
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>💬</Text>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Send Feedback</Text>
                <Text style={styles.settingDescription}>
                  Questions, bugs, or suggestions
                </Text>
              </View>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DATA</Text>

          <Pressable
            style={({ pressed }) => [styles.settingRow, styles.dangerRow, pressed && styles.pressed]}
            onPress={handleClearData}
          >
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🗑️</Text>
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingLabel, styles.dangerText]}>Clear All Data</Text>
                <Text style={styles.settingDescription}>
                  Delete all schedules and reset app
                </Text>
              </View>
            </View>
          </Pressable>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with ❤️ for productivity</Text>
          <Text style={styles.footerSubtext}>Your 24 hours, beautifully organized</Text>
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
    ...typography.caption,
    color: colors.textTertiary,
    letterSpacing: 1,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  premiumCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.buttonPrimary,
    borderRadius: 12,
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
    ...typography.caption,
    color: colors.textSecondary,
  },
  premiumBadge: {
    ...typography.caption,
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
  pressed: {
    opacity: 0.7,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 24,
    marginRight: spacing.md,
    width: 32,
    textAlign: 'center',
  },
  settingTextContainer: {
    flex: 1,
  },
  settingLabel: {
    ...typography.body,
    color: colors.textPrimary,
  },
  settingDescription: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: 2,
  },
  lockedBadge: {
    fontSize: 16,
    color: colors.textTertiary,
  },
  chevron: {
    fontSize: 20,
    color: colors.textTertiary,
    fontWeight: '300',
  },
  dangerRow: {
    borderRadius: 12,
    borderBottomWidth: 0,
  },
  dangerText: {
    color: colors.error,
  },
  footer: {
    padding: spacing.xl,
    alignItems: 'center',
    paddingBottom: spacing.xxxl,
  },
  footerText: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  footerSubtext: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: spacing.xs,
    opacity: 0.6,
  },
});
