# Feature Specifications

## Phase 1: MVP (Must Have)

### 1. Year Grid View (Home Screen)

**Purpose:** Main interface showing visual representation of the entire year

**Components:**
- Grid of 365 dots (366 for leap years)
- Days remaining counter
- Inspirational quote
- Category icons bar at top

**Layout:**
```
┌─────────────────────────────────┐
│          [ Edit ]               │
│  🌲  🌱  🌵  🌻  (8 categories) │
│                                 │
│  · · · · · · · · · · · · · ·  │
│  · · 🌻 · · · · 🌵 · · · · ·  │
│  · · · · · · · · · · · · · ·  │
│  · · · · · (365 dots) · · · ·  │
│  · · · · · · · · · · · · · ·  │
│                                 │
│     "347 days left in 2026"     │
│                                 │
│  "I knew all the rules but..."  │
│                                 │
│         [ 🌵 ]  [ ✨ ]          │
└─────────────────────────────────┘
```

**Functionality:**
- Display 365/366 dots in grid layout (~20-25 per row)
- Each dot represents one day of the year
- Empty dots: Small, muted gray circles
- Filled dots: Colorful plant/nature icons
- Current day: Highlighted with subtle pulse or ring
- Tap any dot → open journal entry for that day
- Scroll vertically to see entire year
- Days counter updates automatically at midnight
- Quote changes daily

