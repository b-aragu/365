# Technical Specifications

## Technology Stack

### Framework
**React Native with Expo (SDK 51+)**

**Why this choice:**
- Cross-platform capability (Android + iOS)
- Rapid development with Expo's tooling
- Excellent performance for grid-based UIs
- Strong community and documentation
- Easy OTA updates
- Native modules for smooth animations

### Core Dependencies

```json
{
  "expo": "~51.0.0",
  "react": "18.2.0",
  "react-native": "0.74.x",
  "@react-navigation/native": "^6.1.0",
  "@react-navigation/bottom-tabs": "^6.5.0",
  "@react-navigation/stack": "^6.3.0",
  "@react-native-async-storage/async-storage": "^1.21.0",
  "react-native-svg": "^15.1.0",
  "react-native-reanimated": "^3.10.0",
  "date-fns": "^3.3.0",
  "expo-haptics": "~13.0.0",
  "expo-font": "~12.0.0",
  "expo-constants": "~16.0.0",
  "react-native-gesture-handler": "~2.16.0"
}
```

### Optional/Future Dependencies
```json
{
  "expo-file-system": "~17.0.0",
  "expo-sharing": "~12.0.0",
  "expo-notifications": "~0.28.0",
  "react-native-view-shot": "^3.8.0"
}
```

## Project Structure

```
365-plant-memory/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx                 # Year grid home screen
│   │   ├── calendar.tsx              # Alternative calendar view (Phase 2)
│   │   ├── settings.tsx              # Settings screen
│   │   └── _layout.tsx               # Tab navigation layout
│   ├── journal/
│   │   └── [date].tsx                # Journal entry screen (dynamic route)
│   ├── _layout.tsx                   # Root layout
│   └── +not-found.tsx
│
├── components/
│   ├── YearGrid.tsx                  # Main grid displaying all 365 days
│   ├── DayDot.tsx                    # Individual day dot/icon component
│   ├── PlantIcon.tsx                 # SVG plant icon renderer
│   ├── JournalEditor.tsx             # Text input with formatting
│   ├── IconSelector.tsx              # Plant icon picker modal
│   ├── QuoteDisplay.tsx              # Daily quote component
│   ├── DayCounter.tsx                # Days remaining counter
│   └── EmptyState.tsx                # Empty state illustrations
│
├── hooks/
│   ├── useJournalEntries.ts          # Custom hook for journal CRUD
│   ├── useYearData.ts                # Hook for year calculations
│   └── useAnimatedTransform.ts       # Reusable animation hook
│
├── utils/
│   ├── storage.ts                    # AsyncStorage wrapper functions
│   ├── dateUtils.ts                  # Date calculations and formatting
│   ├── plantIconMapping.ts           # Icon ID to component mapping
│   └── quotes.ts                     # Quote retrieval logic
│
├── constants/
│   ├── Colors.ts                     # Color palette
│   ├── Layout.ts                     # Spacing, sizing constants
│   ├── PlantIcons.ts                 # Icon metadata and categories
│   └── Quotes.ts                     # Quote database
│
├── assets/
│   ├── icons/
│   │   ├── plants/                   # Plant SVG icons (organized by type)
│   │   │   ├── trees/
│   │   │   ├── flowers/
│   │   │   ├── cacti/
│   │   │   ├── leaves/
│   │   │   ├── mushrooms/
│   │   │   └── animals/
│   │   └── ui/                       # UI icons
│   ├── fonts/
│   └── images/
│
├── types/
│   ├── journal.ts                    # Journal entry types
│   ├── navigation.ts                 # Navigation types
│   └── index.ts                      # Barrel exports
│
├── app.json                          # Expo configuration
├── package.json
├── tsconfig.json
└── README.md
```

## Build Configuration

### app.json
```json
{
  "expo": {
    "name": "365 Plant Memory",
    "slug": "365-plant-memory",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "dark",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#000000"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.plantmemory"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#000000"
      },
      "package": "com.yourcompany.plantmemory"
    },
    "plugins": [
      "expo-font",
      "expo-router"
    ]
  }
}
```

## Performance Optimizations

### Grid Rendering
```typescript
// Use FlatList with optimizations
<FlatList
  data={yearDays}
  numColumns={20}
  renderItem={renderDayDot}
  keyExtractor={(item) => item.date}
  removeClippedSubviews={true}
  maxToRenderPerBatch={50}
  updateCellsBatchingPeriod={50}
  windowSize={21}
  getItemLayout={(data, index) => ({
    length: DOT_SIZE,
    offset: DOT_SIZE * index,
    index,
  })}
/>
```

