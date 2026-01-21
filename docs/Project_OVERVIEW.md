# 365 Plant Memory Journal - Project Overview

## Quick Start for AI Agent

**READ ALL FILES IN THIS ORDER:**
1. `PROJECT_OVERVIEW.md` (this file) - Start here
2. `TECHNICAL_SPECS.md` - Technical requirements & architecture
3. `FEATURES.md` - Feature specifications & user flows
4. `UI_DESIGN.md` - Design system & visual specifications
5. `DATA_MODELS.md` - Data structures & storage
6. `IMPLEMENTATION_GUIDE.md` - Step-by-step build instructions

---

## Project Summary

**App Name:** 365 Plant Memory Journal  
**Platform:** Android (React Native + Expo)  
**Type:** Daily journal with visual year representation  
**Current Status:** New project - needs complete implementation

---

## Core Concept

A year-long visual journal where:
- Each day of the year (365 days) is represented as a dot in a grid
- When users write a journal entry for a day, the dot "grows" into a unique plant/nature icon
- Creates a living visual representation of the user's year
- Gamifies daily journaling through satisfying visual feedback

---

## What You're Building

### Main Screen (Year Grid)
```
┌─────────────────────────────────┐
│         Edit (button)           │
├─────────────────────────────────┤
│  🌲 🌱 🌵 🌸 🍄 🌿 🦋 🐌 ✨    │ ← Plant category selector
├─────────────────────────────────┤
│                                 │
│  · · · 🌸 · · 🌿 · · 🌲 · ·   │
│  · 🌵 · · · 🍄 · · · · 🌱 ·   │
│  · · · · · · · · · · · · · ·   │ ← 365 dots grid
│  · · 🌻 · · · · · · · · · · ·   │   (empty = not journaled)
│  · · · · · · · · · · · · · ·   │   (icon = journaled)
│  ... (multiple rows)            │
│                                 │
├─────────────────────────────────┤
│  "347 days left in 2026"        │ ← Countdown
│  "I knew all the rules but..."  │ ← Daily quote
└─────────────────────────────────┘
```

### Journal Entry Screen
```
┌─────────────────────────────────┐
│  January 21, 2026               │
├─────────────────────────────────┤
│                                 │
│  [Journal text input area]      │
│  "Write your thoughts..."       │
│                                 │
├─────────────────────────────────┤
│  Choose your plant:             │
│  🌸 🌲 🌵 🌿 🍄 [more icons]    │
├─────────────────────────────────┤
│         [Save Button]           │
└─────────────────────────────────┘
```

---

## Key User Experience

1. **Visual Motivation:** Empty dots create visual gaps that encourage daily journaling
2. **Satisfying Growth:** Watching dots transform into colorful plants is rewarding
3. **Year Overview:** See your entire year's consistency at a glance
4. **Personal Expression:** Choose plant icons that represent each day's mood/memory
5. **Minimal Friction:** Quick, simple journaling without complex features

---

## MVP Features (Phase 1 - Build This Now)

✅ 365-dot grid display  
✅ Daily journal entry creation/editing  
✅ 100+ unique plant/nature icons  
✅ Local data storage (AsyncStorage)  
✅ Days remaining counter  
✅ Daily inspirational quotes  
✅ Smooth animations (dot → plant transformation)  
✅ Dark theme interface  
✅ Edit/delete existing entries  

---

## Technology Stack

**Framework:** React Native with Expo
- Version: Expo SDK 51+
- Language: TypeScript
- Target: Android (API 24+)

**Why This Stack:**
- Fastest development for this type of app
- Excellent animation support
- Simple local storage
- Can add iOS easily later
- Great community & documentation

**Key Dependencies:**
- `@react-navigation/native` - Navigation
- `@react-native-async-storage/async-storage` - Data persistence
- `react-native-svg` - Plant icons
- `react-native-reanimated` - Smooth animations
- `date-fns` - Date utilities
- `expo-haptics` - Touch feedback

---

## Project Structure

```
365-plant-memory/
├── README.md
├── app.json
├── package.json
├── tsconfig.json
│
├── app/                          # Main app screens (Expo Router)
│   ├── (tabs)/
│   │   ├── index.tsx            # Year grid (home)
│   │   ├── settings.tsx         # Settings
│   │   └── _layout.tsx
│   ├── journal/[date].tsx       # Journal entry screen
│   └── _layout.tsx
│
├── components/                   # Reusable components
│   ├── YearGrid.tsx             # Main 365-dot grid
│   ├── DayDot.tsx               # Individual dot/plant
│   ├── PlantIcon.tsx            # SVG icon renderer
│   ├── JournalEditor.tsx        # Text input
│   ├── IconSelector.tsx         # Plant picker
│   ├── QuoteDisplay.tsx         # Quote component
│   └── DaysCounter.tsx          # Days remaining
│
├── assets/                       # Static assets
│   ├── icons/
│   │   └── plants/              # 100+ plant SVG files
│   └── fonts/
│
├── utils/                        # Helper functions
│   ├── storage.ts               # AsyncStorage operations
│   ├── dateUtils.ts             # Date calculations
│   └── animations.ts            # Animation configs
│
├── constants/                    # App constants
│   ├── Colors.ts                # Color palette
│   ├── plantIcons.ts            # Icon mappings
│   └── quotes.ts                # 365+ quotes array
│
├── types/                        # TypeScript types
│   └── index.ts                 # All type definitions
│
└── hooks/                        # Custom React hooks
    ├── useJournalEntries.ts     # Entry management
    └── useYearData.ts           # Year calculations
```

---

## Development Approach

### Phase 1: Foundation (Week 1)
1. Set up Expo project with TypeScript
2. Configure navigation (Expo Router)
3. Implement basic year grid layout
4. Set up AsyncStorage integration

