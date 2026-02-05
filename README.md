# Node24

**Your 24-Hour Planner** — A sophisticated scheduling app where nodes always sum to 24 hours.

![Node24](https://img.shields.io/badge/React%20Native-Expo-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![License](https://img.shields.io/badge/License-Proprietary-red)

## About

Node24 is a fresh take on day planning. Instead of traditional time-block calendars, you create "nodes" that represent activities. The magic? **Nodes always fill exactly 24 hours**.

- **1 node** = 24 hours
- **2 nodes** = 12 hours each (or any split you choose)
- **5 nodes** = Automatically balanced, always totaling 24 hours

Empty time appears as subtle filler that shrinks as you add more activities.

## Features

### Core
- **24-Hour Node System** — Add, edit, and resize nodes that always sum to a full day
- **Drag-to-Resize** — Enter edit mode and drag node edges to adjust time
- **Node Locking** — Lock nodes to prevent accidental edits
- **10 Accent Colors** — Personalize each node with beautiful, curated colors
- **Notes & Details** — Add context to any node
- **Repeating Nodes** — Daily, weekdays, weekends, weekly, monthly, yearly
- **Smart Reminders** — Get notified before nodes start
- **Calendar Popup** — Jump to any date with the full calendar view
- **Quick Actions** — Long-press nodes for edit, duplicate, lock, delete

### Design
- **Dark Mode First** — Elegant, eye-friendly interface
- **Native Feel** — Designed to feel like it belongs on iOS
- **Sharp & Clean** — No bubbly UI, just purposeful design
- **Haptic Feedback** — Tactile responses to interactions

### User Experience
- **Onboarding Tutorial** — First-time users get a guided walkthrough
- **Freemium Model** — 5 free nodes/day, premium for unlimited
- **AI Assistant Bar** — Premium preview with smart scheduling suggestions
- **Polished Settings** — Full control with working toggles

### Premium Features (Coming to App Store)
- Unlimited nodes per day
- All color themes
- Reminders & repeating nodes
- Cloud sync across devices
- AI-powered scheduling suggestions
- Home screen widgets
- Analytics & insights

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo Go app (for testing on device)
- Apple Developer Account (for App Store submission)

### Installation

```bash
# Clone the repository
git clone https://github.com/RamiNoodle733/Node24.git
cd Node24

# Install dependencies
npm install

# Start the development server
npx expo start --tunnel
```

### Running on Device

1. Install **Expo Go** from the App Store
2. Scan the QR code from the terminal
3. The app will load on your device

### Running on Web (Preview)

```bash
npx expo start --web
```

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── AddNodeButton/
│   ├── AIAssistantBar/   # AI suggestions UI
│   ├── CalendarPopup/    # Date picker modal
│   ├── ColorPicker/
│   ├── DayHeader/
│   ├── DraggableNodeList/ # Main schedule with drag-to-resize
│   ├── DurationPicker/
│   ├── FillerNode/
│   ├── NodeDetailModal/
│   ├── Onboarding/       # First-time user tutorial
│   ├── PremiumModal/     # Upgrade prompt
│   ├── QuickActionsMenu/ # Long-press actions
│   ├── RepeatPicker/
│   ├── ScheduleNodeCard/
│   └── TimePicker/
├── screens/
│   ├── HomeScreen/       # Main schedule view
│   └── SettingsScreen/   # App settings
├── store/
│   └── scheduleStore.ts  # Zustand state management
├── theme/
│   ├── colors.ts
│   ├── typography.ts
│   └── spacing.ts
├── types/
│   └── index.ts
└── utils/
    ├── helpers.ts
    └── notifications.ts
```

## Design System

### Colors

Node24 uses a carefully curated color palette:

| Color   | Hex       | Usage              |
|---------|-----------|-------------------|
| Blue    | `#0A84FF` | Primary accent     |
| Green   | `#30D158` | Success, nature    |
| Orange  | `#FF9F0A` | Warning, energy    |
| Red     | `#FF453A` | Urgent, important  |
| Purple  | `#BF5AF2` | Creative, special  |
| Pink    | `#FF375F` | Personal           |
| Teal    | `#64D2FF` | Calm, focus        |
| Yellow  | `#FFD60A` | Highlight          |
| Indigo  | `#5E5CE6` | Deep work          |
| Mint    | `#66D4CF` | Refresh            |

### Typography

Uses SF Pro (iOS system font) for native feel.

## Tech Stack

- **Framework:** React Native with Expo SDK 54
- **Language:** TypeScript
- **State:** Zustand with AsyncStorage persistence
- **Navigation:** React Navigation
- **Animations:** React Native Reanimated
- **Gestures:** React Native Gesture Handler
- **Haptics:** Expo Haptics
- **Notifications:** Expo Notifications

## Monetization

Node24 uses a **freemium model**:

### Free Tier
- Up to 5 nodes per day
- Basic colors
- Single-day view
- Edit mode with drag-to-resize

### Premium ($2.99/month or $19.99/year)
- Unlimited nodes
- All 10 colors
- Reminders
- Repeating nodes
- Cloud sync
- AI features
- Analytics

## App Store Submission

### Required
1. Apple Developer Account ($99/year)
2. App icons (1024x1024)
3. Screenshots (6.5", 5.5" iPhone)
4. Privacy Policy URL
5. App description & keywords

### Build for App Store

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build for iOS
eas build --platform ios
```

## Implemented Features

- [x] Core node system (24hr always)
- [x] Node editing (name, color, start/end time, notes)
- [x] Drag-to-resize with edit mode
- [x] Node locking
- [x] Day navigation (arrows + calendar popup)
- [x] Repeat options (7 patterns)
- [x] Reminder settings
- [x] Onboarding tutorial
- [x] Freemium gate (5 nodes limit)
- [x] Premium upgrade modal
- [x] AI assistant bar (UI ready)
- [x] Quick actions menu (long press)
- [x] Settings screen with working toggles
- [x] Haptic feedback throughout
- [x] Dark mode

## Coming Soon

- [ ] Cloud sync with account system
- [ ] AI scheduling (parse commands)
- [ ] Voice-to-schedule
- [ ] Analytics & insights
- [ ] Home screen widgets
- [ ] Apple Watch companion

## License

Proprietary — All rights reserved.

## Author

Made with love for productivity enthusiasts.

---

**Node24** — *Your 24 hours, beautifully organized.*
