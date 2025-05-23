import Editor from '@monaco-editor/react';
import { useState, useEffect } from 'react';
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
  isSpeaking?: boolean;
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
  isSpeaking = false,
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
        setCode(selectedQuestion.code || defaultValue);
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
  const handleEditorBeforeMount = (monaco: any) => {
    // Define Solarized themes
    monaco.editor.defineTheme('solarized-dark', {
      base: 'vs-dark',
      inherit: true,
      ...solarizedDark
    });

    monaco.editor.defineTheme('solarized-light', {
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
    boxShadow: isListening
      ? isSpeaking
        ? isDarkMode
          ? '0 8px 32px rgba(38, 139, 210, 0.6), 0 4px 16px rgba(38, 139, 210, 0.4), 0 0 40px rgba(38, 139, 210, 0.5), 0 0 80px rgba(38, 139, 210, 0.2)'
          : '0 8px 32px rgba(181, 137, 0, 0.6), 0 4px 16px rgba(181, 137, 0, 0.4), 0 0 40px rgba(181, 137, 0, 0.5), 0 0 80px rgba(181, 137, 0, 0.2)'
        : isDarkMode
          ? '0 8px 32px rgba(38, 139, 210, 0.4), 0 4px 16px rgba(38, 139, 210, 0.2), 0 0 20px rgba(38, 139, 210, 0.3)'
          : '0 8px 32px rgba(181, 137, 0, 0.4), 0 4px 16px rgba(181, 137, 0, 0.2), 0 0 20px rgba(181, 137, 0, 0.3)'
      : isDarkMode
        ? `0 8px 32px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 ${solarized.base01}40`
        : `0 8px 32px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 ${solarized.base3}`,
    backgroundColor: isDarkMode ? solarized.base02 : solarized.base2,
    transition: 'box-shadow 0.5s ease',
    animation: isListening
      ? isSpeaking
        ? 'waveformShadows 1.2s ease-in-out infinite'
        : 'gentleListeningShadows 3s ease-in-out infinite'
      : 'none',
  };

  return (
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

      {/* Advanced shadow animation styles */}
      <style>{`
        @keyframes gentleListeningShadows {
          0% { 
            box-shadow: ${isDarkMode
          ? '0 8px 32px rgba(38, 139, 210, 0.4), 0 4px 16px rgba(38, 139, 210, 0.2), 0 0 20px rgba(38, 139, 210, 0.3)'
          : '0 8px 32px rgba(181, 137, 0, 0.4), 0 4px 16px rgba(181, 137, 0, 0.2), 0 0 20px rgba(181, 137, 0, 0.3)'
        };
          }
          50% { 
            box-shadow: ${isDarkMode
          ? '0 12px 40px rgba(38, 139, 210, 0.5), 0 6px 20px rgba(38, 139, 210, 0.3), 0 0 35px rgba(38, 139, 210, 0.4)'
          : '0 12px 40px rgba(181, 137, 0, 0.5), 0 6px 20px rgba(181, 137, 0, 0.3), 0 0 35px rgba(181, 137, 0, 0.4)'
        };
          }
          100% { 
            box-shadow: ${isDarkMode
          ? '0 8px 32px rgba(38, 139, 210, 0.4), 0 4px 16px rgba(38, 139, 210, 0.2), 0 0 20px rgba(38, 139, 210, 0.3)'
          : '0 8px 32px rgba(181, 137, 0, 0.4), 0 4px 16px rgba(181, 137, 0, 0.2), 0 0 20px rgba(181, 137, 0, 0.3)'
        };
          }
        }
        
        @keyframes waveformShadows {
          0% { 
            box-shadow: ${isDarkMode
          ? '0 8px 32px rgba(38, 139, 210, 0.6), 0 4px 16px rgba(38, 139, 210, 0.4), 0 0 40px rgba(38, 139, 210, 0.5), 0 0 80px rgba(38, 139, 210, 0.2)'
          : '0 8px 32px rgba(181, 137, 0, 0.6), 0 4px 16px rgba(181, 137, 0, 0.4), 0 0 40px rgba(181, 137, 0, 0.5), 0 0 80px rgba(181, 137, 0, 0.2)'
        };
          }
          25% { 
            box-shadow: ${isDarkMode
          ? '0 16px 48px rgba(38, 139, 210, 0.8), 0 8px 24px rgba(38, 139, 210, 0.6), 0 0 70px rgba(38, 139, 210, 0.7), 0 0 140px rgba(38, 139, 210, 0.3)'
          : '0 16px 48px rgba(181, 137, 0, 0.8), 0 8px 24px rgba(181, 137, 0, 0.6), 0 0 70px rgba(181, 137, 0, 0.7), 0 0 140px rgba(181, 137, 0, 0.3)'
        };
          }
          50% { 
            box-shadow: ${isDarkMode
          ? '0 24px 64px rgba(38, 139, 210, 0.9), 0 12px 32px rgba(38, 139, 210, 0.7), 0 0 100px rgba(38, 139, 210, 0.8), 0 0 200px rgba(38, 139, 210, 0.4)'
          : '0 24px 64px rgba(181, 137, 0, 0.9), 0 12px 32px rgba(181, 137, 0, 0.7), 0 0 100px rgba(181, 137, 0, 0.8), 0 0 200px rgba(181, 137, 0, 0.4)'
        };
          }
          75% { 
            box-shadow: ${isDarkMode
          ? '0 16px 48px rgba(38, 139, 210, 0.8), 0 8px 24px rgba(38, 139, 210, 0.6), 0 0 70px rgba(38, 139, 210, 0.7), 0 0 140px rgba(38, 139, 210, 0.3)'
          : '0 16px 48px rgba(181, 137, 0, 0.8), 0 8px 24px rgba(181, 137, 0, 0.6), 0 0 70px rgba(181, 137, 0, 0.7), 0 0 140px rgba(181, 137, 0, 0.3)'
        };
          }
          100% { 
            box-shadow: ${isDarkMode
          ? '0 8px 32px rgba(38, 139, 210, 0.6), 0 4px 16px rgba(38, 139, 210, 0.4), 0 0 40px rgba(38, 139, 210, 0.5), 0 0 80px rgba(38, 139, 210, 0.2)'
          : '0 8px 32px rgba(181, 137, 0, 0.6), 0 4px 16px rgba(181, 137, 0, 0.4), 0 0 40px rgba(181, 137, 0, 0.5), 0 0 80px rgba(181, 137, 0, 0.2)'
        };
          }
        }
      `}</style>
    </div>
  );
};

export default CodeEditor;