### Phase 2: Core Features (Week 2)
1. Journal entry screen
2. Save/load functionality
3. Plant icon system (start with 20-30 icons)
4. Basic animations

### Phase 3: Polish (Week 3)
1. Add all 100+ plant icons
2. Implement smooth animations
3. Quote system integration
4. Days counter
5. Edit/delete functionality

### Phase 4: Testing & Refinement (Week 4)
1. Performance optimization
2. Bug fixes
3. User testing
4. Final polish

---

## Critical Success Factors

1. **Performance:** Grid must load fast and scroll smoothly
2. **Animations:** Dot-to-plant transformation must feel satisfying
3. **Simplicity:** Keep UI minimal and focused on journaling
4. **Data Safety:** Never lose user entries (robust storage)
5. **Visual Appeal:** Icons must look cohesive and beautiful

---

## Common Pitfalls to Avoid

❌ Over-engineering the grid (keep it simple)  
❌ Too many features in MVP (stay focused)  
❌ Poor animation performance (use Reanimated)  
❌ Inconsistent icon styles (maintain visual coherence)  
❌ Complex navigation (2-3 screens max for MVP)  
❌ Forgetting data persistence testing  

---

## Testing Strategy

**Functional Testing:**
- Test all 365 days (use date simulation)
- Test with 0, 1, 50, 365 entries
- Test edit/delete operations
- Test app restart (data persistence)

**Performance Testing:**
- Grid load time < 1 second
- Smooth 60fps scrolling
- No memory leaks with full year

**UX Testing:**
- Icon selection is intuitive
- Tap targets are appropriate size
- Animations feel natural
- Text input is comfortable

---

## Next Steps for AI Agent

1. **Read all specification files** in order (listed at top)
2. **Set up Expo project** with TypeScript template
3. **Install dependencies** from TECHNICAL_SPECS.md
4. **Create file structure** as outlined above
5. **Start with YearGrid component** (core of the app)
6. **Implement data layer** (AsyncStorage utilities)
7. **Build journal entry screen**
8. **Add animations last** (after functionality works)

---

## Questions to Resolve

Before starting implementation, clarify these with the developer:

1. Do you have plant icon SVG files ready? (Need ~100 icons)
2. Do you have a quote database? (Need 365+ quotes)
3. Should users journal for future dates or only past/present?
4. Any specific Android version requirements? (suggest API 24+)
5. Should random plant assignment exist or always user-chosen?
6. Maximum journal entry character limit?

---

## Resources Needed

- **Plant Icons:** 100+ unique plant/nature SVG icons
  - Organized by categories (trees, flowers, cacti, etc.)
  - Consistent line-art style
  - Optimized file sizes
  
- **Quote Database:** 365+ inspirational quotes
  - Nature/growth themed
  - 1-2 sentences each
  - Varied and meaningful

---

## Success Metrics (Post-Launch)

- User completes 7-day streak
- User completes 30-day streak
- Grid fully filled (365 entries)
- Average session length
- App retention rate

---

## Future Enhancements (Phase 2 - Don't Build Yet)

📅 Calendar view alternative  
📊 Statistics & streak tracking  
💾 Backup & export functionality  
🎨 Theme customization  
🔔 Daily reminders  
🌍 Social sharing  
📱 Home screen widget  
🎯 Achievements & gamification  

---

## Development Resources

- **Expo Docs:** https://docs.expo.dev
- **React Native Docs:** https://reactnavigation.org
- **Reanimated Docs:** https://docs.swmansion.com/react-native-reanimated
- **Design Inspiration:** Existing app screenshots provided

---

## Contact & Feedback

For questions during development:
1. Reference these specification documents
2. Check existing app screenshots for visual guidance
3. Test frequently on Android device/emulator
4. Keep the user experience simple and delightful

---

# 365 Plant Memory Journal - Project Overview

## What This App Does

365 is a year-long visual journal app where each day is represented as a dot in a grid. When users journal for a day, that dot "grows" into a unique plant/nature icon, creating a living visual representation of their year.

## Core User Experience

1. User opens app and sees a grid of 365 dots (one for each day of the year)
2. Empty days appear as small gray dots
3. Days with journal entries appear as colorful plant/nature icons
4. User taps current day (or any day) to write a journal entry
5. After saving, the dot transforms into a plant icon with a satisfying animation
6. Over time, the year "grows" into a beautiful garden of memories

## Visual Reference

Based on provided screenshots:
- **Image 1**: Shows 4 plant category icons at top with "plant memory..." text
- **Image 2**: Year grid with 347 days remaining, dots in grid pattern, quote at bottom
- **Image 3**: Fully populated year with dense plant icons, "1 day of growth" indicator
- **Image 4**: Mostly empty grid at year start with just a few planted icons

## Key Screens

1. **Year Grid (Home)**: Main screen showing all 365 days
2. **Journal Entry**: Write/edit entry for specific day
3. **Settings**: App preferences and options

## Success Vision

A user who journals daily will see their year transform from an empty grid of dots into a vibrant, diverse garden of plants - a visual reward for consistency and reflection.

## Target Platform

Android (primary), with React Native/Expo for easy iOS expansion later

## Files in This Project Brief

- `PROJECT_OVERVIEW.md` (this file) - High-level vision
- `TECHNICAL_SPEC.md` - Technical implementation details
- `FEATURES.md` - Complete feature specifications
- `UI_DESIGN.md` - Design and visual specifications
- `DATA_MODELS.md` - Data structures and storage
- `DEVELOPMENT_PLAN.md` - Phase breakdown and timeline
- `GETTING_STARTED.md` - Setup instructions