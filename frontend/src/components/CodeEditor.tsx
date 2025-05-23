import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  defaultValue?: string;
  defaultLanguage?: string;
  defaultPath?: string;
  value?: string;
  language?: string;
  path?: string;
  theme?: 'light' | 'vs-dark';
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
  onChange?: (value: string | undefined, event: unknown) => void;
  onValidate?: (markers: unknown[]) => void;
  containerStyle?: React.CSSProperties;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  defaultValue = `# Hello, World!
print("Hello, World!")`,
  defaultLanguage = 'python',
  defaultPath,
  value,
  language,
  path,
  theme = 'vs-dark',
  line,
  loading,
  options,
  overrideServices,
  saveViewState,
  keepCurrentModel,
  height = '100%',
  width = '100%',
  className,
  wrapperProps,
  beforeMount,
  onMount,
  onChange,
  onValidate,
  containerStyle = {
    height: '90vh',
    width: '80%',
    margin: '0 auto',
    border: '1px solid #cccccc',
    borderRadius: '12px',
  },
}) => {
  return (
    <div className="code-editor-container" style={containerStyle}>
      <Editor
        defaultValue={defaultValue}
        defaultLanguage={defaultLanguage}
        defaultPath={defaultPath}
        value={value}
        language={language}
        path={path}
        theme={theme}
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
        beforeMount={beforeMount}
        onMount={onMount}
        onChange={onChange}
        onValidate={onValidate}
      />
    </div>
  );
};

export default CodeEditor;
