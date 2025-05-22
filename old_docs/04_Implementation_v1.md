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
   npm install monaco-editor @monaco-editor/react vite-plugin-monaco-editor
   npm install tailwindcss @tailwindcss/vite
   ```

2. **Configure Tailwind CSS v4**
   
   Update `vite.config.ts` to include the Tailwind and Monaco Editor plugins:
   ```typescript
   import { defineConfig } from 'vite';
   import tailwindcss from '@tailwindcss/vite';
   import monacoEditorPlugin from 'vite-plugin-monaco-editor';
   
   export default defineConfig({
     plugins: [
       tailwindcss(),
       monacoEditorPlugin(),
     ],
   });
   ```
   
   Create or update `src/index.css` with the new Tailwind CSS v4 import:
   ```css
   @import "tailwindcss";
   
   @theme {
     /* Custom colors and settings */
     --color-gray-100: #f3f4f6;
     --color-gray-200: #e5e7eb;
     --color-gray-300: #d1d5db;
     --color-gray-400: #9ca3af;
     --color-gray-500: #6b7280;
     --color-gray-600: #4b5563;
     --color-gray-700: #374151;
     --color-gray-800: #1f2937;
     --color-gray-900: #111827;
     
     --color-blue-500: #3b82f6;
     --color-red-500: #ef4444;
     --color-green-500: #10b981;
   }
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

