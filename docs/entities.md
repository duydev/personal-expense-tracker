# Project Entities and Relationships

This document describes the main entities in the Personal Expense Tracker project and the relationships between them. This overview is intended for developers and contributors to understand the data model and how different parts of the system interact.

## 1. User

- **Description:** Represents a registered user of the application.
- **Key Fields:**
  - `id`: Unique identifier
  - `email`: User's email address
  - `password`: Hashed password
  - `name`: User's display name
- **Relationships:**
  - A user can have many expense records (future feature).
  - A user may have roles or permissions (future feature).

## 2. Expense (Planned)

- **Description:** Represents a single expense entry recorded by a user.
- **Key Fields:**
  - `id`: Unique identifier
  - `userId`: Reference to the user who owns the expense
  - `amount`: Expense amount
  - `categoryId`: Reference to the category
  - `date`: Date of the expense
  - `description`: Optional note
- **Relationships:**
  - Belongs to a user
  - Belongs to a category

## 3. Category (Planned)

- **Description:** Represents a category for classifying expenses (e.g., Food, Transport).
- **Key Fields:**
  - `id`: Unique identifier
  - `name`: Category name
  - `userId`: (optional) If categories are user-specific
- **Relationships:**
  - Can be shared or user-specific
  - Has many expenses

## 4. Other Planned Entities

- **Budget:** For tracking planned vs. actual spending.
- **Income:** For recording income transactions.
- **RecurringExpense:** For scheduled repeating expenses.

## Entity Relationship Diagram (ERD)

```
User 1---* Expense *---1 Category
```

- A **User** can have many **Expenses**.
- Each **Expense** belongs to one **User** and one **Category**.
- A **Category** can have many **Expenses**.

> **Note:** Currently, only the `User` entity is implemented in the codebase (`packages/api/src/users/entities/user.entity.ts`). Other entities are planned for future development. Update this document as new entities are added.
