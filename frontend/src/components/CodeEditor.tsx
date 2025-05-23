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
    border: '1px solid #cccccc',
    borderRadius: '12px',
    overflow: 'hidden',
  },
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

  // Solarized border color
  const solarizedBorder = '#586e75'; // base01 - comments/secondary content

  // Update container style with Solarized border
  const updatedContainerStyle = {
    ...containerStyle,
    borderColor: solarizedBorder,
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