4. **Configure Monaco Editor for Python**

   Create a custom Monaco Editor configuration for Python support:
   
   `src/utils/monacoConfig.ts`:
   ```typescript
   import * as monaco from 'monaco-editor';
   
   // Initialize Monaco environment for workers
   self.MonacoEnvironment = {
     getWorkerUrl: function(_, label) {
       if (label === 'json') {
         return './monaco-editor/esm/vs/language/json/json.worker?worker';
       }
       if (label === 'css' || label === 'scss' || label === 'less') {
         return './monaco-editor/esm/vs/language/css/css.worker?worker';
       }
       if (label === 'html' || label === 'handlebars' || label === 'razor') {
         return './monaco-editor/esm/vs/language/html/html.worker?worker';
       }
       if (label === 'typescript' || label === 'javascript') {
         return './monaco-editor/esm/vs/language/typescript/ts.worker?worker';
       }
       if (label === 'python') {
         // Use the basic editor worker for Python
         return './monaco-editor/esm/vs/editor/editor.worker?worker';
       }
       return './monaco-editor/esm/vs/editor/editor.worker?worker';
     }
   };
   
   // Register Python language if not already registered
   export function configurePythonLanguage() {
     // Check if Python language is already registered
     if (!monaco.languages.getLanguages().some(lang => lang.id === 'python')) {
       monaco.languages.register({ id: 'python' });
       
       // Define Python language configuration
       monaco.languages.setMonarchTokensProvider('python', {
         defaultToken: '',
         tokenPostfix: '.python',
         
         keywords: [
           'and', 'as', 'assert', 'break', 'class', 'continue', 'def',
           'del', 'elif', 'else', 'except', 'exec', 'finally', 'for',
           'from', 'global', 'if', 'import', 'in', 'is', 'lambda',
           'not', 'or', 'pass', 'print', 'raise', 'return', 'try',
           'while', 'with', 'yield',
           'int', 'float', 'long', 'complex', 'hex', 'abs', 'all',
           'any', 'apply', 'basestring', 'bin', 'bool', 'buffer',
           'bytearray', 'callable', 'chr', 'classmethod', 'cmp',
           'coerce', 'compile', 'complex', 'delattr', 'dict', 'dir',
           'divmod', 'enumerate', 'eval', 'execfile', 'file',
           'filter', 'format', 'frozenset', 'getattr', 'globals',
           'hasattr', 'hash', 'help', 'id', 'input', 'intern',
           'isinstance', 'issubclass', 'iter', 'len', 'list',
           'locals', 'map', 'max', 'min', 'next', 'object', 'oct',
           'open', 'ord', 'pow', 'property', 'range', 'raw_input',
           'reduce', 'reload', 'repr', 'reversed', 'round', 'set',
           'setattr', 'slice', 'sorted', 'staticmethod', 'str', 'sum',
           'super', 'tuple', 'type', 'unichr', 'unicode', 'vars',
           'xrange', 'zip', '__dict__', '__doc__', '__file__',
           '__name__', '__package__', 'None', 'True', 'False',
         ],
         
         brackets: [
           { open: '{', close: '}', token: 'delimiter.curly' },
           { open: '[', close: ']', token: 'delimiter.bracket' },
           { open: '(', close: ')', token: 'delimiter.parenthesis' }
         ],
         
         tokenizer: {
           root: [
             { include: '@whitespace' },
             { include: '@numbers' },
             { include: '@strings' },
             
             [/[,:;]/, 'delimiter'],
             [/[{}\[\]()]/, '@brackets'],
             
             [/@[a-zA-Z_]\w*/, 'tag'],
             [/[a-zA-Z_]\w*/, {
               cases: {
                 '@keywords': 'keyword',
                 '@default': 'identifier'
               }
             }]
           ],
           
           whitespace: [
             [/\s+/, 'white'],
             [/(^#.*$)/, 'comment'],
             [/('''.*''')|(""".*""")/, 'string'],
             [/'''.*$/, 'string', '@endDocString'],
             [/""".*$/, 'string', '@endDblDocString']
           ],
           
           endDocString: [
             [/\\'/, 'string'],
             [/.*'''/, 'string', '@popall'],
             [/.*$/, 'string']
           ],
           
           endDblDocString: [
             [/\\"/, 'string'],
             [/.*"""/, 'string', '@popall'],
             [/.*$/, 'string']
           ],
           
           numbers: [
             [/-?0x([abcdef]|[ABCDEF]|\d)+[lL]?/, 'number.hex'],
             [/-?(\d*\.)?\d+([eE][+\-]?\d+)?[jJ]?[lL]?/, 'number']
           ],
           
           strings: [
             [/'$/, 'string.escape', '@popall'],
             [/'/, 'string.escape', '@stringBody'],
             [/"$/, 'string.escape', '@popall'],
             [/"/, 'string.escape', '@dblStringBody']
           ],
           
           stringBody: [
             [/\\./, 'string'],
             [/'/, 'string.escape', '@popall'],
             [/.(?=.*')/, 'string'],
             [/.*\\$/, 'string'],
             [/.*$/, 'string', '@popall']
           ],
           
           dblStringBody: [
             [/\\./, 'string'],
             [/"/, 'string.escape', '@popall'],
             [/.(?=.*")/, 'string'],
             [/.*\\$/, 'string'],
             [/.*$/, 'string', '@popall']
           ]
         }
       });
     }
   }
   
   // Configure language features
   export function initializeMonaco() {
     configurePythonLanguage();
   }
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
   import { initializeMonaco } from './utils/monacoConfig';
   import './App.css';
   
   // Initialize Monaco Editor configuration
   initializeMonaco();
   
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
                 <CodeEditor onCheckCode={() => setIssuePanelVisible(true)} />
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
   import { useEffect, useRef, useState } from 'react';
   import Editor from '@monaco-editor/react';
   import { useAppContext } from '../context/AppContext';
   import { validateCode } from '../utils/codeValidator';

   interface Props {
     onCheckCode: () => void;
   }

   const CodeEditor: React.FC<Props> = ({ onCheckCode }) => {
     const { currentQuestionId, questions, userCode, updateUserCode, mode } = useAppContext();
     const editorRef = useRef(null);
     const [isValid, setIsValid] = useState<boolean | null>(null);
     const [showResult, setShowResult] = useState(false);
     
     const currentQuestion = questions.find(q => q.id === currentQuestionId);
     const currentCode = userCode[currentQuestionId] || currentQuestion?.starterCode || '';
     
     const handleEditorDidMount = (editor: any) => {
       editorRef.current = editor;
     };
     
     const handleChange = (value: string | undefined) => {
       if (value !== undefined) {
         updateUserCode(currentQuestionId, value);
         
         // In learning mode, validation happens in real-time
         if (mode === 'learning' && showResult) {
           checkCode();
         } else {
           // Clear any previous result indicators
           setIsValid(null);
           setShowResult(false);
         }
       }
     };
     
     const checkCode = () => {
       if (!currentQuestion) return;
       
       const result = validateCode(currentCode, currentQuestion.solution);
       setIsValid(result.isValid);
       setShowResult(true);
       onCheckCode(); // Trigger issue panel visibility
       
       // For learning mode, show visual feedback in the editor
       if (mode === 'learning' && editorRef.current) {
         const editor = editorRef.current as any;
         // Add a decoration to the editor to indicate success/failure
         // This is just a simple visual indicator
         editor.deltaDecorations([], [
           {
             range: editor.getModel().getFullModelRange(),
             options: {
               className: result.isValid ? 'valid-code' : 'invalid-code',
               isWholeLine: true,
             },
           },
         ]);
         
         // Remove decoration after 1.5 seconds
         setTimeout(() => {
           editor.deltaDecorations([], []);
         }, 1500);
       }
     };
     
     // Listen for global check-code events (from voice commands)
     useEffect(() => {
       const handleCheckCode = () => checkCode();
       document.addEventListener('check-code', handleCheckCode);
       return () => document.removeEventListener('check-code', handleCheckCode);
     }, [currentCode, currentQuestion]);
     
     return (
       <div className="h-full w-full flex flex-col">
         <div className="h-12 bg-gray-100 border-b flex items-center justify-between px-4">
           <span className="text-sm text-gray-700">
             {mode === 'learning' ? 'Learning Mode' : 'Mock Interview Mode'}
           </span>
           <button
             onClick={checkCode}
             className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition-colors"
           >
             Check
           </button>
         </div>
         <div className="flex-grow">
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
         
         {/* Visual result indicator for immediate feedback */}
         {showResult && mode === 'learning' && (
           <div className={`px-4 py-2 text-sm ${isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
             {isValid ? 'Correct! ✓' : 'Not quite right. Check the Issues panel for details. ✗'}
           </div>
         )}
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

   Here are the implementations for the key components:

   `src/components/QuestionSelectorSidebar/index.tsx`:
   ```tsx
   import { useEffect } from 'react';
   import { useAppContext } from '../../context/AppContext';
   import { useHover } from '../../hooks/useHover';
   import QuestionItem from './QuestionItem';

   interface Props {
     isVisible: boolean;
     onVisibilityChange: (visible: boolean) => void;
     useHoverTrigger?: boolean;
   }

   const QuestionSelectorSidebar: React.FC<Props> = ({ isVisible, onVisibilityChange, useHoverTrigger = true }) => {
     const { questions } = useAppContext();
     const [hoverRef, isHovered] = useHover<HTMLDivElement>();

     // Show sidebar when hovered
     useEffect(() => {
       if (useHoverTrigger && isHovered && !isVisible) {
         onVisibilityChange(true);
       }
     }, [isHovered, isVisible, onVisibilityChange, useHoverTrigger]);

     return (
       <>
         {/* Hover detection zone */}
         <div
           ref={hoverRef}
           className="hover-zone-left"
           aria-hidden="true"
         />

         {/* The actual sidebar */}
         <div
           className={`question-sidebar fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-200 ease-out ${
             isVisible ? 'translate-x-0' : '-translate-x-full'
           } overflow-y-auto z-20`}
         >
           <div className="p-4 border-b">
             <h2 className="text-lg font-semibold">Questions</h2>
             <button
               className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
               onClick={() => onVisibilityChange(false)}
               aria-label="Close question sidebar"
             >
               ✕
             </button>
           </div>

           <div className="p-2">
             {questions.map((question) => (
               <QuestionItem
                 key={question.id}
                 question={question}
                 onClose={() => onVisibilityChange(false)}
               />
             ))}
           </div>
         </div>

         {/* Backdrop - only on mobile */}
         {isVisible && (
           <div
             className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
             onClick={() => onVisibilityChange(false)}
             aria-hidden="true"
           />
         )}
       </>
     );
   };

   export default QuestionSelectorSidebar;
   ```

   `src/components/QuestionSelectorSidebar/QuestionItem.tsx`:
   ```tsx
   import { useAppContext } from '../../context/AppContext';
   import { Question } from '../../types';

   interface Props {
     question: Question;
     onClose: () => void;
   }

   const QuestionItem: React.FC<Props> = ({ question, onClose }) => {
     const { currentQuestionId, setCurrentQuestionId } = useAppContext();
     const isActive = currentQuestionId === question.id;

     const handleClick = () => {
       setCurrentQuestionId(question.id);
       onClose();
     };

     return (
       <div
         className={`p-2 mb-1 rounded cursor-pointer ${
           isActive
             ? 'bg-blue-100 text-blue-800'
             : 'hover:bg-gray-100'
         } ${question.isPlaceholder ? 'opacity-50' : ''}`}
         onClick={handleClick}
         role="button"
         tabIndex={0}
         aria-current={isActive ? 'true' : 'false'}
       >
         <div className="flex items-center">
           <span className="text-sm font-medium mr-2">{question.id}.</span>
           <span className="text-sm">{question.title}</span>
         </div>
       </div>
     );
   };

   export default QuestionItem;
   ```

   `src/components/QuestionDetailsPanel.tsx`:
   ```tsx
   import { useAppContext } from '../context/AppContext';

   const QuestionDetailsPanel: React.FC = () => {
     const { currentQuestionId, questions } = useAppContext();
     const currentQuestion = questions.find(q => q.id === currentQuestionId);

     if (!currentQuestion) {
       return (
         <div className="question-details w-1/3 max-w-md p-4 border-r">
           <p>No question selected</p>
         </div>
       );
     }

     return (
       <div className="question-details w-1/3 max-w-md p-4 border-r overflow-y-auto">
         <h2 className="text-xl font-bold mb-4">{currentQuestion.title}</h2>
         <div className="whitespace-pre-line">
           {currentQuestion.description.split('\n').map((line, i) => (
             <p key={i} className="mb-2">{line}</p>
           ))}
         </div>
       </div>
     );
   };

   export default QuestionDetailsPanel;
   ```

   `src/components/IssuePanel.tsx`:
   ```tsx
   import { useEffect, useState } from 'react';
   import { useAppContext } from '../context/AppContext';
   import { validateCode } from '../utils/codeValidator';
   import { useHover } from '../hooks/useHover';

   interface Props {
     isVisible: boolean;
     onVisibilityChange: (visible: boolean) => void;
     useHoverTrigger?: boolean;
   }

   const IssuePanel: React.FC<Props> = ({ isVisible, onVisibilityChange, useHoverTrigger = true }) => {
     const { currentQuestionId, questions, userCode } = useAppContext();
     const [hoverRef, isHovered] = useHover<HTMLDivElement>();
     const [issues, setIssues] = useState<string[]>([]);
     const [isValid, setIsValid] = useState(false);

     const currentQuestion = questions.find(q => q.id === currentQuestionId);
     const currentCode = userCode[currentQuestionId] || '';

     // Show panel when hovered
     useEffect(() => {
       if (useHoverTrigger && isHovered && !isVisible) {
         onVisibilityChange(true);
       }
     }, [isHovered, isVisible, onVisibilityChange, useHoverTrigger]);

     // Validate code when visible
     useEffect(() => {
       if (isVisible && currentQuestion && currentCode) {
         const result = validateCode(currentCode, currentQuestion.solution);
         setIsValid(result.isValid);
         setIssues(result.issues);
       }
     }, [isVisible, currentQuestion, currentCode]);

     return (
       <>
         {/* Hover detection zone */}
         <div
           ref={hoverRef}
           className="hover-zone-bottom"
           aria-hidden="true"
         />

         {/* The actual issue panel */}
         <div
           className={`issue-panel fixed bottom-0 left-0 right-0 bg-white shadow-lg transform transition-transform duration-200 ease-out ${
             isVisible ? 'translate-y-0' : 'translate-y-full'
           } z-20`}
           style={{ maxHeight: '30vh' }}
         >
           <div className="p-4 border-b flex justify-between items-center">
             <h2 className="text-lg font-semibold">
               {isValid ? '✓ Correct Solution!' : '✗ Issues Found'}
             </h2>
             <button
               className="text-gray-500 hover:text-gray-700"
               onClick={() => onVisibilityChange(false)}
               aria-label="Close issue panel"
             >
               ✕
             </button>
           </div>

           <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(30vh - 60px)' }}>
             {isValid ? (
               <p className="text-green-600">Your solution matches the expected output!</p>
             ) : (
               <ul className="list-disc pl-5">
                 {issues.map((issue, index) => (
                   <li key={index} className="text-red-600 mb-1">{issue}</li>
                 ))}
               </ul>
             )}
           </div>
         </div>
       </>
     );
   };

   export default IssuePanel;
   ```

   `src/components/SettingsSidebar/index.tsx`:
   ```tsx
   import { useEffect } from 'react';
   import { useHover } from '../../hooks/useHover';
   import ModeToggle from './ModeToggle';
   import StorageControls from './StorageControls';

   interface Props {
     isVisible: boolean;
     onVisibilityChange: (visible: boolean) => void;
     useHoverTrigger?: boolean;
   }

   const SettingsSidebar: React.FC<Props> = ({ isVisible, onVisibilityChange, useHoverTrigger = true }) => {
     const [hoverRef, isHovered] = useHover<HTMLDivElement>();

     // Show sidebar when hovered
     useEffect(() => {
       if (useHoverTrigger && isHovered && !isVisible) {
         onVisibilityChange(true);
       }
     }, [isHovered, isVisible, onVisibilityChange, useHoverTrigger]);

     return (
       <>
         {/* Hover detection zone */}
         <div
           ref={hoverRef}
           className="hover-zone-right"
           aria-hidden="true"
         />

         {/* The actual sidebar */}
         <div
           className={`settings-sidebar fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-200 ease-out ${
             isVisible ? 'translate-x-0' : 'translate-x-full'
           } z-20`}
         >
           <div className="p-4 border-b">
             <h2 className="text-lg font-semibold">Settings</h2>
             <button
               className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
               onClick={() => onVisibilityChange(false)}
               aria-label="Close settings sidebar"
             >
               ✕
             </button>
           </div>

           <div className="p-4">
             <ModeToggle />
             <div className="mt-6">
               <StorageControls />
             </div>
           </div>
         </div>

         {/* Backdrop - only on mobile */}
         {isVisible && (
           <div
             className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
             onClick={() => onVisibilityChange(false)}
             aria-hidden="true"
           />
         )}
       </>
     );
   };

   export default SettingsSidebar;
   ```

   `src/components/SettingsSidebar/ModeToggle.tsx`:
   ```tsx
   import { useAppContext } from '../../context/AppContext';

   const ModeToggle: React.FC = () => {
     const { mode, setMode } = useAppContext();

     return (
       <div className="mode-toggle">
         <h3 className="text-md font-semibold mb-3">Mode</h3>
         <div className="flex flex-col space-y-2">
           <label className="flex items-center space-x-2 cursor-pointer">
             <input
               type="radio"
               checked={mode === 'learning'}
               onChange={() => setMode('learning')}
               className="form-radio text-blue-600"
             />
             <span>Learning</span>
           </label>
           <label className="flex items-center space-x-2 cursor-pointer">
             <input
               type="radio"
               checked={mode === 'mock'}
               onChange={() => setMode('mock')}
               className="form-radio text-blue-600"
             />
             <span>Mock</span>
           </label>
         </div>
         <div className="mt-2 text-sm text-gray-600">
           <p>
             {mode === 'learning'
               ? 'Learning mode shows validation results immediately.'
               : 'Mock mode simulates real interview conditions.'}
           </p>
         </div>
       </div>
     );
   };

   export default ModeToggle;
   ```

   `src/components/SettingsSidebar/StorageControls.tsx`:
   ```tsx
   import { useRef } from 'react';
   import { exportToFile, importFromFile } from '../../data/localStorage';

   const StorageControls: React.FC = () => {
     const fileInputRef = useRef<HTMLInputElement>(null);

     const handleImportClick = () => {
       fileInputRef.current?.click();
     };

     const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
       const file = e.target.files?.[0];
       if (!file) return;

       try {
         await importFromFile(file);
         alert('Import successful! Please refresh the page.');
         // Reset file input
         e.target.value = '';
       } catch (error) {
         alert(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
       }
     };

     return (
       <div className="storage-controls">
         <h3 className="text-md font-semibold mb-3">Backup & Restore</h3>
         <div className="flex flex-col space-y-2">
           <button
             onClick={exportToFile}
             className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
           >
             Download Progress
           </button>
           <button
             onClick={handleImportClick}
             className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition-colors"
           >
             Upload Backup
           </button>
           <input
             type="file"
             ref={fileInputRef}
             onChange={handleFileChange}
             accept=".json"
             className="hidden"
           />
         </div>
         <div className="mt-2 text-sm text-gray-600">
           <p>
             All progress is automatically saved in your browser.
             Use these options to backup or restore your data.
           </p>
         </div>
       </div>
     );
   };

   export default StorageControls;
   ```

   `src/components/VoiceCommandButton/index.tsx`:
   ```tsx
   import { useState, useEffect } from 'react';
   import { useVoiceRecognition } from '../../hooks/useVoiceRecognition';
   import { parseVoiceCommand } from '../../utils/voiceCommandParser';
   import { useAppContext } from '../../context/AppContext';
   import TranscriptionToast from './TranscriptionToast';

   const VoiceCommandButton: React.FC = () => {
     const {
       isListening,
       transcript,
       error,
       startListening,
       recognitionSupported
     } = useVoiceRecognition();

     const {
       setCurrentQuestionId,
       questions
     } = useAppContext();

     const [showTranscript, setShowTranscript] = useState(false);
     const [lastTranscript, setLastTranscript] = useState('');

     // Handle voice commands
     useEffect(() => {
       if (transcript && !isListening) {
         // Command processing happens after listening is complete
         setLastTranscript(transcript);
         setShowTranscript(true);

         // Auto-hide transcript after 3 seconds
         const timer = setTimeout(() => {
           setShowTranscript(false);
         }, 3000);

         // Process command
         const command = parseVoiceCommand(transcript);
         if (command) {
           switch (command.command) {
             case 'navigate':
               const questionId = command.params.questionId;
               const questionExists = questions.some(q => q.id === questionId);
               if (questionExists) {
                 setCurrentQuestionId(questionId);
               }
               break;
             case 'check':
               // Trigger code check (implemented via Issue Panel visibility)
               document.dispatchEvent(new CustomEvent('check-code'));
               break;
             case 'showSettings':
               document.dispatchEvent(new CustomEvent('toggle-settings'));
               break;
             case 'showQuestions':
               document.dispatchEvent(new CustomEvent('toggle-questions'));
               break;
             case 'showIssues':
               document.dispatchEvent(new CustomEvent('toggle-issues'));
               break;
           }
         }

         return () => clearTimeout(timer);
       }
     }, [transcript, isListening, setCurrentQuestionId, questions]);

     // Show error for 3 seconds if recognition fails
     useEffect(() => {
       if (error) {
         setLastTranscript(`Error: ${error}`);
         setShowTranscript(true);
         
         const timer = setTimeout(() => {
           setShowTranscript(false);
         }, 3000);
         
         return () => clearTimeout(timer);
       }
     }, [error]);

     if (!recognitionSupported) {
       return null; // Don't show button if speech recognition isn't supported
     }

     return (
       <>
         <button
           className={`voice-command-button fixed bottom-6 right-6 w-12 h-12 rounded-full shadow-lg z-30 flex items-center justify-center transition-colors ${
             isListening
               ? 'bg-red-500 animate-pulse'
               : 'bg-orange-500 hover:bg-orange-600'
           }`}
           onClick={startListening}
           disabled={isListening}
           aria-label="Voice command"
         >
           <svg
             xmlns="http://www.w3.org/2000/svg"
             className="h-6 w-6 text-white"
             fill="none"
             viewBox="0 0 24 24"
             stroke="currentColor"
           >
             <path
               strokeLinecap="round"
               strokeLinejoin="round"
               strokeWidth={2}
               d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
             />
           </svg>
         </button>

         {showTranscript && (
           <TranscriptionToast transcript={lastTranscript} />
         )}
       </>
     );
   };

   export default VoiceCommandButton;
   ```

   `src/components/VoiceCommandButton/TranscriptionToast.tsx`:
   ```tsx
   interface Props {
     transcript: string;
   }

   const TranscriptionToast: React.FC<Props> = ({ transcript }) => {
     return (
       <div
         className="fixed bottom-20 right-6 bg-white rounded-lg shadow-lg p-3 max-w-xs z-30 transition-opacity duration-200 animate-fade-in"
         role="status"
         aria-live="polite"
       >
         <p className="text-sm text-gray-800">{transcript}</p>
       </div>
     );
   };

   export default TranscriptionToast;
   ```

