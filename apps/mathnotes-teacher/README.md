# Mathnotes Teacher - Mobile Application 🎓📊

[![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS%20%7C%20Expo-green.svg)](https://mathnotes.courses)
[![Design](https://img.shields.io/badge/Design-Liquid%20Glass%20%28VisionOS%29-10b981.svg)](https://mathnotes.courses)
[![Tutor LMS](https://img.shields.io/badge/Backend-WordPress%20Tutor%20LMS%20Pro-10b981.svg)](https://mathnotes.courses)

> **High-Yield Pedagogical Educator Portal for Tutor LMS Pro with VisionOS Liquid Glass UI & AI Exam Generation Studio.**

---

## 🌟 Key Highlights

- **VisionOS-Grade Liquid Glass UI**:
  - Translucent frosted acrylic layers with $1.2\text{px}$ specular gradient borders.
  - Luminous emerald aurora backdrops and floating glass dock navigation.
- **4-Step Course Creation Studio**:
  - Mirrors Tutor LMS web builder tabs:
    - Step 1: **Basics** (`#/basics`) - Title, Category chip selector, Difficulty Level, Duration, Pedagogical Description.
    - Step 2: **Additional Info** (`#/additional`) - Learning outcomes, Target audience, Prerequisites.
    - Step 3: **Curriculum** (`#/curriculum`) - Modular topics, lessons, and the one-tap **Teachers AI Generator** to synthesize the full 4-pillar syllabus.
    - Step 4: **Pricing & Publish** (`#/pricing`) - Free vs Paid toggle, Indian Rupee ($\text{₹}$) pricing, draft saving, and live publishing to Tutor LMS.
- **AI Exam & CBT Question Paper Studio**:
  - Generate high-stakes NTA CBT mock papers with verified LaTeX mathematical equations.
  - Options, Bloom's difficulty calibration (Medium / Hard / Olympiad), and full step-by-step solution keys.
  - One-tap publish to Tutor LMS or export to print-ready LaTeX / PDF.
- **Student Doubt Clearance (Q&A Inbox)**:
  - Direct student inquiry management with **"Draft LaTeX Solution with Teachers AI"** for fast, rigorous answers.
  - Instant Expo Push Notification delivery to student lock screens upon answering.
- **Dynamic Tutor LMS Analytics & Operations**:
  - Real-time revenue ($\text{₹}$), enrolled students, course counts, and doubt queues.
  - Batch announcement broadcast studio and live class scheduler.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- Expo CLI (`npm install -g expo-cli`)

### Installation
```bash
# Clone the repository
git clone https://github.com/visualsstudiomarketing-blip/mathnotes-teacher.git
cd mathnotes-teacher

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
apps/mathnotes-teacher/
├── assets/                  # App branding, icons, and splash
├── src/
│   ├── navigation/          # React Navigation & Floating Glass Dock
│   ├── screens/
│   │   ├── TeacherDashboardScreen.tsx # Live metrics, batch actions & courses
│   │   ├── CreateCourseScreen.tsx    # 4-step Tutor LMS course studio
│   │   ├── MyCoursesScreen.tsx       # Course catalog & editor deep links
│   │   ├── ExamStudioScreen.tsx      # AI CBT question paper studio
│   │   ├── TeachersAIScreen.tsx      # Educator curriculum copilot
│   │   ├── QNAInboxScreen.tsx        # Student doubts & AI LaTeX solver
│   │   ├── StudentAnalyticsScreen.tsx# Enrolled student performance
│   │   ├── TeacherProfileScreen.tsx  # Payouts & Section 194-O tax portal
│   │   └── TeacherLoginScreen.tsx    # Google OAuth educator sign-in
│   └── shared/
│       ├── components/glass/         # GlassCard, AuroraBackground, Dock
│       ├── services/                 # Tutor LMS REST API, OAuth, Push
│       └── types/                    # TypeScript interfaces
├── app.json
└── package.json
```

---

## 📄 License & Ownership
Copyright © 2026 [Mathnotes](https://mathnotes.courses). All Rights Reserved.