**States:**
- Empty (not journaled)
- Filled (has journal entry)
- Current (today's date)
- Future (dates ahead - optional dimming)

**Interactions:**
- Tap dot → navigate to journal entry
- Long press → quick preview (Phase 2)
- Pinch to zoom → closer view of icons (Phase 2)

---

### 2. Plant Icon System

**Purpose:** Visual representation of each journal entry

**Icon Categories (displayed at top):**
1. Trees (pine, oak, palm, willow, etc.)
2. Sprouts/Seedlings (growth stages)
3. Potted Plants (houseplants)
4. Cacti & Succulents
5. Flowers (tulip, rose, daisy, sunflower, etc.)
6. Leaves & Foliage
7. Mushrooms & Fungi
8. Nature Elements (rainbow, sun, moon, stars)
9. Animals (bird, snail, butterfly, bee)

**Total Icons Required:** 100-150 unique icons

**Icon Properties:**
- Format: SVG (scalable vector graphics)
- Style: Minimal line art, consistent stroke width
- Colors: Various nature tones (greens, blues, purples, earth tones)
- Size: 24x24 dp when displayed in grid
- Size: 48x48 dp in icon selector

**Selection Methods:**
1. **User Choice** (Primary): User selects from picker when journaling
2. **Random Assignment** (Optional): Auto-assign if user doesn't choose
3. **Mood-Based** (Phase 2): Suggest icons based on journal sentiment

**Icon Mapping Structure:**
```typescript
interface PlantIcon {
  id: string;              // 'flower-daisy'
  category: string;        // 'flowers'
  name: string;            // 'Daisy'
  svgComponent: Component; // SVG component
  color: string;           // Primary color
  rarity?: number;         // For gamification (Phase 2)
}
```

---

### 3. Journal Entry Screen

**Purpose:** Write and save daily reflections

**Layout:**
```
┌─────────────────────────────────┐
│  ← Back          January 21     │
├─────────────────────────────────┤
│                                 │
│  [Text Input Area]              │
│                                 │
│  Write your thoughts for        │
│  today...                       │
│                                 │
│                                 │
│                                 │
├─────────────────────────────────┤
│  Choose your plant:             │
│  🌲 🌱 🌵 🌻 🍄 🦋 (scroll)     │
│                                 │
│  Selected: [🌻 Sunflower]       │
│                                 │
├─────────────────────────────────┤
│      [Save]      [Delete]       │
└─────────────────────────────────┘
```

**Components:**
- Date display (formatted: "January 21, 2026")
- Multi-line text input
- Character counter (optional)
- Plant icon selector
- Save button
- Delete button (if entry exists)
- Cancel/back navigation

**Functionality:**
- Auto-save draft every 30 seconds
- Prevent accidental data loss
- Smooth keyboard handling
- Support for basic text input
- Haptic feedback on save
- Animation when saving (dot → plant transformation)

**Validation:**
- Minimum 1 character to save
- Maximum 10,000 characters
- Must select plant icon before saving

**Edge Cases:**
- Editing existing entry
- Deleting entry (confirmation dialog)
- Navigating away with unsaved changes (prompt)
- Journal entry for future dates (allow or restrict?)

---

### 4. Data Persistence

**Purpose:** Store all journal entries locally on device

**Storage Method:** AsyncStorage (React Native)

**Data Structure:**
```typescript
interface JournalEntry {
  id: string;           // UUID v4
  date: string;         // ISO 8601: '2026-01-21'
  dayOfYear: number;    // 1-365/366
  content: string;      // Journal text
  plantIconId: string;  // 'flower-daisy'
  createdAt: number;    // Unix timestamp
  updatedAt: number;    // Unix timestamp
  wordCount?: number;   // Calculated
}

interface AppData {
  version: string;      // Schema version for migrations
  entries: JournalEntry[];
  settings: UserSettings;
}
```

**Storage Operations:**
```typescript
// Save entry
await storage.saveEntry(entry);

// Get entry by date
const entry = await storage.getEntryByDate('2026-01-21');

// Get all entries
const entries = await storage.getAllEntries();

// Delete entry
await storage.deleteEntry(id);

// Batch update (for performance)
await storage.batchSaveEntries(entries);
```

**Performance:**
- Lazy load entries (load on demand)
- Cache current month in memory
- Index by date for fast lookups
- Periodic cleanup of orphaned data

**Backup Strategy (Phase 2):**
- Export all data as JSON
- Import from JSON file
- Automatic backup to cloud

---

### 5. Day Counter

**Purpose:** Show days remaining in current year

**Display:** "347 days left in 2026"

**Logic:**
```typescript
function getDaysLeftInYear(): number {
  const today = new Date();
  const endOfYear = new Date(today.getFullYear(), 11, 31);
  const diffMs = endOfYear.getTime() - today.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return diffDays;
}
```

**Updates:**
- Recalculates at midnight
- Updates when app comes to foreground
- Animates number change

**Year Transition:**
- On January 1st, resets to 365
- Handles leap years (366 days)
- Archives previous year's data

---

### 6. Inspirational Quotes

**Purpose:** Provide daily motivation and reflection prompts

**Quote Database:** 365+ unique quotes

**Categories:**
- Growth & reflection
- Nature & seasons
- Creativity & expression
- Mindfulness & presence
- Wisdom & philosophy

**Examples:**
- "I knew all the rules but the rules did not know me"
- "Growth is never by mere chance"
- "In every walk with nature, one receives far more than he seeks"
- "The creation of a thousand forests is in one acorn"

**Selection Logic:**
```typescript
function getTodayQuote(dayOfYear: number): string {
  // Deterministic: same day = same quote every year
  return quotes[dayOfYear % quotes.length];
}
```

**Display:**
- Bottom of year grid screen
- Subtle, readable typography
- Fades in on app launch
- Optional: tap to share quote (Phase 2)

---

### 7. Navigation

**Tab Navigation (Bottom):**

```
┌─────────────────────────────────┐
│                                 │
│        [Main Content]           │
│                                 │
├─────────────────────────────────┤
│  🏠 Year    📅 Cal    ⚙️ Set   │
└─────────────────────────────────┘
```

**Tabs:**
1. **Year Grid** (Home) - Main visualization
2. **Calendar** (Phase 2) - Alternative view
3. **Settings** - App preferences

**Stack Navigation:**
- Home → Journal Entry
- Settings → About
- Settings → Export Data (Phase 2)

---

### 8. Settings Screen

**Options:**

**Appearance:**
- [ ] Dark Mode (default: on)
- [ ] Light Mode (Phase 2)

**Journaling:**
- [ ] Auto-assign random plant if none selected
- [ ] Show word count in editor
- [ ] Enable haptic feedback

**Notifications (Phase 2):**
- [ ] Daily reminder at [time picker]
- [ ] Streak reminders
- [ ] End of year celebration

**Data:**
- Export all entries (Phase 2)
- Import from backup (Phase 2)
- Clear all data (with confirmation)

**About:**
- App version
- Privacy policy
- Open source licenses
- Send feedback

---

## Phase 2: Future Enhancements

### 1. Calendar View
Alternative interface showing entries in traditional calendar format

**Features:**
- Month-by-month navigation
- Week/month grid view
- Swipe between months
- Quick access to entries

### 2. Statistics & Insights

**Metrics:**
- Current journaling streak
- Longest streak
- Total entries this year
- Average entry length
- Most used plant icons
- Monthly consistency graph
- Year completion percentage

**Visualizations:**
- Bar chart: entries per month
- Heatmap: journaling intensity
- Pie chart: icon distribution

### 3. Search & Filtering

**Features:**
- Full-text search across all entries
- Filter by date range
- Filter by plant icon
- Filter by word count
- Search within entry text

### 4. Backup & Export

**Export Formats:**
- JSON (raw data)
- PDF (formatted with icons)
- Plain text (all entries)
- Year visualization image

**Backup Options:**
- Manual backup to file
- Auto-backup to Google Drive
- Auto-backup to local storage
- Scheduled backups

### 5. Sharing

**Share Options:**
- Share year visualization as image
- Share individual entry (text only)
- Share entry with icon
- Export specific month

**Privacy:**
- Blur sensitive text option
- Remove dates from export
- Anonymize before sharing

### 6. Customization

**Themes:**
- Light mode
- Dark mode (current)
- Nature themes (forest, ocean, desert)
- Custom color palettes

**Fonts:**
- Font size adjustment (accessibility)
- Font family options (serif, sans-serif, mono)

**Grid Layout:**
- Adjust dots per row
- Compact vs spacious spacing
- Icon size adjustment

### 7. Gamification

**Achievements:**
- First Entry
- 7-Day Streak
- 30-Day Streak
- 100-Day Streak
- 365-Day Completion
- Early Bird (journal before 9am)
- Night Owl (journal after 9pm)
- Collector (use 50+ different icons)

**Rewards:**
- Unlock rare plant icons
- Unlock special themes
- Unlock custom quotes
- Certificate for year completion

### 8. Notifications

**Daily Reminder:**
- Custom time selection
- Smart timing (learn user habits)
- Snooze option

**Streak Reminders:**
- "Don't break your 7-day streak!"
- Motivational messages

**Special Events:**
- Year completion celebration
- Milestone achievements
- Monthly summary

### 9. Widget

**Home Screen Widget:**
- Show days remaining
- Display today's quote
- Quick access to journal
- Show current streak

**Widget Sizes:**
- Small: Days counter
- Medium: Days + quote
- Large: Mini grid preview

### 10. Multi-Year Support

**Features:**
- View previous years
- Compare year to year
- Archive completed years
- Annual review feature

**Navigation:**
- Year selector dropdown
- Swipe between years
- Timeline view

### 11. Import Existing Journals

**Support for:**
- Plain text files
- Day One exports
- Journey app exports
- CSV format

### 12. Collaboration (Stretch)

**Shared Gardens:**
- Share year with family member
- See their progress (private entries)
- Encourage each other
- Couple/family challenges

### 13. Mood Tracking

**Simple Integration:**
- Rate mood when journaling (1-5)
- Color-code icons by mood
- Mood trends over time
- Correlate with journaling consistency

### 14. Tags & Categories

**Organization:**
- Add tags to entries
- Filter by tag
- Common tags suggestions
- Tag cloud visualization

### 15. Voice Journaling

**Features:**
- Record voice memos
- Transcribe to text
- Attach audio to entry
- Playback recordings

---

## Future Integrations (Research Phase)

- Apple Health / Google Fit (wellness data)
- Spotify (music attached to memories)
- Weather API (auto-log weather)
- Location services (auto-tag places)
- Photos (attach images to entries)

---

## Features Explicitly NOT Included

**Social Features:**
- No social media integration
- No public profiles
- No followers/following
- No public feed

**Rationale:** Keep the app personal and private, focused on self-reflection

**Monetization:**
- No ads (ever)
- No subscription (MVP)
- Optional one-time premium unlock (future)

**AI Features:**
- No AI writing assistance
- No entry analysis (MVP)
- Keep it simple and authentic

**Multimedia:**
- No photo attachments (MVP)
- No video (ever)
- Focus on written reflection