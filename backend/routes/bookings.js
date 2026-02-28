const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const bookingsPath = path.join(__dirname, '../data/bookings.json');

const readData = () => {
    const data = fs.readFileSync(bookingsPath, 'utf8');
    return JSON.parse(data);
};

const writeData = (data) => {
    fs.writeFileSync(bookingsPath, JSON.stringify(data, null, 2));
};

// Get all bookings
router.get('/', (req, res) => {
    const bookings = readData();
    res.json(bookings);
});

// Create booking
router.post('/', (req, res) => {
    const { name, date, time, people } = req.body;
    const bookings = readData();

    const newBooking = {
        id: Date.now(),
        name,
        date,
        time,
        people,
        status: 'Pending',
        timestamp: new Date().toISOString()
    };

    bookings.push(newBooking);
    writeData(bookings);
    res.json({ success: true, booking: newBooking });
});

// Update booking status
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const bookings = readData();

    const index = bookings.findIndex(b => b.id == id);
    if (index !== -1) {
        bookings[index].status = status;
        writeData(bookings);
        res.json({ success: true });
    } else {
        res.status(404).json({ success: false, message: 'Booking not found' });
    }
});

module.exports = router;
