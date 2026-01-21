# Data Models & Storage

## TypeScript Type Definitions

### Journal Entry

```typescript
interface JournalEntry {
  // Unique identifier
  id: string;                    // UUID v4
  
  // Date information
  date: string;                  // ISO 8601: '2026-01-21'
  dayOfYear: number;             // 1-365 (or 366 for leap years)
  year: number;                  // 2026
  
  // Content
  content: string;               // Journal text (max 10,000 chars)
  wordCount: number;             // Calculated word count
  
  // Visual representation
  plantIconId: string;           // e.g., 'flower-daisy'
  
  // Metadata
  createdAt: number;             // Unix timestamp (ms)
  updatedAt: number;             // Unix timestamp (ms)
  version: number;               // Schema version (for migrations)
}
```

### Plant Icon

```typescript
interface PlantIcon {
  id: string;                    // 'flower-daisy'
  name: string;                  // 'Daisy'
  category: PlantCategory;       // Enum: 'flowers'
  svgPath: string;               // Path to SVG file
  color: string;                 // Hex color
  keywords: string[];            // For search: ['flower', 'white', 'spring']
  rarity?: 'common' | 'rare' | 'legendary';  // For gamification (Phase 2)
}

enum PlantCategory {
  TREES = 'trees',
  FLOWERS = 'flowers',
  CACTI = 'cacti',
  LEAVES = 'leaves',
  MUSHROOMS = 'mushrooms',
  ANIMALS = 'animals',
  SPROUTS = 'sprouts',
  ELEMENTS = 'elements'
}
```

### App Settings

```typescript
interface AppSettings {
  // Appearance
  theme: 'dark' | 'light';           // Default: 'dark'
  fontSize: number;                  // 14-20, Default: 16
  
  // Journaling preferences
  autoAssignIcon: boolean;           // Default: false
  showWordCount: boolean;            // Default: true
  hapticFeedback: boolean;           // Default: true
  
  // Notifications (Phase 2)
  dailyReminderEnabled: boolean;     // Default: false
  reminderTime?: string;             // '09:00' format
  
  // Privacy
  requireAuth: boolean;              // Default: false (Phase 2)
  autoLock: boolean;                 // Default: false (Phase 2)
  
  // Data
  lastBackupDate?: number;           // Unix timestamp (Phase 2)
  backupEnabled: boolean;            // Default: false (Phase 2)
  
  // Metadata
  version: string;                   // Schema version
  firstLaunchDate: number;           // Unix timestamp
  lastActiveDate: number;            // Unix timestamp
}
```

### User Statistics

```typescript
interface UserStatistics {
  // Streaks
  currentStreak: number;             // Consecutive days
  longestStreak: number;             // All-time best
  lastEntryDate: string;             // ISO date
  
  // Counts
  totalEntries: number;
  totalWords: number;
  averageEntryLength: number;        // Words
  
  // Icon usage
  iconUsageMap: Record<string, number>; // { 'flower-daisy': 12, ... }
  favoriteIcon: string;              // Most used icon ID
  
  // Monthly breakdown
  entriesByMonth: Record<string, number>; // { '2026-01': 15, ... }
  
  // Achievements (Phase 2)
  unlockedAchievements: string[];
  
  // Metadata
  calculatedAt: number;              // Unix timestamp (for caching)
}
```

### App State (In-Memory)

```typescript
interface AppState {
  // Current data
  entries: JournalEntry[];
  settings: AppSettings;
  statistics?: UserStatistics;
  
  // UI state
  selectedDate: string | null;       // Currently viewing/editing
  isLoading: boolean;
  hasUnsavedChanges: boolean;
  
  // Cache
  currentYear: number;
  currentMonth: number;
  todayDate: string;
}
```

### Year Data

```typescript
interface YearData {
  year: number;                      // 2026
  totalDays: number;                 // 365 or 366
  daysRemaining: number;
  entries: JournalEntry[];
  completionPercentage: number;      // 0-100
}
```

---

## Storage Schema

