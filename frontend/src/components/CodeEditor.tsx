import Editor from '@monaco-editor/react';

const CodeEditor: React.FC = () => {
    return (
        <div style={{ height: '500px', width: '100%' }}>
            <Editor
                height="100%"
                defaultLanguage="javascript"
                defaultValue="// Happy coding!"
            />
        </div>
    );
};

export default CodeEditor; 