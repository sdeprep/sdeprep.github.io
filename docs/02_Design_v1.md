# Design Document (Version 1)

This document expands on the Product Requirements Document for version 1. It describes the user interface and key components of the LeetCode‑style coding practice website.

## Layout Overview

The page contains three main vertical regions:

1. **Question Selector Sidebar** – hidden off‑screen on the left until the cursor hovers near the edge. It lists ~50 questions.
2. **Main Content Area** – split into:
   - **Question Details Panel** – a narrow left column with the full problem description.
   - **Code Editor** – the primary region for editing Python solutions.
   - **Issue Panel** – a collapsible area at the bottom that lists mismatches when the code fails the strict check.
3. **Settings Sidebar** – hidden off‑screen on the right until hovered. It provides a Learning/Mock mode toggle and buttons to download or upload the progress stored in `localStorage`.

A floating orange **Voice Command Button** sits at the bottom‑right corner. Pressing it activates the browser's Web Speech API. A small toast near the button displays a short transcription.

## Technologies

- **React + TypeScript** for the web application.
- **Tailwind CSS** for rapid UI styling with utility classes.
- **Monaco Editor** for the code editing component with Python syntax highlighting.
- **LocalStorage** for persisting progress indefinitely.
- **Web Speech API** for voice commands.

## Key Interactions

- Hovering near either screen edge reveals the sidebars.
- Selecting a question loads its description and starter code.
- The "Check" button validates the code against the exact solution and displays any issues.
- Voice commands can navigate between questions or trigger a check.
- Keyboard shortcuts mirror these actions for accessibility.

## Open Questions and Suggestions

1. **How should additional programming languages be prioritized?**
   - Support only Python in version 1. No other languages are required.
   - Evaluate user demand for JavaScript or other languages later.

2. **What persistent mechanism should replace localStorage long term?**
   - Stick with localStorage for version 1.
   - Consider IndexedDB or a lightweight backend in future versions if progress sync becomes important.

3. **Which voice command technology should be used?**
   - Use the browser's built‑in Web Speech API for version 1.
   - Investigate third‑party services (e.g., Whisper) if reliability is insufficient later.

4. **Should analytics be integrated in the initial release?**
   - Skip analytics for version 1 to stay focused on core functionality.
   - Revisit analytics after gathering feedback from early users.
