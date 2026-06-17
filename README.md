# MentorPath

A full-stack MERN mentor-mentee platform.

## Project Structure

```
mentorpath/
├── client/          # React + Vite frontend (port 5173)
└── server/          # Node + Express backend (port 5000)
```

## Quick Start

### 1. Set up the server
```bash
cd server
cp .env.example .env
# Fill in your .env values (MongoDB URI, JWT secret, etc.)
npm install
npm run dev
```

### 2. Set up the client
```bash
cd client
npm install
npm run dev
```

### 3. Open the app
Visit: http://localhost:5173

---

## Environment Variables (server/.env)

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Any long random string |
| `CLIENT_URL` | http://localhost:5173 (dev) |
| `CLOUDINARY_*` | From cloudinary.com (free account) |
| `STRIPE_SECRET_KEY` | From stripe.com (test key) |

---

## API Routes

| Method | Route | Access |
|---|---|---|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/mentors | Public |
| POST | /api/sessions | Mentee |
| GET | /api/mentor/earnings/me | Mentor |
| GET | /api/admin/dashboard | Admin |

---

## Pages (40 total)

**Public (5):** Landing, Explore, Mentor Profile, Login, Register

**Mentee (14):** Dashboard, Onboarding, Career Quiz, Explore, Book Session, Session Room, Leave Review, My Sessions, Messages, Saved Mentors, Roadmaps, Subscription, Notifications, Settings

**Mentor (12):** Apply, Status, Dashboard, Availability, Sessions, Session Room, Roadmap Builder, Messages, Earnings, Edit Profile, Pricing, Notifications

**Admin (8):** Dashboard, Applications, Users, Sessions, Revenue, Moderation, Analytics, Settings

**Shared (5):** 404, Terms, Privacy, Verify Email, Forgot/Reset Password
