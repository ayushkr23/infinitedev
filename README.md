<div align="center">

# ⚡ InfiniteDev

### Multi-Language Online Compiler & IDE

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://infinitedev.onrender.com/)

*A sleek, cyberpunk-themed online IDE that lets you write, compile, and execute code in multiple languages — right in your browser.*

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🖥️ **Monaco Editor** | VS Code-grade editor with syntax highlighting, autocomplete, bracket matching |
| 🌐 **5 Languages** | C, C++, Java, Python, JavaScript |
| 📊 **Execution Metrics** | Real-time CPU time & memory usage tracking |
| 🤖 **AI Assistant** | Code explanation, error analysis & fix suggestions |
| 🎨 **Cyberpunk UI** | Glitch effects, scanlines, glassmorphic components, Framer Motion animations |
| 📁 **Multi-Tab** | Open and manage multiple files simultaneously |
| 📥 **Code Tools** | Download, copy, and share your code |
| ⌨️ **Stdin Support** | Interactive input for programs that read from stdin |

---

## 🛠️ Tech Stack

**Frontend:**
- React 19 + Vite 8
- TailwindCSS 3
- Monaco Editor
- Framer Motion
- Lucide Icons

**Backend:**
- Node.js + Express
- Local compilers (gcc, g++, javac, python, node)
- Process-level memory tracking via `pidusage`

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- gcc / g++ (for C/C++)
- JDK (for Java)
- Python 3

### Installation

```bash
# Clone the repo
git clone https://github.com/ayushkr23/infinitedev.git
cd infinitedev

# Install all dependencies
npm run install:all

# Build the frontend
npm run build

# Start the server
npm start
```

The app will be running at `http://localhost:5000`

### Development Mode

```bash
# Terminal 1: Start the backend
cd backend && node server.js

# Terminal 2: Start the frontend dev server
cd frontend-v2 && npm run dev -- --port 3001
```

---

## 📁 Project Structure

```
infinitedev/
├── backend/
│   ├── server.js          # Express API + code execution engine
│   ├── temp/              # Temporary files for compilation
│   └── package.json
├── frontend-v2/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Top bar with glitch logo & language selector
│   │   │   ├── ActivityBar.jsx     # VS Code-style sidebar icons
│   │   │   ├── Explorer.jsx        # File tree panel
│   │   │   ├── BottomPanel.jsx     # Stdin input & execution info
│   │   │   ├── RightPanel.jsx      # Output terminal & AI assistant
│   │   │   └── CustomSelect.jsx    # Glassmorphic language dropdown
│   │   ├── App.jsx                 # Main layout & state management
│   │   ├── main.jsx                # Entry point
│   │   └── index.css               # Glitch effects, scanlines & theme
│   ├── tailwind.config.js
│   └── package.json
├── package.json            # Root scripts for build & deploy
├── render.yaml             # Render.com deployment config
└── .gitignore
```

---

## 🌐 Deployment

### Render.com (Recommended)

1. Push to GitHub
2. Connect repo on [render.com](https://render.com)
3. Render auto-detects `render.yaml` and configures:
   - **Build:** `npm run install:all && npm run build`
   - **Start:** `npm start`

> ⚠️ **Note:** Free tier supports Python & JavaScript execution. For C/C++/Java, use a VPS with compilers installed.

---

## 📸 Screenshots

<div align="center">
  <i>Cyberpunk-themed IDE with glitch effects and glassmorphic UI</i>
</div>

---

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/execute` | Execute code (body: `{ language, code, stdin }`) |
| `POST` | `/ai-help` | AI assistance (body: `{ action, code, error, language }`) |

---

## 📄 License

ISC

---

<div align="center">

**Built with ❤️ by [Ayush Kumar](https://github.com/ayushkr23)**

</div>
