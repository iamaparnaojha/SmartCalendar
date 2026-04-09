# 📅 Smart Calendar — Interactive Wall Experience ✦

A premium, production-grade **Interactive Wall Calendar** designed with modern aesthetics and seamless user experience. Built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**.

---

## ✨ Core Features

- **🎨 Premium Visuals**: Stunning glassmorphic UI with dynamic, season-based background imagery.
- **📖 3D Page Flip**: Immersive 3D animations that simulate a real wall calendar page-turn.
- **🔔 Smart Reminders**: Set quick reminders with interactive icons and full-page "success" celebrations.
- **🔗 Shared Range Notes**: Context-aware note management for specific dates or multiple date ranges.
- **💾 Industrial Persistence**: Robust **localStorage** synchronization with atomic month-wise isolation.
- **🌓 Adaptive Themes**: Fluid transitions between Sleek Dark and Crystal Light modes.

---

## 🏗️ Technical Architecture & Flow

The application follows a **Decoupled Layered Architecture**:

1.  **Logic (Hooks)**: Custom hooks (`useNotes`, `useReminders`) manage the internal state and business logic.
2.  **Storage (Atomic)**: Implements a **Read-Modify-Write** pattern with `localStorage`. Every interaction freshly reads from disk to ensure data integrity.
3.  **UI (Components)**: Atomic components (`DayCell`, `NotesPanel`) render the state and trigger handlers.
4.  **Sync**: UI re-hydrates instantly upon storage updates, ensuring zero-latency feel with persistent safety.

---

## 🧠 Strategic Technical Choices

- **Next.js 15 (App Router)**: Chosen for its superior routing, instant page loads, and built-in optimization for high-fidelity images.
- **Month-Wise Partitioning**: Notes are bucketed by `YYYY-MM`. This prevents data bloat and ensures one month's data never interferes with another.
- **Vanilla CSS Animations**: Complex 3D transformations (page flips) are handled via raw CSS keyframes for smoother 60fps performance and better browser GPU utilization.
- **Deep Consistency**: Functional state updates + fresh storage reads guarantee no data overlaps even during rapid high-frequency user edits.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Utility**: [Date-fns](https://date-fns.org/) for precise temporal operations.
- **Icons**: Selective Emojis & System Typography for performance.

---

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Launch Dev Environment**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 📂 Architecture at a Glance

```text
src/
├── app/          # Next.js App Router & Global Styles
├── components/   # Atomic UI (Grid, Cells, Overlays, Panels)
├── hooks/        # State Machines (Navigation, Notes, Reminders)
├── utils/        # Storage Sync & Calendar Logic
└── types/        # Unified TypeScript Interfaces
```

---

## 👩‍💻 Created with ❤️ by **Aparna**

> Designed to bring digital simplicity to the classic wall calendar experience.
