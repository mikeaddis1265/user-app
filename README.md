# Next.js Blog API with JWT Authentication

A full-featured blog API built with Next.js featuring user authentication, post management, and comment functionality.

## Features

- 🔐 JWT Authentication (Register, Login)
- 📝 CRUD Operations for Blog Posts
- 💬 Post Comments System
- 👥 User Management (Admin)
- 🔍 Search & Filter Posts
- 🔒 Protected API Routes

## API Endpoints

### Authentication
| Method | Endpoint                | Description           | Auth Required |
|--------|-------------------------|-----------------------|---------------|
| POST   | `/api/auth/register`    | Register new user     | No            |
| POST   | `/api/auth/login`       | Login user (get JWT)  | No            |

### Posts
| Method | Endpoint                | Description                          | Auth Required |
|--------|-------------------------|--------------------------------------|---------------|
| GET    | `/api/posts`            | Get all posts (filterable/searchable)| No            |
| GET    | `/api/posts/:id`        | Get single post                      | No            |
| POST   | `/api/posts`            | Create new post                      | Yes           |
| PATCH  | `/api/posts/:id`        | Update post                          | Yes           |
| DELETE | `/api/posts/:id`        | Delete post                          | Yes           |

### Comments
| Method | Endpoint                        | Description                | Auth Required |
|--------|---------------------------------|----------------------------|---------------|
| GET    | `/api/posts/:id/comments`       | Get all comments for post  | No            |
| POST   | `/api/posts/:id/comments`       | Add comment to post        | Yes           |

### Users (Admin)
| Method | Endpoint          | Description          | Auth Required |
|--------|-------------------|----------------------|---------------|
| GET    | `/api/users`      | Get all users        | Yes           |
| GET    | `/api/users/:id`  | Get single user      | Yes           |
| PATCH  | `/api/users/:id`  | Update user          | Yes           |
| DELETE | `/api/users/:id`  | Delete user          | Yes           |

## Query Parameters for Posts

- `search`: Search term in title/content
- `category`: Filter by category
- `page`: Pagination page number
- `pageSize`: Items per page
- `sortBy`: Field to sort by (`createdAt`, `title`)
- `sortOrder`: `asc` or `desc`

Example: `/api/posts?search=AI&category=tech&page=1&pageSize=5&sortBy=createdAt&sortOrder=desc`

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm/yarn/pnpm

### Installation
1. Clone the repository
2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install