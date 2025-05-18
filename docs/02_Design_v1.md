# Design Document (Version 1)

This design describes the initial single-page web application for practicing interview problems in Python. The focus is on a purely client-side experience that stores progress in `localStorage` and requires no backend services.

## Layout Overview

- **Question Selector Sidebar**
  - Hidden until the user hovers near the left edge (or taps a button on mobile).
  - Lists around 50 questions.
  - Selecting a question loads its details and starter code.
- **Main Panel**
  - Divided into a narrow **Question Details** column and a larger **Code Editor** area.
  - An **Issue Panel** with bullet points appears when the user hovers near the bottom or taps a mobile button.
- **Settings Sidebar**
  - Revealed by hovering on the right edge.
  - Provides a Learning/Mock mode toggle and buttons to download or upload the localStorage backup.
- **Voice Command Button**
  - Floating orange circle at the bottom right.
  - Starts listening via the browser's Web Speech API and shows a short transcription toast nearby.

## Technologies

- **Frontend**: React with TypeScript and Tailwind CSS utility classes.
- **Code Editing**: A monaco-style editor restricted to Python 3.
- **Voice Commands**: Web Speech API for built-in speech recognition.
- **Persistence**: Browser `localStorage` only, with options to export and import.

## Key Interactions

1. Hover on the left edge to open the question sidebar.
2. Choose a question to load its description and starter code.
3. Write code in the editor and press **Check** to validate the solution exactly.
4. Hover near the bottom to reveal the Issue Panel with mismatch bullets.
5. Hover on the right edge to adjust settings or download progress.
6. Press the floating voice button to navigate or insert text via voice.

## Accessibility and Shortcuts

- Keyboard shortcuts toggle sidebars, run the checker, and focus the voice button for accessibility.
- Simple visual cues (toasts and animations) clarify state changes without cluttering the interface.

## Answered Questions

- **Additional languages?** Only Python is supported in the code editor.
- **Persistent storage long term?** Keep using `localStorage` for version 1.
- **Voice command library?** Use the browser's built‑in Web Speech API.
- **Analytics?** None for the initial release.