### AsyncStorage Keys

```typescript
const STORAGE_KEYS = {
  ENTRIES: '@365_entries',
  SETTINGS: '@365_settings',
  STATISTICS: '@365_statistics',
  DRAFT: '@365_draft',              // Auto-save draft
  VERSION: '@365_version',
} as const;
```

### Data Format in Storage

**Entries:**
```json
{
  "version": "1.0.0",
  "entries": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "date": "2026-01-21",
      "dayOfYear": 21,
      "year": 2026,
      "content": "Today was a beautiful day...",
      "wordCount": 45,
      "plantIconId": "flower-daisy",
      "createdAt": 1706745600000,
      "updatedAt": 1706745600000,
      "version": 1
    }
  ]
}
```

**Settings:**
```json
{
  "version": "1.0.0",
  "settings": {
    "theme": "dark",
    "fontSize": 16,
    "autoAssignIcon": false,
    "showWordCount": true,
    "hapticFeedback": true,
    "dailyReminderEnabled": false,
    "requireAuth": false,
    "autoLock": false,
    "backupEnabled": false,
    "firstLaunchDate": 1704067200000,
    "lastActiveDate": 1706745600000
  }
}
```

**Statistics:**
```json
{
  "version": "1.0.0",
  "statistics": {
    "currentStreak": 7,
    "longestStreak": 21,
    "lastEntryDate": "2026-01-21",
    "totalEntries": 157,
    "totalWords": 12543,
    "averageEntryLength": 79,
    "iconUsageMap": {
      "flower-daisy": 12,
      "tree-oak": 8,
      "mushroom-1": 15
    },
    "favoriteIcon": "mushroom-1",
    "entriesByMonth": {
      "2026-01": 21
    },
    "unlockedAchievements": ["first_entry", "week_streak"],
    "calculatedAt": 1706745600000
  }
}
```

---

## Storage Operations

### CRUD Operations

```typescript
// Create/Update Entry
async function saveEntry(entry: JournalEntry): Promise<void> {
  const existingData = await getEntriesData();
  const index = existingData.entries.findIndex(e => e.id === entry.id);
  
  if (index >= 0) {
    // Update existing
    existingData.entries[index] = entry;
  } else {
    // Create new
    existingData.entries.push(entry);
  }
  
  // Sort by date
  existingData.entries.sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  await AsyncStorage.setItem(
    STORAGE_KEYS.ENTRIES,
    JSON.stringify(existingData)
  );
}

// Read Entry by Date
async function getEntryByDate(date: string): Promise<JournalEntry | null> {
  const data = await getEntriesData();
  return data.entries.find(e => e.date === date) || null;
}

// Read All Entries
async function getAllEntries(): Promise<JournalEntry[]> {
  const data = await getEntriesData();
  return data.entries;
}

// Read Entries for Year
async function getEntriesForYear(year: number): Promise<JournalEntry[]> {
  const data = await getEntriesData();
  return data.entries.filter(e => e.year === year);
}

// Delete Entry
async function deleteEntry(id: string): Promise<void> {
  const data = await getEntriesData();
  data.entries = data.entries.filter(e => e.id !== id);
  await AsyncStorage.setItem(
    STORAGE_KEYS.ENTRIES,
    JSON.stringify(data)
  );
}

// Batch Operations (for performance)
async function batchSaveEntries(entries: JournalEntry[]): Promise<void> {
  const existingData = await getEntriesData();
  
  entries.forEach(entry => {
    const index = existingData.entries.findIndex(e => e.id === entry.id);
    if (index >= 0) {
      existingData.entries[index] = entry;
    } else {
      existingData.entries.push(entry);
    }
  });
  
  existingData.entries.sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  await AsyncStorage.setItem(
    STORAGE_KEYS.ENTRIES,
    JSON.stringify(existingData)
  );
}
```

### Helper Functions