3. **Implement "Check" button functionality**

   Add a check button to the Code Editor component:

   `src/components/CodeEditor.tsx` (updated):
   ```tsx
   import { useEffect, useRef, useState } from 'react';
   import Editor from '@monaco-editor/react';
   import { useAppContext } from '../context/AppContext';
   import { validateCode } from '../utils/codeValidator';

   interface Props {
     onCheckCode: () => void;
   }

   const CodeEditor: React.FC<Props> = ({ onCheckCode }) => {
     const { currentQuestionId, questions, userCode, updateUserCode, mode } = useAppContext();
     const editorRef = useRef(null);
     const [isValid, setIsValid] = useState<boolean | null>(null);
     const [showResult, setShowResult] = useState(false);
     
     const currentQuestion = questions.find(q => q.id === currentQuestionId);
     const currentCode = userCode[currentQuestionId] || currentQuestion?.starterCode || '';
     
     const handleEditorDidMount = (editor: any) => {
       editorRef.current = editor;
     };
     
     const handleChange = (value: string | undefined) => {
       if (value !== undefined) {
         updateUserCode(currentQuestionId, value);
         
         // In learning mode, validation happens in real-time
         if (mode === 'learning' && showResult) {
           checkCode();
         } else {
           // Clear any previous result indicators
           setIsValid(null);
           setShowResult(false);
         }
       }
     };
     
     const checkCode = () => {
       if (!currentQuestion) return;
       
       const result = validateCode(currentCode, currentQuestion.solution);
       setIsValid(result.isValid);
       setShowResult(true);
       onCheckCode(); // Trigger issue panel visibility
       
       // For learning mode, show visual feedback in the editor
       if (mode === 'learning' && editorRef.current) {
         const editor = editorRef.current as any;
         // Add a decoration to the editor to indicate success/failure
         // This is just a simple visual indicator
         editor.deltaDecorations([], [
           {
             range: editor.getModel().getFullModelRange(),
             options: {
               className: result.isValid ? 'valid-code' : 'invalid-code',
               isWholeLine: true,
             },
           },
         ]);
         
         // Remove decoration after 1.5 seconds
         setTimeout(() => {
           editor.deltaDecorations([], []);
         }, 1500);
       }
     };
     
     // Listen for global check-code events (from voice commands)
     useEffect(() => {
       const handleCheckCode = () => checkCode();
       document.addEventListener('check-code', handleCheckCode);
       return () => document.removeEventListener('check-code', handleCheckCode);
     }, [currentCode, currentQuestion]);
     
     return (
       <div className="h-full w-full flex flex-col">
         <div className="h-12 bg-gray-100 border-b flex items-center justify-between px-4">
           <span className="text-sm text-gray-700">
             {mode === 'learning' ? 'Learning Mode' : 'Mock Interview Mode'}
           </span>
           <button
             onClick={checkCode}
             className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition-colors"
           >
             Check
           </button>
         </div>
         <div className="flex-grow">
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
         
         {/* Visual result indicator for immediate feedback */}
         {showResult && mode === 'learning' && (
           <div className={`px-4 py-2 text-sm ${isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
             {isValid ? 'Correct! ✓' : 'Not quite right. Check the Issues panel for details. ✗'}
           </div>
         )}
       </div>
     );
   };

   export default CodeEditor;
   ```

4. **Add Learning vs. Mock Mode Implementation**

   Update the App.tsx file to handle the different modes:

   ```tsx
   // In App.tsx, add this code to handle the different modes
   
   // Update the App component to pass the mode information
   function App() {
     // ... existing code ...
     
     const { mode } = useAppContext();
     
     // In mock mode, we don't show hover-triggered elements automatically
     // The user must explicitly toggle them with buttons/keyboard shortcuts
     const shouldUseHoverTriggers = mode === 'learning';
     
     // ... rest of the component ...
     
     return (
       <AppProvider>
         <div className="app-container h-screen w-screen flex overflow-hidden">
           {/* Question Selector Sidebar */}
           <QuestionSelectorSidebar 
             isVisible={leftSidebarVisible} 
             onVisibilityChange={setLeftSidebarVisible}
             useHoverTrigger={shouldUseHoverTriggers}
           />
           
           {/* Main Work Area */}
           <div className="main-area flex flex-col flex-grow h-full">
             <div className="main-content flex flex-grow">
               <QuestionDetailsPanel />
               <div className="code-editor-container flex-grow">
                 <CodeEditor onCheckCode={() => setIssuePanelVisible(true)} />
               </div>
             </div>
             <IssuePanel 
               isVisible={issuePanelVisible} 
               onVisibilityChange={setIssuePanelVisible}
               useHoverTrigger={shouldUseHoverTriggers}
             />
           </div>
           
           {/* Settings Sidebar */}
           <SettingsSidebar 
             isVisible={rightSidebarVisible} 
             onVisibilityChange={setRightSidebarVisible}
             useHoverTrigger={shouldUseHoverTriggers}
           />
           
           {/* Voice Command Button (floating) */}
           <VoiceCommandButton />
           
           {/* Mode indicator - only visible in mock mode */}
           {mode === 'mock' && (
             <div className="fixed top-4 right-4 bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-sm">
               Mock Interview Mode
             </div>
           )}
         </div>
       </AppProvider>
     );
   }
   ```

   Then update the sidebar and panel components to respect the `useHoverTrigger` prop:

   ```tsx
   // Example update for the QuestionSelectorSidebar component
   interface Props {
     isVisible: boolean;
     onVisibilityChange: (visible: boolean) => void;
     useHoverTrigger?: boolean;
   }

   const QuestionSelectorSidebar: React.FC<Props> = ({ 
     isVisible, 
     onVisibilityChange,
     useHoverTrigger = true
   }) => {
     // ... existing code ...
     
     // Show sidebar when hovered, but only if hover triggers are enabled
     useEffect(() => {
       if (useHoverTrigger && isHovered && !isVisible) {
         onVisibilityChange(true);
       }
     }, [isHovered, isVisible, onVisibilityChange, useHoverTrigger]);
     
     // ... rest of the component ...
   };
   ```

   Do the same for the other components that use hover triggers.

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
