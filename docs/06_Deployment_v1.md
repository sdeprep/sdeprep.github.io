# Deployment Plan (Version 1)

The website is hosted on **GitHub Pages**. A GitHub Actions workflow (`.github/workflows/deploy.yml`) builds the frontend and publishes the static files to Pages whenever commits reach the `main` branch.

1. **Build Step** – The workflow installs dependencies, runs `npm run build` and uploads the resulting `dist/` folder as an artifact.
2. **Deploy Step** – The `deploy-pages` action publishes the artifact to GitHub Pages.

This setup provides a lightweight CI/CD pipeline with no separate servers to manage.
