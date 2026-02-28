const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const bookingRoutes = require('./routes/bookings');
const messageRoutes = require('./routes/messages');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));
// Serve Font Awesome locally (no CDN needed)
app.use('/fontawesome', express.static(path.join(__dirname, '../node_modules/@fortawesome/fontawesome-free')));
// FA CSS references ../webfonts/ — serve at root /webfonts/ too
app.use('/webfonts', express.static(path.join(__dirname, '../node_modules/@fortawesome/fontawesome-free/webfonts')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/messages', messageRoutes);

// Serve frontend for any non-API routes
app.use((req, res, next) => {
    if (!req.path.startsWith('/api/')) {
        res.sendFile(path.resolve(__dirname, '../frontend/index.html'));
    } else {
        next();
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
