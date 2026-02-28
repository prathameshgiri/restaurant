async function loadOrders() {
    const res = await fetch('/api/orders');
    const orders = await res.json();
    const table = document.getElementById('orders-table');
    if (!table) return;

    table.innerHTML = orders.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>${order.user}</td>
            <td>${order.items}</td>
            <td>$${order.total}</td>
            <td><span class="status status-${order.status.toLowerCase()}">${order.status}</span></td>
            <td>
                <select onchange="updateOrderStatus(${order.id}, this.value)">
                    <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="Preparing" ${order.status === 'Preparing' ? 'selected' : ''}>Preparing</option>
                    <option value="Completed" ${order.status === 'Completed' ? 'selected' : ''}>Completed</option>
                </select>
            </td>
        </tr>
    `).join('');
}

async function updateOrderStatus(id, status) {
    await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    });
    loadOrders();
}

async function loadBookings() {
    const res = await fetch('/api/bookings');
    const bookings = await res.json();
    const table = document.getElementById('bookings-table');
    if (!table) return;

    table.innerHTML = bookings.map(b => `
        <tr>
            <td>${b.date}</td>
            <td>${b.time}</td>
            <td>${b.name}</td>
            <td>${b.people}</td>
            <td><span class="status status-${b.status.toLowerCase()}">${b.status}</span></td>
            <td>
                <button onclick="updateBookingStatus(${b.id}, 'Accepted')" class="btn btn-primary" style="padding: 5px 10px; font-size: 0.8rem;">Accept</button>
                <button onclick="updateBookingStatus(${b.id}, 'Rejected')" class="btn btn-outline" style="padding: 5px 10px; font-size: 0.8rem;">Reject</button>
            </td>
        </tr>
    `).join('');
}

async function updateBookingStatus(id, status) {
    await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    });
    loadBookings();
}

async function loadMessages() {
    const res = await fetch('/api/messages');
    const messages = await res.json();
    const list = document.getElementById('messages-list');
    if (!list) return;

    list.innerHTML = messages.map(m => `
        <div class="dashboard-card" style="margin-bottom: 1rem; border: 1px solid var(--border-color);">
            <div style="display: flex; justify-content: space-between;">
                <strong>${m.name} (${m.email})</strong>
                <button onclick="deleteMessage(${m.id})" style="color: red; background: none; border: none; cursor: pointer;">Delete</button>
            </div>
            <p style="margin-top: 10px;">${m.message}</p>
            <small>${new Date(m.timestamp).toLocaleString()}</small>
        </div>
    `).join('');
}

async function deleteMessage(id) {
    await fetch(`/api/messages/${id}`, { method: 'DELETE' });
    loadMessages();
}

// Initial loads
document.addEventListener('DOMContentLoaded', () => {
    loadOrders();
    loadBookings();
    loadMessages();

    // Auto-refresh orders every 10 seconds as per README
    setInterval(loadOrders, 10000);
});
