# Design Document (Version 1)

This design describes the initial single‑page web application for practicing interview problems in Python. Version 1 is intentionally fully client‑side, persisting all state in the browser’s `localStorage`; no backend services are required.

## Layout Overview

The page contains three primary regions plus a floating action button:

1. **Question Selector Sidebar** – hidden off‑screen on the left and revealed when the pointer hovers near the edge (or via a tap‑to‑open button on mobile). It lists approximately 50 curated questions. Selecting a question loads its full description and starter code.

2. **Main Content Area** – itself split into:

   * **Question Details Panel** – a narrow left column presenting the problem statement and any constraints.
   * **Code Editor** – a Monaco‑style editor (Python‑only) occupying the majority of the width.
   * **Issue Panel** – a collapsible strip docked to the bottom that appears when the pointer nears the lower edge (or when triggered from mobile). It shows bullet‑point mismatches whenever the submission fails the strict check.

3. **Settings Sidebar** – hidden off‑screen on the right; hovering (or tapping) reveals controls for **Learning / Mock** mode, plus **Download** / **Upload** buttons for exporting or importing the entire `localStorage` snapshot.

4. **Voice Command Button** – a floating orange circle anchored to the bottom‑right corner. Pressing it activates the browser’s Web Speech API. A transient toast just above the button displays the live transcription for quick visual feedback.

## Technologies

| Concern          | Technology                                                     |
| ---------------- | -------------------------------------------------------------- |
| Framework & Lang | **React** with **TypeScript**                                  |
| Styling          | **Tailwind CSS** utility classes                               |
| Code Editor      | **Monaco Editor** limited to **Python 3** syntax and execution |
| Voice Commands   | Browser‑native **Web Speech API**                              |
| Persistence      | Browser **localStorage** with JSON backup / restore            |

## Key Interactions

1. **Reveal sidebars** – hover near the left or right edge (or tap the corresponding mobile buttons).
2. **Select a question** – loads description and starter code into the editor.
3. **Write & Check** – edit the code and press **Check** to run the exact validator and capture any discrepancies.
4. **Inspect Issues** – hover near the bottom (or tap) to open the Issue Panel and review mismatches point‑by‑point.
5. **Adjust settings or backup progress** – open the Settings Sidebar.
6. **Use voice commands** – press the floating button to navigate or insert snippets hands‑free. Keyboard shortcuts exist for all major actions.

## Accessibility and Shortcuts

* Every sidebar and the voice button has an associated keyboard shortcut for screen‑reader friendliness.
* All hover‑triggered panels also expose explicit touchscreen buttons.
* Toasts and subtle motion provide status feedback without covering core content.

## Open Questions & Answers for Version 1

1. **Additional programming languages?** Only **Python 3** is supported.&#x20;
2. **Long‑term persistence?** Stick with `localStorage` for this version
3. **Voice command engine?** Use the built‑in **Web Speech API**
4. **Analytics?** Deliberately omitted to keep scope tight for v1
