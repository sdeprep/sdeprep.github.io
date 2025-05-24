import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useQuestions } from '../contexts/QuestionContext';
import { useTheme } from '../contexts/ThemeContext';
import solarizedDark from '../themes/solarized-dark.json';
import solarizedLight from '../themes/solarized-light.json';

interface CodeEditorProps {
  defaultValue?: string;
  defaultLanguage?: string;
  defaultPath?: string;
  language?: string;
  path?: string;
  line?: number;
  loading?: React.ReactNode;
  options?: object;
  overrideServices?: object;
  saveViewState?: boolean;
  keepCurrentModel?: boolean;
  height?: string | number;
  width?: string | number;
  className?: string;
  wrapperProps?: object;
  beforeMount?: (monaco: unknown) => void;
  onMount?: (editor: unknown, monaco: unknown) => void;
  onValidate?: (markers: unknown[]) => void;
  containerStyle?: React.CSSProperties;
  isListening?: boolean;
  audioLevel?: number;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  defaultValue = `# Hello, World!
print("Hello, World!")`,
  defaultLanguage = 'python',
  defaultPath,
  language,
  path,
  line,
  loading,
  options = {
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    fontSize: 14,
    lineNumbers: 'on',
    roundedSelection: false,
    scrollbar: {
      vertical: 'visible',
      horizontal: 'visible',
    },
  },
  overrideServices,
  saveViewState,
  keepCurrentModel,
  height = '100%',
  width = '100%',
  className,
  wrapperProps,
  beforeMount,
  onMount,
  onValidate,
  containerStyle = {
    height: '85vh',
    width: '80%',
    margin: '3vh auto 8vh auto',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  isListening = false,
  audioLevel = 0,
}) => {
  const { selectedQuestion } = useQuestions();
  const { isDarkMode } = useTheme();
  const [code, setCode] = useState(defaultValue);

  // Load code from localStorage when question changes
  useEffect(() => {
    if (selectedQuestion) {
      const savedCode = localStorage.getItem(`code_${selectedQuestion.id}`);
      if (savedCode) {
        setCode(savedCode);
      } else {
        // Use the question's default code if no saved code exists
        setCode(defaultValue);
      }
    }
  }, [selectedQuestion, defaultValue]);

  // Save code to localStorage when it changes
  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined && selectedQuestion) {
      setCode(value);
      localStorage.setItem(`code_${selectedQuestion.id}`, value);
    }
  };

  // Handle Monaco editor setup
  const handleEditorBeforeMount = (monaco: unknown) => {
    // Define Solarized themes
    const monacoEditor = monaco as {
      editor: {
        defineTheme: (themeName: string, themeData: unknown) => void;
      };
    };

    monacoEditor.editor.defineTheme('solarized-dark', {
      base: 'vs-dark',
      inherit: true,
      ...solarizedDark
    });

    monacoEditor.editor.defineTheme('solarized-light', {
      base: 'vs',
      inherit: true,
      ...solarizedLight
    });

    // Call user's beforeMount if provided
    if (beforeMount) {
      beforeMount(monaco);
    }
  };

  // Get theme name based on current mode
  const themeToUse = isDarkMode ? 'solarized-dark' : 'solarized-light';

  // Solarized colors for styling
  const solarized = {
    base03: '#002b36',
    base02: '#073642',
    base01: '#586e75',
    base00: '#657b83',
    base0: '#839496',
    base1: '#93a1a1',
    base2: '#eee8d5',
    base3: '#fdf6e3',
  };

  // Update container style with improved visual hierarchy and dynamic shadow animations
  const updatedContainerStyle = {
    ...containerStyle,
    borderColor: isDarkMode ? solarized.base01 : solarized.base1,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: '12px',
    boxShadow: (() => {
      if (!isListening) {
        // Default shadow when not listening
        return isDarkMode
          ? `0 4px 16px rgba(0, 0, 0, 0.2), 0 8px 32px rgba(0, 0, 0, 0.15), inset 0 1px 0 ${solarized.base01}40`
          : `0 4px 16px rgba(0, 0, 0, 0.08), 0 8px 32px rgba(0, 0, 0, 0.06), inset 0 1px 0 ${solarized.base3}`;
      }

      // Audio-responsive shadow - waveform-like expansion

      // Dynamic shadow calculations based on audio level
      const shadowDistance1 = 4 + (audioLevel * 16); // 4px to 20px
      const shadowBlur1 = 16 + (audioLevel * 24); // 16px to 40px
      const shadowDistance2 = 8 + (audioLevel * 32); // 8px to 40px  
      const shadowBlur2 = 32 + (audioLevel * 48); // 32px to 80px
      const shadowDistance3 = 16 + (audioLevel * 48); // 16px to 64px
      const shadowBlur3 = 48 + (audioLevel * 72); // 48px to 120px

      // Opacity calculations for smooth intensity changes
      const opacity1 = 0.12 + (audioLevel * 0.2); // 0.12 to 0.32
      const opacity2 = 0.08 + (audioLevel * 0.15); // 0.08 to 0.23
      const opacity3 = 0.05 + (audioLevel * 0.1); // 0.05 to 0.15

      // Build shadow layers based on theme
      if (isDarkMode) {
        return `0 ${shadowDistance1}px ${shadowBlur1}px rgba(38, 139, 210, ${opacity1}), 0 ${shadowDistance2}px ${shadowBlur2}px rgba(38, 139, 210, ${opacity2}), 0 ${shadowDistance3}px ${shadowBlur3}px rgba(38, 139, 210, ${opacity3})`;
      } else {
        return `0 ${shadowDistance1}px ${shadowBlur1}px rgba(181, 137, 0, ${opacity1}), 0 ${shadowDistance2}px ${shadowBlur2}px rgba(181, 137, 0, ${opacity2}), 0 ${shadowDistance3}px ${shadowBlur3}px rgba(181, 137, 0, ${opacity3})`;
      }
    })(),
    backgroundColor: isDarkMode ? solarized.base02 : solarized.base2,
    transition: 'box-shadow 0.05s ease-out, border-radius 0.3s ease', // Faster transition for more responsive feel
  };

  return (
    <div className="code-editor-wrapper">
      {/* Question Title */}
      {selectedQuestion && (
        <div
          className="question-title"
          style={{
            textAlign: 'center',
            marginBottom: '16px',
            fontSize: '24px',
            fontWeight: '600',
            color: isDarkMode ? solarized.base0 : solarized.base00,
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
        >
          {selectedQuestion.title}
        </div>
      )}

      <div className="code-editor-container" style={updatedContainerStyle}>
        <Editor
          value={code}
          defaultLanguage={defaultLanguage}
          defaultPath={defaultPath}
          language={language}
          path={path}
          theme={themeToUse}
          line={line}
          loading={loading}
          options={options}
          overrideServices={overrideServices}
          saveViewState={saveViewState}
          keepCurrentModel={keepCurrentModel}
          height={height}
          width={width}
          className={className}
          wrapperProps={wrapperProps}
          beforeMount={handleEditorBeforeMount}
          onMount={onMount}
          onChange={handleCodeChange}
          onValidate={onValidate}
        />

        {/* Removed complex animation styles - now using direct audioLevel control */}
      </div>
    </div>
  );
};

export default CodeEditor;