### Icon Optimization
- SVG icons should be optimized (remove unnecessary paths)
- Consider using react-native-svg's caching
- Lazy load icon assets
- Use memo for icon components

### Animation Performance
- Use react-native-reanimated for 60fps animations
- Run animations on UI thread
- Avoid animating too many elements simultaneously
- Use native driver where possible

### Storage Optimization
- Batch AsyncStorage operations
- Implement debouncing for auto-save
- Use JSON serialization efficiently
- Consider compression for large entries (Phase 2)

## Testing Strategy

### Unit Tests
- Date utility functions
- Storage helpers
- Icon mapping logic
- Quote selection

### Component Tests
- DayDot renders correctly
- PlantIcon displays right icon
- JournalEditor saves input
- IconSelector selection works

### Integration Tests
- Complete journaling flow
- Data persistence
- Navigation between screens
- Edit/delete entries

### E2E Tests (using Maestro or Detox)
- User can create first entry
- User can view all entries
- Grid displays correctly with mixed states
- Animations perform smoothly

## Security Considerations

### Data Privacy
- All data stored locally
- No external API calls (MVP)
- No user authentication (MVP)
- No analytics tracking (MVP)

### Future Considerations
- Optional cloud backup with encryption
- Export data as encrypted file
- PIN/biometric lock option

## Platform-Specific Notes

### Android
- Test on various screen sizes (5" to 7" screens)
- Support Android 8.0+ (API level 26+)
- Handle back button navigation
- Support dark mode properly

### iOS (Future)
- Test on iPhone SE to Pro Max
- Support iOS 14+
- Handle safe areas properly
- Support dynamic type

## Known Technical Challenges

### 1. Grid Performance
**Challenge:** Rendering 365 interactive elements smoothly
**Solution:**
- Use FlatList virtualization
- Implement getItemLayout for fixed sizing
- Memo individual components
- Batch state updates

### 2. Icon Asset Management
**Challenge:** 100+ SVG icons impact bundle size
**Solution:**
- Optimize all SVGs (remove metadata, compress paths)
- Consider dynamic imports
- Use icon font as alternative
- Implement asset preloading

### 3. Animation Smoothness
**Challenge:** Complex animations may lag on budget devices
**Solution:**
- Use react-native-reanimated
- Run animations on UI thread
- Simplify animations for low-end devices
- Provide option to disable animations

### 4. Date/Timezone Handling
**Challenge:** Edge cases with timezones and year boundaries
**Solution:**
- Always use local device time
- Use date-fns for reliable date math
- Test extensively around year boundaries
- Handle leap years correctly

### 5. Data Migration
**Challenge:** Future updates may require schema changes
**Solution:**
- Version storage schema
- Implement migration functions
- Maintain backward compatibility
- Test migrations thoroughly

## Development Environment Setup

### Required Tools
- Node.js 18+ LTS
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Physical Android device or emulator

### VS Code Extensions (Recommended)
- ES7+ React/Redux/React-Native snippets
- Prettier
- ESLint
- React Native Tools
- TypeScript

### Environment Variables
```
# .env (if needed in future)
API_URL=
ANALYTICS_KEY=
```

## CI/CD Considerations (Future)

### Expo EAS Build
```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

### Automated Testing
- Run tests on PR
- Build preview on main branch
- Deploy to Google Play internal track

## Monitoring & Analytics (Phase 2)

### Crash Reporting
- Sentry for error tracking
- Custom error boundaries

### Analytics
- Mixpanel or Amplitude (optional)
- Track key metrics:
  - Daily active users
  - Entries created
  - Streak lengths
  - Feature usage

## Accessibility

### Requirements
- Screen reader support (TalkBack)
- Minimum touch target: 44x44 dp
- Sufficient color contrast (WCAG AA)
- Keyboard navigation support
- Alternative text for all icons
- Haptic feedback option

### Implementation
```typescript
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Day 156, June 5th, journaled"
  accessibilityRole="button"
  accessibilityHint="Tap to view or edit journal entry"
>
  <PlantIcon />
</TouchableOpacity>
```

## Internationalization (Future)

### Considerations
- Use i18n library (react-i18next)
- Support RTL languages
- Localize dates properly
- Translate quotes database
- Support multiple calendar systems