# UI/UX Design Specifications

## Design Philosophy

**Core Principles:**
- Minimal and zen-like
- Nature-inspired aesthetic
- Focus on the journal, not the interface
- Satisfying, rewarding interactions
- Dark mode by default (easier on eyes)

**Inspiration:**
- Japanese minimalism
- Botanical illustrations
- Digital gardens
- Mindfulness apps

---

## Color Palette

### Base Colors (Dark Mode)
```css
--background-primary: #000000     /* Pure black */
--background-secondary: #0A0A0A   /* Slightly lifted black */
--background-elevated: #1A1A1A    /* Cards, modals */

--text-primary: #FFFFFF           /* Pure white */
--text-secondary: #A0A0A0         /* Muted gray */
--text-tertiary: #666666          /* Dimmed gray */

--border-default: #2A2A2A         /* Subtle borders */
--border-focus: #3A3A3A           /* Focused state */
```

### Plant Colors (For Icons)
```css
--plant-green-light: #7ED957      /* Spring green */
--plant-green: #4CAF50            /* Classic green */
--plant-green-dark: #2E7D32       /* Forest green */

--plant-blue: #64B5F6             /* Sky blue */
--plant-purple: #9C27B0           /* Lavender */
--plant-pink: #F48FB1             /* Soft pink */
--plant-yellow: #FFD54F           /* Sunflower */
--plant-orange: #FF9800           /* Autumn orange */
--plant-red: #EF5350              /* Berry red */
--plant-brown: #8D6E63            /* Earth brown */
```

### Accent Colors
```css
--accent-primary: #7C4DFF         /* Purple highlight */
--accent-success: #4CAF50         /* Green success */
--accent-warning: #FF9800         /* Orange warning */
--accent-error: #EF5350           /* Red error */
```

### States
```css
--state-hover: rgba(255, 255, 255, 0.05)
--state-pressed: rgba(255, 255, 255, 0.1)
--state-disabled: rgba(255, 255, 255, 0.3)
--state-focus: rgba(124, 77, 255, 0.2)
```

---

## Typography

### Font Families
**Primary:** SF Pro Display (iOS) / Roboto (Android)  
**Fallback:** System default sans-serif

### Font Sizes
```css
--text-xs: 12px       /* Captions, metadata */
--text-sm: 14px       /* Secondary text */
--text-base: 16px     /* Body text, journal */
--text-lg: 18px       /* Subheadings */
--text-xl: 24px       /* Headings */
--text-2xl: 32px      /* Large headings */
--text-3xl: 48px      /* Day counter */
```

### Font Weights
```css
--font-light: 300
--font-regular: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
```

### Line Heights
```css
--leading-tight: 1.2
--leading-normal: 1.5
--leading-relaxed: 1.75
```

### Usage
```
Day Counter: 48px Bold
Quote: 14px Regular, Italic
Journal Entry: 16px Regular
Dates: 18px Medium
```

---

## Spacing System

**Base Unit:** 4px

```css
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-5: 20px
--space-6: 24px
--space-8: 32px
--space-10: 40px
--space-12: 48px
--space-16: 64px
```

**Common Patterns:**
- Component padding: 16px
- Screen margins: 20px
- Grid gaps: 8px
- Section spacing: 32px

---

## Layout Specifications

### Year Grid

**Dot Specifications:**
```
Dot Size: 16px × 16px
Dot Spacing: 8px
Dots per Row: 20-25 (responsive)
Grid Padding: 20px
```

**Grid Calculations:**
```typescript
const screenWidth = Dimensions.get('window').width;
const gridPadding = 20;
const dotSpacing = 8;
const availableWidth = screenWidth - (gridPadding * 2);
const dotsPerRow = Math.floor((availableWidth + dotSpacing) / (dotSize + dotSpacing));
```

**Plant Icon Size (in Grid):**
```
Icon Size: 24px × 24px
Touch Target: 44px × 44px (for accessibility)
```

### Category Icons Bar
```
Icon Size: 32px × 32px
Horizontal Spacing: 16px
Scroll: Horizontal scroll if needed
Height: 64px
Padding: 12px vertical
```

### Days Counter
```
Position: Top center
Font Size: 48px
Font Weight: Bold
Spacing: 24px from top
```

### Quote Display
```
Position: Bottom of grid
Font Size: 14px
Style: Italic
Max Width: 80% screen width
Padding: 20px
Alignment: Center
```

---

## Component Designs

### 1. Day Dot

**Empty State:**
```
Circle: 16px diameter
Fill: #3A3A3A (muted gray)
Border: None
Opacity: 0.6
```

**Filled State:**
```
Plant Icon: 24px × 24px
Colors: Various (based on plant)
Border: None
Opacity: 1.0
```

