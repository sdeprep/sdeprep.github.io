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

  // Update container style with improved visual hierarchy and orange shadow when listening
  const updatedContainerStyle = {
    ...containerStyle,
    borderColor: isDarkMode ? solarized.base01 : solarized.base1,
    borderWidth: '1px',
    borderStyle: 'solid',
    boxShadow: isListening
      ? '0 8px 32px rgba(203, 75, 22, 0.4), 0 4px 16px rgba(203, 75, 22, 0.2), 0 0 20px rgba(203, 75, 22, 0.3)'
      : isDarkMode
        ? `0 8px 32px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 ${solarized.base01}40`
        : `0 8px 32px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 ${solarized.base3}`,
    backgroundColor: isDarkMode ? solarized.base02 : solarized.base2,
    transition: 'box-shadow 0.3s ease, transform 0.3s ease',
    transform: isListening ? 'translateY(-2px)' : 'translateY(0)',
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
    </div>
  );
};

export default CodeEditor;
