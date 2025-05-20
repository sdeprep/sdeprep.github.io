# Implementation Plan (Version 1)

This document describes how to build and integrate the first release of the project, starting from the current state of the repository. It serves as a practical guide for implementing the LeetCode-style coding practice application.

## Overview

The implementation approach focuses on rapid development of a working prototype. The basic project structure is already set up. We'll build upon this foundation following this strategy:

1. Install remaining dependencies (Monaco Editor, Tailwind CSS) (0.5 day)
2. Implement core UI components and layout structure (2 days)
3. Integrate Monaco Editor for Python code editing and implement validation (1 day)
4. Add voice command functionality with Web Speech API (1 day)
5. Implement localStorage persistence (0.5 day)
6. Final refinement and testing (1 day)

Total estimated timeline: ~6 working days.

## Current Project Status

The basic React + TypeScript project using Vite has already been initialized:
- Project structure set up with standard Vite configuration
- React 19 with TypeScript already installed
- Basic App component exists but contains only placeholder content
- No additional dependencies installed yet (need Monaco Editor, Tailwind CSS)
- No component structure implemented yet

## Setup: Remaining Dependencies

1. **Install core dependencies**
   ```bash
   # Navigate to frontend directory if not already there
   cd frontend
   
   # Core dependencies for Monaco Editor and Tailwind
   npm install @monaco-editor/react tailwindcss postcss autoprefixer
   ```

