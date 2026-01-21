# Getting Started - Setup Instructions

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js:** Version 18 or higher (LTS recommended)
  - Download: https://nodejs.org/
  - Verify: `node --version`

- **npm or yarn:** Comes with Node.js
  - Verify: `npm --version` or `yarn --version`

- **Git:** For version control
  - Download: https://git-scm.com/
  - Verify: `git --version`

### For Android Development
- **Android Studio:**
  - Download: https://developer.android.com/studio
  - Install Android SDK
  - Set up Android emulator or use physical device

### Optional Tools
- **VS Code:** Recommended code editor
  - Download: https://code.visualstudio.com/
  - Extensions: ES7+ React snippets, Prettier, ESLint

- **Expo Go App:** For testing on physical device
  - Android: https://play.google.com/store/apps/details?id=host.exp.exponent
  - iOS: https://apps.apple.com/app/expo-go/id982107779

---

## Project Initialization

### Option 1: Using This Documentation with Antigravity

If you're using Google Antigravity or another AI agent:

1. **Provide all documentation files:**
   ```
   PROJECT_OVERVIEW.md
   TECHNICAL_SPEC.md
   FEATURES.md
   UI_DESIGN.md
   DATA_MODELS.md
   DEVELOPMENT_PLAN.md
   GETTING_STARTED.md (this file)
   ```

2. **Give this instruction to the AI agent:**
   ```
   Read all the provided markdown files to understand the 365 Plant 
   Memory Journal app. Then initialize the React Native Expo project 
   following the specifications in TECHNICAL_SPEC.md. Start by 
   implementing Week 1 tasks from DEVELOPMENT_PLAN.md, focusing on 
   project setup and the year grid component.
   ```

3. **Provide additional resources:**
   - Plant icon SVG files (or ask agent to source/generate them)
   - Quote database (or ask agent to generate 365 quotes)

### Option 2: Manual Setup

1. **Create the Expo project:**
   ```bash
   npx create-expo-app 365-plant-memory --template blank-typescript
   cd 365-plant-memory
   ```

2. **Install core dependencies:**
   ```bash
   # Navigation
   npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar

   # Storage
   npx expo install @react-native-async-storage/async-storage

   # UI & Graphics
   npx expo install react-native-svg
   npx expo install react-native-reanimated
   npx expo install react-native-gesture-handler

   # Utilities
   npx expo install date-fns
   npx expo install expo-haptics
   npx expo install expo-font
   ```

3. **Set up project structure:**
   ```bash
   mkdir -p app/{journal,\(tabs\)}
   mkdir -p components
   mkdir -p hooks
   mkdir -p utils
   mkdir -p constants
   mkdir -p types
   mkdir -p assets/{icons/plants/{trees,flowers,cacti,leaves,mushrooms,animals},fonts,images}
   ```

4. **Create initial files:**
   - Copy structure from TECHNICAL_SPEC.md
   - Create type definitions from DATA_MODELS.md
   - Set up constants from UI_DESIGN.md

---

## Project Configuration

### app.json Configuration

