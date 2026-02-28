const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const messagesPath = path.join(__dirname, '../data/messages.json');

const readData = () => {
    const data = fs.readFileSync(messagesPath, 'utf8');
    return JSON.parse(data);
};

const writeData = (data) => {
    fs.writeFileSync(messagesPath, JSON.stringify(data, null, 2));
};

// Get all messages
router.get('/', (req, res) => {
    const messages = readData();
    res.json(messages);
});

// Send a message
router.post('/', (req, res) => {
    const { name, email, message } = req.body;
    const messages = readData();

    const newMessage = {
        id: Date.now(),
        name,
        email,
        message,
        read: false,
        timestamp: new Date().toISOString()
    };

    messages.push(newMessage);
    writeData(messages);
    res.json({ success: true, message: newMessage });
});

// Mark as read or delete
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    let messages = readData();
    messages = messages.filter(m => m.id != id);
    writeData(messages);
    res.json({ success: true });
});

module.exports = router;
