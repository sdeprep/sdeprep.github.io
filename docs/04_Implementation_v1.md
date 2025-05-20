# Implementation Plan (Version 1)

This document describes how to build and integrate the first release of the project. It serves as a roadmap for developers when putting all pieces together.

## Overview

The implementation approach focuses on rapid development of a working prototype. The strategy is to:

1. Set up the project structure and basic React framework (1 day)
2. Implement core UI components in parallel with minimal styling (2 days)
3. Integrate Monaco Editor and implement code validation (1 day)
4. Add voice command functionality and integrate Web Speech API (1 day)
5. Implement localStorage persistence (1 day)
6. Refinement and testing (1 day)

Total estimated timeline: ~7 working days.

## Setup

1. **Initialize the project**
   ```bash
   # Create a new Vite React TypeScript project
   npm create vite@latest frontend -- --template react-ts
   cd frontend
   npm install
   ```

2. **Install dependencies**
   ```bash
   # Core dependencies
   npm install monaco-editor @monaco-editor/react tailwindcss
   
   # Voice command support
   # (Web Speech API is built into browsers, no additional package needed)
   
   # Optional developer tools
   npm install -D typescript-plugin-css-modules
   ```

3. **Configure Tailwind CSS**
   ```bash
   npx tailwindcss init -p
   ```
   
   Create `tailwind.config.js`:
   ```javascript
   module.exports = {
     content: [
       "./index.html",
       "./src/**/*.{js,ts,jsx,tsx}",
     ],
     theme: {
       extend: {},
     },
     plugins: [],
   }
   ```
   
   Add Tailwind directives to main CSS file:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

4. **Set up folder structure**
   ```
   src/
   ├── components/
   │   ├── App.tsx
   │   ├── CodeEditor.tsx
   │   ├── IssuePanel.tsx
   │   ├── QuestionDetailsPanel.tsx
   │   ├── QuestionSelectorSidebar.tsx
   │   ├── SettingsSidebar.tsx
   │   └── VoiceCommandButton.tsx
   ├── data/
   │   ├── questionData.ts              # Initial questions and solutions
   │   └── localStorage.ts              # Helper functions for localStorage
   ├── hooks/
   │   ├── useHover.ts                  # Custom hook for hover detection
   │   ├── useLocalStorage.ts           # Custom hook for localStorage
   │   └── useVoiceRecognition.ts       # Custom hook for Web Speech API
   ├── types/
   │   └── index.ts                     # TypeScript type definitions
   ├── utils/
   │   ├── codeValidator.ts             # Solution validation logic
   │   └── voiceCommandParser.ts        # Voice command processing
   ├── main.tsx
   └── index.css
   ```

## Build Process

### Phase 1: Core UI Framework

1. **Implement App component and main layout**
   - Set up basic responsive grid/flex layout
   - Implement keyboard shortcut handlers
   - Create state management with React context

2. **Build Question Selector Sidebar**
   - Create hover detection for showing/hiding
   - Implement question list with placeholder data
   - Add selection functionality

3. **Implement Main Work Area**
   - Create basic question details panel
   - Build placeholder for code editor
   - Add issue panel structure

### Phase 2: Monaco Editor Integration

1. **Set up Monaco Editor component**
   ```tsx
   import { useRef, useEffect } from 'react';
   import { Editor } from '@monaco-editor/react';
   
   const CodeEditor = ({ value, onChange }) => {
     return (
       <Editor
         height="100%"
         language="python"
         theme="vs-dark"
         value={value}
         onChange={onChange}
         options={{
           minimap: { enabled: false },
           fontSize: 14,
           scrollBeyondLastLine: false,
           wordWrap: 'on',
         }}
       />
     );
   };
   ```

2. **Create solution validation logic**
   - Implement exact string matching
   - Capture and format validation issues

### Phase 3: Voice Commands and Settings

1. **Implement voice commands with Web Speech API**
   ```tsx
   const useVoiceRecognition = (onResult) => {
     useEffect(() => {
       if (!('webkitSpeechRecognition' in window)) {
         console.warn('Speech recognition not supported');
         return;
       }
       
       const recognition = new window.webkitSpeechRecognition();
       recognition.continuous = false;
       recognition.interimResults = true;
       
       recognition.onresult = (event) => {
         const transcript = event.results[0][0].transcript;
         onResult(transcript);
       };
       
       // Additional setup...
       
       return () => recognition.abort();
     }, [onResult]);
     
     // Return controls for starting/stopping recognition
   };
   ```

2. **Create Settings Sidebar**
   - Implement mode toggle (Learning/Mock)
   - Add localStorage import/export

### Phase 4: Data Persistence

1. **Implement localStorage schema and helpers**
   ```typescript
   const STORAGE_KEY = 'leetcode-practice-v1';
   
   type StorageData = {
     version: string;
     settings: {
       mode: 'learning' | 'mock';
     };
     lastQuestionId: number;
     questions: Record<string, {
       userCode: string;
       lastSaved: string;
     }>;
   };
   
   export const saveToLocalStorage = (data: StorageData): void => {
     localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
   };
   
   export const loadFromLocalStorage = (): StorageData | null => {
     const data = localStorage.getItem(STORAGE_KEY);
     return data ? JSON.parse(data) : null;
   };
   ```

2. **Connect components to localStorage**
   - Auto-save code changes
   - Persist selected question and mode

### Phase 5: Refinement and Testing

1. **Add finishing touches to UI**
   - Improve transitions and animations
   - Ensure responsive layout works

2. **Manual testing checklist**
   - Verify all sidebars show/hide correctly
   - Test code validation
   - Verify voice commands work in Chrome
   - Test localStorage persistence
   - Verify keyboard shortcuts

3. **Prepare GitHub Pages deployment**
   - Ensure build process works with GitHub Actions
   - Verify deployment to GitHub Pages

## Development Workflow Tips

1. Use Vite's hot module replacement for rapid development
2. Focus on functionality first, then refine UI
3. Test voice commands directly in Chrome (best supported)
4. Use localStorage dev tools in browser to debug persistence
5. Commit changes frequently to leverage GitHub Actions
