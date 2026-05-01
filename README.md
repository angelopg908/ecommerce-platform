# ShopFlow Full-Stack E-Commerce Platform

A production-style e-commerce application built as a portfolio project. Features a product catalog, shopping cart, Stripe checkout, order history, and an admin dashboard.

**Live Demo:** https://ecommerce-platform-nine-pi.vercel.app

> Test card: `4242 4242 4242 4242` · Any future expiry · Any CVC

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router |
| Backend | Node.js, Express.js |
| Database | PostgreSQL (Neon) |
| Payments | Stripe Checkout |
| Deployment | Vercel (frontend), Render (backend) |

---

## Features

**Customer**
- Browse and search products with price filtering and pagination
- Product detail page with quantity selector
- Persistent cart synced to the server
- Stripe-hosted checkout (test mode)
- Order history with expandable item breakdown

**Admin** (`/admin`)
- Create, edit, and delete products with image preview
- View all orders across all users
- Update order status (pending → processing → shipped → delivered)

**Auth**
- JWT-based authentication with 7-day tokens
- bcrypt password hashing (cost factor 12)
- Role-based access control (user / admin)
- Protected routes on both frontend and backend

---

## Project Structure

```
ecommerce-platform/
├── client/                  # React frontend (Vite)
│   └── src/
│       ├── components/      # Navbar, ProductCard, ProtectedRoute, admin tabs
│       ├── context/         # AuthContext, CartContext
│       ├── pages/           # Home, ProductDetail, Cart, Checkout, Orders, Admin
│       └── services/        # Axios instance with auth interceptor
└── server/                  # Express backend
    └── src/
        ├── controllers/     # auth, product, cart, order, payment, admin
        ├── middleware/       # authenticate, requireAdmin
        ├── routes/          # REST API routes
        ├── services/        # DB query layer
        └── db/              # pg Pool, schema, migrations
```

---

## Database Schema

```sql
users        (id, email, password, role, created_at)
products     (id, name, description, price, image_url, stock, created_at)
cart_items   (id, user_id, product_id, quantity, created_at)
orders       (id, user_id, total, status, created_at)
order_items  (id, order_id, product_id, quantity, price)
```

---

## Running Locally

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon free tier)
- Stripe account (test keys)
- Stripe CLI (for local webhooks)

### Setup

**1. Clone the repo**
```bash
git clone https://github.com/angelopg908/ecommerce-platform.git
cd ecommerce-platform
```

**2. Install dependencies**
```bash
cd server && npm install
cd ../client && npm install
```

**3. Configure environment variables**

Create `server/.env`:
```env
PORT=5000
DATABASE_URL=your_neon_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
CLIENT_URL=http://localhost:5173
```

Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

**4. Run the database migration**
```bash
cd server
node src/db/migrate.js
```

**5. Start the servers** (3 separate terminals)
```bash
# Terminal 1 — backend
cd server && node src/index.js

# Terminal 2 — frontend
cd client && npm run dev

# Terminal 3 — Stripe webhook listener
stripe listen --forward-to localhost:5000/api/payments/webhook
```

**6. Open** http://localhost:5173

---

## API Endpoints

| Method | Route | Auth |
|--------|-------|------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | User |
| GET | `/api/products` | Public |
| GET | `/api/products/:id` | Public |
| GET | `/api/cart` | User |
| POST | `/api/cart` | User |
| PUT | `/api/cart/:productId` | User |
| DELETE | `/api/cart/:productId` | User |
| GET | `/api/orders` | User |
| GET | `/api/orders/:id` | User |
| POST | `/api/payments/checkout-session` | User |
| POST | `/api/payments/webhook` | Stripe |
| GET | `/api/admin/orders` | Admin |
| PUT | `/api/admin/orders/:id/status` | Admin |
| POST | `/api/admin/products` | Admin |
| PUT | `/api/admin/products/:id` | Admin |
| DELETE | `/api/admin/products/:id` | Admin |

---

## Deployment

| Service | Platform | Config |
|---------|----------|--------|
| Frontend | Vercel | Root: `client`, auto-detects Vite |
| Backend | Render | Root: `server`, start: `node src/index.js` |
| Database | Neon | Serverless PostgreSQL |
| Webhooks | Stripe Dashboard | `checkout.session.completed` |
