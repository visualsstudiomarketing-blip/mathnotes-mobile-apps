# Mathnotes Mobile Applications Platform

Production-ready mobile applications ecosystem for **[Mathnotes.courses](https://mathnotes.courses/)**, connecting students and educators with Tutor LMS Pro and dual RAG AI assistants.

---

## Ecosystem Architecture

- **`apps/mathnotes-student`**: The student application for course discovery, video lessons, checkpoint quizzes, and 24/7 conceptual mentoring via **MathNotes AI**.
- **`apps/mathnotes-teacher`**: The educator portal for curriculum construction, student progress analytics, doubt answering, and **MathNotes Teachers AI** copilot.
- **`shared/`**: Unified TypeScript types, Google OAuth 2.0 client, Expo Push Notifications service, and Tutor LMS API client.
- **`mathnotes-mobile-core-plugin.php`**: WordPress drop-in backend gateway handling Google token verification and dispatching push notifications on Tutor LMS hooks.
- **`live-preview/`**: Interactive browser-based mobile simulator for testing both apps and both AI assistants.

---

## 1. Quick Testing (Instant Browser Simulator)

To test both mobile apps with live API connectivity and interactive AI right now without installing mobile emulators:

👉 Open [`live-preview/index.html`](./live-preview/index.html) in any web browser.

**Features to test in the simulator:**
1. **One-Click Switcher**: Toggle between **Mathnotes (Student)** and **Mathnotes Teacher**.
2. **Interactive Push Alerts**: Click **"Test Push Alert"** to trigger simulated device push notifications (Quiz deadline reminders for students, student doubt alerts for teachers).
3. **Interactive Quizzes**: Tap **"Try Quiz"** to take an intuitive calculus limit checkpoint quiz with LaTeX rendering.
4. **Google OAuth Switcher**: Click the user badge to switch between student and educator authenticated sessions.
5. **Live RAG Bots**: Chat with **MathNotes AI** or generate JEE lesson plans with **Teachers AI**.

---

## 2. WordPress Backend Setup

To enable Google OAuth and push notifications on your live WordPress site:
1. Copy [`mathnotes-mobile-core-plugin.php`](./mathnotes-mobile-core-plugin.php) into your WordPress site's `wp-content/plugins/mathnotes-mobile-core/` folder.
2. In your WordPress Admin (`mathnotes.courses/wp-admin`), navigate to **Plugins** and click **Activate** on **Mathnotes Mobile Core & Gateway**.
3. The plugin will automatically expose:
   - `POST /wp-json/tutor/v1/auth/google`
   - `POST /wp-json/mathnotes/v1/user/push-token`
   - Real-time hooks on student doubts and quiz submissions.

---

## 3. Running & Building the Mobile Apps with Expo

### Mathnotes Student App
```bash
cd apps/mathnotes-student
npm install
npx expo start
```
- Press `a` to open on an Android emulator or device via Expo Go.
- Press `i` to open on an iOS simulator or device via Expo Go.
- Press `w` to run on web.

### Mathnotes Teacher App
```bash
cd apps/mathnotes-teacher
npm install
npx expo start
```

### Building APK (Android) & IPA (iOS)
Run the following from either app directory:
```bash
# Build standalone Android APK
eas build -p android --profile preview

# Build production app bundle for Google Play
eas build -p android --profile production

# Build production IPA for Apple App Store
eas build -p ios --profile production
```

---

## Support & Inquiries
- **General Support**: `care@mathnotes.courses`
- **Teacher Partnerships**: `teachers@mathnotes.courses`
