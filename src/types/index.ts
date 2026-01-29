// Node24 Core Types

import { NodeColorKey } from '../theme/colors';

// Repeat rule for recurring nodes
export type RepeatType = 
  | 'none'
  | 'daily'
  | 'weekdays'
  | 'weekends'
  | 'weekly'
  | 'monthly'
  | 'yearly';

export interface RepeatRule {
  type: RepeatType;
  // For 'weekly' - which day (0 = Sunday, 6 = Saturday)
  dayOfWeek?: number;
  // For 'monthly' - which day of month (1-31)
  dayOfMonth?: number;
}

// Reminder settings for a node
export interface ReminderSettings {
  enabled: boolean;
  // Minutes before the node starts to send reminder
  minutesBefore: number;
  // Notification ID for cancellation
  notificationId?: string;
}

// A single schedule node
export interface ScheduleNode {
  id: string;
  // Name/title of the node (empty for filler)
  name: string;
  // Duration in minutes (always positive, all nodes sum to 1440)
  durationMinutes: number;
  // User-selected color key
  color: NodeColorKey;
  // Optional notes
  notes?: string;
  // Whether this is a filler (empty time) node
  isFiller: boolean;
  // Repeat settings
  repeatRule: RepeatRule;
  // Reminder settings
  reminder: ReminderSettings;
  // Created timestamp
  createdAt: number;
  // Last modified timestamp
  updatedAt: number;
}

// A day's schedule
export interface DaySchedule {
  // Date string in YYYY-MM-DD format
  date: string;
  // Ordered array of nodes (sum of durations = 1440)
  nodes: ScheduleNode[];
  // Last modified timestamp
  updatedAt: number;
}

// App state
export interface AppState {
  // Currently selected date
  currentDate: string;
  // All stored schedules by date
  schedules: Record<string, DaySchedule>;
  // Whether edit mode is active
  isEditMode: boolean;
  // Premium status
  isPremium: boolean;
}

// Helper constants
export const MINUTES_IN_DAY = 1440;
export const DEFAULT_NEW_NODE_DURATION = 240; // 4 hours
