# 🍽️ Gourmet Paradise — Restaurant Booking & Order Management System

> **Full-Stack College Project** | HTML · CSS · JavaScript · Node.js · Express.js

---

## 📌 Project Overview

**Gourmet Paradise** is a complete restaurant booking and food ordering web application built for college submission. It features a modern user-facing website and a secure admin control panel.

### ✨ Key Highlights
- Beautiful split-layout Hero section with an inline table booking form
- Interactive food menu with 16+ items, category filters, and a live cart
- Photo gallery and customer testimonials
- User order tracking with a visual status timeline
- Real-time admin dashboard (orders, bookings, messages)
- Times New Roman font — classic fine-dining aesthetic
- All prices in **Indian Rupees (₹)**

---

## 🔐 Login Credentials

### 👤 User Account (Customer)

| Field    | Value            |
|----------|------------------|
| Email    | `aditi@demo.com` |
| Password | `aditi123`       |

**User can:**
- Browse the full menu & add items to cart
- Place food orders (prices in ₹)
- Book a table directly from the homepage
- View order history on the **My Orders** page
- Track order status: **Pending → Preparing → Completed**
- Cancel **Pending** orders
- Send contact messages

---

### 🛡️ Admin Account

| Field    | Value             |
|----------|-------------------|
| Email    | `aditi@admin.com` |
| Password | `aditi123`        |

**Admin can:**
- View all customer orders in real time (auto-refresh every 10s)
- Update order status: Pending → Preparing → Completed
- View & manage table bookings (Accept / Reject)
- Read and delete customer contact messages

---

## 🚀 How to Run the Project

### Step 1 — Make sure Node.js is installed
```bash
node -v
# Should show v16 or higher
```

### Step 2 — Open the project folder
```bash
cd "d:\MDM.Clg.Pro\Aditi Suryawanshi\Restaurant booking"
```

### Step 3 — Install dependencies (first time only)
```bash
npm install
```

### Step 4 — Start the server
```bash
node backend/server.js
```

You should see:
```
Server is running on port 5000
```

### Step 5 — Open in browser
```
http://localhost:5000
```

---

## 🌐 Page URLs

| Page            | URL                                    | Access     |
|-----------------|----------------------------------------|------------|
| 🏠 Home          | http://localhost:5000/                 | Public     |
| 🔑 Login         | http://localhost:5000/login.html       | Public     |
| 📋 My Orders      | http://localhost:5000/my-orders.html   | User only  |
| 🛡️ Admin Panel    | http://localhost:5000/admin.html       | Admin only |

---

## 📁 Project Folder Structure

```
Restaurant booking/
│
├── backend/
│   ├── server.js              ← Express server entry point
│   ├── routes/
│   │   ├── auth.js            ← Login API (user & admin)
│   │   ├── orders.js          ← Orders CRUD API
│   │   ├── bookings.js        ← Table booking API
│   │   └── messages.js        ← Contact messages API
│   └── data/
│       ├── orders.json        ← Order storage (JSON)
│       ├── bookings.json      ← Booking storage (JSON)
│       └── messages.json      ← Message storage (JSON)
│
├── frontend/
│   ├── index.html             ← Main user website
│   ├── login.html             ← Login page (user + admin)
│   ├── my-orders.html         ← User order history page
│   ├── admin.html             ← Admin dashboard
│   ├── css/
│   │   └── style.css          ← All styles (Times New Roman theme)
│   └── js/
│       ├── auth.js            ← Login state & navbar logic
│       ├── order.js           ← Menu, cart & order placement
│       ├── booking.js         ← Table booking & contact form
│       └── admin.js           ← Admin dashboard logic
│
├── package.json               ← Node.js dependencies
├── CREDENTIALS.md             ← Quick credentials reference
└── README.md                  ← This file
```

---

## 🧱 Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | HTML5, CSS3, Vanilla JavaScript     |
| Backend   | Node.js, Express.js (v5)            |
| Storage   | JSON files (no database needed)     |
| Icons     | Font Awesome 6                      |
| Font      | Times New Roman (body), Playfair Display (headings) |

---

## 🎨 Website Sections

| # | Section        | Description                                                  |
|---|----------------|--------------------------------------------------------------|
| 1 | **Hero**       | Left: heading + stats + CTA buttons. Right: Book Table form  |
| 2 | **About**      | Restaurant story, farm-to-table values, feature highlights   |
| 3 | **Menu**       | 16 food items with category tabs (Starters / Mains / Pasta / Desserts) |
| 4 | **Gallery**    | Photo grid with hover overlays                               |
| 5 | **Testimonials** | Guest reviews on a dark background                         |
| 6 | **Contact**    | Message form connected to admin panel                        |

---

## 📦 npm Dependencies

```json
{
  "express":     "^5.2.1",
  "cors":        "^2.8.6",
  "body-parser": "^2.2.2"
}
```

Install with:
```bash
npm install
```

---

## ⚙️ REST API Endpoints

| Method | Route                  | Description                        |
|--------|------------------------|------------------------------------|
| POST   | `/api/auth/login`      | User or admin login                |
| GET    | `/api/orders`          | Get all orders (admin)             |
| GET    | `/api/orders?user=X`   | Get orders for a specific user     |
| POST   | `/api/orders`          | Place a new order                  |
| PUT    | `/api/orders/:id`      | Update order status (admin)        |
| DELETE | `/api/orders/:id`      | Cancel a pending order (user)      |
| GET    | `/api/bookings`        | Get all table bookings             |
| POST   | `/api/bookings`        | Submit a table booking             |
| PUT    | `/api/bookings/:id`    | Accept or reject a booking (admin) |
| GET    | `/api/messages`        | Get all contact messages           |
| POST   | `/api/messages`        | Send a contact message             |
| DELETE | `/api/messages/:id`    | Delete a message (admin)           |

---

## 🔒 Security Notes

- Authentication is **demo-level** (plain text comparison)
- Session stored in `localStorage`
- Route protection done via JavaScript checks
- **Not suitable for production** — for learning/demo only

---

## 📈 Future Enhancements

- [ ] MongoDB database integration
- [ ] JWT-based authentication
- [ ] Payment gateway (Razorpay / Stripe)
- [ ] Email order confirmations
- [ ] Mobile app (React Native)
- [ ] Real-time updates via WebSockets

---

## 👩‍💻 Developer

**Prathamesh Giri**
- College Project — Full Stack Web Development
- February 2026

---

> 💡 *Built for learning & demonstration purposes only.*
