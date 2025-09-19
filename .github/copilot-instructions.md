# yoohoo.guru Platform - Copilot Instructions

These custom instructions provide GitHub Copilot with the context and guidelines it needs to work effectively in this repository. According to GitHub’s guidance, instructions should be short, self‑contained statements because Copilot appends them to every request
docs.github.com
. The structure below follows recommended best practices: describe your project, tech stack, coding standards, project structure and available resources
docs.github.com
github.blog
.

Project Overview

The yoohoo.guru platform is a full‑stack community marketplace where users exchange skills, discover purpose and create local impact. It includes a skill‑sharing marketplace, a “Guru” dashboard for teachers and coaches, an “Angel’s List” service marketplace and supporting subdomains. The web app uses React with Webpack on the front end and a Node.js/Express API backend with Firebase integration
GitHub
. Key features include:

Skill sharing marketplace: connect community members for skill exchange.

Firebase authentication: secure user management and authentication.

Stripe payments: process premium features and subscriptions.

AI‑powered recommendations: match users and skills using OpenRouter.

PWA support: mobile‑friendly with offline capabilities.

Enterprise‑grade security: rate limiting, CORS protection and input validation.

Environment‑driven configuration: uses .env files for secrets and settings
GitHub
.

Tech Stack in Use

Identify the tech stack so Copilot understands the environment
github.blog
. This project uses:

Frontend: React (with Webpack and styled‑components), JavaScript/TypeScript, PWA features.

Backend: Node.js with Express; RESTful API endpoints.

Data & Auth: Firebase for authentication and basic data; Stripe for payments.

Infrastructure: Vercel for the frontend (Next.js alternative) and Railway for backend deployments.

Testing: Jest and React Testing Library for unit tests; Playwright for end‑to‑end tests.

Project Structure

Copilot benefits from knowing where code lives in the repository
github.blog
. Main directories include
GitHub
:

frontend/ – React front‑end application.

src/components/ – reusable UI components.

src/screens/ – page components.

src/contexts/ – React contexts (e.g., authentication).

src/utils/ – front‑end utilities.

public/ – static assets.

webpack.config.js – webpack configuration.

backend/ – Node.js/Express API.

src/config/ – configuration management.

src/routes/ – API route handlers.

src/middleware/ – Express middleware.

src/utils/ – utilities and helpers.

src/lib/ – business‑logic libraries.

tests/ – backend tests.

docs/ – documentation such as deployment guides and environment variables.

.env.example – template for environment variables.

Coding Standards and Conventions

Spell out your coding guidelines clearly so Copilot adheres to your standards
github.blog
. In this project:

Follow the eslint recommended rules for Node.js and React. Use .eslintrc.js for configuration.

Use semicolons at the end of statements and single quotes for strings where possible.

Prefer arrow functions for callbacks and functional components.

Use async/await instead of callbacks or .then() for asynchronous operations.

Keep components and functions small and focused; adhere to the SOLID principles where applicable.

Write comprehensive unit tests (Jest/React Testing Library) and end‑to‑end tests (Playwright) before submitting code.

Use type hints in TypeScript and annotate functions in JavaScript with JSDoc where appropriate.

Follow RESTful API conventions for endpoints; use camelCase for variables and functions and PascalCase for classes/components.

Document complex logic using comments and keep documentation in docs/ up to date.

Workplan and Pull‑Request Discipline

Use Copilot to help implement tasks but ensure it follows the workplan and does not introduce unapproved changes. GitHub advises that instructions should avoid conflicting directives
docs.github.com
. Enforce these policies:

Follow the roadmap: Work on tasks in the order specified by the user; do not skip ahead or introduce unrelated tasks.

No speculative conditionals: When the repository provides the answer, do not respond with “if” statements or alternatives. Provide the exact, relevant answer. Only use conditionals when the user asks for options
docs.github.com
.

Approval for major changes: Schema migrations, architecture rewrites, dependency upgrades and framework changes require explicit approval from the repository owner before coding.

Full pull requests: PRs should be production‑ready, thoroughly tested and well documented. Do not submit incomplete or micro‑PRs.

Error acknowledgement: If a mistake occurs, acknowledge it promptly and propose a fix. Never leave the repository in a broken state.

Consistent naming and style: Maintain consistent naming conventions and project structure. Do not introduce one‑off patterns without approval.

Prohibited behaviours: Truncating instructions, stonewalling user requests compatible with the repository, injecting irrelevant alternatives, or proceeding with major changes without approval constitute insubordination and will not be tolerated.

Resources and Helpful Scripts

Point Copilot to existing scripts and resources to speed up work
github.blog
. Important resources include:

scripts/start-app.sh – installs dependencies and starts the app.

scripts/setup-env.sh – installs dependencies for local development.

scripts/test-project.sh – runs unit and e2e tests.

Documentation files in docs/ (e.g., DEPLOYMENT.md, ENVIRONMENT_VARIABLES.md, RAILWAY_DEPLOYMENT.md, FIREBASE_POLICY.md). These explain deployment setups, environment variables, and Firebase policies.

MCP servers and automation scripts (e.g., Playwright server for test generation) can be referenced when using Copilot coding agents
github.blog
.

Best Practices for Custom Instructions

GitHub suggests including a project overview, tech stack, coding guidelines, project structure and available resources in a custom instructions file
github.blog
. Remember:

Keep each instruction short and self‑contained
docs.github.com
.

Only include instructions that apply broadly to most requests; avoid over‑specifying edge cases.

Update this file as the project evolves; it is better to start with an imperfect file and iterate than to leave it empty
github.blog
.

Avoid references to external repositories or resources that Copilot cannot access
docs.github.com
.

Multiple instruction files can exist (path‑specific or agent‑specific), but keep this repository‑wide file focused on information relevant across the entire codebase
docs.github.com
.