```typescript
// Get entries data with version checking
async function getEntriesData(): Promise<{ version: string; entries: JournalEntry[] }> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.ENTRIES);
    if (!data) {
      return { version: CURRENT_VERSION, entries: [] };
    }
    const parsed = JSON.parse(data);
    
    // Check if migration needed
    if (parsed.version !== CURRENT_VERSION) {
      return await migrateEntriesData(parsed);
    }
    
    return parsed;
  } catch (error) {
    console.error('Error reading entries:', error);
    return { version: CURRENT_VERSION, entries: [] };
  }
}

// Generate unique ID
function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Calculate word count
function calculateWordCount(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

// Calculate day of year
function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

// Check if leap year
function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}
```

---

## Data Migrations

### Version Control

```typescript
const CURRENT_VERSION = '1.0.0';

interface MigrationFunction {
  from: string;
  to: string;
  migrate: (data: any) => any;
}

const migrations: MigrationFunction[] = [
  // Example: v1.0.0 to v1.1.0
  {
    from: '1.0.0',
    to: '1.1.0',
    migrate: (data) => {
      // Add new fields, transform data
      return {
        ...data,
        version: '1.1.0',
        entries: data.entries.map((entry: any) => ({
          ...entry,
          tags: [], // New field in v1.1.0
        })),
      };
    },
  },
];

async function migrateEntriesData(data: any): Promise<any> {
  let currentData = data;
  const fromVersion = data.version || '1.0.0';
  
  // Find applicable migrations
  const applicableMigrations = migrations.filter(
    m => compareVersions(m.from, fromVersion) >= 0
  );
  
  // Apply migrations sequentially
  for (const migration of applicableMigrations) {
    currentData = migration.migrate(currentData);
  }
  
  // Save migrated data
  await AsyncStorage.setItem(
    STORAGE_KEYS.ENTRIES,
    JSON.stringify(currentData)
  );
  
  return currentData;
}
```

---

## Statistics Calculation

### Computing Statistics

```typescript
async function calculateStatistics(): Promise<UserStatistics> {
  const entries = await getAllEntries();
  
  // Calculate streaks
  const { currentStreak, longestStreak } = calculateStreaks(entries);
  
  // Count totals
  const totalEntries = entries.length;
  const totalWords = entries.reduce((sum, e) => sum + e.wordCount, 0);
  const averageEntryLength = totalEntries > 0 
    ? Math.round(totalWords / totalEntries) 
    : 0;
  
  // Icon usage
  const iconUsageMap: Record<string, number> = {};
  entries.forEach(entry => {
    iconUsageMap[entry.plantIconId] = (iconUsageMap[entry.plantIconId] || 0) + 1;
  });
  
  const favoriteIcon = Object.entries(iconUsageMap)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || '';
  
  // Monthly breakdown
  const entriesByMonth: Record<string, number> = {};
  entries.forEach(entry => {
    const monthKey = entry.date.substring(0, 7); // '2026-01'
    entriesByMonth[monthKey] = (entriesByMonth[monthKey] || 0) + 1;
  });
  
  const lastEntryDate = entries.length > 0 
    ? entries[entries.length - 1].date 
    : '';
  
  const statistics: UserStatistics = {
    currentStreak,
    longestStreak,
    lastEntryDate,
    totalEntries,
    totalWords,
    averageEntryLength,
    iconUsageMap,
    favoriteIcon,
    entriesByMonth,
    unlockedAchievements: [],
    calculatedAt: Date.now(),
  };
  
  // Cache statistics
  await AsyncStorage.setItem(
    STORAGE_KEYS.STATISTICS,
    JSON.stringify({ version: CURRENT_VERSION, statistics })
  );
  
  return statistics;
}

function calculateStreaks(entries: JournalEntry[]): {
  currentStreak: number;
  longestStreak: number;
} {
  if (entries.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }
  
  // Sort by date
  const sorted = [...entries].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;
  
  const today = new Date().toISOString().split('T')[0];
  const lastEntry = sorted[sorted.length - 1].date;
  
  // Calculate longest streak
  for (let i = 1; i < sorted.length; i++) {
    const prevDate = new Date(sorted[i - 1].date);
    const currDate = new Date(sorted[i].date);
    const diffDays = Math.floor(
      (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (diffDays === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }
  
  // Calculate current streak (from today backwards)
  const todayDate = new Date(today);
  const lastEntryDate = new Date(lastEntry);
  const daysSinceLastEntry = Math.floor(
    (todayDate.getTime() - lastEntryDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  if (daysSinceLastEntry <= 1) {
    // Count backwards from last entry
    currentStreak = 1;
    for (let i = sorted.length - 2; i >= 0; i--) {
      const prevDate = new Date(sorted[i].date);
      const currDate = new Date(sorted[i + 1].date);
      const diffDays = Math.floor(
        (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (diffDays === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  } else {
    currentStreak = 0;
  }
  
  return { currentStreak, longestStreak: Math.max(longestStreak, 1) };
}
```