**Current Day (Today):**
```
Additional: Pulsing ring
Ring Color: #7C4DFF (accent purple)
Ring Size: 32px diameter
Animation: Gentle pulse (1.5s duration)
```

**Future Day (Optional):**
```
Same as empty, but:
Opacity: 0.3
Slightly smaller: 14px
```

### 2. Plant Icon Selector

**Modal Design:**
```
┌─────────────────────────────────┐
│  Choose Your Plant      [×]     │
├─────────────────────────────────┤
│                                 │
│  🌲 Trees                       │
│  🌲 🌳 🌴 🌵 🌿 ...            │
│                                 │
│  🌸 Flowers                     │
│  🌸 🌺 🌻 🌷 🌹 ...            │
│                                 │
│  🍄 Mushrooms                   │
│  🍄 🍄 🍄 🍄 🍄 ...            │
│                                 │
│  [Currently Selected: 🌻]       │
│                                 │
│           [Confirm]             │
└─────────────────────────────────┘
```

**Layout:**
- Full screen or bottom sheet modal
- Grouped by category
- Grid layout: 5 icons per row
- Icon size: 48px × 48px
- Touch target: 64px × 64px
- Selected state: Border highlight
- Scrollable content

### 3. Journal Editor

**Text Input:**
```
Background: #1A1A1A
Border: 1px solid #2A2A2A
Border Radius: 12px
Padding: 16px
Font Size: 16px
Line Height: 1.5
Min Height: 200px
Placeholder: "Write your thoughts for today..."
```

**Character Counter (Optional):**
```
Position: Bottom right of input
Font Size: 12px
Color: #666666
Format: "1,234 / 10,000"
```

### 4. Buttons

**Primary Button (Save):**
```
Background: #7C4DFF
Text: #FFFFFF
Height: 48px
Border Radius: 24px
Font Size: 16px
Font Weight: 600
Padding: 0 32px

Hover: Background opacity 0.9
Pressed: Background opacity 0.8
Disabled: Opacity 0.5
```

**Secondary Button (Delete):**
```
Background: Transparent
Border: 1px solid #EF5350
Text: #EF5350
Height: 48px
Border Radius: 24px
Font Size: 16px
Font Weight: 600
Padding: 0 32px

Hover: Background rgba(239, 83, 80, 0.1)
Pressed: Background rgba(239, 83, 80, 0.2)
```

**Text Button (Cancel):**
```
Background: Transparent
Text: #A0A0A0
Height: 48px
Font Size: 16px
Font Weight: 500
Padding: 0 16px

Hover: Text opacity 0.8
```

### 5. Navigation Bar

**Tab Bar:**
```
Height: 64px
Background: #0A0A0A
Border Top: 1px solid #2A2A2A
Icons: 24px × 24px
Active Color: #7C4DFF
Inactive Color: #666666
Label Size: 12px
```

---

## Animations

### Dot to Plant Transformation

**Timing:** 600ms  
**Easing:** ease-out

```typescript
// Scale and fade animation
Animated.parallel([
  Animated.spring(scale, {
    toValue: 1.2,
    tension: 50,
    friction: 7,
    useNativeDriver: true,
  }),
  Animated.timing(opacity, {
    toValue: 1,
    duration: 300,
    useNativeDriver: true,
  }),
]).start();
```

**Sequence:**
1. Dot scales up slightly (1.0 → 1.2)
2. Dot fades out
3. Icon fades in at same position
4. Icon scales to normal (1.2 → 1.0)
5. Haptic feedback

### Current Day Pulse

**Animation:**
```typescript
Animated.loop(
  Animated.sequence([
    Animated.timing(ringScale, {
      toValue: 1.3,
      duration: 1500,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }),
    Animated.timing(ringOpacity, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }),
  ])
).start();
```

### Screen Transitions

**Page Navigation:**
- Duration: 300ms
- Type: Slide from right (forward) / left (back)
- Easing: ease-in-out

**Modal:**
- Duration: 250ms
- Type: Slide from bottom
- Backdrop: Fade in (opacity 0 → 0.5)

### Loading States

**Initial Grid Load:**
- Stagger animation: Each row fades in sequentially
- Delay between rows: 50ms
- Total duration: ~2 seconds for full year

**Save Confirmation:**
- Checkmark icon bounces in
- Duration: 400ms
- Spring animation

---

## Interactions & Feedback

### Haptic Feedback

**When to Use:**
- Tap day dot (light impact)
- Select plant icon (medium impact)
- Save journal entry (success notification)
- Delete entry (warning notification)
- Achievement unlocked (heavy impact)

**Implementation:**
```typescript
import * as Haptics from 'expo-haptics';

// Light tap
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

// Medium impact
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

// Success
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
```

### Touch States

