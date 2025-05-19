# Design Document (Version 1 - Final)

This document expands on the Product Requirements Document and **merges all notes from the earlier “version 2” draft** so no details are lost.  
The application is a **single-page, fully client-side LeetCode-style coding-practice site**. All state lives in the browser’s `localStorage`; no backend services are required.

---

## Layout Overview

The interface is divided into four main areas plus a floating button:

1. **Question Selector Sidebar** (left)  
   - Hidden just off-screen until the user hovers at the far-left edge (or taps an “open” button on mobile).  
   - Lists **≈ 50 question slots**. Slots 1-11 contain real problems (e.g. *Sort an Array*, *Two Sum*); slots 12-50 are placeholders until more content is prepared.  
   - Selecting a slot loads its full description *and* starter code into the Main Work Area.

2. **Main Work Area** (center)  
   - **Question Details Panel** – a narrow column showing the complete problem statement and any constraints. It remains visible while the user writes code.  
   - **Code Editor** – a **Monaco Editor** instance locked to **Python 3**. Uses a simple monospaced font and supports keyboard shortcuts for common actions.  
   - **Issue Panel** – hidden by default; a collapsible strip docked to the bottom. It appears when the pointer nears the bottom edge (or via a mobile tap) **after the user presses “Check”** and shows a bullet list of any mismatches reported by the exact validator.

3. **Settings Sidebar** (right)  
   - Revealed on hover at the right edge or by tapping a button on mobile.  
   - Provides two persistent modes: **Learning** and **Mock** (saved in `localStorage`).  
   - Includes **Download** and **Upload** buttons that export or import a complete `localStorage` backup so progress can be saved or restored.

4. **Voice Command Button** (floating)  
   - An orange circular button anchored to the bottom-right corner.  
   - Pressing it activates the browser’s **Web Speech API** for commands such as “go to question five” or “check code”.  
   - A small toast near the button shows the live transcription and fades out shortly after.

---

## Visual Style

- Built with **Tailwind CSS** utility classes for rapid prototyping.  
- Minimalist look with generous whitespace; elements use subtle gray borders and Tailwind’s default palette for high contrast so the code editor remains the focal point.  
- Sidebars and the Issue Panel slide in/out with a brief (~200 ms ease-out) animation.  
- Toasts are small and unobtrusive. The design respects `prefers-reduced-motion`.

---

## Technologies

- **React 18 + TypeScript 5** for the single-page application.  
- **Monaco Editor** limited to **Python 3** syntax and execution.  
- **Tailwind CSS** (JIT mode) for styling.  
- Version 1 supports only **Python 3**; additional languages are not planned.
- **Web Speech API** for voice commands.  
- **localStorage** for persisting progress indefinitely, with optional JSON backup/restore.

---

## Key Interactions

- Hovering near the left or right edge (or tapping the corresponding mobile buttons) reveals the Question Selector or Settings sidebars.  
- Selecting a question loads its description and starter code into the editor.  
- Editing code and pressing **“Check”** runs a strict validator; mismatches are sent to the Issue Panel.  
- Hovering near the bottom (or tapping on mobile) opens the Issue Panel to review failures.  
- Pressing the Voice Command Button lets users navigate or trigger **Check** hands-free.  
- Keyboard shortcuts mirror all major actions for accessibility.

---

## Accessibility and Shortcuts

- Every sidebar, the Issue Panel, and the Voice Command Button can be toggled/focused with keyboard shortcuts.  
- ARIA labels are applied to dynamic regions; toasts use polite live-regions for screen-reader feedback.  
- All hover-triggered actions have explicit tap targets on touch devices.  
- The layout re-flows responsively; below 640 px width, panels stack vertically.

---

## Data Persistence

- All per-question code, mode selection, and the last opened slot are stored in a versioned JSON blob in `localStorage`.  
- Users can **Download** (`.json`) or **Upload** that blob via the Settings Sidebar.  
- Version 1 relies exclusively on `localStorage`; no replacement is planned.

---


## Analytics

- No analytics or tracking is integrated in Version 1.
