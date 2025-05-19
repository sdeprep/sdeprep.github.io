# SDE

This repository contains a React frontend located in the `frontend/` directory.

## Local Development

Run the app locally with the following commands:

```bash
cd frontend
npm install
npm run dev
```

You can also batch‑transcribe audio files using `content_generation/transcribe_audio_folder.py`:

```bash
python content_generation/transcribe_audio_folder.py
```

## Deployment

The site is automatically built and deployed to **GitHub Pages** whenever changes are pushed to the `main` branch. The workflow configuration lives in `.github/workflows/deploy.yml`. GitHub Pages hosts the production website, while GitHub Actions provides the continuous integration and deployment pipeline.

The project uses **Node.js 22**. Ensure this version is installed locally so commands like `npm run build` behave consistently with the CI workflow.
