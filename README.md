# Node24

**Your 24-Hour Planner** — A sophisticated scheduling app where nodes always sum to 24 hours.

![Node24](https://img.shields.io/badge/React%20Native-Expo-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![License](https://img.shields.io/badge/License-Proprietary-red)

## 📱 About

Node24 is a fresh take on day planning. Instead of traditional time-block calendars, you create "nodes" that represent activities. The magic? **Nodes always fill exactly 24 hours**.

- **1 node** = 24 hours
- **2 nodes** = 12 hours each (or any split you choose)
- **5 nodes** = Automatically balanced, always totaling 24 hours

Empty time appears as subtle filler that shrinks as you add more activities.

## ✨ Features

### Core
- 📅 **24-Hour Node System** — Add, edit, and resize nodes that always sum to a full day
- 🎨 **10 Accent Colors** — Personalize each node with beautiful, curated colors
- 📝 **Notes & Details** — Add context to any node
- ↻ **Repeating Nodes** — Daily, weekdays, weekends, weekly, monthly, yearly
- 🔔 **Smart Reminders** — Get notified before nodes start

### Design
- 🌙 **Dark Mode First** — Elegant, eye-friendly interface
- ⚡ **Native Feel** — Designed to feel like it belongs on iOS
- 🎯 **Sharp & Clean** — No bubbly UI, just purposeful design

### Premium Features (Coming Soon)
- Unlimited nodes per day
- All color themes
- Cloud sync across devices
- AI-powered scheduling suggestions
- Home screen widgets
- Statistics & insights

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo Go app (for testing on device)
- Apple Developer Account (for App Store submission)

### Installation

```bash
# Clone the repository
git clone https://github.com/RamiNoodle733/Schedule-App.git
cd Schedule-App

# Install dependencies
npm install

# Start the development server
npx expo start
```

### Running on Device

1. Install **Expo Go** from the App Store or Play Store
2. Scan the QR code from the terminal
3. The app will load on your device

### Running on Web (Preview)

```bash
npx expo start --web
```

## 🏗 Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── AddNodeButton/
│   ├── ColorPicker/
│   ├── DayHeader/
│   ├── DurationPicker/
│   ├── FillerNode/
│   ├── NodeDetailModal/
│   ├── NodeList/
│   ├── RepeatPicker/
│   ├── ScheduleNodeCard/
│   └── TimeMarker/
├── screens/            # App screens
│   └── HomeScreen/
├── store/              # State management (Zustand)
│   └── scheduleStore.ts
├── theme/              # Design system
│   ├── colors.ts
│   ├── typography.ts
│   └── spacing.ts
├── types/              # TypeScript types
│   └── index.ts
└── utils/              # Helper functions
    ├── helpers.ts
    └── notifications.ts
```

## 🎨 Design System

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

## 📦 Tech Stack

- **Framework:** React Native with Expo
- **Language:** TypeScript
- **State:** Zustand with AsyncStorage persistence
- **Navigation:** React Navigation
- **Animations:** React Native Reanimated
- **Notifications:** Expo Notifications

## 💰 Monetization

Node24 uses a **freemium model**:

### Free Tier
- Up to 5 nodes per day
- 4 basic colors
- Single-day view

### Premium ($4.99/month or $29.99/year)
- Unlimited nodes
- All 10 colors
- Reminders
- Repeating nodes
- Cloud sync
- AI features
- Widgets

## 📱 App Store Submission

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

## 🗺 Roadmap

- [x] Core node system
- [x] Day navigation
- [x] Node editing (name, color, duration)
- [x] Repeat options
- [x] Reminders
- [ ] Drag-to-resize nodes
- [ ] Calendar month view
- [ ] Cloud sync
- [ ] AI scheduling assistant
- [ ] Home screen widgets
- [ ] Apple Watch companion

## 📄 License

Proprietary — All rights reserved.

## 👤 Author

Made with ❤️ for productivity enthusiasts.

---

**Node24** — *Plan your day, one node at a time.*
