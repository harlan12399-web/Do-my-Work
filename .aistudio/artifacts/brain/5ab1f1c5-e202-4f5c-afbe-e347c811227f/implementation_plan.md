# Implementation Plan — "Do My Work"

An ultra-refined, premium AI worksheet solver built in the obsidian, delicate aesthetic of the reference site. Users submit worksheets (via photo, file upload, paste, or text), and Gemini solves every problem, returning both a visual sheet with answers completed and a clean, copyable answer key.

---

## 1. Visual & Aesthetic Architecture (Matching Reference Style)
- **Design Constitution**:
  - Deep dark obsidian palette (`#09090b` base, `#0d0d10` elevated surfaces, `#131317` cards).
  - Delicate hairline borders (`rgba(255,255,255,0.06)` to `0.12`).
  - Warm subtle accent glowing elements (`#ff7a3d`, `#e88e63`, soft amber halos).
  - Editorial typography: Georgia italic headings paired with modern tabular monospace and clean sans details.
  - Background atmosphere: subtle procedural grain, SVG rolling hills, animated gulls, celestial sun/moon/flower arc, ambient drifting dust particles, and mouse-follow parallax.
  - Custom floating cursor ring and dot with ripple feedback.

---

## 2. Onboarding, Sign-In & Profile
- **Personalized Onboarding**:
  - Step-by-step modal card:
    1. Name / alias
    2. Grade / Year group / Study focus
    3. Horizon / Celestial preference (Auto, Sun, Flower, Moon)
    4. Accent tone preference
- **Top Profile Pill**:
  - Displays user avatar initial, greeting ("Good evening, Harlan."), remaining daily quota, and VIP badge status.
  - Clicking opens the full slide-out settings drawer.

---

## 3. VIP Unlock & Daily Quota System
- **Initial Load VIP Prompt**:
  - On first load (or accessible anytime), an understated dialog offers:
    *"Enter VIP code for premium access"* with PIN input for `6856`.
  - **Standard Tier**: 15 solves per day with a visual countdown and progress track.
  - **VIP Tier**: Unlocked with code `6856` — grants unlimited solves, priority processing badge, expanded worksheet resolution, and instant batch exports.
- **Persistent State**:
  - Daily quota and VIP status safely stored in `localStorage` with daily midnight reset tracking.

---

## 4. Full-Stack Server & Gemini AI Solver
- **Express Backend (`server.ts`)**:
  - Mounted with Vite middlewares for smooth dev and production serving.
  - Proxies Gemini API requests securely using `@google/genai` with `gemini-3.8-flash`.
  - Endpoint: `POST /api/solve-worksheet` accepting base64 image data or document text.
- **Intelligent Worksheet Parsing**:
  - Instructs Gemini to parse all questions, problems, blanks, and tables.
  - Detects coordinates/bounding areas for blanks or questions so answers can be visually stamped onto the worksheet.
  - Provides direct, clear answers, optional concise working, and question-by-question items.

---

## 5. Worksheet Submission & Interactive Return Sheet
- **Input Channels**:
  - Drag-and-drop or file picker (supports images PNG/JPG/WebP, PDFs, docs).
  - Paste directly from clipboard (`Ctrl+V` / `Cmd+V`).
  - Camera capture for mobile/tablet or webcam snapshots.
  - Text input mode for typed problem sheets.
  - Preloaded sample worksheets (Algebra quiz, Biology cell diagram & questions, Literature comprehension) for instant 1-click test drive.
- **Output Experience (Requested Format)**:
  - **Visual Sheet View**: Original worksheet rendered with crisp, authentic handwritten or typed blue/amber ink overlays precisely placed into blanks, with zoom/pan, compare slider (original vs completed), and download button.
  - **Solution Key View**: Minimalist list of answers formatted cleanly.
  - **One-Click Copy**: A prominent, tactile button to copy all answers cleanly formatted (e.g. `1. A, 2. x = 14...`) to the clipboard with confirmation toast.
  - **Download Options**: Save annotated completed sheet as image or printable summary.

---

## 6. Premium Touches & Polish
- Keyboard shortcuts: `C` to copy answers, `F` for focus mode, `S` for settings, `Esc` to close modals.
- Toast notifications with signature orange dot.
- Solved worksheet history cache so users can revisit previous worksheets anytime during their session.
