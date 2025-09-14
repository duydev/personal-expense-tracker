# Personal Expense Tracker

## Overview

Personal Expense Tracker is a user-centric application designed to help individuals track and manage their daily expenses and incomes efficiently. The project focuses on simplicity, data security, and practical value, enabling users to gain better control over their personal finances.

## Main Features (MVP)

### 1. User Management

- **Sign Up:** Register with email/password or social login (Google/Apple).
- **Login/Logout:** Secure authentication and session management (JWT, Redis cache).
- **Forgot/Reset Password:** Easily reset password via email.

### 2. Transaction Management

- **Add Transaction:** Record expenses/incomes with amount, date, description, and category.
- **Edit/Delete Transaction:** Update or soft-delete entries to maintain accurate records.
- **Categories:** Manage default and custom categories for transactions.

### 3. Reporting & Analytics

- **Dashboard:** View monthly income/expense summary and pie chart by category.
- **Transaction History:** Filterable list of transactions by date/month/category.
- **Monthly Reports:** Generate and receive PDF/email reports with financial summaries.

### 4. (Optional) Budget Management

- **Set Budgets:** Define budgets per category/month and receive alerts when exceeded.
- **Reminders:** Get notifications for upcoming bills or low budgets.

## Non-Functional Requirements

- **Performance:** Dashboard loads in under 2 seconds (Redis caching).
- **Security:** Encrypted sensitive data, HTTPS API, role-based access.
- **Usability:** Responsive UI (mobile-first, React), multi-language support (EN/VI).
- **Scalability:** Flexible DB schema, cloud-ready deployment.
- **Testing:** Unit tests (NestJS API), integration tests (DB), E2E tests (Frontend).

## Tech Stack

- **Backend:** NestJS (API), PostgreSQL (DB), Redis (cache/session)
- **Frontend:** React (TypeScript, Chart.js)
- **Other:** Nodemailer (email), Schedule jobs (NestJS), Cloud deployment (Heroku/AWS)

## Getting Started

_Setup and usage instructions coming soon._
