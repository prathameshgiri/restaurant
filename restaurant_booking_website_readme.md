# 🍽️ Restaurant Booking & Order Management Website

## 📌 Project Overview
This project is a **full‑stack Restaurant Booking & Ordering Website** built using **HTML, CSS, JavaScript (Frontend)** and **Node.js (Backend)**.  
It includes:
- A **User Website (Frontend)** for login, restaurant booking, and placing orders
- A **Secure Admin Panel** to view & manage orders and messages in real time
- **Demo authentication** for both users and admin
- **Clean, modern, white‑theme UI** with smooth lazy animations

The project is designed for **learning, demo, and portfolio purposes**.

---

## 🧱 Tech Stack

### Frontend
- HTML5
- CSS3 (Flexbox + Grid)
- JavaScript (Vanilla JS)
- CSS Animations + Lazy Animations

### Backend
- Node.js
- Express.js
- JSON / In‑Memory Store (Demo)

---

## 🎨 UI & Design Guidelines

- **Theme:** Clean white background
- **Style:** Modern, minimal, professional
- **Animations:**
  - Lazy fade‑in on scroll
  - Button hover transitions
  - Card lift animation
- **Layout:** Section‑based with unique design per section

---

## 👤 User Side (Frontend Website)

### 🔐 User Authentication (Demo Login)

Demo credentials (hard‑coded):
```
Email: user@demo.com
Password: 123456
```

Features:
- Login required before ordering
- Session stored using `localStorage`

---

### 🏠 Sections on User Website

#### 1️⃣ Hero Section
- Restaurant branding
- Call‑to‑action buttons
  - Book Table
  - Order Food

#### 2️⃣ About Restaurant
- Short intro
- Special highlights

#### 3️⃣ Menu Section
- Food cards
- Price, description
- "Add to Order" button

#### 4️⃣ Table Booking Section
- Name
- Date & Time
- Number of people
- Submit booking request

#### 5️⃣ Order Section
- Cart system
- Quantity controls
- Total price calculation
- Place Order button

#### 6️⃣ Contact / Message Section
- User can send messages
- Stored for admin review

---

## 🛒 Order Flow (User)

1. User logs in
2. Selects food items
3. Adds items to cart
4. Places order
5. Order is saved on backend
6. Admin sees it in real time

---

## 🛠️ Admin Panel

### 🔐 Admin Authentication (Demo Login)

Demo credentials:
```
Username: admin
Password: admin123
```

- Admin panel is **locked behind login**
- Unauthorized access redirected to login page

---

### 📊 Admin Dashboard Features

#### 📦 Orders Management
- View all orders in real time
- Order details:
  - User name
  - Items ordered
  - Quantity
  - Total price
- Update order status:
  - Pending
  - Preparing
  - Completed

#### 💬 Messages Management
- View messages sent by users
- Mark as read
- Delete messages

#### 📅 Booking Requests
- View table bookings
- Accept / Reject booking

---

## ⚙️ Backend Structure (Node.js)

### 📁 Folder Structure
```
/backend
 ├── server.js
 ├── routes
 │   ├── auth.js
 │   ├── orders.js
 │   ├── bookings.js
 │   └── messages.js
 ├── data
 │   ├── orders.json
 │   ├── bookings.json
 │   └── messages.json
```

---

### 🚀 Backend Flow

- Express server handles APIs
- REST APIs:
  - `/login`
  - `/orders`
  - `/bookings`
  - `/messages`
- Uses JSON storage for demo
- Can be upgraded to MongoDB easily

---

## 🔄 Real‑Time Behavior (Demo)

- Orders auto‑refresh every few seconds
- Admin panel fetches latest data using `setInterval()`
- Smooth UI updates without page reload

---

## 🧩 Frontend Folder Structure
```
/frontend
 ├── index.html
 ├── login.html
 ├── admin.html
 ├── css
 │   └── style.css
 ├── js
 │   ├── auth.js
 │   ├── order.js
 │   ├── booking.js
 │   └── admin.js
```

---

## ✨ Animations & Effects

- Fade‑in on scroll using `IntersectionObserver`
- Button ripple effects
- Card hover shadow
- Smooth transitions using `transition` & `transform`

---

## 🔐 Security (Demo Level)

- Client‑side authentication
- Route protection via JS checks
- Not production secure (for demo only)

---

## 📈 Future Enhancements

- MongoDB integration
- JWT authentication
- Payment gateway
- Email notifications
- Mobile responsive improvements

---

## 📌 How to Run Project

1. Clone repository
2. Install dependencies
```
npm install
```
3. Start server
```
node server.js
```
4. Open frontend in browser

---

## 🏁 Conclusion

This project demonstrates a **complete restaurant booking & order management system** using **HTML, CSS, JavaScript, and Node.js** with a **modern UI and admin control system**.

Perfect for:
- College projects
- Portfolio
- Learning full‑stack development

---

💡 *Built for learning & demonstration purposes*

