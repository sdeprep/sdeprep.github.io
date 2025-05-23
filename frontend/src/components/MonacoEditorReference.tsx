import React from 'react';
import CodeEditor from './CodeEditor';

const MonacoEditorReference: React.FC = () => {
    const originalDefaultValue = `# Given an array of integers nums and an integer target,
# return indices of the two numbers such that they add up to target.
# You may assume that each input would have exactly one solution,
# and you may not use the same element twice.
# You can return the answer in any order.

# Example 1:
# Input: nums = [2,7,11,15], target = 9
# Output: [0,1]
# Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

def twoSum(nums, target):
    pass # Your code here

"""
@monaco-editor/react Component Options:

| Option           | Type                | Description                                                                         | Possible Values                                         |
|------------------|---------------------|-------------------------------------------------------------------------------------|---------------------------------------------------------|
| defaultValue     | string              | Default value of the current model.                                                 | Any string                                              |
| defaultLanguage  | string              | Default language of the current model.                                              | e.g., "python", "javascript", "typescript", etc.        |
| defaultPath      | string              | Default path of the current model.                                                  | Any string representing a file path                     |
| value            | string              | Value of the current model (for controlled component).                              | Any string                                              |
| language         | string              | Language of the current model.                                                      | e.g., "python", "javascript", "typescript", etc.        |
| path             | string              | Path of the current model.                                                          | Any string representing a file path                     |
| theme            | "light" \| "vs-dark" | The theme for the monaco editor.                                                    | "light", "vs-dark"                                      |
| line             | number              | The line to jump on it.                                                             | Any number                                              |
| loading          | React Node          | The loading screen before the editor is mounted.                                    | Any valid React Node                                    |
| options          | object              | Configuration options for the monaco editor (IStandaloneEditorConstructionOptions). | See Monaco Editor IStandaloneEditorConstructionOptions  |
| overrideServices | object              | Override services for the monaco editor (IEditorOverrideServices).                  | See Monaco Editor IEditorOverrideServices               |
| saveViewState    | boolean             | Indicator whether to save the models' view states.                                  | true, false                                             |
| keepCurrentModel | boolean             | Indicator whether to dispose the current model on unmount.                          | true, false                                             |
| width            | number \| string     | Width of the editor wrapper.                                                        | Any number or CSS width string                          |
| height           | number \| string     | Height of the editor wrapper.                                                       | Any number or CSS height string                         |
| className        | string              | Class name for the editor container.                                                | Any valid CSS class name                                |
| wrapperProps     | object              | Props applied to the wrapper element.                                               | Any valid HTML div attributes                           |
| beforeMount      | function            | Event emitted before the editor is mounted.                                         | A function that takes a Monaco instance as an argument  |
| onMount          | function            | Event emitted when the editor is mounted.                                           | A function that takes editor and Monaco instances       |
| onChange         | function            | Event emitted when the content changes.                                             | A function that takes value and event arguments         |
| onValidate       | function            | Event emitted when markers are ready.                                               | A function that takes a markers array                   |

The 'options' prop accepts a wide range of configurations from the monaco-editor library's IStandaloneEditorConstructionOptions interface.
"""`;

    const sectionStyle = {
        margin: '40px auto',
        width: '95%',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        border: '1px solid #e9ecef'
    };

    const headingStyle = {
        textAlign: 'center' as const,
        margin: '20px 0',
        color: '#2c3e50',
        fontSize: '2rem',
        fontWeight: 'bold'
    };

    const subHeadingStyle = {
        textAlign: 'center' as const,
        margin: '15px 0',
        color: '#34495e',
        fontSize: '1.5rem'
    };

    const descriptionStyle = {
        textAlign: 'center' as const,
        margin: '10px 0 20px 0',
        color: '#6c757d',
        fontSize: '1rem',
        fontStyle: 'italic'
    };

    const editorRowStyle = {
        display: 'flex',
        justifyContent: 'space-around',
        margin: '20px 0',
        gap: '15px'
    };

    const editorContainerStyle = {
        height: '35vh',
        width: '30%',
        border: '1px solid #cccccc',
        borderRadius: '8px'
    };

    const glossaryStyle = {
        ...sectionStyle,
        backgroundColor: '#e8f4fd',
        border: '2px solid #2196F3'
    };

    const termStyle = {
        fontWeight: 'bold',
        color: '#1976d2',
        marginBottom: '8px'
    };

    const definitionStyle = {
        marginBottom: '15px',
        paddingLeft: '20px',
        lineHeight: '1.6'
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#ffffff' }}>
            <h1 style={{ ...headingStyle, fontSize: '2.5rem', color: '#1a202c' }}>
                Monaco Editor Reference Guide
            </h1>
            <p style={{ ...descriptionStyle, fontSize: '1.2rem', marginBottom: '40px' }}>
                Comprehensive examples demonstrating Monaco Editor component options
            </p>

            {/* Glossary Section */}
            <div style={glossaryStyle}>
                <h2 style={subHeadingStyle}>📚 Key Terms Glossary</h2>
                <p style={descriptionStyle}>
                    Essential concepts to understand Monaco Editor properties
                </p>

                <div style={{ textAlign: 'left', maxWidth: '800px', margin: '0 auto' }}>
                    <div style={termStyle}>Model:</div>
                    <div style={definitionStyle}>
                        A "model" in Monaco Editor is like a document or file that contains text content. Think of it as a virtual file in memory. Each model has:
                        <ul>
                            <li><strong>Content:</strong> The actual text/code inside</li>
                            <li><strong>Language:</strong> The programming language (affects syntax highlighting, autocomplete, etc.)</li>
                            <li><strong>Path:</strong> A virtual file path that helps Monaco organize and identify the model</li>
                            <li><strong>View State:</strong> Cursor position, scroll location, selections, etc.</li>
                        </ul>
                        When you create multiple editors or switch between different files, each one gets its own model.
                    </div>

                    <div style={termStyle}>Path vs File Path:</div>
                    <div style={definitionStyle}>
                        The "path" property is NOT a real file system path. It's a virtual identifier that Monaco uses to:
                        <ul>
                            <li><strong>Auto-detect language:</strong> If you set path="main.py", Monaco knows it's Python</li>
                            <li><strong>Organize models:</strong> Like tabs in VS Code, each path represents a different "file"</li>
                            <li><strong>Enable IntelliSense:</strong> Monaco can provide better autocomplete when it knows the "filename"</li>
                            <li><strong>Model management:</strong> Switch between different models using their paths</li>
                        </ul>
                    </div>

                    <div style={termStyle}>Language Detection:</div>
                    <div style={definitionStyle}>
                        Monaco automatically determines the programming language based on file extension in the path:
                        <ul>
                            <li><code>.py</code> → Python</li>
                            <li><code>.js</code> → JavaScript</li>
                            <li><code>.tsx</code> → TypeScript React</li>
                            <li><code>.css</code> → CSS</li>
                            <li><code>.html</code> → HTML</li>
                        </ul>
                        This affects syntax highlighting, error checking, and autocomplete features.
                    </div>

                    <div style={termStyle}>View State:</div>
                    <div style={definitionStyle}>
                        The editor's "view state" includes cursor position, scroll location, text selections, and folded code regions. This state can be preserved when switching between models.
                    </div>

                    <div style={termStyle}>IntelliSense:</div>
                    <div style={definitionStyle}>
                        The smart code completion, error checking, and code hints that appear as you type. It includes autocomplete suggestions, parameter hints, and error underlining.
                    </div>

                    <div style={termStyle}>Controlled vs Uncontrolled Components:</div>
                    <div style={definitionStyle}>
                        <ul>
                            <li><strong>Uncontrolled:</strong> Use <code>defaultValue</code> - React doesn't manage the content, Monaco handles it internally</li>
                            <li><strong>Controlled:</strong> Use <code>value</code> - React state controls the content, you must handle <code>onChange</code></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Original Example */}
            <div style={sectionStyle}>
                <h2 style={subHeadingStyle}>Complete Example</h2>
                <p style={descriptionStyle}>
                    Full-featured editor with comprehensive documentation and example code
                </p>
                <CodeEditor defaultValue={originalDefaultValue} />
            </div>

            {/* 1. defaultValue Examples */}
            <div style={sectionStyle}>
                <h2 style={subHeadingStyle}>1. defaultValue Property</h2>
                <p style={descriptionStyle}>
                    Sets the initial text content when the editor first loads. This creates an uncontrolled component where Monaco manages the content internally.
                </p>

                <div style={editorRowStyle}>
                    <CodeEditor
                        defaultValue={`print("This text was set as defaultValue")`}
                        defaultLanguage="python"
                        containerStyle={editorContainerStyle}
                    />

                    <CodeEditor
                        defaultValue={`message = "This string was the defaultValue"
print(message)`}
                        defaultLanguage="python"
                        containerStyle={editorContainerStyle}
                    />

                    <CodeEditor
                        defaultValue={`"""
This multiline comment was part of the defaultValue
property passed to this editor component
"""
def example():
    return "defaultValue demo"`}
                        defaultLanguage="python"
                        containerStyle={editorContainerStyle}
                    />
                </div>
            </div>

            {/* 2. defaultLanguage Examples */}
            <div style={sectionStyle}>
                <h2 style={subHeadingStyle}>2. defaultLanguage Property</h2>
                <p style={descriptionStyle}>
                    Sets the programming language when the editor first loads. This determines syntax highlighting, IntelliSense features, and error checking for the entire editing session.
                </p>

                <div style={editorRowStyle}>
                    <CodeEditor
                        defaultValue={`console.log("JavaScript syntax highlighting");
// defaultLanguage="javascript" enables JS features
const data = { hello: "world" };`}
                        defaultLanguage="javascript"
                        containerStyle={editorContainerStyle}
                    />

                    <CodeEditor
                        defaultValue={`<!-- defaultLanguage="html" enables HTML features -->
<html>
<body>
  <h1>HTML syntax highlighting</h1>
  <p>Auto-completion works for HTML tags</p>
</body>
</html>`}
                        defaultLanguage="html"
                        containerStyle={editorContainerStyle}
                    />

                    <CodeEditor
                        defaultValue={`/* defaultLanguage="css" enables CSS features */
.button {
  color: blue; /* CSS syntax highlighting */
  padding: 10px;
  border-radius: 4px;
}`}
                        defaultLanguage="css"
                        containerStyle={editorContainerStyle}
                    />
                </div>
            </div>

            {/* 3. defaultPath Examples - COMPLETELY REWRITTEN */}
            <div style={sectionStyle}>
                <h2 style={subHeadingStyle}>3. defaultPath Property</h2>
                <p style={descriptionStyle}>
                    Sets a virtual file path that Monaco uses to identify the model. This is NOT a real file system path, but a virtual identifier that enables language auto-detection, IntelliSense improvements, and model organization.
                </p>

                <div style={{ backgroundColor: '#fff3cd', padding: '15px', borderRadius: '8px', margin: '20px 0', border: '1px solid #ffeaa7' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>🔍 How defaultPath Works:</h4>
                    <ul style={{ margin: 0, color: '#856404' }}>
                        <li><strong>Language Detection:</strong> Monaco looks at the file extension (.py, .js, .tsx) to automatically set the language</li>
                        <li><strong>Model Identity:</strong> Each unique path creates a separate model (like different tabs in VS Code)</li>
                        <li><strong>IntelliSense Context:</strong> Some language features work better when Monaco knows the "filename"</li>
                        <li><strong>Virtual Organization:</strong> You can switch between different "files" using their paths</li>
                    </ul>
                </div>

                <div style={editorRowStyle}>
                    <CodeEditor
                        defaultValue={`# defaultPath="app/main.py"
# Monaco detects Python from .py extension
# This creates a model identified as "main.py"

def main():
    print("Language auto-detected as Python!")
    return "Path enables organization"`}
                        defaultPath="app/main.py"
                        containerStyle={editorContainerStyle}
                    />

                    <CodeEditor
                        defaultValue={`// defaultPath="src/utils.js"
// Monaco detects JavaScript from .js extension
// This creates a separate model from the Python one

function helper() {
    console.log("Different model, different language!");
    return "Each path = separate virtual file";
}`}
                        defaultPath="src/utils.js"
                        containerStyle={editorContainerStyle}
                    />

                    <CodeEditor
                        defaultValue={`/* defaultPath="styles/config.css" */
/* Monaco detects CSS from .css extension */
/* This demonstrates how file extension drives language */

.config {
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
    /* Notice CSS syntax highlighting! */
}`}
                        defaultPath="styles/config.css"
                        containerStyle={editorContainerStyle}
                    />
                </div>

                <div style={{ backgroundColor: '#d1ecf1', padding: '15px', borderRadius: '8px', margin: '20px 0', border: '1px solid #bee5eb' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#0c5460' }}>💡 Real-World Example:</h4>
                    <p style={{ margin: 0, color: '#0c5460' }}>
                        Imagine you're building a code editor like VS Code. Each "tab" in the editor would have a different path:
                        <br />• <code>src/App.tsx</code> → TypeScript React file
                        <br />• <code>styles/main.css</code> → CSS file
                        <br />• <code>README.md</code> → Markdown file
                        <br />• <code>package.json</code> → JSON file
                        <br />Monaco uses these paths to provide the right language features for each "file".
                    </p>
                </div>
            </div>

            {/* 4. value Examples (Controlled Component) */}
            <div style={sectionStyle}>
                <h2 style={subHeadingStyle}>4. value Property (Controlled Component)</h2>
                <p style={descriptionStyle}>
                    Creates a controlled component where React state manages the editor's content. You must handle onChange to update your state when the user types.
                </p>

                <div style={{ backgroundColor: '#fff3cd', padding: '15px', borderRadius: '8px', margin: '20px 0', border: '1px solid #ffeaa7' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>🔧 Controlled vs Uncontrolled:</h4>
                    <ul style={{ margin: 0, color: '#856404' }}>
                        <li><strong>Uncontrolled (defaultValue):</strong> Monaco manages content, React doesn't track changes</li>
                        <li><strong>Controlled (value):</strong> React state controls content, you get real-time updates via onChange</li>
                        <li><strong>Use controlled for:</strong> Auto-save, real-time validation, content synchronization</li>
                        <li><strong>Use uncontrolled for:</strong> Simple editors where you don't need to track changes</li>
                    </ul>
                </div>

                <div style={editorRowStyle}>
                    <CodeEditor
                        defaultValue={`// This demonstrates controlled component pattern
// In real app, you'd use React state:
// const [code, setCode] = useState(initialValue);
// <CodeEditor value={code} onChange={setCode} />

function ControlledExample() {
  return "Content managed by React state";
}`}
                        defaultLanguage="javascript"
                        containerStyle={editorContainerStyle}
                    />

                    <CodeEditor
                        defaultValue={`# Controlled component benefits:
# - Real-time validation as user types
# - Auto-save functionality  
# - Undo/redo state management
# - Content synchronization across components

def controlled_benefits():
    return "React manages the content"`}
                        defaultLanguage="python"
                        containerStyle={editorContainerStyle}
                    />

                    <CodeEditor
                        defaultValue={`/* Controlled component use cases: */
/* - Live preview (markdown → HTML) */
/* - Real-time collaboration */
/* - Form validation */
/* - Auto-completion based on content */

.controlled-editor {
    border: 2px solid #4CAF50;
}`}
                        defaultLanguage="css"
                        containerStyle={editorContainerStyle}
                    />
                </div>
            </div>

            {/* 5. language Examples */}
            <div style={sectionStyle}>
                <h2 style={subHeadingStyle}>5. language Property</h2>
                <p style={descriptionStyle}>
                    Dynamically changes the programming language after the editor is created. Unlike defaultLanguage, this can be updated at any time to switch syntax highlighting and language features.
                </p>

                <div style={{ backgroundColor: '#d1ecf1', padding: '15px', borderRadius: '8px', margin: '20px 0', border: '1px solid #bee5eb' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#0c5460' }}>🔄 Dynamic Language Switching:</h4>
                    <ul style={{ margin: 0, color: '#0c5460' }}>
                        <li><strong>defaultLanguage:</strong> Sets language once when editor loads (static)</li>
                        <li><strong>language:</strong> Can be changed anytime during the editor's lifecycle (dynamic)</li>
                        <li><strong>Use cases:</strong> Language selection dropdown, file type switching, multi-language documents</li>
                        <li><strong>Effect:</strong> Changes syntax highlighting, autocomplete, error checking instantly</li>
                    </ul>
                </div>

                <div style={editorRowStyle}>
                    <CodeEditor
                        defaultValue={`{
  "dynamic": "This editor can switch languages",
  "feature": "Change language prop to see instant update",
  "languages": ["json", "javascript", "python", "sql"]
}`}
                        defaultLanguage="json"
                        containerStyle={editorContainerStyle}
                    />

                    <CodeEditor
                        defaultValue={`interface LanguageSwitcher {
  // Imagine a dropdown that changes the language prop
  currentLanguage: 'typescript' | 'javascript' | 'python';
  switchLanguage: (newLang: string) => void;
}

// Language prop enables real-time switching`}
                        defaultLanguage="typescript"
                        containerStyle={editorContainerStyle}
                    />

                    <CodeEditor
                        defaultValue={`-- SQL mode demonstrates language switching
-- Same content, different syntax highlighting
SELECT 
  'language' as property,
  'dynamic switching' as feature
FROM monaco_editor_options;`}
                        defaultLanguage="sql"
                        containerStyle={editorContainerStyle}
                    />
                </div>
            </div>

            {/* 6. path Examples */}
            <div style={sectionStyle}>
                <h2 style={subHeadingStyle}>6. path Property</h2>
                <p style={descriptionStyle}>
                    Dynamically changes the virtual file path of the current model. Unlike defaultPath, this can be updated to switch between different models or rename the current model.
                </p>

                <div style={{ backgroundColor: '#e8f5e8', padding: '15px', borderRadius: '8px', margin: '20px 0', border: '1px solid #4CAF50' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#2e7d32' }}>📁 Dynamic Path vs Default Path:</h4>
                    <ul style={{ margin: 0, color: '#2e7d32' }}>
                        <li><strong>defaultPath:</strong> Sets initial virtual file path when editor loads</li>
                        <li><strong>path:</strong> Can be changed to switch between different models or rename current model</li>
                        <li><strong>Model switching:</strong> Change path to load a different "file" with its own content and view state</li>
                        <li><strong>Model creation:</strong> New paths automatically create new models</li>
                    </ul>
                </div>

                <div style={editorRowStyle}>
                    <CodeEditor
                        defaultValue={`// path="src/components/Header.tsx"
// Dynamic path enables multi-file editing
// Change this path to switch to different models

export const Header: React.FC = () => {
  return <h1>Dynamic path switching demo</h1>;
};`}
                        defaultLanguage="typescript"
                        containerStyle={editorContainerStyle}
                    />

                    <CodeEditor
                        defaultValue={`# path="tests/test_calculator.py"  
# Each unique path represents a different "file"
# Monaco remembers content and view state per path

def test_path_switching():
    """
    When you change the path prop:
    1. Current model's state is saved
    2. New model is loaded (or created)
    3. Language auto-detected from extension
    """
    return "Path enables file organization"`}
                        defaultLanguage="python"
                        containerStyle={editorContainerStyle}
                    />

                    <CodeEditor
                        defaultValue={`<!-- path="public/index.html" -->
<!-- Path switching is like switching tabs in VS Code -->
<!-- Each path maintains separate: -->
<!-- - Content -->
<!-- - Cursor position -->  
<!-- - Scroll position -->
<!-- - Language settings -->

<html>
  <body>
    <h1>Path-based model organization</h1>
  </body>
</html>`}
                        defaultLanguage="html"
                        containerStyle={editorContainerStyle}
                    />
                </div>

                <div style={{ backgroundColor: '#f3e5f5', padding: '15px', borderRadius: '8px', margin: '20px 0', border: '1px solid #9c27b0' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#7b1fa2' }}>💡 Real-World Path Usage:</h4>
                    <p style={{ margin: 0, color: '#7b1fa2' }}>
                        Build a multi-file code editor by changing the path prop:
                        <br />• User clicks "App.tsx" tab → <code>setPath("src/App.tsx")</code>
                        <br />• User clicks "styles.css" tab → <code>setPath("src/styles.css")</code>
                        <br />• User creates new file → <code>setPath("src/NewComponent.tsx")</code>
                        <br />Monaco automatically manages separate models for each path, just like a real IDE!
                    </p>
                </div>
            </div>

            {/* 7. theme Examples */}
            <div style={sectionStyle}>
                <h2 style={subHeadingStyle}>7. theme Property</h2>
                <p style={descriptionStyle}>
                    Changes the visual color scheme of the editor between light and dark modes. This affects background colors, text colors, and syntax highlighting colors.
                </p>

                <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', margin: '20px 0', border: '1px solid #dee2e6' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>🎨 Available Themes:</h4>
                    <ul style={{ margin: 0, color: '#495057' }}>
                        <li><strong>"light":</strong> Light background, dark text (good for bright environments)</li>
                        <li><strong>"vs-dark":</strong> Dark background, light text (easier on eyes in dark environments)</li>
                        <li><strong>Custom themes:</strong> You can register custom themes using Monaco's API</li>
                        <li><strong>System preference:</strong> Can be changed dynamically based on user settings</li>
                    </ul>
                </div>

                <div style={editorRowStyle}>
                    <CodeEditor
                        defaultValue={`# theme="light" - Default light theme
# White background, dark text
# Good for: Daytime use, bright environments

def light_theme_example():
    return "Clean, bright appearance"`}
                        defaultLanguage="python"
                        containerStyle={editorContainerStyle}
                        theme="light"
                    />

                    <CodeEditor
                        defaultValue={`# theme="vs-dark" - Visual Studio dark theme
# Dark background, light text
# Good for: Night time, reduced eye strain

def dark_theme_example():
    return "Easy on the eyes"`}
                        defaultLanguage="python"
                        containerStyle={editorContainerStyle}
                        theme="vs-dark"
                    />

                    <CodeEditor
                        defaultValue={`# Theme switching in real apps:
# const [isDark, setIsDark] = useState(false);
# <CodeEditor theme={isDark ? "vs-dark" : "light"} />

def theme_switching():
    return "Dynamic theme changes"`}
                        defaultLanguage="python"
                        containerStyle={editorContainerStyle}
                    />
                </div>
            </div>

            {/* 8. line Examples */}
            <div style={sectionStyle}>
                <h2 style={subHeadingStyle}>8. line Property</h2>
                <p style={descriptionStyle}>
                    Automatically scrolls to and places the cursor on a specific line number when the editor loads. Useful for highlighting errors or jumping to specific code locations.
                </p>

                <div style={{ backgroundColor: '#e8f4fd', padding: '15px', borderRadius: '8px', margin: '20px 0', border: '1px solid #2196F3' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>🎯 Line Navigation Use Cases:</h4>
                    <ul style={{ margin: 0, color: '#1976d2' }}>
                        <li><strong>Error highlighting:</strong> Jump to line with compilation error</li>
                        <li><strong>Code review:</strong> Navigate to specific line in pull request</li>
                        <li><strong>Debug mode:</strong> Jump to breakpoint location</li>
                        <li><strong>Search results:</strong> Highlight line containing search match</li>
                    </ul>
                </div>

                <div style={editorRowStyle}>
                    <CodeEditor
                        defaultValue={`# Line 1: Function definition
# Line 2: Variable declaration  
# Line 3: ← CURSOR POSITIONED HERE
# Line 4: Return statement
# Line 5: End of function

def example():
    value = "Line 3 is highlighted"
    return value  # line prop set to 3`}
                        defaultLanguage="python"
                        containerStyle={editorContainerStyle}
                        line={3}
                    />

                    <CodeEditor
                        defaultValue={`# Line 1: Import statements
# Line 2: Class definition
# Line 3: Constructor
# Line 4: Method 1
# Line 5: Method 2
# Line 6: ← CURSOR POSITIONED HERE
# Line 7: End of class

class Example:
    def method(self):
        return "Line 6 focused"  # line prop set to 6`}
                        defaultLanguage="python"
                        containerStyle={editorContainerStyle}
                        line={6}
                    />

                    <CodeEditor
                        defaultValue={`// Line 1
// Line 2
// Line 3
// Line 4
// Line 5
// Line 6
// Line 7
// Line 8
// Line 9 ← CURSOR POSITIONED HERE

// Useful for: Error navigation, code review
console.log("Line 9 highlighted");`}
                        defaultLanguage="javascript"
                        containerStyle={editorContainerStyle}
                        line={9}
                    />
                </div>
            </div>

            {/* 9. loading Examples */}
            <div style={sectionStyle}>
                <h2 style={subHeadingStyle}>9. loading Property</h2>
                <p style={descriptionStyle}>
                    Custom React component displayed while Monaco Editor is initializing. Monaco needs to load language services, themes, and other resources before becoming interactive.
                </p>

                <div style={{ backgroundColor: '#fff3cd', padding: '15px', borderRadius: '8px', margin: '20px 0', border: '1px solid #ffeaa7' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>⏳ Why Loading Screens Matter:</h4>
                    <ul style={{ margin: 0, color: '#856404' }}>
                        <li><strong>First load:</strong> Monaco downloads and initializes language workers</li>
                        <li><strong>User experience:</strong> Shows progress instead of blank screen</li>
                        <li><strong>Customizable:</strong> Match your app's design and branding</li>
                        <li><strong>Accessibility:</strong> Screen readers can announce loading state</li>
                    </ul>
                </div>

                <div style={editorRowStyle}>
                    <CodeEditor
                        defaultValue={`# Simple loading text
print("Editor initialized!")`}
                        defaultLanguage="python"
                        containerStyle={editorContainerStyle}
                        loading={<div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>Initializing Monaco Editor...</div>}
                    />

                    <CodeEditor
                        defaultValue={`# Branded loading with icon
print("Custom loading component")`}
                        defaultLanguage="python"
                        containerStyle={editorContainerStyle}
                        loading={<div style={{ padding: '20px', textAlign: 'center', color: '#007acc', fontSize: '16px' }}>🔄 Loading Code Editor...</div>}
                    />

                    <CodeEditor
                        defaultValue={`# Styled loading component
print("Matches app design")`}
                        defaultLanguage="python"
                        containerStyle={editorContainerStyle}
                        loading={
                            <div style={{
                                padding: '20px',
                                textAlign: 'center',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '8px',
                                border: '2px dashed #dee2e6',
                                color: '#6c757d'
                            }}>
                                ⚡ Preparing Editor...
                            </div>
                        }
                    />
                </div>
            </div>

            {/* 10. options Examples */}
            <div style={sectionStyle}>
                <h2 style={subHeadingStyle}>10. options Property</h2>
                <p style={descriptionStyle}>
                    Advanced configuration object that controls Monaco Editor's behavior, appearance, and features. Based on Monaco's IStandaloneEditorConstructionOptions interface.
                </p>

                <div style={{ backgroundColor: '#e8f5e8', padding: '15px', borderRadius: '8px', margin: '20px 0', border: '1px solid #4CAF50' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#2e7d32' }}>⚙️ Common Options:</h4>
                    <ul style={{ margin: 0, color: '#2e7d32' }}>
                        <li><strong>readOnly:</strong> Disable editing (view-only mode)</li>
                        <li><strong>fontSize:</strong> Change text size (number in pixels)</li>
                        <li><strong>minimap:</strong> Toggle the code minimap on the right</li>
                        <li><strong>lineNumbers:</strong> Show/hide line numbers or customize format</li>
                        <li><strong>scrollBeyondLastLine:</strong> Allow scrolling past the last line</li>
                        <li><strong>wordWrap:</strong> Enable/disable text wrapping</li>
                    </ul>
                </div>

                <div style={editorRowStyle}>
                    <CodeEditor
                        defaultValue={`# options={{ readOnly: true }}
# This editor cannot be modified
# Good for: Documentation, code examples

def read_only_example():
    return "Cannot edit this code"`}
                        defaultLanguage="python"
                        containerStyle={editorContainerStyle}
                        options={{ readOnly: true }}
                    />

                    <CodeEditor
                        defaultValue={`# options={{ fontSize: 18 }}
# Larger text for better readability
# Good for: Accessibility, presentations

def large_font_example():
    return "Bigger text size"`}
                        defaultLanguage="python"
                        containerStyle={editorContainerStyle}
                        options={{ fontSize: 18 }}
                    />

                    <CodeEditor
                        defaultValue={`# options={{ minimap: { enabled: false } }}
# No minimap (code overview) on the right
# Good for: Small screens, focused editing

def no_minimap_example():
    return "More space for code"`}
                        defaultLanguage="python"
                        containerStyle={editorContainerStyle}
                        options={{ minimap: { enabled: false } }}
                    />
                </div>
            </div>

            {/* 11. overrideServices Examples */}
            <div style={sectionStyle}>
                <h2 style={subHeadingStyle}>11. overrideServices Property</h2>
                <p style={descriptionStyle}>
                    Advanced feature for replacing Monaco's internal services with custom implementations. This is for expert users who need to modify core editor behavior.
                </p>

                <div style={{ backgroundColor: '#fff5f5', padding: '15px', borderRadius: '8px', margin: '20px 0', border: '1px solid #f56565' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#c53030' }}>⚠️ Advanced Feature Warning:</h4>
                    <ul style={{ margin: 0, color: '#c53030' }}>
                        <li><strong>Expert level:</strong> Requires deep knowledge of Monaco's architecture</li>
                        <li><strong>Services:</strong> Internal Monaco systems like language services, text model services</li>
                        <li><strong>Use cases:</strong> Custom autocomplete, modified file handling, custom validation</li>
                        <li><strong>Risk:</strong> Can break editor functionality if implemented incorrectly</li>
                    </ul>
                </div>

                <div style={editorRowStyle}>
                    <CodeEditor
                        defaultValue={`// overrideServices example (conceptual)
// Most developers don't need this feature
// It's for customizing Monaco's internal systems

class CustomLanguageService {
  // Override Monaco's built-in language features
  provideCompletionItems() {
    return customAutoComplete();
  }
}`}
                        defaultLanguage="javascript"
                        containerStyle={editorContainerStyle}
                    />

                    <CodeEditor
                        defaultValue={`# overrideServices use cases:
# - Custom autocomplete from your API
# - Modified file system simulation  
# - Custom validation rules
# - Integration with external tools

def when_to_use_override_services():
    return "When default Monaco isn't enough"`}
                        defaultLanguage="python"
                        containerStyle={editorContainerStyle}
                    />

                    <CodeEditor
                        defaultValue={`/* Alternative approaches: */
/* Most customization can be done with: */
/* - options prop for configuration */
/* - onMount for setup and event handlers */
/* - Monaco's public APIs */

.avoid-override-services {
  content: "Use simpler methods first";
}`}
                        defaultLanguage="css"
                        containerStyle={editorContainerStyle}
                    />
                </div>
            </div>

            {/* 12. saveViewState Examples */}
            <div style={sectionStyle}>
                <h2 style={subHeadingStyle}>12. saveViewState Property</h2>
                <p style={descriptionStyle}>
                    Controls whether Monaco remembers the editor's view state (cursor position, scroll location, selections) when switching between different models/files.
                </p>

                <div style={{ backgroundColor: '#e8f4fd', padding: '15px', borderRadius: '8px', margin: '20px 0', border: '1px solid #2196F3' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>💾 What is View State?</h4>
                    <ul style={{ margin: 0, color: '#1976d2' }}>
                        <li><strong>Cursor position:</strong> Where the text cursor is located</li>
                        <li><strong>Scroll position:</strong> How far down/up the editor is scrolled</li>
                        <li><strong>Text selections:</strong> Any highlighted text</li>
                        <li><strong>Folded regions:</strong> Which code blocks are collapsed</li>
                        <li><strong>When useful:</strong> Multi-file editors, tabs, model switching</li>
                    </ul>
                </div>

                <div style={editorRowStyle}>
                    <CodeEditor
                        defaultValue={`# saveViewState=true
# When you switch to another model and back:
# - Cursor returns to same position
# - Scroll position restored
# - Text selections preserved

def save_view_state_demo():
    # Place cursor here, scroll down, then switch models
    # When you return, everything is remembered
    return "View state preserved"`}
                        defaultLanguage="python"
                        containerStyle={editorContainerStyle}
                        saveViewState={true}
                    />

                    <CodeEditor
                        defaultValue={`# saveViewState=false  
# When you switch models and back:
# - Cursor resets to line 1
# - Scroll position resets to top
# - Text selections lost

def no_save_view_state():
    # Cursor and scroll reset on model switch
    return "Fresh start each time"`}
                        defaultLanguage="python"
                        containerStyle={editorContainerStyle}
                        saveViewState={false}
                    />

                    <CodeEditor
                        defaultValue={`// Real-world example:
// Building a code editor with multiple tabs
// Each tab = different model (file)
// saveViewState=true makes it feel like a real IDE

function FileTab({ path, content }) {
  return (
    <CodeEditor 
      path={path}
      defaultValue={content}
      saveViewState={true} // Remember position per file
    />
  );
}`}
                        defaultLanguage="javascript"
                        containerStyle={editorContainerStyle}
                    />
                </div>
            </div>

            {/* 13. keepCurrentModel Examples */}
            <div style={sectionStyle}>
                <h2 style={subHeadingStyle}>13. keepCurrentModel Property</h2>
                <p style={descriptionStyle}>
                    Controls whether Monaco disposes (destroys) the current model when the React component unmounts. This affects memory management and model persistence.
                </p>

                <div style={{ backgroundColor: '#fff3cd', padding: '15px', borderRadius: '8px', margin: '20px 0', border: '1px solid #ffeaa7' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>🗂️ Model Lifecycle Management:</h4>
                    <ul style={{ margin: 0, color: '#856404' }}>
                        <li><strong>keepCurrentModel=true:</strong> Model survives component unmount (stays in Monaco's memory)</li>
                        <li><strong>keepCurrentModel=false:</strong> Model destroyed when component unmounts (frees memory)</li>
                        <li><strong>Memory consideration:</strong> Keeping many models can use significant memory</li>
                        <li><strong>Persistence:</strong> Kept models retain content and view state</li>
                    </ul>
                </div>

                <div style={editorRowStyle}>
                    <CodeEditor
                        defaultValue={`# keepCurrentModel=true
# Use when:
# - Building tabbed editor (models persist across tabs)
# - Temporary navigation (user might return)
# - Multi-step workflow with same models

def when_to_keep_model():
    return "Model survives component lifecycle"`}
                        defaultLanguage="python"
                        containerStyle={editorContainerStyle}
                        keepCurrentModel={true}
                    />

                    <CodeEditor
                        defaultValue={`# keepCurrentModel=false (default)
# Use when:
# - One-time editor usage
# - Memory management is important  
# - Each editor instance is independent

def when_to_dispose_model():
    return "Model cleaned up on unmount"`}
                        defaultLanguage="python"
                        containerStyle={editorContainerStyle}
                        keepCurrentModel={false}
                    />

                    <CodeEditor
                        defaultValue={`/* Real scenario comparison: */

/* Tabbed Code Editor: */
/* keepCurrentModel=true */
/* User can switch tabs without losing work */

/* Modal Code Viewer: */  
/* keepCurrentModel=false */
/* Clean up memory when modal closes */

function choose_wisely() {
  return "Consider your use case";
}`}
                        defaultLanguage="javascript"
                        containerStyle={editorContainerStyle}
                    />
                </div>
            </div>

            {/* 14. width Examples */}
            <div style={sectionStyle}>
                <h2 style={subHeadingStyle}>14. width Property</h2>
                <p style={descriptionStyle}>
                    Controls the horizontal size of the editor container. Can be specified as pixels, percentages, or other CSS units.
                </p>

                <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', margin: '20px 0', border: '1px solid #dee2e6' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>📏 Width Options:</h4>
                    <ul style={{ margin: 0, color: '#495057' }}>
                        <li><strong>Fixed pixels:</strong> <code>width="400px"</code> or <code>width={400}</code></li>
                        <li><strong>Percentage:</strong> <code>width="100%"</code> (fills container)</li>
                        <li><strong>CSS units:</strong> <code>width="50vw"</code> (viewport width)</li>
                        <li><strong>Responsive:</strong> Use with CSS media queries for different screen sizes</li>
                    </ul>
                </div>

                <div style={editorRowStyle}>
                    <CodeEditor
                        defaultValue={`# width="200px" - Fixed width
# Good for: Consistent sizing
# Limited horizontal space

def narrow_editor():
    return "Fixed 200px wide"`}
                        defaultLanguage="python"
                        containerStyle={{ ...editorContainerStyle, width: '200px' }}
                        width="200px"
                    />

                    <CodeEditor
                        defaultValue={`# width="100%" - Fills parent container  
# Good for: Responsive design
# Adapts to different screen sizes

def responsive_width():
    return "Takes full width of parent"`}
                        defaultLanguage="python"
                        containerStyle={{ ...editorContainerStyle, width: '100%' }}
                        width="100%"
                    />

                    <CodeEditor
                        defaultValue={`# width={400} - Numeric (pixels)
# Same as "400px"
# Programmatically controllable

function fixedWidth() {
  return "Exactly 400 pixels wide";
}`}
                        defaultLanguage="javascript"
                        containerStyle={{ ...editorContainerStyle, width: '400px' }}
                        width={400}
                    />
                </div>
            </div>

            {/* 15. height Examples */}
            <div style={sectionStyle}>
                <h2 style={subHeadingStyle}>15. height Property</h2>
                <p style={descriptionStyle}>
                    Controls the vertical size of the editor container. Essential for ensuring the editor has enough space to display content properly.
                </p>

                <div style={{ backgroundColor: '#e8f4fd', padding: '15px', borderRadius: '8px', margin: '20px 0', border: '1px solid #2196F3' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>📐 Height Considerations:</h4>
                    <ul style={{ margin: 0, color: '#1976d2' }}>
                        <li><strong>Minimum height:</strong> Editors need at least 100px to be functional</li>
                        <li><strong>Content-based:</strong> Consider typical file sizes in your app</li>
                        <li><strong>Viewport relative:</strong> <code>height="50vh"</code> for half screen height</li>
                        <li><strong>Flex layouts:</strong> Use <code>height="100%"</code> with flex containers</li>
                    </ul>
                </div>

                <div style={editorRowStyle}>
                    <CodeEditor
                        defaultValue={`# height="200px" - Compact editor
# Good for: Code snippets, small edits
print("Compact vertical space")`}
                        defaultLanguage="python"
                        containerStyle={{ ...editorContainerStyle, height: '200px' }}
                        height="200px"
                    />

                    <CodeEditor
                        defaultValue={`# height="100%" - Fill parent
# Good for: Full-screen editors, flex layouts
# Requires parent with defined height

function fullHeight() {
  return "Fills available vertical space";
}`}
                        defaultLanguage="javascript"
                        containerStyle={editorContainerStyle}
                        height="100%"
                    />

                    <CodeEditor
                        defaultValue={`# height={300} - Medium editor  
# Good for: Balance of visibility and space
# Shows ~10-15 lines of code

def mediumHeight() {
    return "Good balance of space"`}
                        defaultLanguage="python"
                        containerStyle={{ ...editorContainerStyle, height: '300px' }}
                        height={300}
                    />
                </div>
            </div>

            {/* 16. className Examples */}
            <div style={sectionStyle}>
                <h2 style={subHeadingStyle}>16. className Property</h2>
                <p style={descriptionStyle}>
                    Adds custom CSS classes to the editor container, enabling custom styling and theming beyond Monaco's built-in options.
                </p>

                <div style={{ backgroundColor: '#e8f5e8', padding: '15px', borderRadius: '8px', margin: '20px 0', border: '1px solid #4CAF50' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#2e7d32' }}>🎨 Styling Use Cases:</h4>
                    <ul style={{ margin: 0, color: '#2e7d32' }}>
                        <li><strong>Custom borders:</strong> Add colored borders around the editor</li>
                        <li><strong>Shadows and effects:</strong> Box shadows, border radius, etc.</li>
                        <li><strong>Theme integration:</strong> Match your app's design system</li>
                        <li><strong>State indication:</strong> Visual feedback for errors, focus, etc.</li>
                    </ul>
                </div>

                <div style={editorRowStyle}>
                    <CodeEditor
                        defaultValue={`/* Custom CSS classes enable:
 * - Branded styling
 * - Visual state indicators  
 * - Integration with design systems
 */

.custom-editor {
  border: 2px solid #007acc;
  border-radius: 8px;
}`}
                        defaultLanguage="css"
                        containerStyle={editorContainerStyle}
                        className="custom-editor"
                    />

                    <CodeEditor
                        defaultValue={`// className for different editor states
// .editor-error { border-color: red; }
// .editor-success { border-color: green; }
// .editor-focus { box-shadow: 0 0 10px blue; }

function styledEditor() {
  return "Visual feedback through CSS";
}`}
                        defaultLanguage="javascript"
                        containerStyle={editorContainerStyle}
                        className="editor-theme-blue"
                    />

                    <CodeEditor
                        defaultValue={`# Multiple classes can be applied
# className="editor-special theme-dark bordered"

def multiple_classes():
    return "Combine different styling aspects"`}
                        defaultLanguage="python"
                        containerStyle={editorContainerStyle}
                        className="special-editor"
                    />
                </div>
            </div>

            {/* 17. wrapperProps Examples */}
            <div style={sectionStyle}>
                <h2 style={subHeadingStyle}>17. wrapperProps Property</h2>
                <p style={descriptionStyle}>
                    Passes additional HTML attributes to the wrapper div element. Useful for accessibility, testing, and integration with other tools.
                </p>

                <div style={{ backgroundColor: '#fff3cd', padding: '15px', borderRadius: '8px', margin: '20px 0', border: '1px solid #ffeaa7' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>🔧 Common Wrapper Props:</h4>
                    <ul style={{ margin: 0, color: '#856404' }}>
                        <li><strong>id:</strong> Unique identifier for DOM queries</li>
                        <li><strong>data-testid:</strong> Testing framework selectors</li>
                        <li><strong>role:</strong> Accessibility roles for screen readers</li>
                        <li><strong>aria-*:</strong> Accessibility attributes</li>
                        <li><strong>onClick:</strong> Click handlers on the wrapper</li>
                    </ul>
                </div>

                <div style={editorRowStyle}>
                    <CodeEditor
                        defaultValue={`# wrapperProps={{ id: "main-editor" }}
# Useful for:
# - document.getElementById("main-editor")
# - CSS selectors: #main-editor
# - Integration with other libraries

def unique_identifier():
    return "DOM element can be found by ID"`}
                        defaultLanguage="python"
                        containerStyle={editorContainerStyle}
                        wrapperProps={{ id: "editor-1" }}
                    />

                    <CodeEditor
                        defaultValue={`// wrapperProps={{ "data-testid": "code-editor" }}
// Enables testing frameworks to find the editor:
// screen.getByTestId("code-editor")
// cy.get('[data-testid="code-editor"]')

function testingIntegration() {
  return "Easy to test with automation tools";
}`}
                        defaultLanguage="javascript"
                        containerStyle={editorContainerStyle}
                        wrapperProps={{ "data-testid": "editor" }}
                    />

                    <CodeEditor
                        defaultValue={`# wrapperProps={{ role: "textbox", "aria-label": "Code editor" }}
# Accessibility improvements:
# - Screen readers understand it's an input
# - Clear description for assistive technology

def accessibility_support():
    return "Better experience for all users"`}
                        defaultLanguage="python"
                        containerStyle={editorContainerStyle}
                        wrapperProps={{ role: "textbox" }}
                    />
                </div>
            </div>

            {/* 18. beforeMount Examples */}
            <div style={sectionStyle}>
                <h2 style={subHeadingStyle}>18. beforeMount Property</h2>
                <p style={descriptionStyle}>
                    Function called before the editor instance is created. Receives the Monaco instance to configure global settings, register custom languages, or set up themes.
                </p>

                <div style={{ backgroundColor: '#f3e5f5', padding: '15px', borderRadius: '8px', margin: '20px 0', border: '1px solid #9c27b0' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#7b1fa2' }}>⚡ beforeMount Use Cases:</h4>
                    <ul style={{ margin: 0, color: '#7b1fa2' }}>
                        <li><strong>Custom themes:</strong> Register new color schemes</li>
                        <li><strong>Language registration:</strong> Add support for custom languages</li>
                        <li><strong>Global configuration:</strong> Set Monaco-wide options</li>
                        <li><strong>Worker setup:</strong> Configure language service workers</li>
                    </ul>
                </div>

                <div style={editorRowStyle}>
                    <CodeEditor
                        defaultValue={`// beforeMount example:
// Register custom theme before editor creation

function beforeMount(monaco) {
  monaco.editor.defineTheme('myTheme', {
    base: 'vs-dark',
    inherit: true,
    rules: [{ token: 'comment', foreground: 'ff6b6b' }]
  });
}`}
                        defaultLanguage="javascript"
                        containerStyle={editorContainerStyle}
                        beforeMount={(monaco) => console.log('Setting up Monaco:', monaco)}
                    />

                    <CodeEditor
                        defaultValue={`# beforeMount for language registration
# Perfect for adding custom syntax highlighting

def register_custom_language(monaco):
    # Register new language with Monaco
    monaco.languages.register({
        'id': 'myLang',
        'extensions': ['.mylang']
    })
    return "Custom language ready"`}
                        defaultLanguage="python"
                        containerStyle={editorContainerStyle}
                        beforeMount={(monaco) => console.log('Language setup:', monaco)}
                    />

                    <CodeEditor
                        defaultValue={`/* Global Monaco configuration example */
/* beforeMount runs once per Monaco instance */

function setupMonaco(monaco) {
  // Configure all editors globally
  monaco.editor.setTheme('vs-dark');
  
  // Add custom commands
  monaco.editor.addCommand(/* ... */);
}`}
                        defaultLanguage="javascript"
                        containerStyle={editorContainerStyle}
                        beforeMount={(monaco) => console.log('Global setup:', monaco)}
                    />
                </div>
            </div>

            {/* 19. onMount Examples */}
            <div style={sectionStyle}>
                <h2 style={subHeadingStyle}>19. onMount Property</h2>
                <p style={descriptionStyle}>
                    Function called when the editor instance is created and ready. Receives both the editor instance and Monaco object for editor-specific configuration.
                </p>

                <div style={{ backgroundColor: '#d1ecf1', padding: '15px', borderRadius: '8px', margin: '20px 0', border: '1px solid #bee5eb' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#0c5460' }}>🎯 onMount Use Cases:</h4>
                    <ul style={{ margin: 0, color: '#0c5460' }}>
                        <li><strong>Event listeners:</strong> Listen for editor events</li>
                        <li><strong>Focus control:</strong> Auto-focus the editor</li>
                        <li><strong>Commands/actions:</strong> Add custom keyboard shortcuts</li>
                        <li><strong>Reference storage:</strong> Save editor reference for later use</li>
                    </ul>
                </div>

                <div style={editorRowStyle}>
                    <CodeEditor
                        defaultValue={`// onMount: Editor instance ready
// Perfect for editor-specific setup

function onMount(editor, monaco) {
  // Store reference for later use
  editorRef.current = editor;
  
  // Auto-focus the editor
  editor.focus();
}`}
                        defaultLanguage="javascript"
                        containerStyle={editorContainerStyle}
                        onMount={(editor, monaco) => console.log('Editor ready:', editor)}
                    />

                    <CodeEditor
                        defaultValue={`# onMount for event listeners
# React to user interactions

def setup_editor_events(editor, monaco):
    # Listen for content changes
    editor.onDidChangeModelContent(lambda e: 
        print(f"Content changed: {e}")
    )
    
    # Listen for cursor position changes  
    editor.onDidChangeCursorPosition(lambda e:
        print(f"Cursor at line {e.position.lineNumber}")
    )`}
                        defaultLanguage="python"
                        containerStyle={editorContainerStyle}
                        onMount={(editor, monaco) => console.log('Event setup:', editor)}
                    />

                    <CodeEditor
                        defaultValue={`/* Custom commands and keyboard shortcuts */

function setupCommands(editor, monaco) {
  // Add custom keyboard shortcut
  editor.addCommand(
    monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S,
    function() {
      // Custom save logic
      console.log('Save triggered!');
    }
  );
}`}
                        defaultLanguage="javascript"
                        containerStyle={editorContainerStyle}
                        onMount={(editor, monaco) => console.log('Commands setup:', editor)}
                    />
                </div>
            </div>

            {/* 20. onChange Examples */}
            <div style={sectionStyle}>
                <h2 style={subHeadingStyle}>20. onChange Property</h2>
                <p style={descriptionStyle}>
                    Function called whenever the user modifies the editor content. Essential for controlled components and real-time features like auto-save, validation, and content synchronization.
                </p>

                <div style={{ backgroundColor: '#e8f5e8', padding: '15px', borderRadius: '8px', margin: '20px 0', border: '1px solid #4CAF50' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#2e7d32' }}>🔄 onChange Use Cases:</h4>
                    <ul style={{ margin: 0, color: '#2e7d32' }}>
                        <li><strong>Controlled components:</strong> Keep React state in sync with editor content</li>
                        <li><strong>Auto-save:</strong> Save changes automatically after user stops typing</li>
                        <li><strong>Real-time validation:</strong> Check syntax/errors as user types</li>
                        <li><strong>Live preview:</strong> Update preview pane with latest content</li>
                        <li><strong>Collaboration:</strong> Send changes to other users in real-time</li>
                    </ul>
                </div>

                <div style={editorRowStyle}>
                    <CodeEditor
                        defaultValue={`// onChange: Real-time content tracking
// Called every time user types or modifies content

function handleChange(value, event) {
  // value = current editor content (string)
  // event = Monaco change event object
  console.log('New content:', value);
  
  // Update React state for controlled component
  setCode(value);
}`}
                        defaultLanguage="javascript"
                        containerStyle={editorContainerStyle}
                        onChange={(value, event) => console.log('Content changed:', value?.slice(0, 50) + '...' || 'Empty content')}
                    />

                    <CodeEditor
                        defaultValue={`# onChange: Auto-save implementation
# Save changes automatically after user stops typing

def handle_content_change(value, event):
    # Debounce saves to avoid too many requests
    clear_timeout(save_timer)
    save_timer = set_timeout(lambda: save_to_server(value), 1000)
    
    # Also update local state immediately
    set_content(value)`}
                        defaultLanguage="python"
                        containerStyle={editorContainerStyle}
                        onChange={(value, event) => console.log('Auto-save scheduled for:', value?.length || 0, 'characters')}
                    />

                    <CodeEditor
                        defaultValue={`/* onChange: Live validation and preview */

function handleValidationAndPreview(value, event) {
  // 1. Real-time syntax validation
  validateSyntax(value);
  
  // 2. Update live preview (e.g., Markdown → HTML)
  updatePreview(value);
  
  // 3. Track user activity for analytics
  trackEditingActivity(event);
}`}
                        defaultLanguage="javascript"
                        containerStyle={editorContainerStyle}
                        onChange={(value, event) => console.log('Live update:', { length: value?.length || 0, hasErrors: false })}
                    />
                </div>
            </div>

            {/* 21. onValidate Examples */}
            <div style={sectionStyle}>
                <h2 style={subHeadingStyle}>21. onValidate Property</h2>
                <p style={descriptionStyle}>
                    Function called when Monaco's language service completes validation and produces error/warning markers. Receives an array of diagnostic markers for syntax errors, warnings, and suggestions.
                </p>

                <div style={{ backgroundColor: '#fff5f5', padding: '15px', borderRadius: '8px', margin: '20px 0', border: '1px solid #f56565' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#c53030' }}>🔍 Validation Markers Explained:</h4>
                    <ul style={{ margin: 0, color: '#c53030' }}>
                        <li><strong>Markers:</strong> Objects containing error/warning information</li>
                        <li><strong>Properties:</strong> Line number, column, severity, message, source</li>
                        <li><strong>Severity levels:</strong> Error (red), Warning (orange), Info (blue), Hint (gray)</li>
                        <li><strong>Auto-generated:</strong> Monaco's language service creates these automatically</li>
                        <li><strong>Use cases:</strong> Error reporting, status indicators, code quality metrics</li>
                    </ul>
                </div>

                <div style={editorRowStyle}>
                    <CodeEditor
                        defaultValue={`// onValidate: Handle syntax errors and warnings
// markers = array of diagnostic markers

function handleValidation(markers) {
  // Filter by severity
  const errors = markers.filter(m => m.severity === 8); // Error
  const warnings = markers.filter(m => m.severity === 4); // Warning
  
  // Update UI indicators
  setErrorCount(errors.length);
  setWarningCount(warnings.length);
}`}
                        defaultLanguage="javascript"
                        containerStyle={editorContainerStyle}
                        onValidate={(markers) => console.log('Validation complete:', markers.length, 'issues found')}
                    />

                    <CodeEditor
                        defaultValue={`# onValidate: Error reporting and code quality

def handle_validation_markers(markers):
    # Process each validation marker
    for marker in markers:
        line = marker.startLineNumber
        column = marker.startColumn  
        message = marker.message
        severity = marker.severity
        
        # Report to error tracking service
        if severity == 8:  # Error
            error_tracker.report(f"Line {line}: {message}")
        
        # Update code quality metrics
        quality_metrics.update(markers)`}
                        defaultLanguage="python"
                        containerStyle={editorContainerStyle}
                        onValidate={(markers) => console.log('Quality check:', { errors: markers.filter(m => m.severity === 8).length, warnings: markers.filter(m => m.severity === 4).length })}
                    />

                    <CodeEditor
                        defaultValue={`/* onValidate: Real-time feedback system */

function provideFeedback(markers) {
  // Create status message for users
  if (markers.length === 0) {
    setStatus("✅ No issues found");
  } else {
    const errors = markers.filter(m => m.severity === 8);
    const warnings = markers.filter(m => m.severity === 4);
    
    setStatus(\`❌ \${errors.length} errors, ⚠️ \${warnings.length} warnings\`);
  }
  
  // Highlight problematic lines in editor
  highlightProblematicLines(markers);
}`}
                        defaultLanguage="javascript"
                        containerStyle={editorContainerStyle}
                        onValidate={(markers) => {
                            const errors = markers.filter(m => m.severity === 8).length;
                            const warnings = markers.filter(m => m.severity === 4).length;
                            console.log('Status update:', errors ? `❌ ${errors} errors` : warnings ? `⚠️ ${warnings} warnings` : '✅ All good');
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default MonacoEditorReference; 