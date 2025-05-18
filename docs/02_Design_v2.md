# Design Document (Version 1)

This document outlines the user interface design for the next iteration of the LeetCode-style application described in the PRD. Version 1 focuses on a client-only approach, enhancing the structure established earlier.

## Layout Overview

The interface is split into the following main areas:

1. **Question Selector Sidebar** (left)
2. **Main Work Area** (center)
   - Question Details Panel
   - Code Editor
   - Issue Panel
3. **Settings Sidebar** (right)
4. **Voice Command Button** (floating)

### 1. Question Selector Sidebar
- Hidden until the user hovers at the far left edge (or taps a small button on mobile).
- Contains a list of approximately 50 question slots. The first 11 slots hold real questions from version 1 (e.g., *Sort an Array*, *Two Sum*, etc.); the remainder use placeholders until more content is prepared.
- Selecting a slot loads its description and starter code in the main work area.

### 2. Main Work Area
- **Question Details Panel** – narrow column showing the text of the selected problem. It remains visible while the user works.
- **Code Editor** – primary region for typing Python code. Uses a simple monospaced font and allows keyboard shortcuts for common actions.
- **Issue Panel** – hidden by default. Appears when hovering near the bottom of the page or by tapping a mobile button. Displays a bullet list of mismatches after the "Check" action.

### 3. Settings Sidebar
- Revealed by hovering on the right edge (or tapping a button on mobile).
- Includes two modes: **Learning** and **Mock**. Mode selection is persistent in `localStorage`.
- Provides buttons to download or upload a local storage backup so progress can be saved or restored.

### 4. Voice Command Button
- An orange circular button floats at the bottom right corner.
- When pressed, the app listens for voice commands such as "go to question five" or "check code".
- A small toast showing the transcription fades in near the button and disappears shortly after.

## Visual Style
- **Tailwind CSS** is used for rapid prototyping with utility classes.
- The overall look is minimalist with plenty of whitespace. Elements use subtle borders and a neutral color palette so the code editor remains the focal point.
- Sidebars slide in with a brief animation when activated to reinforce the hidden/temporary nature of these panels.

## Accessibility and Shortcuts
- Keyboard shortcuts allow quick toggling of sidebars, initiating the check action, and focusing the voice command button.
- The interface is responsive; on mobile devices, hidden sidebars are toggled via small buttons, and the layout stacks vertically where necessary.

## Data Persistence
- All progress is stored locally in `localStorage` with no back‑end server required.
- Users can export or import their progress from the settings sidebar.

## Open Questions
- Which color scheme best balances readability with a modern look? Tailwind's default palette is used initially, but a custom theme may be applied if feedback suggests it.
- Should additional real problems replace placeholders in version 1, or remain as stubs until a later release?

