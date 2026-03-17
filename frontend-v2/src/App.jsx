import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import TabBar from './components/TabBar';
import CodeEditor from './components/CodeEditor';
import ActivityBar from './components/ActivityBar';
import Explorer from './components/Explorer';
import RightPanel from './components/RightPanel';
import BottomPanel from './components/BottomPanel';
import { motion, AnimatePresence } from 'framer-motion';

const templates = {
  python: 'print("Hello, InfiniteDev v2.2 PRO!")\n\n# Try out snippets! Type "main" and hit Enter',
  javascript: 'console.log("Hello, InfiniteDev v2.2 PRO!");',
  c: '#include <stdio.h>\n\nint main() {\n    printf("Hello, InfiniteDev v2.2 PRO!\\n");\n    return 0;\n}',
  cpp: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, InfiniteDev v2.2 PRO!" << std::endl;\n    return 0;\n}',
  java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, InfiniteDev v2.2 PRO!");\n    }\n}'
};

const langToExt = { python: 'py', javascript: 'js', c: 'c', cpp: 'cpp', java: 'java' };

function App() {
  const [tabs, setTabs] = useState([
    { id: '1', name: 'main.py', content: templates.python, language: 'python' }
  ]);
  const [activeTabId, setActiveTabId] = useState('1');
  const [activeView, setActiveView] = useState('explorer'); // explorer, search, ai
  const [output, setOutput] = useState({ text: '', error: '', metrics: {} });
  const [isRunning, setIsRunning] = useState(false);
  const [stdin, setStdin] = useState('');

  const activeTab = tabs.find(t => t.id === activeTabId);

  const handleRun = async () => {
    setIsRunning(true);
    try {
      const response = await fetch('/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: activeTab.content,
          language: activeTab.language,
          stdin
        })
      });
      const data = await response.json();
      setOutput({
        text: data.output || '',
        error: data.error || '',
        metrics: {
          time: data.duration,
          memory: data.memory,
          type: data.type
        }
      });
    } catch (err) {
      setOutput(prev => ({ ...prev, error: 'Failed to connect to backend.' }));
    } finally {
      setIsRunning(false);
    }
  };

  const addTab = (lang = activeTab.language) => {
    const id = Date.now().toString();
    const newTab = {
      id,
      name: `file-${tabs.length + 1}.${langToExt[lang]}`,
      content: templates[lang],
      language: lang
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(id);
  };

  const closeTab = (id) => {
    if (tabs.length === 1) return;
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    if (activeTabId === id) setActiveTabId(newTabs[0].id);
  };

  const updateContent = (content) => {
    setTabs(tabs.map(t => t.id === activeTabId ? { ...t, content } : t));
  };

  return (
    <div className="h-screen flex flex-col bg-[#0d0d0d] text-[#e5e5e5] font-sans selection:bg-orange-500/30">
      {/* Top Navbar */}
      <Navbar 
        onRun={handleRun} 
        isRunning={isRunning}
        language={activeTab.language}
        setLanguage={(lang) => {
          setTabs(tabs.map(t => t.id === activeTabId ? { ...t, language: lang, name: `main.${langToExt[lang]}`, content: templates[lang] } : t));
        }}
      />
      
      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Activity Bar (Slim Left) */}
        <ActivityBar activeView={activeView} setActiveView={setActiveView} />

        {/* Sidebar Pane (Explorer/etc) */}
        <AnimatePresence mode="wait">
          {activeView === 'explorer' && (
            <Explorer 
              tabs={tabs} 
              activeTabId={activeTabId} 
              onSelectTab={setActiveTabId} 
              onAddTab={addTab}
            />
          )}
        </AnimatePresence>

        {/* Center Workspace (Editor + Bottom Panel) */}
        <div className="flex-1 flex flex-col min-w-0">
          <TabBar 
            tabs={tabs} 
            activeTabId={activeTabId} 
            onSwitch={setActiveTabId} 
            onClose={closeTab} 
            onAdd={addTab}
          />
          
          <div className="flex-1 relative overflow-hidden bg-[#1e1e1e]">
            <CodeEditor 
              content={activeTab.content} 
              language={activeTab.language} 
              theme="dark"
              onChange={updateContent}
            />
          </div>

          <BottomPanel 
            stdin={stdin} 
            setStdin={setStdin} 
            result={output} 
            executionMetrics={output.metrics} 
          />
        </div>

        {/* Right Panel (Output + AI) */}
        <RightPanel 
          output={output}
          code={activeTab.content}
          language={activeTab.language}
        />
      </div>
    </div>
  );
}

export default App;
