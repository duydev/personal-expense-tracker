# Software Requirements Specification (SRS) for Personal Expense Tracker

## 1. Introduction

### 1.1 Purpose

This document outlines the software requirements for the **Personal Expense Tracker**, a Minimum Viable Product (MVP) designed to help users track and manage their daily expenses and income. The application aims to provide a simple, effective way to monitor spending, analyze financial patterns, and maintain control over personal finances. This SRS serves as the foundation for the design, development, and testing of the system.

### 1.2 Scope

**In Scope:**

- Basic user management
- Transaction recording and management
- Simple data analysis
- Monthly reporting

**Out of Scope:**

- Bank integration
- Online payments
- Multi-user collaboration (team features)
- Advanced features like AI-based spending predictions (potential post-MVP extensions)

**Tech Stack:**

- **Backend:** NestJS (API)
- **Database:** PostgreSQL
- **Cache:** Redis
- **Frontend:** Vite + React + TypeScript

### 1.3 Definitions and Acronyms

- **MVP:** Minimum Viable Product – A product with just enough features to satisfy early users.
- **API:** Application Programming Interface.
- **JWT:** JSON Web Token – Authentication mechanism.
- **CRUD:** Create, Read, Update, Delete – Core data operations.

### 1.4 References

No external references; requirements are based on user needs analysis and BA expertise.

### 1.5 Overview

This document provides a general description, functional requirements, and non-functional requirements for the Personal Expense Tracker.

## 2. Overall Description

### 2.1 Product Perspective

The Personal Expense Tracker is a user-centric tool designed to help individuals reduce financial waste by tracking expenses by category, viewing reports, and setting basic budgets. It targets individual users or small households, offering a simple, intuitive interface for both mobile and desktop use.

### 2.2 Product Functions

- Secure user registration and authentication
- Recording and managing income/expense transactions
- Data analysis through dashboards and reports
- Budget management and reminders (optional for MVP extension)

### 2.3 User Characteristics

- **Primary Users:** Individuals aged 18-50 interested in personal finance management
- **Assumptions:** Users have basic tech literacy (familiar with email and web apps)

### 2.4 Operating Environment

- **Frontend:** Web browsers (Chrome, Firefox, Safari) on desktop and mobile
- **Backend:** Node.js server with NestJS, deployed on cloud platforms (e.g., Heroku, AWS)
- **Database:** PostgreSQL (local or cloud-hosted, e.g., Supabase)
- **Cache:** Redis for performance optimization

### 2.5 Assumptions and Constraints

- **Assumptions:** Users have stable internet access
- **Constraints:** MVP development to be completed within 2-4 weeks, focusing on core features

## 3. Functional Requirements

The requirements are categorized by module, each including a description, user story, and implementation notes.

### 3.1 User Management Module

#### REQ-UM-01: User Registration

- **Description:** Users can create an account using email and password or via social login (Google/Apple)
- **User Story:** As a new user, I want to sign up quickly so that I can start tracking expenses without barriers
- **Implementation Notes:** API `POST /register`; Validate unique email; Store in PostgreSQL users table

#### REQ-UM-02: Login/Logout

- **Description:** Authenticate users and manage sessions
- **User Story:** As a returning user, I want to log in securely so that my data is protected
- **Implementation Notes:** API `POST /login` with JWT token; Redis for session storage

#### REQ-UM-03: Password Reset

- **Description:** Send a password reset link via email
- **User Story:** As a user who forgot my password, I want to reset it easily so that I don’t lose access
- **Implementation Notes:** API `POST /forgot-password`; Integrate email service (e.g., Nodemailer)

### 3.2 Transaction Management Module

#### REQ-TM-01: Add Transaction

- **Description:** Users can input income/expense transactions with amount, date, description, and category
- **User Story:** As a user, I want to add expenses/incomes on the go so that I can record them immediately
- **Implementation Notes:** API `POST /transactions`; Store in PostgreSQL transactions table; React form with TypeScript validation

#### REQ-TM-02: Edit/Delete Transaction

- **Description:** Users can edit or delete existing transactions
- **User Story:** As a user, I want to edit or delete mistakes so that my records are accurate
- **Implementation Notes:** API `PUT/DELETE /transactions/:id`; Use soft delete in PostgreSQL

#### REQ-TM-03: Transaction Categories

- **Description:** Manage a list of default and custom categories (e.g., food, entertainment)
- **User Story:** As a user, I want to categorize transactions so that I can analyze spending patterns
- **Implementation Notes:** API CRUD `/categories`; Cache category list in Redis

### 3.3 Reporting & Analytics Module

#### REQ-RA-01: Main Dashboard

- **Description:** Display total income/expense for the current month and a pie chart by category
- **User Story:** As a user, I want a quick overview dashboard so that I can see my financial health at a glance
- **Implementation Notes:** API `GET /dashboard`; Aggregate query in PostgreSQL (SUM/GROUP BY); Cache in Redis; Chart.js for frontend visualization

#### REQ-RA-02: Transaction History

- **Description:** List transactions with filters for date, month, or category
- **User Story:** As a user, I want to search and filter transactions so that I can review past spending
- **Implementation Notes:** API `GET /transactions` with query params; Implement pagination; Cache results in Redis

#### REQ-RA-03: Monthly Report

- **Description:** Generate and send a monthly summary report via email or PDF
- **User Story:** As a user, I want monthly reports so that I can track progress over time
- **Implementation Notes:** Use NestJS Schedule for cron jobs; Integrate PDF generation and email service

### 3.4 Budget Management Module (Optional for MVP Extension)

#### REQ-BM-01: Set Budget

- **Description:** Set budgets for categories per month, with alerts for overspending
- **User Story:** As a user, I want to set budgets so that I can control overspending
- **Implementation Notes:** API CRUD `/budgets`; Async notifications via Redis queue

#### REQ-BM-02: Reminders

- **Description:** Alerts for upcoming bills or low budgets
- **User Story:** As a user, I want reminders so that I don’t miss payments
- **Implementation Notes:** Cron job or Redis queue for notifications

## 4. Non-Functional Requirements

### 4.1 Performance

- Dashboard load time < 2 seconds (leveraging Redis cache)
- Support up to 1000 transactions per user without performance degradation

### 4.2 Security

- Encrypt passwords using bcrypt
- Use HTTPS for all API communications
- Restrict data access to the authenticated user (JWT authorization)

### 4.3 Usability

- Responsive interface (mobile-first design with React)
- Support for multiple languages (starting with English and Vietnamese)

### 4.4 Scalability

- Design flexible database schema with indexes on date/category for fast queries
- Cloud deployment compatibility (e.g., Heroku, AWS)

### 4.5 Testing

- Unit tests for NestJS APIs
- Integration tests for PostgreSQL interactions
- End-to-end tests for React frontend
