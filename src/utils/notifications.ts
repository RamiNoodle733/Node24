// Node24 Notification Service
// Handles scheduling and managing reminders for nodes

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { ScheduleNode } from '../types';
import { parseDate, getNodeStartTime } from './helpers';

// Configure how notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Request notification permissions
export const requestNotificationPermissions = async (): Promise<boolean> => {
  if (!Device.isDevice) {
    console.log('Notifications only work on physical devices');
    return false;
  }
  
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    console.log('Notification permissions not granted');
    return false;
  }
  
  // Configure for Android
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('reminders', {
      name: 'Node Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#0A84FF',
    });
  }
  
  return true;
};

// Schedule a notification for a node
export const scheduleNodeReminder = async (
  node: ScheduleNode,
  dateString: string,
  startMinutes: number
): Promise<string | null> => {
  if (!node.reminder.enabled) {
    return null;
  }
  
  try {
    // Calculate the notification time
    const date = parseDate(dateString);
    const notificationMinutes = startMinutes - node.reminder.minutesBefore;
    
    // Handle edge case where reminder would be before midnight
    if (notificationMinutes < 0) {
      // Reminder would be on previous day - skip for now
      return null;
    }
    
    const hours = Math.floor(notificationMinutes / 60);
    const minutes = notificationMinutes % 60;
    
    date.setHours(hours, minutes, 0, 0);
    
    // Don't schedule if the time has passed
    if (date.getTime() <= Date.now()) {
      return null;
    }
    
    // Schedule the notification
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Node24 Reminder',
        body: `${node.name} starts in ${node.reminder.minutesBefore} minutes`,
        data: { nodeId: node.id, date: dateString },
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: date,
      },
    });
    
    return notificationId;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return null;
  }
};

// Cancel a scheduled notification
export const cancelNodeReminder = async (notificationId: string): Promise<void> => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error('Error canceling notification:', error);
  }
};

// Cancel all scheduled notifications
export const cancelAllReminders = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error canceling all notifications:', error);
  }
};

// Get all scheduled notifications
export const getScheduledReminders = async (): Promise<Notifications.NotificationRequest[]> => {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
    return [];
  }
};

// Listen for notification interactions
export const addNotificationResponseListener = (
  callback: (response: Notifications.NotificationResponse) => void
): Notifications.Subscription => {
  return Notifications.addNotificationResponseReceivedListener(callback);
};

// Listen for notifications received while app is foregrounded
export const addNotificationReceivedListener = (
  callback: (notification: Notifications.Notification) => void
): Notifications.Subscription => {
  return Notifications.addNotificationReceivedListener(callback);
};