Update your `app.json`:

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
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.plantmemory"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#000000"
      },
      "package": "com.yourcompany.plantmemory",
      "permissions": []
    },
    "plugins": [
      "expo-router",
      [
        "expo-font",
        {
          "fonts": ["./assets/fonts/YourFont.ttf"]
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

### TypeScript Configuration

Update `tsconfig.json`:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "jsx": "react-native",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/utils/*": ["./utils/*"],
      "@/constants/*": ["./constants/*"],
      "@/types/*": ["./types/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"]
}
```

### Babel Configuration

Create/update `babel.config.js`:

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './',
            '@/components': './components',
            '@/utils': './utils',
            '@/constants': './constants',
            '@/types': './types',
          },
        },
      ],
    ],
  };
};
```

---

## Development Environment Setup

### VS Code Setup

**Recommended Extensions:**
1. ES7+ React/Redux/React-Native snippets
2. Prettier - Code formatter
3. ESLint
4. React Native Tools
5. Auto Rename Tag
6. Path Intellisense

**Settings (`.vscode/settings.json`):**
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

### Prettier Configuration

Create `.prettierrc`:
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "always"
}
```

### ESLint Configuration

Create `.eslintrc.js`:
```javascript
module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
  },
};
```

---

## Running the App

### Start Development Server

```bash
# Start Expo development server
npx expo start

# Or with specific options
npx expo start --clear    # Clear cache
npx expo start --android  # Open on Android
npx expo start --tunnel   # Use tunneling (for remote testing)
```

### Run on Android Emulator

1. **Start Android Studio**
2. **Open AVD Manager** (Android Virtual Device)
3. **Start an emulator**
4. **Run:** `npx expo start --android`

### Run on Physical Device

1. **Install Expo Go** on your Android device
2. **Connect to same WiFi** as development machine
3. **Start dev server:** `npx expo start`
4. **Scan QR code** with Expo Go app

---

## Building the App

### Development Build

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas login
eas build:configure

# Create development build
eas build --profile development --platform android
```

### Production Build

```bash
# Create production build (APK for testing)
eas build --profile preview --platform android

# Create production build (AAB for Play Store)
eas build --profile production --platform android
```

### eas.json Configuration

Create `eas.json`:
```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
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
  },
  "submit": {
    "production": {}
  }
}
```

---

## Testing

### Run Tests

```bash
# Install testing dependencies
npm install --save-dev @testing-library/react-native @testing-library/jest-native jest

# Run tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

### Test Configuration

Create `jest.config.js`:
```javascript
module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
};
```

---

## Troubleshooting

### Common Issues

**Issue: Metro bundler not starting**
```bash
# Clear cache and restart
npx expo start --clear
```

**Issue: Module not found errors**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

**Issue: Android build fails**
```bash
# Clean Android build
cd android
./gradlew clean
cd ..
```

**Issue: TypeScript errors**
```bash
# Regenerate TypeScript types
npx expo customize tsconfig.json
```

**Issue: Reanimated errors**
```bash
# Make sure babel.config.js has reanimated plugin
# Restart with cache clear
npx expo start --clear
```

### Getting Help

**Resources:**
- Expo Documentation: https://docs.expo.dev/
- React Native Docs: https://reactnative.dev/
- Stack Overflow: Tag with `expo` and `react-native`
- Expo Discord: https://chat.expo.dev/
- React Native Discord: https://discord.gg/react-native

**Debugging:**
- Use React DevTools
- Enable Debug JS Remotely
- Use console.log() liberally
- Check Metro bundler logs
- Use React Native Debugger

---

## Next Steps

Once your environment is set up:

1. **Follow DEVELOPMENT_PLAN.md** for implementation order
2. **Reference TECHNICAL_SPEC.md** for architecture decisions
3. **Use FEATURES.md** to understand requirements
4. **Check UI_DESIGN.md** for visual specifications
5. **Refer to DATA_MODELS.md** for data structures

### Week 1 Checklist

- [ ] Project initialized
- [ ] Dependencies installed
- [ ] Development server running
- [ ] Can see app on device/emulator
- [ ] Git repository created
- [ ] First commit made
- [ ] Ready to start coding!

---

## Additional Resources

### Plant Icons
You'll need ~100+ SVG icons. Options:
- Generate with AI (Midjourney, DALL-E)
- Purchase from icon packs (Noun Project, Iconfinder)
- Use free sets (Flaticon with attribution)
- Draw custom icons (Figma, Illustrator)

### Quotes Database
You'll need 365+ inspirational quotes. Options:
- Curate from quotes websites
- Generate with AI (ChatGPT, Claude)
- Use public domain quotes
- Write original quotes

### Design Assets
- App icon (1024×1024px)
- Splash screen
- Adaptive icon (Android)
- Screenshots for store listing

---

## Quick Start Commands Summary

```bash
# 1. Create project
npx create-expo-app 365-plant-memory --template blank-typescript
cd 365-plant-memory

# 2. Install dependencies
npx expo install expo-router react-native-safe-area-context react-native-screens
npx expo install @react-native-async-storage/async-storage
npx expo install react-native-svg react-native-reanimated
npx expo install date-fns expo-haptics

# 3. Start development
npx expo start

# 4. Build for testing (later)
npm install -g eas-cli
eas build:configure
eas build --profile development --platform android
```

---

**You're all set! Happy coding! 🚀**