---

## Data Export/Import (Phase 2)

### Export Format

```typescript
interface ExportData {
  exportVersion: string;
  exportDate: number;
  appVersion: string;
  entries: JournalEntry[];
  settings: AppSettings;
  statistics: UserStatistics;
}

async function exportData(): Promise<string> {
  const entries = await getAllEntries();
  const settings = await getSettings();
  const statistics = await calculateStatistics();
  
  const exportData: ExportData = {
    exportVersion: '1.0.0',
    exportDate: Date.now(),
    appVersion: CURRENT_VERSION,
    entries,
    settings,
    statistics,
  };
  
  return JSON.stringify(exportData, null, 2);
}

async function importData(jsonString: string): Promise<void> {
  const importData: ExportData = JSON.parse(jsonString);
  
  // Validate data
  if (!importData.entries || !Array.isArray(importData.entries)) {
    throw new Error('Invalid import data');
  }
  
  // Merge or replace entries
  await batchSaveEntries(importData.entries);
  
  // Optionally import settings
  if (importData.settings) {
    await saveSettings(importData.settings);
  }
}
```

---

## Performance Optimizations

### Indexing

```typescript
// Create index for fast date lookups
const dateIndex = new Map<string, JournalEntry>();
entries.forEach(entry => {
  dateIndex.set(entry.date, entry);
});

// Fast lookup
const entry = dateIndex.get('2026-01-21');
```

### Caching Strategy

```typescript
// Cache frequently accessed data
const cache = {
  entries: null as JournalEntry[] | null,
  statistics: null as UserStatistics | null,
  lastFetch: 0,
  ttl: 5 * 60 * 1000, // 5 minutes
};

async function getCachedEntries(): Promise<JournalEntry[]> {
  const now = Date.now();
  
  if (cache.entries && (now - cache.lastFetch < cache.ttl)) {
    return cache.entries;
  }
  
  cache.entries = await getAllEntries();
  cache.lastFetch = now;
  return cache.entries;
}

// Invalidate cache on write
function invalidateCache() {
  cache.entries = null;
  cache.statistics = null;
  cache.lastFetch = 0;
}
```

### Batch Operations

```typescript
// Batch multiple AsyncStorage operations
async function batchOperations() {
  await AsyncStorage.multiSet([
    [STORAGE_KEYS.ENTRIES, entriesJson],
    [STORAGE_KEYS.SETTINGS, settingsJson],
    [STORAGE_KEYS.STATISTICS, statsJson],
  ]);
}
```

---

## Error Handling

```typescript
// Graceful error handling
async function safeGetEntries(): Promise<JournalEntry[]> {
  try {
    return await getAllEntries();
  } catch (error) {
    console.error('Failed to load entries:', error);
    // Return empty array as fallback
    return [];
  }
}

// Data validation
function validateEntry(entry: Partial<JournalEntry>): entry is JournalEntry {
  return !!(
    entry.id &&
    entry.date &&
    entry.content &&
    entry.plantIconId &&
    typeof entry.dayOfYear === 'number' &&
    typeof entry.year === 'number'
  );
}
```