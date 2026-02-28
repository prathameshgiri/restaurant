const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const ordersPath = path.join(__dirname, '../data/orders.json');

const readData = () => JSON.parse(fs.readFileSync(ordersPath, 'utf8'));
const writeData = (data) => fs.writeFileSync(ordersPath, JSON.stringify(data, null, 2));

// Get all orders (admin) or filter by user
router.get('/', (req, res) => {
    const orders = readData();
    const { user } = req.query;
    if (user) {
        return res.json(orders.filter(o => o.user === user));
    }
    res.json(orders);
});

// Place an order
router.post('/', (req, res) => {
    const { user, items, total } = req.body;
    const orders = readData();
    const newOrder = {
        id: Date.now(),
        user,
        items,
        total,
        status: 'Pending',
        timestamp: new Date().toISOString()
    };
    orders.push(newOrder);
    writeData(orders);
    res.json({ success: true, order: newOrder });
});

// Update order status (admin)
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const orders = readData();
    const idx = orders.findIndex(o => o.id == id);
    if (idx !== -1) {
        orders[idx].status = status;
        writeData(orders);
        res.json({ success: true });
    } else {
        res.status(404).json({ success: false, message: 'Order not found' });
    }
});

// Cancel / delete an order (user cancels pending)
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    let orders = readData();
    const order = orders.find(o => o.id == id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.status !== 'Pending') return res.status(400).json({ success: false, message: 'Only pending orders can be cancelled' });
    orders = orders.filter(o => o.id != id);
    writeData(orders);
    res.json({ success: true });
});

module.exports = router;
