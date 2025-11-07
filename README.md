Here’s a **condensed README** version suitable for quick submission while covering all the key requirements:

````markdown
# MERN Blog Assignment

Full-stack **MERN blog** with JWT authentication, file uploads, comments, pagination, and Tailwind CSS UI.

---

## Features

- User registration/login (JWT)
- CRUD posts with featured images (Multer)
- Pagination & search
- Add comments
- Tailwind CSS responsive UI
- React Router navigation

---

## Setup

### 1. Clone

```bash
git clone https://github.com/PLP-MERN-Stack-Development/mern-stack-integration-Sim047.git
cd mern-blog
````

### 2. Backend

```bash
cd server
npm install
```

Create `.env`:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
UPLOAD_DIR=uploads
```

Start server:

```bash
npm run dev
```

### 3. Frontend

```bash
cd ../client
npm install
```

Create `.env`:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

Start frontend:

```bash
npm run dev
```

---

## Usage

* Open `http://localhost:5173`
* Register/login
* Create, edit, delete posts (if logged in)
* Search posts, navigate pages, view/add comments

---

## Notes

* Images stored in `/server/uploads/`
* JWT token in `localStorage`
* REST API:

  * `POST /api/auth/register`
  * `POST /api/auth/login`
  * `GET/POST/PUT/DELETE /api/posts`
  * `POST /api/posts/:id/comments`

---

## Tech

React, Tailwind, Axios, Node.js, Express, MongoDB, Mongoose, JWT, Multer

```