2. **Configure Tailwind CSS**
   ```bash
   # Initialize Tailwind
   npx tailwindcss init -p
   ```
   
   Update `tailwind.config.js`:
   ```javascript
   /** @type {import('tailwindcss').Config} */
   export default {
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
   
   Update `src/index.css` with Tailwind directives:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

3. **Create complete folder structure**
   ```
   src/
   ├── components/
   │   ├── CodeEditor.tsx
   │   ├── IssuePanel.tsx
   │   ├── QuestionDetailsPanel.tsx
   │   ├── QuestionSelectorSidebar/
   │   │   ├── index.tsx
   │   │   └── QuestionItem.tsx
   │   ├── SettingsSidebar/
   │   │   ├── index.tsx
   │   │   ├── ModeToggle.tsx
   │   │   └── StorageControls.tsx
   │   └── VoiceCommandButton/
   │       ├── index.tsx
   │       └── TranscriptionToast.tsx
   ├── data/
   │   ├── questions.ts         # Initial questions and solutions
   │   └── localStorage.ts      # Helper functions for localStorage
   ├── hooks/
   │   ├── useHover.ts          # Custom hook for hover detection
   │   ├── useLocalStorage.ts   # Custom hook for localStorage
   │   └── useVoiceRecognition.ts # Custom hook for Web Speech API
   ├── types/
   │   └── index.ts             # TypeScript type definitions
   ├── utils/
   │   ├── codeValidator.ts     # Solution validation logic
   │   └── voiceCommandParser.ts # Voice command processing
   ├── context/
   │   └── AppContext.tsx       # Global state management
   ├── App.tsx
   ├── App.css
   ├── main.tsx
   └── index.css
   ```

## Implementation Steps

### Phase 1: Core Structure and UI Framework

1. **Create TypeScript interfaces**

   `src/types/index.ts`:
   ```typescript
   export interface Question {
     id: number;
     title: string;
     description: string;
     starterCode: string;
     solution: string;
     isPlaceholder?: boolean;
   }
   
   export interface UserCodeState {
     [questionId: string]: {
       userCode: string;
       lastSaved: string;
     };
   }
   
   export type AppMode = 'learning' | 'mock';
   
   export interface AppState {
     currentQuestionId: number;
     mode: AppMode;
     questions: Record<string, UserCodeState>;
   }
   ```

2. **Create global context for state management**

   `src/context/AppContext.tsx`:
   ```tsx
   import { createContext, useContext, useState, ReactNode } from 'react';
   import { AppMode, Question } from '../types';
   import { questionData } from '../data/questions';
   
   interface AppContextType {
     currentQuestionId: number;
     setCurrentQuestionId: (id: number) => void;
     mode: AppMode;
     setMode: (mode: AppMode) => void;
     questions: Question[];
     userCode: Record<number, string>;
     updateUserCode: (questionId: number, code: string) => void;
   }
   
   const AppContext = createContext<AppContextType | undefined>(undefined);
   
   export const AppProvider = ({ children }: { children: ReactNode }) => {
     const [currentQuestionId, setCurrentQuestionId] = useState(1);
     const [mode, setMode] = useState<AppMode>('learning');
     const [userCode, setUserCode] = useState<Record<number, string>>({});
     
     const updateUserCode = (questionId: number, code: string) => {
       setUserCode(prev => ({
         ...prev,
         [questionId]: code
       }));
       // Later we'll add localStorage persistence here
     };
     
     return (
       <AppContext.Provider value={{
         currentQuestionId,
         setCurrentQuestionId,
         mode,
         setMode,
         questions: questionData,
         userCode,
         updateUserCode
       }}>
         {children}
       </AppContext.Provider>
     );
   };
   
   export const useAppContext = () => {
     const context = useContext(AppContext);
     if (context === undefined) {
       throw new Error('useAppContext must be used within an AppProvider');
     }
     return context;
   };
   ```

3. **Implement App layout with responsive grid**

   Update `src/App.tsx`:
   ```tsx
   import { useState, useEffect } from 'react';
   import { AppProvider } from './context/AppContext';
   import QuestionSelectorSidebar from './components/QuestionSelectorSidebar';
   import QuestionDetailsPanel from './components/QuestionDetailsPanel';
   import CodeEditor from './components/CodeEditor';
   import IssuePanel from './components/IssuePanel';
   import SettingsSidebar from './components/SettingsSidebar';
   import VoiceCommandButton from './components/VoiceCommandButton';
   import './App.css';
   
   function App() {
     // State for controlling sidebar visibility
     const [leftSidebarVisible, setLeftSidebarVisible] = useState(false);
     const [rightSidebarVisible, setRightSidebarVisible] = useState(false);
     const [issuePanelVisible, setIssuePanelVisible] = useState(false);
     
     // Keyboard shortcut handler
     useEffect(() => {
       const handleKeyDown = (e: KeyboardEvent) => {
         // Add keyboard shortcuts here for accessibility
         if (e.key === 'q' && e.ctrlKey) setLeftSidebarVisible(prev => !prev);
         if (e.key === 's' && e.ctrlKey) setRightSidebarVisible(prev => !prev);
         if (e.key === 'i' && e.ctrlKey) setIssuePanelVisible(prev => !prev);
       };
       
       window.addEventListener('keydown', handleKeyDown);
       return () => window.removeEventListener('keydown', handleKeyDown);
     }, []);
     
     return (
       <AppProvider>
         <div className="app-container h-screen w-screen flex overflow-hidden">
           {/* Question Selector Sidebar */}
           <QuestionSelectorSidebar 
             isVisible={leftSidebarVisible} 
             onVisibilityChange={setLeftSidebarVisible} 
           />
           
           {/* Main Work Area */}
           <div className="main-area flex flex-col flex-grow h-full">
             <div className="main-content flex flex-grow">
               <QuestionDetailsPanel />
               <div className="code-editor-container flex-grow">
                 <CodeEditor />
               </div>
             </div>
             <IssuePanel 
               isVisible={issuePanelVisible} 
               onVisibilityChange={setIssuePanelVisible} 
             />
           </div>
           
           {/* Settings Sidebar */}
           <SettingsSidebar 
             isVisible={rightSidebarVisible} 
             onVisibilityChange={setRightSidebarVisible} 
           />
           
           {/* Voice Command Button (floating) */}
           <VoiceCommandButton />
         </div>
       </AppProvider>
     );
   }
   
   export default App;
   ```

   Update `src/App.css`:
   ```css
   .app-container {
     position: relative;
   }
   
   /* Add styles for hover detection zones */
   .hover-zone-left, .hover-zone-right, .hover-zone-bottom {
     position: absolute;
     z-index: 10;
   }
   
   .hover-zone-left {
     left: 0;
     top: 0;
     height: 100%;
     width: 20px;
   }
   
   .hover-zone-right {
     right: 0;
     top: 0;
     height: 100%;
     width: 20px;
   }
   
   .hover-zone-bottom {
     bottom: 0;
     left: 0;
     width: 100%;
     height: 20px;
   }
   ```

### Phase 2: Create Custom Hooks

1. **Implement useHover hook**

   `src/hooks/useHover.ts`:
   ```typescript
   import { useState, useEffect, useRef, RefObject } from 'react';
   
   export function useHover<T extends HTMLElement = HTMLDivElement>(): [RefObject<T>, boolean] {
     const [isHovered, setIsHovered] = useState(false);
     const ref = useRef<T>(null);
     
     useEffect(() => {
       const element = ref.current;
       if (!element) return;
       
       const handleMouseEnter = () => setIsHovered(true);
       const handleMouseLeave = () => setIsHovered(false);
       
       element.addEventListener('mouseenter', handleMouseEnter);
       element.addEventListener('mouseleave', handleMouseLeave);
       
       return () => {
         element.removeEventListener('mouseenter', handleMouseEnter);
         element.removeEventListener('mouseleave', handleMouseLeave);
       };
     }, [ref]);
     
     return [ref, isHovered];
   }
   ```

2. **Implement useLocalStorage hook**

   `src/hooks/useLocalStorage.ts`:
   ```typescript
   import { useState, useEffect } from 'react';
   
   export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
     // Get from localStorage or use initial value
     const readValue = (): T => {
       try {
         const item = window.localStorage.getItem(key);
         return item ? JSON.parse(item) : initialValue;
       } catch (error) {
         console.warn(`Error reading localStorage key "${key}":`, error);
         return initialValue;
       }
     };
     
     const [storedValue, setStoredValue] = useState<T>(readValue);
     
     // Update localStorage when the state changes
     const setValue = (value: T) => {
       try {
         window.localStorage.setItem(key, JSON.stringify(value));
         setStoredValue(value);
       } catch (error) {
         console.warn(`Error setting localStorage key "${key}":`, error);
       }
     };
     
     // Sync with localStorage if the key changes in another tab
     useEffect(() => {
       const handleStorageChange = (e: StorageEvent) => {
         if (e.key === key && e.newValue) {
           setStoredValue(JSON.parse(e.newValue));
         }
       };
       
       window.addEventListener('storage', handleStorageChange);
       return () => window.removeEventListener('storage', handleStorageChange);
     }, [key]);
     
     return [storedValue, setValue];
   }
   ```

3. **Implement useVoiceRecognition hook**

   `src/hooks/useVoiceRecognition.ts`:
   ```typescript
   import { useState, useEffect, useCallback } from 'react';
   
   // TypeScript type for Web Speech API, which isn't fully typed in lib.dom.d.ts
   interface SpeechRecognition extends EventTarget {
     continuous: boolean;
     interimResults: boolean;
     lang: string;
     start: () => void;
     stop: () => void;
     abort: () => void;
     onresult: (event: any) => void;
     onerror: (event: any) => void;
     onend: () => void;
   }
   
   declare global {
     interface Window {
       SpeechRecognition: new () => SpeechRecognition;
       webkitSpeechRecognition: new () => SpeechRecognition;
     }
   }
   
   export function useVoiceRecognition() {
     const [isListening, setIsListening] = useState(false);
     const [transcript, setTranscript] = useState('');
     const [error, setError] = useState<string | null>(null);
     
     // Create a recognition instance
     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
     const recognitionSupported = !!SpeechRecognition;
     
     // Use useCallback to ensure we don't create a new function on each render
     const startListening = useCallback(() => {
       if (!recognitionSupported) {
         setError('Speech recognition not supported in this browser');
         return;
       }
       
       try {
         const recognition = new SpeechRecognition();
         recognition.continuous = false;
         recognition.interimResults = true;
         recognition.lang = 'en-US';
         
         recognition.onresult = (event: any) => {
           const currentTranscript = Array.from(event.results)
             .map((result: any) => result[0].transcript)
             .join('');
           
           setTranscript(currentTranscript);
         };
         
         recognition.onerror = (event: any) => {
           setError(`Speech recognition error: ${event.error}`);
           setIsListening(false);
         };
         
         recognition.onend = () => {
           setIsListening(false);
         };
         
         recognition.start();
         setIsListening(true);
         setError(null);
         
         // Automatically stop after 5 seconds to prevent indefinite listening
         setTimeout(() => {
           recognition.stop();
         }, 5000);
       } catch (err) {
         setError(`Failed to start speech recognition: ${err}`);
       }
     }, [recognitionSupported]);
     
     return {
       isListening,
       transcript,
       error,
       startListening,
       recognitionSupported
     };
   }
   ```

### Phase 3: Implement Core Components

1. **Create Question Data**

   `src/data/questions.ts`:
   ```typescript
   import { Question } from '../types';
   
   export const questionData: Question[] = [
     {
       id: 1,
       title: "Sort an Array",
       description: "Given an array of integers nums, sort the array in ascending order and return it.\n\nExample 1:\nInput: nums = [5,2,3,1]\nOutput: [1,2,3,5]\n\nExample 2:\nInput: nums = [5,1,1,2,0,0]\nOutput: [0,0,1,1,2,5]",
       starterCode: "def solution(nums):\n    # Your code here\n    pass",
       solution: "def solution(nums):\n    return sorted(nums)"
     },
     {
       id: 2,
       title: "Two Sum",
       description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nExample 1:\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].",
       starterCode: "def solution(nums, target):\n    # Your code here\n    pass",
       solution: "def solution(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []"
     },
     // Add the remaining 9 questions from the PRD
     // For placeholder questions (12-50), create them in a loop below
   ];
   
   // Generate placeholder questions for the remaining slots (12-50)
   for (let i = 12; i <= 50; i++) {
     questionData.push({
       id: i,
       title: `Placeholder Question ${i}`,
       description: "This question will be added in a future update.",
       starterCode: "def solution():\n    # Placeholder\n    pass",
       solution: "def solution():\n    return 'placeholder'",
       isPlaceholder: true
     });
   }
   ```

2. **Create localStorage helpers**

   `src/data/localStorage.ts`:
   ```typescript
   import { AppMode } from '../types';
   
   const STORAGE_KEY = 'leetcode-practice-v1';
   
   export interface StorageData {
     version: string;
     settings: {
       mode: AppMode;
     };
     lastQuestionId: number;
     questions: Record<string, {
       userCode: string;
       lastSaved: string;
     }>;
   }
   
   export const saveToLocalStorage = (data: StorageData): void => {
     localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
   };
   
   export const loadFromLocalStorage = (): StorageData | null => {
     const data = localStorage.getItem(STORAGE_KEY);
     if (!data) return null;
     
     try {
       return JSON.parse(data) as StorageData;
     } catch (e) {
       console.error('Failed to parse localStorage data:', e);
       return null;
     }
   };
   
   export const exportToFile = (): void => {
     const data = localStorage.getItem(STORAGE_KEY);
     if (!data) {
       alert('No data to export');
       return;
     }
     
     const blob = new Blob([data], { type: 'application/json' });
     const url = URL.createObjectURL(blob);
     const a = document.createElement('a');
     a.href = url;
     a.download = 'leetcode-practice-backup.json';
     document.body.appendChild(a);
     a.click();
     document.body.removeChild(a);
     URL.revokeObjectURL(url);
   };
   
   export const importFromFile = (file: File): Promise<boolean> => {
     return new Promise((resolve, reject) => {
       const reader = new FileReader();
       
       reader.onload = (e) => {
         try {
           const result = e.target?.result;
           if (typeof result !== 'string') {
             reject(new Error('Failed to read file'));
             return;
           }
           
           // Validate the JSON structure
           const data = JSON.parse(result) as StorageData;
           if (!data.version || !data.settings || !data.questions) {
             reject(new Error('Invalid backup file format'));
             return;
           }
           
           localStorage.setItem(STORAGE_KEY, result);
           resolve(true);
         } catch (e) {
           reject(new Error('Invalid JSON file'));
         }
       };
       
       reader.onerror = () => reject(new Error('Failed to read file'));
       reader.readAsText(file);
     });
   };
   ```

3. **Implement utils for validation and voice commands**

   `src/utils/codeValidator.ts`:
   ```typescript
   export interface ValidationResult {
     isValid: boolean;
     issues: string[];
   }
   
   export const validateCode = (userCode: string, solution: string): ValidationResult => {
     // For version 1, we're doing an exact match to keep it simple
     if (userCode.trim() === solution.trim()) {
       return { isValid: true, issues: [] };
     }
     
     // Simple diff to identify issues - could be enhanced later
     const userLines = userCode.trim().split('\n');
     const solutionLines = solution.trim().split('\n');
     
     const issues: string[] = [];
     
     // Check if function signature is correct
     if (userLines[0] !== solutionLines[0]) {
       issues.push('Function signature is incorrect');
     }
     
     // Check if the solution has the same number of lines
     if (userLines.length !== solutionLines.length) {
       issues.push(`Expected ${solutionLines.length} lines but found ${userLines.length}`);
     }
     
     // Look for other specific issues
     // This is very simplistic for version 1
     if (!issues.length) {
       issues.push('Your solution does not match the expected output');
     }
     
     return { isValid: false, issues };
   };
   ```

   `src/utils/voiceCommandParser.ts`:
   ```typescript
   export interface CommandResult {
     command: string;
     params: Record<string, any>;
     original: string;
   }
   
   // Simple command patterns for voice control
   const PATTERNS = [
     { regex: /go to question (\d+)/i, command: 'navigate', paramName: 'questionId' },
     { regex: /check( code)?/i, command: 'check' },
     { regex: /(show|open|display) settings/i, command: 'showSettings' },
     { regex: /(show|open|display) questions/i, command: 'showQuestions' },
     { regex: /(show|open|display) issues/i, command: 'showIssues' },
   ];
   
   export const parseVoiceCommand = (transcript: string): CommandResult | null => {
     for (const pattern of PATTERNS) {
       const match = transcript.match(pattern.regex);
       if (match) {
         const result: CommandResult = {
           command: pattern.command,
           params: {},
           original: transcript
         };
         
         // Extract parameter if present
         if (match[1] && pattern.paramName) {
           // Convert to appropriate type (number for questionId)
           if (pattern.paramName === 'questionId') {
             result.params[pattern.paramName] = parseInt(match[1], 10);
           } else {
             result.params[pattern.paramName] = match[1];
           }
         }
         
         return result;
       }
     }
     
     return null;
   };
   ```

### Phase 4: Implement Individual Component Files

When implementing specific components, ensure they follow this pattern:

1. **Code Editor Component with Monaco**

   `src/components/CodeEditor.tsx`:
   ```tsx
   import { useEffect, useRef } from 'react';
   import Editor from '@monaco-editor/react';
   import { useAppContext } from '../context/AppContext';
   
   const CodeEditor: React.FC = () => {
     const { currentQuestionId, questions, userCode, updateUserCode } = useAppContext();
     const editorRef = useRef(null);
     
     const currentQuestion = questions.find(q => q.id === currentQuestionId);
     const currentCode = userCode[currentQuestionId] || currentQuestion?.starterCode || '';
     
     const handleEditorDidMount = (editor: any) => {
       editorRef.current = editor;
     };
     
     const handleChange = (value: string | undefined) => {
       if (value !== undefined) {
         updateUserCode(currentQuestionId, value);
       }
     };
     
     return (
       <div className="h-full w-full">
         <Editor
           height="100%"
           language="python"
           theme="vs-dark"
           value={currentCode}
           onChange={handleChange}
           onMount={handleEditorDidMount}
           options={{
             minimap: { enabled: false },
             fontSize: 14,
             scrollBeyondLastLine: false,
             wordWrap: 'on',
             automaticLayout: true,
           }}
         />
       </div>
     );
   };
   
   export default CodeEditor;
   ```

2. **Implement all other components following similar patterns**

   Follow the same approach for the remaining components, ensuring they:
   - Connect to the global context
   - Handle their own state
   - Use custom hooks as needed
   - Implement proper event handlers

### Phase 5: Final Integration and Refinement

1. **Update main.tsx to wrap everything in AppProvider**
   ```tsx
   import React from 'react';
   import ReactDOM from 'react-dom/client';
   import App from './App';
   import './index.css';
   
   ReactDOM.createRoot(document.getElementById('root')!).render(
     <React.StrictMode>
       <App />
     </React.StrictMode>
   );
   ```

2. **Add debug output for localStorage during development**
   - Create a small utility that logs changes to localStorage for easier debugging

3. **Implement keyboard shortcuts as described in the Technical Spec**
   - Ensure all UI elements are accessible via keyboard
   - Document the shortcuts for users

## Testing and Verification

Follow the testing plan in the Test Plan document:

1. Verify the layout works in different window sizes
2. Test hover detection for sidebars
3. Ensure Monaco Editor is properly configured for Python
4. Test voice commands in Chrome
5. Verify localStorage functionality
6. Test keyboard shortcuts

## Deployment

The GitHub Actions workflow is already set up to deploy to GitHub Pages. Simply push your changes to main:

1. Commit all changes
2. Push to the main branch
3. GitHub Actions will automatically build and deploy to Pages

## Common Issues and Solutions

1. **Monaco Editor fails to load**
   - Check for proper imports and styles
   - Ensure the editor has a proper height/width

2. **Voice recognition not working**
   - Ensure you're using Chrome (best support)
   - Check for HTTPS (required for Web Speech API)
   - Verify browser permissions

3. **Responsive layout breaks**
   - Test with browser dev tools at different sizes
   - Ensure flex/grid layout is handling resizing properly

4. **localStorage not persisting**
   - Check for quota limits
   - Verify JSON serialization is working
   - Use browser dev tools to inspect storage

## Development Workflow Tips

1. Start with the layout and sidebars first to get the structure right
2. Then add the Monaco Editor and basic question navigation
3. Add validation and the issue panel
4. Implement localStorage functionality
5. Add voice commands last as they're more experimental

By following this plan step by step, you'll create a functional personal coding practice site focused on your specific needs without unnecessary complexity.
