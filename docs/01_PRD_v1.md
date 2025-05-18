# Product Requirements Document (PRD)

## Project Overview

This document describes **version 1** of a LeetCode‑style web application for practicing coding interview problems. The focus is on a client‑only implementation that stores progress in `localStorage`. No backend or authentication is required.

## Goals

- Hidden question selector that appears on hover at the left edge of the screen.
- About 50 question slots. The first several contain real problems, the remainder use placeholders.
- Question details, code editor and an issue panel are always available when a problem is selected.
- Strict Python 3 code checking using a "Check" button. The entire solution must match exactly.
- Progress is stored in `localStorage` indefinitely and can be downloaded or uploaded from a settings sidebar.
- Two modes in the settings sidebar: **Learning** and **Mock**.
- Voice commands triggered by a floating orange button at the bottom right; a small transcription toast appears nearby.
- Keyboard shortcuts for common actions for accessibility.

## Non‑Goals

- Backend services or authentication.
- Real‑time collaboration or advanced code execution.

## User Experience

### Question Selector Sidebar
- Hidden until the user hovers on the left edge (tap a button on mobile).
- Lists ~50 questions; selecting one loads its description and starter code.

### Main Layout
- **Question Details Panel** – narrow column describing the selected problem.
- **Code Editing Area** – primary area for typing Python code.
- **Issue Panel** – minimal bullet list of mismatches. Appears when hovering near the bottom (or via a small mobile button).

### Settings Sidebar
- Revealed by hovering on the right edge (or tapping a button on mobile).
- Contains **Learning/Mock** mode toggle and buttons to download or upload the local storage backup.

### Voice Interaction
- An orange circular button floats at the bottom right of the screen.
- Pressing it listens for voice commands such as "go to question five" or "check code".
- A transcription toast appears close to the button with short fade‑in/fade‑out timing.
- Voice commands can also insert text in a simple coding mode.

### Keyboard Shortcuts
- Provide shortcuts for toggling sidebars, checking code, and focusing the voice button.

## Initial Question List

Version 1 uses 50 slots. The first set contains the following real LeetCode problems:

1. **Sort an Array** – given an array, return it sorted.
2. **Two Sum** (LeetCode #1)
3. **Two Sum II – Input Array Is Sorted** (LeetCode #167)
4. **Meeting Rooms** (LeetCode #252)
5. **Intersection of Three Sorted Arrays** (LeetCode #1213)
6. **Intersection of Two Arrays** (LeetCode #349)
7. **Merge Sorted Array** (LeetCode #88)
8. **Kth Largest Element in an Array** (LeetCode #215)
9. **K Closest Points to Origin** (LeetCode #973)
10. **Top K Frequent Elements** (LeetCode #347)
11. **Sort Colors** (LeetCode #75)

The remaining questions use placeholder titles and descriptions until more content is prepared.

## Milestones

1. **Prototype** – static layout with dummy data and hover interactions.
2. **Question Selector** – implement sidebar and sample questions above.
3. **Editor and Strict Check** – integrate code editor and exact match validation.
4. **Issue Panel & Voice Commands** – display bullet points for issues, enable voice navigation with transcription toast.
5. **Settings Sidebar** – add mode toggle and backup buttons.

## FAQ

1. **Where will question data come from later?** – Eventually from an API (possibly static), but version 1 bundles it locally.
2. **What design system should we use?** – Tailwind CSS for rapid prototyping with utility classes.
3. **Should analytics be collected early?** – Defer analytics until after receiving user feedback.
4. **Will strict checking evolve?** – It may provide hints in the future, but no partial credit.
5. **Should progress ever expire?** – No, progress in `localStorage` persists and is only replaced when new data is saved.

## Open Questions

At this time there are no unresolved questions for the product manager.
