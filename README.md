![Build](https://img.shields.io/github/actions/workflow/status/duydev/personal-expense-tracker/ci.yml?branch=main&label=build)
![Tests](https://img.shields.io/badge/tests-passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-80%25-brightgreen)
![License](https://img.shields.io/github/license/duydev/personal-expense-tracker)
![Tech Stack](https://img.shields.io/badge/stack-NestJS%20%7C%20React%20%7C%20PostgreSQL%20%7C%20Redis-blue)

# Personal Expense Tracker

## Overview

Personal Expense Tracker is a modern, full-stack application to help individuals track, analyze, and manage their personal finances. Built with a focus on simplicity, security, and actionable insights, it empowers users to:

- Record daily expenses and incomes
- Visualize spending patterns and trends
- Set budgets and receive alerts
- Access their data securely from any device

**Why use this project?**

- 🚀 Fast, mobile-first UI (React + Vite)
- 🔒 Secure authentication (JWT, Redis, encrypted data)
- 📊 Rich analytics and PDF/email reporting
- 🛠️ Easily extensible and cloud-ready

## Features

### User Management

- Register with email/password or social login (Google/Apple)
- Secure login/logout with JWT and Redis session management
- Forgot/reset password via email

### Transaction Management

- Add, edit, or delete expenses and incomes
- Categorize transactions (default/custom categories)
- Filter and search transaction history

### Reporting & Analytics

- Dashboard with monthly summaries and pie charts
- Filterable transaction history by date/month/category
- Generate PDF/email reports

### Budget & Reminders (Optional)

- Set monthly/category budgets and get alerts
- Receive reminders for bills or low budgets

## Non-Functional Requirements

- **Performance:** Fast dashboard (Redis caching, optimized queries)
- **Security:** Encrypted data, HTTPS, RBAC, secure sessions
- **Usability:** Responsive, mobile-first UI, multi-language (EN/VI)
- **Scalability:** Modular backend, cloud-ready, flexible DB
- **Testing:** Unit, integration, and E2E tests (NestJS, Jest)

## Tech Stack

- **Backend:** [NestJS](https://nestjs.com/) (API), [PostgreSQL](https://www.postgresql.org/) (DB), [Redis](https://redis.io/) (cache/session)
- **Frontend:** [React](https://react.dev/) (TypeScript, [Chart.js](https://www.chartjs.org/))
- **Other:** [Nodemailer](https://nodemailer.com/) (email), scheduled jobs (NestJS), cloud deployment (Heroku/AWS)

## Getting Started

### Prerequisites

- Node.js v18+
- Yarn v1.22+
- PostgreSQL & Redis (local or Docker)

### Installation

```bash
# Clone the repo
git clone https://github.com/duydev/personal-expense-tracker.git
cd personal-expense-tracker

# Install dependencies
yarn install

# Copy and edit environment variables
cp .env.example .env
# (edit .env as needed for DB, Redis, etc)

# Start backend (NestJS API)
yarn dev:api
# Start frontend (React/Vite)
yarn dev:frontend
```

### Running Tests

```bash
# Run all unit tests
yarn workspace api test
# Run with coverage
yarn workspace api test --coverage
```

### Project Structure

- `packages/api` — NestJS backend (TypeORM, PostgreSQL, Redis)
- `packages/frontend` — React + Vite frontend

## Contributing

Contributions are welcome! Please open issues or pull requests for features, bug fixes, or documentation improvements.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
