# GingerNotes — Premium Smart Study Assistant

GingerNotes is a modern, high-fidelity study tool built in **React Native** using the **Expo** framework. It has a beautiful responsive layout (which looks like a premium persistent sidebar on desktop/tablet, and switches to bottom tabs on mobile devices), supports seamless light and dark mode toggling, and provides rich interactive features including note scanning, AI chatting, customizable quiz taking, and flashcards with 3D card flips.

---

## 🚀 How to Run Locally

Since this is a standard Expo React Native project, you can run it on your machine on Web, Android, or iOS with the following steps:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (version 18 or above recommended).

### Setup and Start
1. Open a terminal/shell inside this directory (`gingernotes/`).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Expo development server:
   ```bash
   npm run start
   ```

### Running on Different Platforms
- **Web Browser (Recommended for instant view)**: Press **`w`** in the terminal or run:
  ```bash
  npm run web
  ```
- **Android Device/Emulator**: Install the **Expo Go** app on your phone, then scan the QR code printed in the terminal, or run:
  ```bash
  npm run android
  ```
- **iOS Device/Simulator**: Scan the QR code with your iOS Camera app, or run:
  ```bash
  npm run ios
  ```

---

## 🎨 Design System & Highlights

- **Dynamic Theme Engine**: Integrates a seamless `ThemeContext` providing custom color palettes for:
  - **Dark Mode**: High-end glassmorphism with glowing neon borders, deep indigo gradient backdrops, and active blue and purple tabs.
  - **Light Mode**: Vibrant, crisp white-and-blue design with soft shadows and clear typography.
- **Responsive Architecture**: Uses React Native's `useWindowDimensions` to scale the UI dynamically:
  - **Screen Width ≥ 1024px**: Displays the precise multi-column layout shown in the design specs, complete with the persistent left-side brand sidebar.
  - **Screen Width < 1024px**: Transforms into a mobile-first app, featuring a sleek top header with quick buttons and a responsive bottom tab bar.
- **Shared State Bridge**: A unified `AppContext` synchronizes actions across screens. For example:
  - Performing note uploads increments your dashboard notes stats.
  - Taking and finishing topic quizzes recalculates scores and study streaks instantly.
  - Creating new flashcard decks appends cards dynamically to your grid view.

---

## 📁 File Modularity

```text
gingernotes/
├── app.json                 # Expo configurations
├── package.json             # NPM dependencies & scripts
├── App.js                   # Root entry combining layout & state
└── src/
    ├── context/
    │   ├── ThemeContext.js  # Dark/Light mode theme state & custom tokens
    │   ├── NavigationContext.js  # Dynamic state routing
    │   └── AppContext.js    # Database state, chat history, quiz/flashcard records
    ├── components/
    │   ├── Card.js          # Styled cards (glassmorphism in Dark)
    │   ├── Button.js        # Premium touchable buttons with animations
    │   ├── ProgressBar.js   # Custom horizontal gradient progress track
    │   ├── Sidebar.js       # Desktop sidebar and mobile bottom tab navigator
    │   └── Header.js        # Responsive mobile view header
    └── screens/
        ├── DashboardScreen.js  # Main study stats, quick actions, note summaries
        ├── ScanNotesScreen.js  # OCR note upload and AI text extraction simulator
        ├── AIChatScreen.js     # Ginger AI chatbot with preloaded suggestion queries
        ├── FlashcardsScreen.js # Deck collections with interactive 3D card flips
        ├── QuizzesScreen.js    # Topic selector with live adaptive quiz session engine
        └── StudyPlannerScreen.js # Calendar tracking and checked schedules list
```
