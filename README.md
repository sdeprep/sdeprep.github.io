# SDE - Speed Run Interview Prep

A voice-enabled coding interview preparation platform designed for **speed run revision**. Practice algorithmic problems with minimal tokens while covering everything exhaustively - perfect for quick review sessions before interviews.

## Features

- 🎯 **Speed Run Format**: Problems condensed to essential information using minimal tokens
- 🎤 **Voice Interface**: Navigate and interact using speech recognition  
- 📚 **Categorized Problems**: Organized by algorithm type (Trees, Graphs, DP, etc.)
- ⚡ **Quick Revision**: Exhaustive coverage in minimal time
- 💾 **Auto-Save**: Your code is automatically saved as you type
- 🎨 **Solarized Theme**: Beautiful dark/light themes optimized for coding

## Problem Format

Each problem follows a concise format optimized for speed revision:
```
"""
- Task: [what to do]
- Constraint: [key limitations] 
- Example:
  - Input: [sample input]
  - Output: [expected output]
"""
```

This repository contains a React frontend located in the `frontend/` directory.

## Local Development

Run the app locally with the following commands:

```bash
cd frontend
npm install
npm run dev
```


## Deployment

The site is automatically built and deployed to **GitHub Pages** whenever changes are pushed to the `main` branch. The workflow configuration lives in `.github/workflows/deploy.yml`. GitHub Pages hosts the production website, while GitHub Actions provides the continuous integration and deployment pipeline.

The project uses **Node.js 22**. Ensure this version is installed locally so commands like `npm run build` behave consistently with the CI workflow.
