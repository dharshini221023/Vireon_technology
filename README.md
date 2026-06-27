# Vireon Technologies – Full-Stack Website

A complete enterprise technology company website with a Node.js/Express backend.

---

## Project Structure

```
vireon-technologies/
├── server.js                 # Express app entry point
├── package.json
├── .env.example              # Copy to .env and configure
├── .gitignore
├── public/
│   └── index.html            # Complete single-page frontend
└── backend/
    ├── routes/
    │   ├── contact.js        # Contact form submissions
    │   ├── newsletter.js     # Newsletter subscriptions
    │   ├── careers.js        # Job listings & applications
    │   ├── insights.js       # Blog / insights articles
    │   └── auth.js           # Client portal login
    ├── middleware/
    │   ├── validate.js       # Input validation (express-validator)
    │   └── mailer.js         # Email sending (Nodemailer)
    └── data/
        └── store.js          # In-memory data store (replace with DB in prod)
```

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your SMTP credentials and settings
```

### 3. Start the server
```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

### 4. Open in browser
```
http://localhost:3000
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/contact` | Submit contact form |
| GET | `/api/contact` | List all contacts (admin) |
| POST | `/api/newsletter/subscribe` | Subscribe to newsletter |
| GET | `/api/newsletter` | List subscribers (admin) |
| GET | `/api/careers` | List job openings |
| GET | `/api/careers/:id` | Get single job |
| POST | `/api/careers/:id/apply` | Submit job application |
| GET | `/api/insights` | List blog articles |
| GET | `/api/insights/:slug` | Get single article |
| POST | `/api/auth/login` | Client portal login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/health` | API health check |

---

## Demo Login Credentials

| Email | Password | Role |
|-------|----------|------|
| `demo@vireon.com` | `Vireon2026!` | Client |
| `admin@vireon.com` | `AdminVireon2026!` | Admin |

---

## Email Configuration (SMTP)

In `.env`, set your SMTP provider credentials:

**Gmail (App Password):**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-16-char-app-password
```

> Without SMTP credentials, emails are skipped but all API logic still works — submissions are stored in memory and logged to the console.

---

## Production Deployment

For production, replace the in-memory store in `backend/data/store.js` with a real database:

- **PostgreSQL** – Use `pg` or `prisma`
- **MongoDB** – Use `mongoose`
- **SQLite** – Use `better-sqlite3` for a zero-config option

Also:
- Set `NODE_ENV=production` in `.env`
- Use a process manager like **PM2**: `pm2 start server.js`
- Put Nginx or Caddy in front as a reverse proxy
- Enable HTTPS

---

## Tech Stack

**Frontend**
- Vanilla HTML/CSS/JS (SPA with page routing)
- Font Awesome 6.5 icons
- Google Fonts (Poppins, Inter, Montserrat)

**Backend**
- Node.js + Express 4
- express-validator (input validation)
- Nodemailer (email)
- Helmet (security headers)
- express-rate-limit (rate limiting)
- morgan (request logging)

---

© 2026 Vireon Technologies. All rights reserved.
