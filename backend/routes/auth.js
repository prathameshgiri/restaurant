const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // User Login
    if (email === 'aditi@demo.com' && password === 'aditi123') {
        return res.json({ success: true, role: 'user', name: 'Aditi' });
    }

    // Admin Login
    if (email === 'aditi@admin.com' && password === 'aditi123') {
        return res.json({ success: true, role: 'admin', name: 'Aditi (Admin)' });
    }

    res.status(401).json({ success: false, message: 'Invalid email or password' });
});

module.exports = router;
