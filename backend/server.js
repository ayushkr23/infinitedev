const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Serve the built React frontend
app.use(express.static(path.join(__dirname, '..', 'frontend-v2', 'dist')));

const TEMP_DIR = path.join(__dirname, 'temp');
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR);
}

const config = {
    python: { command: 'python', extension: 'py' },
    javascript: { command: 'node', extension: 'js' },
    c: { command: 'gcc', extension: 'c', outExtension: 'exe' },
    cpp: { command: 'g++', extension: 'cpp', outExtension: 'exe' },
    java: { command: 'javac', extension: 'java' }
};

const pidusage = require('pidusage');

app.post('/execute', async (req, res) => {
    const { language, code, stdin } = req.body;

    if (!config[language]) {
        return res.status(400).json({ error: 'Unsupported language' });
    }

    const id = uuidv4();
    const fileName = `${id}.${config[language].extension}`;
    const filePath = path.join(TEMP_DIR, fileName);

    fs.writeFileSync(filePath, code);

    let startTime = Date.now();

    try {
        if (language === 'c' || language === 'cpp') {
            const outPath = path.join(TEMP_DIR, `${id}.exe`);
            const compile = spawn(config[language].command, [filePath, '-o', outPath]);

            let compileError = '';
            compile.stderr.on('data', (data) => { compileError += data.toString(); });

            compile.on('close', (code) => {
                if (code !== 0) {
                    res.json({ error: compileError, type: 'Compilation Error', success: false });
                    cleanup([filePath, outPath]);
                } else {
                    runExecutable(outPath, stdin, res, [filePath, outPath], startTime);
                }
            });
        } else if (language === 'java') {
            const finalJavaPath = path.join(TEMP_DIR, 'Main.java');
            fs.writeFileSync(finalJavaPath, code);
            const compile = spawn('javac', [finalJavaPath]);
            let compileError = '';
            compile.stderr.on('data', (data) => { compileError += data.toString(); });

            compile.on('close', (code) => {
                if (code !== 0) {
                    res.json({ error: compileError, type: 'Compilation Error', success: false });
                    cleanup([filePath, finalJavaPath, path.join(TEMP_DIR, 'Main.class')]);
                } else {
                    runExecutable('java', stdin, res, [filePath, finalJavaPath, path.join(TEMP_DIR, 'Main.class')], startTime, ['-cp', TEMP_DIR, 'Main']);
                }
            });
        } else {
            runExecutable(config[language].command, stdin, res, [filePath], startTime, [filePath]);
        }
    } catch (err) {
        res.status(500).json({ error: err.message, type: 'Internal Server Error' });
    }
});

function runExecutable(command, stdin, res, filesToCleanup, startTime, args = []) {
    const child = spawn(command, args);
    let output = '';
    let error = '';
    let maxMemory = 0;

    if (stdin) {
        child.stdin.write(stdin);
        child.stdin.end();
    }

    const interval = setInterval(() => {
        if (child.pid) {
            pidusage(child.pid, (err, stats) => {
                if (!err && stats) {
                    maxMemory = Math.max(maxMemory, stats.memory);
                }
            });
        }
    }, 100);

    child.stdout.on('data', (data) => { output += data.toString(); });
    child.stderr.on('data', (data) => { error += data.toString(); });

    const timeout = setTimeout(() => {
        child.kill();
        clearInterval(interval);
        res.json({ error: 'Execution Timeout (Limit: 10s)', type: 'Timeout Error', success: false });
        cleanup(filesToCleanup);
    }, 10000);

    child.on('close', (code) => {
        clearTimeout(timeout);
        clearInterval(interval);
        const duration = Date.now() - startTime;
        
        // Final memory check
        if (child.pid) {
            pidusage(child.pid, (err, stats) => {
                if (!err && stats) maxMemory = Math.max(maxMemory, stats.memory);
                pidusage.clear();
                
                res.json({
                    output,
                    error,
                    success: code === 0,
                    duration: `${duration}ms`,
                    memory: `${(maxMemory / 1024 / 1024).toFixed(2)} MB`,
                    type: code === 0 ? 'Success' : 'Runtime Error'
                });
                cleanup(filesToCleanup);
            });
        } else {
            res.json({
                output,
                error,
                success: code === 0,
                duration: `${duration}ms`,
                memory: '0 MB',
                type: code === 0 ? 'Success' : 'Runtime Error'
            });
            cleanup(filesToCleanup);
        }
    });
}

app.post('/ai-help', async (req, res) => {
    const { action, code, error, language } = req.body;
    
    let prompt = "";
    if (action === 'explain-code') {
        prompt = `Explain the following ${language} code clearly and concisely:\n\n${code}`;
    } else if (action === 'explain-error') {
        prompt = `Explain this error for the following ${language} code:\n\nError: ${error}\n\nCode:\n${code}`;
    } else if (action === 'suggest-fix') {
        prompt = `Suggest a fix for this error in the following ${language} code:\n\nError: ${error}\n\nCode:\n${code}\n\nProvide the corrected code snippet.`;
    }

    // Since I don't have an API key, I'll provide a helpful mock response or use a placeholder logic.
    // In a real scenario, this would call OpenAI/Gemini/Anthropic.
    
    const mockResponses = {
        'explain-code': "This code seems to be initializing a simple greeting. It uses the standard output of the language to display 'Hello, InfiniteDev!'.",
        'explain-error': "The error typically occurs when there's a syntax mismatch or a missing dependency. Check your semicolons and imports.",
        'suggest-fix': "Try wrapping your logic in a try-catch block or ensuring all variables are declared before use."
    };

    res.json({ response: mockResponses[action] || "I'm not sure how to help with that yet." });
});

function cleanup(files) {
    files.forEach(file => {
        if (fs.existsSync(file)) {
            try { fs.unlinkSync(file); } catch (e) {}
        }
    });
}

// Catch-all: serve React app for any non-API route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend-v2', 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`InfiniteDev server running on port ${PORT}`);
});
