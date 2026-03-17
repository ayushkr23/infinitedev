// Monaco Editor Loader
require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });

let editor;
let currentLanguage = 'python';
let tabs = [
    { id: 'tab-1', name: 'main.py', content: 'print("Hello, InfiniteDev!")', language: 'python' }
];
let activeTabId = 'tab-1';

const templates = {
    python: 'print("Hello, InfiniteDev!")',
    javascript: 'console.log("Hello, InfiniteDev!");',
    c: '#include <stdio.h>\n\nint main() {\n    printf("Hello, InfiniteDev!\\n");\n    return 0;\n}',
    cpp: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, InfiniteDev!" << std::endl;\n    return 0;\n}',
    java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, InfiniteDev!");\n    }\n}'
};

const langToExt = {
    python: 'py',
    javascript: 'js',
    c: 'c',
    cpp: 'cpp',
    java: 'java'
};

require(['vs/editor/editor.main'], function () {
    editor = monaco.editor.create(document.getElementById('monaco-editor-container'), {
        value: templates.python,
        language: 'python',
        theme: 'vs-dark',
        automaticLayout: true,
        fontSize: 14,
        fontFamily: 'JetBrains Mono',
        minimap: { enabled: false },
        scrollbar: { vertical: 'visible', horizontal: 'visible' },
        lineNumbers: 'on',
        bracketPairColorization: { enabled: true }
    });

    // Cursor position update
    editor.onDidChangeCursorPosition((e) => {
        document.getElementById('cursor-pos').innerText = `Ln ${e.position.lineNumber}, Col ${e.position.column}`;
    });

    // Save content to tab on change
    editor.onDidChangeModelContent(() => {
        const activeTab = tabs.find(t => t.id === activeTabId);
        if (activeTab) activeTab.content = editor.getValue();
    });
});

// Theme Toggle
document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    monaco.editor.setTheme(isLight ? 'vs' : 'vs-dark');
});

// Language Selector
document.getElementById('language-selector').addEventListener('change', (e) => {
    const lang = e.target.value;
    currentLanguage = lang;
    
    // Update active tab if it's the only one or user wants to switch language of current tab
    const activeTab = tabs.find(t => t.id === activeTabId);
    if (activeTab) {
        activeTab.language = lang;
        activeTab.name = `main.${langToExt[lang]}`;
        renderTabs();
        monaco.editor.setModelLanguage(editor.getModel(), lang);
        if (!activeTab.content || activeTab.content === templates[Object.keys(templates).find(k => templates[k] === activeTab.content)]) {
            editor.setValue(templates[lang]);
        }
    }
});

// Run Button
document.getElementById('run-btn').addEventListener('click', async () => {
    const code = editor.getValue();
    const stdin = document.getElementById('stdin-box').value;
    const language = currentLanguage;

    const runBtn = document.getElementById('run-btn');
    runBtn.innerText = 'Running...';
    runBtn.disabled = true;

    try {
        const response = await fetch('http://localhost:5000/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, language, stdin })
        });
        const data = await response.json();

        document.getElementById('output-text').innerText = data.output || '';
        document.getElementById('error-text').innerText = data.error || '';
        document.getElementById('runtime-display').innerText = `Time: ${data.duration || '0ms'}`;
        
        if (data.error) {
            document.getElementById('error-box').classList.add('visible');
        } else {
            document.getElementById('error-box').classList.remove('visible');
        }
    } catch (err) {
        document.getElementById('error-text').innerText = 'Error connecting to backend.';
    } finally {
        runBtn.innerText = 'Run Code';
        runBtn.disabled = false;
    }
});

// Tab Management
function renderTabs() {
    const tabsBar = document.getElementById('tabs-bar');
    const addBtn = document.getElementById('add-tab');
    
    // Clear existing tabs (except add button)
    const existingTabs = tabsBar.querySelectorAll('.tab');
    existingTabs.forEach(t => t.remove());

    tabs.forEach(tab => {
        const tabEl = document.createElement('div');
        tabEl.className = `tab ${tab.id === activeTabId ? 'active' : ''}`;
        tabEl.dataset.id = tab.id;
        tabEl.innerHTML = `${tab.name} <span class="close-tab" data-id="${tab.id}">&times;</span>`;
        
        tabEl.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-tab')) return;
            switchTab(tab.id);
        });

        tabEl.querySelector('.close-tab').addEventListener('click', (e) => {
            closeTab(tab.id);
        });

        tabsBar.insertBefore(tabEl, addBtn);
    });
}

function switchTab(id) {
    const tab = tabs.find(t => t.id === id);
    if (!tab) return;
    
    activeTabId = id;
    currentLanguage = tab.language;
    document.getElementById('language-selector').value = tab.language;
    
    editor.setValue(tab.content);
    monaco.editor.setModelLanguage(editor.getModel(), tab.language);
    
    renderTabs();
}

function closeTab(id) {
    if (tabs.length === 1) return; // Don't close last tab
    
    const index = tabs.findIndex(t => t.id === id);
    tabs = tabs.filter(t => t.id !== id);
    
    if (activeTabId === id) {
        activeTabId = tabs[Math.max(0, index - 1)].id;
        switchTab(activeTabId);
    } else {
        renderTabs();
    }
}

document.getElementById('add-tab').addEventListener('click', () => {
    const id = `tab-${Date.now()}`;
    const newTab = {
        id: id,
        name: `file-${tabs.length + 1}.${langToExt[currentLanguage]}`,
        content: templates[currentLanguage],
        language: currentLanguage
    };
    tabs.push(newTab);
    switchTab(id);
});

// AI Features
async function askAI(action) {
    const aiResponseBox = document.getElementById('ai-response-box');
    const code = editor.getValue();
    const error = document.getElementById('error-text').innerText;
    const language = currentLanguage;

    aiResponseBox.innerHTML = '<p class="placeholder-text">Consulting Infinite AI...</p>';

    try {
        const response = await fetch('http://localhost:5000/ai-help', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, code, error, language })
        });
        const data = await response.json();
        aiResponseBox.innerHTML = `<p>${data.response}</p>`;
    } catch (err) {
        aiResponseBox.innerHTML = '<p class="error-text">Failed to reach AI helper.</p>';
    }
}

document.getElementById('ai-explain-code').addEventListener('click', () => askAI('explain-code'));
document.getElementById('ai-explain-error').addEventListener('click', () => askAI('explain-error'));
document.getElementById('ai-suggest-fix').addEventListener('click', () => askAI('suggest-fix'));

// Footer Actions
document.getElementById('copy-btn').addEventListener('click', () => {
    navigator.clipboard.writeText(editor.getValue());
    alert('Code copied to clipboard!');
});

document.getElementById('clear-btn').addEventListener('click', () => {
    if (confirm('Clear editor content?')) {
        editor.setValue('');
    }
});

document.getElementById('download-btn').addEventListener('click', () => {
    const code = editor.getValue();
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${langToExt[currentLanguage]}`;
    a.click();
    URL.revokeObjectURL(url);
});

// Initialize
renderTabs();
