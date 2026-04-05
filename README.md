# Zorvyn Financial Dashboard API

A powerful, secure, and scalable backend API for a Financial Dashboard, featuring role-based access control (RBAC), authentication, and detailed financial analytics.

**Live Backend URL:** [https://zorvyn-dashboard-9fka.onrender.com/](https://zorvyn-dashboard-9fka.onrender.com/)

## Features

- **Robust Authentication**: Secure registration and login using JWT (JSON Web Tokens) and Bcrypt for password hashing.
- **Role-Based Access Control (RBAC)**:
  - `Admin`: Full control over users and transactions.
  - `Analyst`: Access to detailed financial analytics and reports.
  - `Viewer`: Basic access to summaries and recent activity.
- **Transaction Management**: Full CRUD operations for financial transactions (Income/Expenses).
- **Dashboard Analytics**: Summarized data, category totals, monthly trends, and recent activity trackers.
- **Scalable Architecture**: Organized using the Controller-Service-Route pattern for clean code and maintainability.

---

## Technology Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (using [Mongoose ODM](https://mongoosejs.com/))
- **Security**: JWT for auth, Bcrypt for hashing, CORS for origin protection.
- **Environment**: Dotenv for configuration management.

---

## Project Structure

```text
zorvyn-dashboard/
├── backend/
│   ├── config/         # Database configuration
│   ├── controller/     # Logic for handling requests
│   ├── middleware/     # Auth & Authorization guards
│   ├── models/         # Mongoose schemas (User, Transaction)
│   ├── routes/         # Endpoint definitions
│   ├── server.js       # Entry point
│   └── .env            # Environment variables (Internal only)
├── package.json        # Main scripts
└── README.md           # Documentation
```

---

## Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account or local MongoDB instance.

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Ankit00890/zorvyn-dashboard.git
   cd zorvyn-dashboard
   ```

2. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the `backend/` directory and add the following:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   ```

4. **Run the application**:
   ```bash
   # Development mode (with nodemon)
   npm run dev
   
   # Production mode
   npm start
   ```

---

## API Documentation

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/register` | Register a new user | Public |
| POST | `/login` | Authenticate user & get token | Public |
| GET | `/me` | Get current logged-in user details | Private |

**User Roles**: `viewer`, `analyst`, `admin`

### Users (`/api/users`) - Admin Only
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| GET | `/` | Get list of all users | Admin |
| GET | `/:id` | Get single user by ID | Admin |
| PUT | `/:id` | Update user details/roles | Admin |
| DELETE| `/:id` | Delete user | Admin |

### Transactions (`/api/transactions`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| GET | `/` | List all transactions | Private |
| GET | `/:id` | Get transaction details | Private |
| POST | `/` | Create a new transaction | Admin |
| PUT | `/:id` | Update existing transaction | Admin |
| DELETE| `/:id` | Soft delete transaction | Admin |

### Dashboard Analytics (`/api/dashboard`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| GET | `/summary` | Get high-level balance summary | Private |
| GET | `/recent` | Get 5 most recent activities | Private |
| GET | `/category-totals` | Analytics based on categories | Analyst/Admin |
| GET | `/monthly-trends` | Financial trends over time | Analyst/Admin |

---

## Assumptions & Design Decisions

### Assumptions Made
- **Database**: MongoDB Atlas is used for persistence, assuming users will provide their own connection string.
- **Roles**: Roles are predefined as `viewer`, `analyst`, and `admin`. Defaults to `viewer` on registration.
- **Delete Policy**: The system uses soft deletes for transactions (setting `isDeleted: true`) to preserve historical data integrity.

### Tradeoffs Considered
- **Monolith Architecture**: Decided on a modular monolith for simplicity and speed of development. While microservices offer better scale, they introduce unnecessary complexity for a dashboard of this scope.
- **JWT vs. Sessions**: JWT was chosen for stateless authentication, which scales better across multiple servers and works seamlessly with modern client-side application frontends.
- **Inline Logic vs Services**: Logic is kept in controllers for now to keep the codebase lean and readable, given the current complexity level. If business logic grows, a separate service layer would be the next step for refactoring.

---

## License
Distributed under the ISC License. See `LICENSE` for more information.

---
Created by [Ankit](https://github.com/Ankit00890)