**Minimum Touch Target:** 44x44 dp (WCAG guideline)

**Visual Feedback:**
- Hover: Slight scale (1.05) + opacity (0.9)
- Press: Scale (0.95) + opacity (0.8)
- Release: Spring back to normal

### Empty States

**No Entries Yet:**
```
┌─────────────────────────────────┐
│                                 │
│         🌱                      │
│                                 │
│   Start Your Growth Journey     │
│                                 │
│   Tap today's dot to plant      │
│   your first memory             │
│                                 │
│      [ Get Started ]            │
└─────────────────────────────────┘
```

**Search No Results:**
```
🔍 No entries found

Try different keywords or dates
```

---

## Responsive Design

### Breakpoints

**Phone (Portrait):**
- Width: 320-428px
- Dots per row: 18-20

**Phone (Landscape):**
- Width: 568-926px
- Dots per row: 30-35

**Tablet:**
- Width: 768px+
- Dots per row: 40-45
- Two-column layout option

### Safe Areas

**iOS:**
- Top: Status bar + notch
- Bottom: Home indicator

**Android:**
- Top: Status bar
- Bottom: Navigation bar

**Implementation:**
```typescript
import { SafeAreaView } from 'react-native-safe-area-context';

<SafeAreaView style={{ flex: 1 }}>
  {/* Content */}
</SafeAreaView>
```

---

## Dark Mode (Default)

Current implementation focuses on dark mode.

### Light Mode (Phase 2)

**Color Adjustments:**
```css
--background-primary: #FFFFFF
--background-secondary: #F5F5F5
--background-elevated: #FFFFFF

--text-primary: #000000
--text-secondary: #666666
--text-tertiary: #999999

--border-default: #E0E0E0
--border-focus: #BDBDBD
```

---

## Accessibility

### Color Contrast

**Minimum Ratios (WCAG AA):**
- Normal text: 4.5:1
- Large text: 3:1
- UI components: 3:1

**Current Compliance:**
- White on black: 21:1 ✓
- Gray (#A0A0A0) on black: 8.2:1 ✓
- Accent (#7C4DFF) on black: 5.8:1 ✓

### Screen Reader Support

**Semantic Labels:**
```typescript
<View
  accessible={true}
  accessibilityRole="button"
  accessibilityLabel="January 21st, 2026, journaled with sunflower icon"
  accessibilityHint="Double tap to view or edit entry"
>
  <PlantIcon />
</View>
```

**Navigation Announcements:**
- "Year grid, 347 days journaled"
- "Journal entry screen, January 21st"
- "Settings screen"

### Font Scaling

Support iOS Dynamic Type and Android font scaling:
```typescript
const fontSize = 16 * fontScale; // Respects system settings
```

### Reduce Motion

Detect and respect system preferences:
```typescript
import { AccessibilityInfo } from 'react-native';

const reduceMotionEnabled = await AccessibilityInfo.isReduceMotionEnabled();

if (!reduceMotionEnabled) {
  // Use full animations
} else {
  // Use minimal/instant transitions
}
```

---

## Performance Considerations

### Image Optimization
- Use optimized SVGs (remove unnecessary data)
- Implement lazy loading for icons
- Cache rendered icons

### Animation Performance
- Use `useNativeDriver: true` wherever possible
- Avoid animating layout properties
- Use `react-native-reanimated` for complex animations

### Render Optimization
- Memo components that don't change often
- Use FlatList for grid (virtualization)
- Implement `getItemLayout` for fixed-size items

---

## Platform-Specific Patterns

### Android
- Material Design ripple effects
- Bottom sheet modals
- Floating action button (optional)
- System navigation gestures

### iOS (Future)
- Cupertino-style navigation
- Swipe back gesture
- Modal sheets
- iOS-specific fonts (SF Pro)

---

## Design Assets Needed

### Icons (100+ SVG files)
Organized by category:
- `/assets/icons/plants/trees/`
- `/assets/icons/plants/flowers/`
- `/assets/icons/plants/cacti/`
- `/assets/icons/plants/leaves/`
- `/assets/icons/plants/mushrooms/`
- `/assets/icons/plants/animals/`

### App Icons
- 1024×1024px (iOS)
- 512×512px (Android)
- Various sizes for different densities

### Splash Screen
- Simple design with app name/logo
- Dark background
- Light plant illustration

---

## Design Review Checklist

Before implementation:
- [ ] All colors meet contrast requirements
- [ ] Touch targets are minimum 44×44 dp
- [ ] Animations use native driver
- [ ] Empty states are designed
- [ ] Error states are handled
- [ ] Loading states are clear
- [ ] Responsive on various screen sizes
- [ ] Dark mode looks polished
- [ ] Haptic feedback is appropriate
- [ ] Navigation is intuitive