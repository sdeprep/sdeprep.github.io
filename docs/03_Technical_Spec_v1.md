# Technical Specification (Version 1)

This document outlines the low-level technical details for the LeetCode-style coding practice site. It explains the architecture, key modules and how data flows through the application.

## Overview

The system is a client-side single-page application (SPA) built with React and TypeScript. It uses no backend services and stores all data in the browser's localStorage. The application is designed for rapid prototyping with minimal complexity while providing a functional coding practice environment.

Key architectural characteristics:
- Pure client-side rendering with React 18 functional components
- State management using React's useState and useContext hooks (no Redux)
- Persistent storage using localStorage with a simple versioned JSON schema
- Monaco Editor integration for Python code editing
- Web Speech API for voice command processing

## Components

### Component Hierarchy
```
App
├── QuestionSelectorSidebar
│   └── QuestionItem (x50)
├── MainWorkArea
│   ├── QuestionDetailsPanel
│   ├── CodeEditor (Monaco)
│   └── IssuePanel
├── SettingsSidebar
│   ├── ModeToggle
│   └── StorageControls
└── VoiceCommandButton
    └── TranscriptionToast
```

### Key Component Details

1. **App**: Root component that manages overall layout and handles keyboard shortcuts.
   - Maintains global state (current question, learning/mock mode)
   - Provides context for shared state
   - Handles keyboard event listeners

2. **QuestionSelectorSidebar**: Collapsible sidebar triggered by hover/tap events.
   - Manages its own open/closed state
   - Renders the list of question items
   - Communicates selection to parent App component

3. **CodeEditor**: Wrapper component around Monaco Editor.
   - Initializes Monaco with Python 3 language configuration
   - Handles save/restore of code from localStorage
   - Interfaces with the code validation logic

4. **VoiceCommandButton**: Manages voice recognition via Web Speech API.
   - Handles recording state (idle, listening, processing)
   - Processes transcription into commands
   - Shows feedback via TranscriptionToast

5. **IssuePanel**: Collapsible panel showing validation problems.
   - Appears when check button is pressed and issues exist
   - Shows bullet list of mismatches
   - Controls its own visibility based on hover/interaction

## Data Flow

### LocalStorage Schema
```json
{
  "version": "1.0",
  "settings": {
    "mode": "learning" | "mock"
  },
  "lastQuestionId": 1,
  "questions": {
    "1": {
      "userCode": "def solution(nums):\n    # user code here\n    return sorted(nums)",
      "lastSaved": "2023-05-15T14:22:10Z"
    },
    "2": {
      "userCode": "# Two Sum solution\n",
      "lastSaved": "2023-05-14T10:15:32Z"
    }
    // Additional questions...
  }
}
```

### Key Data Flows

1. **Question Selection Flow**:
   - User hovers/taps to reveal QuestionSelectorSidebar
   - User selects a question
   - App updates state with selected question ID
   - MainWorkArea loads question details and user's saved code (if any)
   - CodeEditor initializes with the user's previous code or starter template

2. **Code Validation Flow**:
   - User modifies code in the editor
   - User presses "Check" button
   - Validator compares user code with expected solution (exact match)
   - Results sent to IssuePanel
   - If hover/tap near bottom edge, IssuePanel becomes visible

3. **Voice Command Flow**:
   - User presses VoiceCommandButton
   - Web Speech API starts listening
   - TranscriptionToast shows live transcription
   - Command interpreter processes text
   - App performs the requested action (navigate, check, insert text)

## Implementation Notes

### Monaco Editor Integration
- Minimal configuration focused on Python syntax highlighting
- Simple interface for getting/setting code content
- No need for complex language services or debugging support

### Voice Command Processing
- Simple command pattern matching using regular expressions
- Limited vocabulary focused on navigation and basic editor actions
- No need for advanced NLP or machine learning

### Validation Approach
- Direct string comparison against stored solutions
- No code execution or unit testing required
- Issues reported as simple text mismatches

## Performance Considerations

Since this is a personal tool for rapid prototyping:
- The entire question dataset can be loaded at startup
- Monaco Editor can be eagerly loaded as it's central to the experience
- localStorage operations should be batched when possible to avoid performance hits during rapid interactions

## Browser Support
- Focus only on modern browsers (Chrome, Firefox, Edge)
- No special accommodations for legacy browsers
