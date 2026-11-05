# Mathnotes (Student) - Mobile Application 📐✨

[![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS%20%7C%20Expo-blue.svg)](https://mathnotes.courses)
[![Design](https://img.shields.io/badge/Design-Liquid%20Glass%20%28VisionOS%29-38bdf8.svg)](https://mathnotes.courses)
[![Tutor LMS](https://img.shields.io/badge/Backend-WordPress%20Tutor%20LMS%20Pro-10b981.svg)](https://mathnotes.courses)

> **High-Performance Cognitive Mathematics Learning Platform for IIT-JEE, UPSC CSAT & University AI/CS.**

---

## 🌟 Key Highlights

- **VisionOS-Grade Liquid Glass UI**:
  - Translucent frosted acrylic layers with $1.2\text{px}$ specular gradient borders.
  - Luminous ambient aurora backdrops and floating glass dock navigation.
- **Vision Math Lens 2.0**:
  - Point your phone camera or upload photos of handwritten math problems.
  - Automatic OCR LaTeX extraction and Socratic step-by-step first-principles derivations.
  - Common student pitfall alerts (preventing negative marking traps in JEE).
- **Interactive Concept Mastery**:
  - 4-Pillar Pedagogical Flow: *Learn $\to$ Practice $\to$ Understand $\to$ Achieve*.
  - Native KaTeX mathematical formula rendering.
- **Live Tutor LMS Pro Synchronization**:
  - Real-time enrolled course progression, lesson playback, and checkpoint quiz results.
  - 1-Click Razorpay UPI / Card checkout integration.
- **24/7 MathNotes AI Mentor**:
  - Step-by-step guidance, Feynman explanation mode, and instant doubt resolution.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- Expo CLI (`npm install -g expo-cli`)

### Installation
```bash
# Clone the repository
git clone https://github.com/visualsstudiomarketing-blip/mathnotes-student.git
cd mathnotes-student

# Install dependencies
npm install

# Start Expo development server
npx expo start
```

### Build Android Release APK
```bash
npx expo prebuild --platform android --clean
cd android
./gradlew assembleRelease
```

---

## 🏛️ Architecture & Directory Layout

```
apps/mathnotes-student/
├── assets/                  # App branding, icons, and splash
├── src/
│   ├── navigation/          # React Navigation & Floating Glass Dock
│   ├── screens/
│   │   ├── HomeScreen.tsx           # Liquid Glass hero & 4 pillars
│   │   ├── CourseCatalogScreen.tsx  # Tutor LMS course marketplace
│   │   ├── CourseDetailScreen.tsx   # Syllabus, lessons & quizzes
│   │   ├── LessonViewerScreen.tsx   # Media player & notes
│   │   ├── QuizScreen.tsx           # Interactive checkpoint CBT
│   │   ├── VisionMathLensScreen.tsx # Camera OCR & Socratic solver
│   │   ├── MathNotesAIScreen.tsx    # 24/7 AI math mentor
│   │   ├── StudentDashboardScreen.tsx # Progress analytics
│   │   └── CheckoutScreen.tsx       # India Razorpay UPI payment
│   └── shared/
│       ├── components/glass/        # GlassCard, AuroraBackground, Dock
│       ├── services/                # Tutor LMS REST API, OAuth, Push
│       └── types/                   # TypeScript interfaces
├── app.json
└── package.json
```

---

## 📄 License & Ownership
Copyright © 2026 [Mathnotes](https://mathnotes.courses). All Rights Reserved.
