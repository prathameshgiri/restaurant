const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PORT = 3001;
const JWT_SECRET = 'spicegarden_secret_2024_secure_key';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Data directory
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// Helper functions
const readData = (file) => {
  const filePath = path.join(DATA_DIR, file);
  if (!fs.existsSync(filePath)) return [];
  try { return JSON.parse(fs.readFileSync(filePath, 'utf8')); } catch { return []; }
};

const writeData = (file, data) => {
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2));
};

// Initialize data files
const initData = () => {
  if (!fs.existsSync(path.join(DATA_DIR, 'users.json'))) {
    const adminHash = bcrypt.hashSync('admin123', 10);
    const userHash = bcrypt.hashSync('user123', 10);
    writeData('users.json', [
      { id: 'admin-001', name: 'Admin', email: 'admin@spicegarden.com', password: adminHash, role: 'admin', createdAt: new Date().toISOString(), phone: '9876543210', address: 'Restaurant HQ' },
      { id: 'user-001', name: 'Demo User', email: 'user@spicegarden.com', password: userHash, role: 'user', createdAt: new Date().toISOString(), phone: '9876543211', address: '12, MG Road, Pune' }
    ]);
  } else {
    // Ensure demo user always exists
    const users = readData('users.json');
    if (!users.find(u => u.email === 'user@spicegarden.com')) {
      const userHash = bcrypt.hashSync('user123', 10);
      users.push({ id: 'user-001', name: 'Demo User', email: 'user@spicegarden.com', password: userHash, role: 'user', createdAt: new Date().toISOString(), phone: '9876543211', address: '12, MG Road, Pune' });
      writeData('users.json', users);
    }
  }
  if (!fs.existsSync(path.join(DATA_DIR, 'menu.json'))) {
    writeData('menu.json', [
      { id: 'm1', name: 'Butter Chicken', category: 'Main Course', price: 320, description: 'Tender chicken in rich tomato-butter sauce with aromatic spices', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400', available: true, popular: true, veg: false, spicy: 2 },
      { id: 'm2', name: 'Paneer Tikka Masala', category: 'Main Course', price: 280, description: 'Grilled paneer in spicy tikka masala gravy', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', available: true, popular: true, veg: true, spicy: 2 },
      { id: 'm3', name: 'Dal Makhani', category: 'Main Course', price: 220, description: 'Slow-cooked black lentils with butter and cream', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400', available: true, popular: false, veg: true, spicy: 1 },
      { id: 'm4', name: 'Biryani Hyderabadi', category: 'Rice & Biryani', price: 380, description: 'Aromatic long-grain rice layered with tender meat and saffron', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', available: true, popular: true, veg: false, spicy: 2 },
      { id: 'm5', name: 'Veg Biryani', category: 'Rice & Biryani', price: 280, description: 'Fragrant basmati rice with seasonal vegetables and whole spices', image: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=400', available: true, popular: false, veg: true, spicy: 1 },
      { id: 'm6', name: 'Garlic Naan', category: 'Breads', price: 60, description: 'Soft leavened bread baked in tandoor with garlic and butter', image: 'https://images.unsplash.com/photo-1619735272788-43edf0ce0490?w=400', available: true, popular: true, veg: true, spicy: 0 },
      { id: 'm7', name: 'Tandoori Roti', category: 'Breads', price: 40, description: 'Whole wheat bread baked fresh in tandoor oven', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400', available: true, popular: false, veg: true, spicy: 0 },
      { id: 'm8', name: 'Gulab Jamun', category: 'Desserts', price: 120, description: 'Soft milk dumplings soaked in rose-flavored sugar syrup', image: 'https://images.unsplash.com/photo-1666275916491-17736d4e9c97?w=400', available: true, popular: true, veg: true, spicy: 0 },
      { id: 'm9', name: 'Mango Lassi', category: 'Beverages', price: 100, description: 'Refreshing yogurt-based drink blended with fresh Alphonso mango', image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400', available: true, popular: true, veg: true, spicy: 0 },
      { id: 'm10', name: 'Masala Chai', category: 'Beverages', price: 60, description: 'Traditional spiced tea with cardamom, ginger and cinnamon', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', available: true, popular: false, veg: true, spicy: 0 },
      { id: 'm11', name: 'Chicken Tikka', category: 'Starters', price: 280, description: 'Succulent chicken marinated in yogurt and spices, grilled in tandoor', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400', available: true, popular: true, veg: false, spicy: 2 },
      { id: 'm12', name: 'Samosa (2 pcs)', category: 'Starters', price: 80, description: 'Crispy pastry filled with spiced potatoes and peas', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', available: true, popular: false, veg: true, spicy: 1 },
      { id: 'm13', name: 'Pani Puri', category: 'Starters', price: 100, description: 'Crispy hollow puris filled with spiced water and chutneys', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400', available: true, popular: true, veg: true, spicy: 3 },
      { id: 'm14', name: 'Rasmalai', category: 'Desserts', price: 140, description: 'Soft paneer rounds in chilled saffron-flavored milk', image: 'https://images.unsplash.com/photo-1666275916491-17736d4e9c97?w=400', available: true, popular: false, veg: true, spicy: 0 },
      { id: 'm15', name: 'Kadai Paneer', category: 'Main Course', price: 260, description: 'Paneer with bell peppers in kadai masala', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400', available: true, popular: false, veg: true, spicy: 2 },
      { id: 'm16', name: 'Mutton Rogan Josh', category: 'Main Course', price: 420, description: 'Slow-cooked tender mutton in Kashmiri spices', image: 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=400', available: true, popular: true, veg: false, spicy: 3 },
    ]);
  }
  if (!fs.existsSync(path.join(DATA_DIR, 'orders.json'))) writeData('orders.json', []);
  if (!fs.existsSync(path.join(DATA_DIR, 'bookings.json'))) writeData('bookings.json', []);
  if (!fs.existsSync(path.join(DATA_DIR, 'messages.json'))) writeData('messages.json', []);
  if (!fs.existsSync(path.join(DATA_DIR, 'reviews.json'))) {
    writeData('reviews.json', [
      { id: 'r1', name: 'Priya Sharma', rating: 5, comment: 'Absolutely divine! The Butter Chicken is the best I have ever had. The ambiance is beautiful and the staff is incredibly warm and welcoming.', date: '2024-01-15', avatar: 'PS' },
      { id: 'r2', name: 'Rahul Mehta', rating: 5, comment: 'Spice Garden lives up to every bit of its reputation. The Hyderabadi Biryani is a masterpiece - perfectly spiced and incredibly aromatic.', date: '2024-02-03', avatar: 'RM' },
      { id: 'r3', name: 'Ananya Patel', rating: 4, comment: 'Wonderful dining experience! The Paneer Tikka Masala was exceptional. Great vegetarian options too. Highly recommend for family outings!', date: '2024-02-20', avatar: 'AP' },
      { id: 'r4', name: 'Vikram Singh', rating: 5, comment: 'Every dish was a culinary journey. The Mutton Rogan Josh melted in the mouth. Will definitely be back with the whole family!', date: '2024-03-01', avatar: 'VS' },
      { id: 'r5', name: 'Sunita Reddy', rating: 5, comment: 'The Pani Puri here is legendary. Amazing street food presented so elegantly. The Mango Lassi is refreshing and the service is top notch.', date: '2024-03-10', avatar: 'SR' },
    ]);
  }
};

initData();

// Auth middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch { res.status(401).json({ error: 'Invalid token' }); }
};

const adminAuth = (req, res, next) => {
  auth(req, res, () => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
    next();
  });
};

// ========== AUTH ROUTES ==========
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
    const users = readData('users.json');
    if (users.find(u => u.email === email)) return res.status(400).json({ error: 'Email already registered' });
    const hashed = await bcrypt.hash(password, 10);
    const newUser = { id: uuidv4(), name, email, password: hashed, phone: phone || '', address: address || '', role: 'user', createdAt: new Date().toISOString() };
    users.push(newUser);
    writeData('users.json', users);
    const token = jwt.sign({ id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } });
  } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = readData('users.json');
    const user = users.find(u => u.email === email);
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Invalid email or password' });
    const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, address: user.address } });
  } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/auth/me', auth, (req, res) => {
  const users = readData('users.json');
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, address: user.address, createdAt: user.createdAt });
});

// ========== MENU ROUTES ==========
app.get('/api/menu', (req, res) => {
  const menu = readData('menu.json');
  res.json(menu.filter(item => item.available));
});

app.get('/api/menu/all', adminAuth, (req, res) => {
  res.json(readData('menu.json'));
});

app.post('/api/menu', adminAuth, (req, res) => {
  const menu = readData('menu.json');
  const newItem = { id: uuidv4(), ...req.body, available: true, createdAt: new Date().toISOString() };
  menu.push(newItem);
  writeData('menu.json', menu);
  res.json(newItem);
});

app.put('/api/menu/:id', adminAuth, (req, res) => {
  const menu = readData('menu.json');
  const idx = menu.findIndex(m => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Item not found' });
  menu[idx] = { ...menu[idx], ...req.body };
  writeData('menu.json', menu);
  res.json(menu[idx]);
});

app.delete('/api/menu/:id', adminAuth, (req, res) => {
  const menu = readData('menu.json');
  const filtered = menu.filter(m => m.id !== req.params.id);
  writeData('menu.json', filtered);
  res.json({ success: true });
});

// ========== ORDER ROUTES ==========
app.post('/api/orders', auth, (req, res) => {
  try {
    const { items, totalAmount, deliveryAddress, paymentMethod, notes } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ error: 'No items in order' });
    const orders = readData('orders.json');
    const orderId = 'ORD-' + Date.now().toString().slice(-6);
    const newOrder = {
      id: uuidv4(), orderId, userId: req.user.id, userName: req.user.name, userEmail: req.user.email,
      items, totalAmount, deliveryAddress: deliveryAddress || '', paymentMethod: paymentMethod || 'cash',
      notes: notes || '', status: 'placed', createdAt: new Date().toISOString(),
      timeline: [{ status: 'placed', time: new Date().toISOString(), message: 'Order placed successfully' }]
    };
    orders.push(newOrder);
    writeData('orders.json', orders);
    res.json(newOrder);
  } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/orders/my', auth, (req, res) => {
  const orders = readData('orders.json');
  const userOrders = orders.filter(o => o.userId === req.user.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(userOrders);
});

app.get('/api/orders/track/:orderId', auth, (req, res) => {
  const orders = readData('orders.json');
  const order = orders.find(o => (o.orderId === req.params.orderId || o.id === req.params.orderId) && o.userId === req.user.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

app.get('/api/orders', adminAuth, (req, res) => {
  const orders = readData('orders.json').sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(orders);
});

app.put('/api/orders/:id/status', adminAuth, (req, res) => {
  const { status } = req.body;
  const validStatuses = ['placed', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) return res.status(400).json({ error: 'Invalid status' });
  const orders = readData('orders.json');
  const idx = orders.findIndex(o => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Order not found' });
  const statusMessages = {
    placed: 'Order placed successfully', confirmed: 'Order confirmed by restaurant',
    preparing: 'Chef is preparing your order', ready: 'Order is ready',
    delivered: 'Order delivered successfully', cancelled: 'Order cancelled'
  };
  orders[idx].status = status;
  orders[idx].timeline.push({ status, time: new Date().toISOString(), message: statusMessages[status] });
  writeData('orders.json', orders);
  res.json(orders[idx]);
});

app.put('/api/orders/:id/cancel', auth, (req, res) => {
  const orders = readData('orders.json');
  const idx = orders.findIndex(o => o.id === req.params.id && o.userId === req.user.id);
  if (idx === -1) return res.status(404).json({ error: 'Order not found' });
  if (!['placed', 'confirmed'].includes(orders[idx].status)) return res.status(400).json({ error: 'Cannot cancel this order' });
  orders[idx].status = 'cancelled';
  orders[idx].timeline.push({ status: 'cancelled', time: new Date().toISOString(), message: 'Order cancelled by customer' });
  writeData('orders.json', orders);
  res.json(orders[idx]);
});

// ========== BOOKING ROUTES ==========
app.post('/api/bookings', (req, res) => {
  try {
    const { name, email, phone, date, time, guests, occasion, specialRequests } = req.body;
    if (!name || !email || !phone || !date || !time || !guests) return res.status(400).json({ error: 'Required fields missing' });
    const bookings = readData('bookings.json');
    const newBooking = {
      id: uuidv4(), bookingId: 'BK-' + Date.now().toString().slice(-6),
      name, email, phone, date, time, guests, occasion: occasion || '', specialRequests: specialRequests || '',
      status: 'pending', createdAt: new Date().toISOString()
    };
    bookings.push(newBooking);
    writeData('bookings.json', bookings);
    res.json(newBooking);
  } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/bookings', adminAuth, (req, res) => {
  const bookings = readData('bookings.json').sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(bookings);
});

app.put('/api/bookings/:id', adminAuth, (req, res) => {
  const bookings = readData('bookings.json');
  const idx = bookings.findIndex(b => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Booking not found' });
  bookings[idx] = { ...bookings[idx], ...req.body };
  writeData('bookings.json', bookings);
  res.json(bookings[idx]);
});

app.delete('/api/bookings/:id', adminAuth, (req, res) => {
  const bookings = readData('bookings.json');
  writeData('bookings.json', bookings.filter(b => b.id !== req.params.id));
  res.json({ success: true });
});

// ========== MESSAGES ROUTES ==========
app.post('/api/messages', (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ error: 'Required fields missing' });
    const messages = readData('messages.json');
    const newMsg = { id: uuidv4(), name, email, phone: phone || '', subject: subject || '', message, read: false, createdAt: new Date().toISOString() };
    messages.push(newMsg);
    writeData('messages.json', messages);
    res.json(newMsg);
  } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/messages', adminAuth, (req, res) => {
  const messages = readData('messages.json').sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(messages);
});

app.put('/api/messages/:id/read', adminAuth, (req, res) => {
  const messages = readData('messages.json');
  const idx = messages.findIndex(m => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Message not found' });
  messages[idx].read = true;
  writeData('messages.json', messages);
  res.json(messages[idx]);
});

app.delete('/api/messages/:id', adminAuth, (req, res) => {
  const messages = readData('messages.json');
  writeData('messages.json', messages.filter(m => m.id !== req.params.id));
  res.json({ success: true });
});

// ========== REVIEWS ROUTES ==========
app.get('/api/reviews', (req, res) => {
  res.json(readData('reviews.json'));
});

app.post('/api/reviews', auth, (req, res) => {
  const { rating, comment } = req.body;
  if (!rating || !comment) return res.status(400).json({ error: 'Rating and comment required' });
  const reviews = readData('reviews.json');
  const newReview = {
    id: uuidv4(), name: req.user.name, rating: parseInt(rating), comment,
    date: new Date().toISOString().split('T')[0], avatar: req.user.name.split(' ').map(n => n[0]).join('').toUpperCase()
  };
  reviews.push(newReview);
  writeData('reviews.json', reviews);
  res.json(newReview);
});

// ========== USERS (ADMIN) ROUTES ==========
app.get('/api/users', adminAuth, (req, res) => {
  const users = readData('users.json').map(u => ({ ...u, password: undefined }));
  res.json(users);
});

app.delete('/api/users/:id', adminAuth, (req, res) => {
  if (req.params.id === req.user.id) return res.status(400).json({ error: 'Cannot delete yourself' });
  const users = readData('users.json');
  writeData('users.json', users.filter(u => u.id !== req.params.id));
  res.json({ success: true });
});

// ========== ADMIN STATS ==========
app.get('/api/admin/stats', adminAuth, (req, res) => {
  const orders = readData('orders.json');
  const users = readData('users.json').filter(u => u.role === 'user');
  const bookings = readData('bookings.json');
  const messages = readData('messages.json');
  const menu = readData('menu.json');
  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString());
  const statusCounts = {};
  orders.forEach(o => { statusCounts[o.status] = (statusCounts[o.status] || 0) + 1; });
  res.json({
    totalOrders: orders.length, totalUsers: users.length, totalRevenue,
    totalBookings: bookings.length, unreadMessages: messages.filter(m => !m.read).length,
    menuItems: menu.length, todayOrders: todayOrders.length,
    pendingBookings: bookings.filter(b => b.status === 'pending').length, statusCounts
  });
});

// Serve pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/user/login', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'public', 'register.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'public', 'dashboard.html')));
app.get('/cart', (req, res) => res.sendFile(path.join(__dirname, 'public', 'cart.html')));
app.get('/admin/login', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin', 'index.html')));
app.get('/admin/*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin', 'dashboard.html')));

app.listen(PORT, () => {
  console.log(`🌐 User Website : http://localhost:${PORT}/`);
  console.log(`🔐 User Login   : http://localhost:${PORT}/user/login`);
  console.log(`👤 User Account : user@spicegarden.com  /  user123`);
});

app.listen(ADMIN_PORT, () => {
  console.log(`🛡️  Admin Panel  : http://localhost:${ADMIN_PORT}/admin/login`);
  console.log(`🔑 Admin Login  : admin@spicegarden.com  /  admin123`);
});
