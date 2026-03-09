// ── HELPERS ──
const getToken = () => localStorage.getItem('sg_token');
const getUser = () => { try { return JSON.parse(localStorage.getItem('sg_user')); } catch { return null; } };
const API = (path, opts = {}) => fetch(path, { ...opts, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}`, ...(opts.headers || {}) } }).then(r => r.json().then(d => { if (!r.ok) throw new Error(d.error || 'Request failed'); return d; }));

function showToast(msg, type = 'info', icon = 'ℹ️') {
  const c = document.getElementById('toastContainer');
  const t = document.createElement('div'); t.className = `toast ${type}`;
  t.innerHTML = `<span>${icon}</span><span>${msg}</span>`; c.appendChild(t);
  setTimeout(() => { t.style.animation = 'slideOutRight 0.3s ease forwards'; setTimeout(() => t.remove(), 300); }, 3500);
}

function adminLogout() {
  localStorage.clear();
  window.location.href = '/admin/login';
}

// ── GUARD ──
const user = getUser();
if (!user || user.role !== 'admin') { window.location.href = '/admin/login'; }

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  // Set admin name
  if (user) {
    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    document.getElementById('adminAvatarSide').textContent = initials;
    document.getElementById('adminNameSide').textContent = user.name;
    const hr = new Date().getHours();
    const greet = hr < 12 ? 'Good Morning' : hr < 17 ? 'Good Afternoon' : 'Good Evening';
    document.getElementById('dashWelcome').textContent = `${greet}, ${user.name.split(' ')[0]}! 👋`;
  }
  // Clock
  setInterval(() => {
    document.getElementById('topbarTime').textContent = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }, 1000);
  loadStats();
  loadOrders();
  loadMenuAdmin();
  loadBookings();
  loadMessages();
  loadUsers();
});

// ── PAGE NAVIGATION ──
function showPage(name, el) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById(`page-${name}`).classList.add('active');
  // Accept element directly OR fall back to global event
  const activeEl = el || (typeof event !== 'undefined' && event?.currentTarget);
  if (activeEl) activeEl.classList.add('active');
  const titles = { dashboard: 'Dashboard', orders: 'Orders', menu: 'Menu Items', bookings: 'Bookings', messages: 'Messages', users: 'Users' };
  document.getElementById('pageTitle').textContent = titles[name] || name;
}

// ── STATS ──
async function loadStats() {
  try {
    const s = await API('/api/admin/stats');
    const cards = document.querySelectorAll('.stat-card');
    const vals = [s.totalOrders, `₹${s.totalRevenue.toLocaleString('en-IN')}`, s.totalUsers, s.totalBookings, s.todayOrders, s.unreadMessages, s.menuItems, s.pendingBookings];
    cards.forEach((card, i) => { const v = card.querySelector('.stat-value'); if (v) v.textContent = vals[i] ?? '—'; });
    // Badge
    if (s.unreadMessages > 0) { const b = document.getElementById('newMsgBadge'); b.textContent = s.unreadMessages; b.style.display = 'inline'; }
    if (s.pendingBookings > 0) { const b = document.getElementById('newBookingsBadge'); b.textContent = s.pendingBookings; b.style.display = 'inline'; }
    // Status chart
    const chartEl = document.getElementById('orderStatusChart');
    const statusColors = { placed: '#3b82f6', confirmed: '#f59e0b', preparing: '#f97316', ready: '#a855f7', delivered: '#22c55e', cancelled: '#ef4444' };
    const totalOrders = Object.values(s.statusCounts || {}).reduce((a, b) => a + b, 0) || 1;
    chartEl.innerHTML = Object.entries(s.statusCounts || {}).map(([status, count]) => {
      const pct = Math.round((count / totalOrders) * 100);
      return `<div>
        <div style="display:flex;justify-content:space-between;font-size:0.78rem;margin-bottom:0.3rem;">
          <span style="text-transform:capitalize">${status}</span><span style="color:${statusColors[status]}">${count} (${pct}%)</span>
        </div>
        <div style="height:6px;background:rgba(255,255,255,0.07);border-radius:3px;overflow:hidden">
          <div style="height:100%;width:${pct}%;background:${statusColors[status]};border-radius:3px;transition:width 1s ease"></div>
        </div>
      </div>`;
    }).join('');
  } catch (err) { console.error(err); }
}

// ── ORDERS ──
let allOrders = [];
async function loadOrders() {
  try {
    allOrders = await API('/api/orders');
    const search = (document.getElementById('orderSearch')?.value || '').toLowerCase();
    const statusFilter = document.getElementById('orderFilterStatus')?.value || '';
    let filtered = allOrders;
    if (search) filtered = filtered.filter(o => o.orderId?.toLowerCase().includes(search) || o.userName?.toLowerCase().includes(search) || o.userEmail?.toLowerCase().includes(search));
    if (statusFilter) filtered = filtered.filter(o => o.status === statusFilter);
    const tbody = document.getElementById('ordersTable');
    if (!filtered.length) { tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:2rem;color:rgba(255,255,255,0.3)">No orders found</td></tr>'; return; }
    tbody.innerHTML = filtered.map(o => `
      <tr>
        <td><strong style="color:var(--secondary)">${o.orderId}</strong></td>
        <td><div>${o.userName}</div><div style="font-size:0.75rem;color:rgba(255,255,255,0.4)">${o.userEmail}</div></td>
        <td style="max-width:180px"><div style="font-size:0.78rem;color:rgba(255,255,255,0.6)">${o.items?.map(i => `${i.name}×${i.qty}`).join(', ')}</div></td>
        <td><strong style="color:var(--secondary)">₹${o.totalAmount}</strong></td>
        <td><span style="font-size:0.78rem">${o.paymentMethod || 'cash'}</span></td>
        <td>
          <select class="status-select" onchange="updateOrderStatus('${o.id}', this.value)">
            ${['placed', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'].map(s => `<option value="${s}" ${o.status === s ? 'selected' : ''}>${s.charAt(0).toUpperCase() + s.slice(1)}</option>`).join('')}
          </select>
        </td>
        <td style="font-size:0.78rem;color:rgba(255,255,255,0.5)">${new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
        <td><div class="td-actions">
          <button class="btn-action btn-view" onclick="viewOrder('${o.id}')">👁 View</button>
        </div></td>
      </tr>
    `).join('');
    // Recent orders widget
    const widget = document.getElementById('recentOrdersWidget');
    if (widget) {
      widget.innerHTML = allOrders.slice(0, 5).map(o => `
        <div class="recent-order-row">
          <div><div style="font-size:0.82rem;font-weight:600">${o.orderId}</div><div style="font-size:0.72rem;color:rgba(255,255,255,0.4)">${o.userName}</div></div>
          <div><div style="color:var(--secondary);font-size:0.85rem">₹${o.totalAmount}</div><span class="badge badge-${o.status}" style="font-size:0.65rem">${o.status}</span></div>
        </div>
      `).join('');
    }
  } catch (err) { showToast(err.message, 'error', '❌'); }
}

async function updateOrderStatus(id, status) {
  try {
    await API(`/api/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
    showToast(`✅ Order status → "${status.toUpperCase()}"`, 'success', '✅');
    await loadOrders();   // refresh table so dropdown reflects new state
    loadStats();
  } catch (err) { showToast(err.message, 'error', '❌'); }
}

function viewOrder(id) {
  const o = allOrders.find(x => x.id === id);
  if (!o) return;
  const statusColors = { placed: '#3b82f6', confirmed: '#f59e0b', preparing: '#f97316', ready: '#a855f7', delivered: '#22c55e', cancelled: '#ef4444' };
  document.getElementById('orderDetailContent').innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
      <div><strong style="color:var(--secondary);font-size:1.1rem">${o.orderId}</strong><div style="font-size:0.78rem;color:rgba(255,255,255,0.4)">${new Date(o.createdAt).toLocaleString('en-IN')}</div></div>
      <span class="badge badge-${o.status}">${o.status.toUpperCase()}</span>
    </div>
    <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:1rem;margin-bottom:1rem">
      <div style="font-size:0.78rem;color:rgba(255,255,255,0.5);margin-bottom:0.5rem">CUSTOMER</div>
      <div>${o.userName} · ${o.userEmail}</div>
      ${o.deliveryAddress ? `<div style="font-size:0.82rem;color:rgba(255,255,255,0.5);margin-top:0.3rem">📍 ${o.deliveryAddress}</div>` : ''}
    </div>
    <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:1rem;margin-bottom:1rem">
      <div style="font-size:0.78rem;color:rgba(255,255,255,0.5);margin-bottom:0.7rem">ORDER ITEMS</div>
      ${o.items.map(i => `<div style="display:flex;justify-content:space-between;font-size:0.84rem;padding:0.3rem 0;border-bottom:1px solid rgba(255,255,255,0.05)"><span>${i.name} × ${i.qty}</span><span style="color:var(--secondary)">₹${i.price * i.qty}</span></div>`).join('')}
      <div style="display:flex;justify-content:space-between;font-weight:700;margin-top:0.7rem"><span>Total</span><span style="color:var(--secondary)">₹${o.totalAmount}</span></div>
    </div>
    <div style="margin-bottom:1rem">
      <div style="font-size:0.78rem;color:rgba(255,255,255,0.5);margin-bottom:0.5rem">UPDATE STATUS</div>
      <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
        ${['placed', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'].map(s => `<button onclick="updateOrderStatus('${o.id}','${s}');document.getElementById('orderDetailModal').classList.remove('open');loadOrders();" style="background:${o.status === s ? statusColors[s] : 'rgba(255,255,255,0.07)'};border:none;color:#fff;padding:0.4rem 0.8rem;border-radius:6px;font-size:0.75rem;cursor:pointer;font-family:'Poppins',sans-serif">${s}</button>`).join('')}
      </div>
    </div>
  `;
  document.getElementById('orderDetailModal').classList.add('open');
}

// ── MENU ──
let allMenuAdmin = [];
let editingMenuId = null;

async function loadMenuAdmin() {
  try {
    allMenuAdmin = await API('/api/menu/all');
    const search = (document.getElementById('menuSearch')?.value || '').toLowerCase();
    const filtered = search ? allMenuAdmin.filter(m => m.name.toLowerCase().includes(search) || m.category.toLowerCase().includes(search)) : allMenuAdmin;
    document.getElementById('menuTable').innerHTML = filtered.map(m => `
      <tr>
        <td><img class="td-img" src="${m.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=80'}" alt="${m.name}" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=80'"/></td>
        <td><strong>${m.name}</strong></td>
        <td><span style="background:rgba(255,255,255,0.07);padding:0.2rem 0.6rem;border-radius:6px;font-size:0.78rem">${m.category}</span></td>
        <td><strong style="color:var(--secondary)">₹${m.price}</strong></td>
        <td><span class="badge badge-${m.veg ? 'veg' : 'nonveg'}">${m.veg ? '🟢 Veg' : '🔴 Non-Veg'}</span></td>
        <td>${'🌶️'.repeat(m.spicy || 0) || '—'}</td>
        <td><span class="badge ${m.available ? 'badge-active' : 'badge-cancelled'}">${m.available ? 'Available' : 'Unavailable'}</span></td>
        <td><div class="td-actions">
          <button class="btn-action btn-edit" onclick="editMenuItem('${m.id}')">✏️ Edit</button>
          <button class="btn-action btn-delete" onclick="deleteMenuItem('${m.id}','${m.name}')">🗑️ Delete</button>
        </div></td>
      </tr>
    `).join('');
  } catch (err) { showToast(err.message, 'error', '❌'); }
}

function openMenuModal(itemId = null) {
  editingMenuId = null;
  document.getElementById('menuModalTitle').textContent = 'Add Menu Item';
  document.getElementById('menuForm').reset();
  document.getElementById('menuModal').classList.add('open');
}

function closeMenuModal() { document.getElementById('menuModal').classList.remove('open'); }

function editMenuItem(id) {
  const item = allMenuAdmin.find(m => m.id === id);
  if (!item) return;
  editingMenuId = id;
  document.getElementById('menuModalTitle').textContent = 'Edit Menu Item';
  document.getElementById('mfName').value = item.name;
  document.getElementById('mfCategory').value = item.category;
  document.getElementById('mfPrice').value = item.price;
  document.getElementById('mfSpicy').value = item.spicy || 0;
  document.getElementById('mfDesc').value = item.description;
  document.getElementById('mfImage').value = item.image || '';
  document.getElementById('mfVeg').value = item.veg ? 'true' : 'false';
  document.getElementById('mfPopular').value = item.popular ? 'true' : 'false';
  document.getElementById('menuModal').classList.add('open');
}

document.getElementById('menuForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const body = {
    name: document.getElementById('mfName').value,
    category: document.getElementById('mfCategory').value,
    price: parseInt(document.getElementById('mfPrice').value),
    spicy: parseInt(document.getElementById('mfSpicy').value),
    description: document.getElementById('mfDesc').value,
    image: document.getElementById('mfImage').value || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
    veg: document.getElementById('mfVeg').value === 'true',
    popular: document.getElementById('mfPopular').value === 'true',
  };
  try {
    if (editingMenuId) {
      await API(`/api/menu/${editingMenuId}`, { method: 'PUT', body: JSON.stringify(body) });
      showToast('Menu item updated!', 'success', '✅');
    } else {
      await API('/api/menu', { method: 'POST', body: JSON.stringify(body) });
      showToast('Menu item added!', 'success', '✅');
    }
    closeMenuModal();
    loadMenuAdmin();
    loadStats();
  } catch (err) { showToast(err.message, 'error', '❌'); }
});

async function deleteMenuItem(id, name) {
  if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
  try {
    await API(`/api/menu/${id}`, { method: 'DELETE' });
    showToast(`"${name}" deleted`, 'info', '🗑️');
    loadMenuAdmin();
    loadStats();
  } catch (err) { showToast(err.message, 'error', '❌'); }
}

// ── BOOKINGS ──
let allBookings = [];
async function loadBookings() {
  try {
    allBookings = await API('/api/bookings');
    const search = (document.getElementById('bookingSearch')?.value || '').toLowerCase();
    const filtered = search ? allBookings.filter(b => b.name?.toLowerCase().includes(search) || b.email?.toLowerCase().includes(search) || b.bookingId?.toLowerCase().includes(search)) : allBookings;
    const statColors = { pending: '#f59e0b', confirmed: '#22c55e', cancelled: '#ef4444' };
    document.getElementById('bookingsTable').innerHTML = filtered.map(b => `
      <tr>
        <td><strong style="color:var(--secondary)">${b.bookingId}</strong></td>
        <td>${b.name}</td>
        <td>${b.phone}</td>
        <td>${b.date} · ${b.time}</td>
        <td>${b.guests} guests</td>
        <td>${b.occasion || '—'}</td>
        <td>
          <select class="status-select" onchange="updateBookingStatus('${b.id}',this.value)">
            ${['pending', 'confirmed', 'cancelled'].map(s => `<option value="${s}" ${b.status === s ? 'selected' : ''}>${s.charAt(0).toUpperCase() + s.slice(1)}</option>`).join('')}
          </select>
        </td>
        <td><div class="td-actions">
          <button class="btn-action btn-delete" onclick="deleteBooking('${b.id}')">🗑️</button>
        </div></td>
      </tr>
    `).join('');
  } catch (err) { showToast(err.message, 'error', '❌'); }
}

async function updateBookingStatus(id, status) {
  try {
    await API(`/api/bookings/${id}`, { method: 'PUT', body: JSON.stringify({ status }) });
    showToast(`✅ Booking ${status}`, 'success', '✅');
    await loadBookings();   // refresh table
    loadStats();
  } catch (err) { showToast(err.message, 'error', '❌'); }
}

async function deleteBooking(id) {
  if (!confirm('Delete this booking?')) return;
  try {
    await API(`/api/bookings/${id}`, { method: 'DELETE' });
    showToast('Booking deleted', 'info', '🗑️');
    loadBookings();
    loadStats();
  } catch (err) { showToast(err.message, 'error', '❌'); }
}

// ── MESSAGES ──
let allMessages = [];
async function loadMessages() {
  try {
    allMessages = await API('/api/messages');
    const search = (document.getElementById('msgSearch')?.value || '').toLowerCase();
    const filtered = search ? allMessages.filter(m => m.name?.toLowerCase().includes(search) || m.email?.toLowerCase().includes(search) || m.subject?.toLowerCase().includes(search)) : allMessages;
    document.getElementById('messagesTable').innerHTML = filtered.map(m => `
      <tr style="${!m.read ? 'background:rgba(232,93,4,0.04)' : ''}">
        <td><strong>${m.name}</strong></td>
        <td style="font-size:0.8rem">${m.email}</td>
        <td style="font-size:0.8rem">${m.phone || '—'}</td>
        <td style="font-size:0.8rem">${m.subject || '—'}</td>
        <td style="max-width:200px;font-size:0.78rem;color:rgba(255,255,255,0.6)">${m.message.substring(0, 60)}${m.message.length > 60 ? '...' : ''}</td>
        <td><span class="badge ${m.read ? 'badge-read' : 'badge-unread'}">${m.read ? 'Read' : '● New'}</span></td>
        <td style="font-size:0.78rem;color:rgba(255,255,255,0.4)">${new Date(m.createdAt).toLocaleDateString('en-IN')}</td>
        <td><div class="td-actions">
          <button class="btn-action btn-view" onclick="viewMessage('${m.id}')">👁 View</button>
          <button class="btn-action btn-delete" onclick="deleteMessage('${m.id}')">🗑️</button>
        </div></td>
      </tr>
    `).join('');
  } catch (err) { showToast(err.message, 'error', '❌'); }
}

async function viewMessage(id) {
  const m = allMessages.find(x => x.id === id);
  if (!m) return;
  document.getElementById('msgDetailContent').innerHTML = `
    <div style="display:flex;flex-direction:column;gap:0.8rem">
      <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:1rem">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;font-size:0.85rem">
          <div><span style="color:rgba(255,255,255,0.4)">From: </span>${m.name}</div>
          <div><span style="color:rgba(255,255,255,0.4)">Email: </span>${m.email}</div>
          ${m.phone ? `<div><span style="color:rgba(255,255,255,0.4)">Phone: </span>${m.phone}</div>` : ''}
          ${m.subject ? `<div><span style="color:rgba(255,255,255,0.4)">Subject: </span>${m.subject}</div>` : ''}
          <div><span style="color:rgba(255,255,255,0.4)">Date: </span>${new Date(m.createdAt).toLocaleString('en-IN')}</div>
        </div>
      </div>
      <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:1rem">
        <div style="font-size:0.75rem;color:rgba(255,255,255,0.4);margin-bottom:0.5rem">MESSAGE</div>
        <p style="font-size:0.9rem;line-height:1.6">${m.message}</p>
      </div>
    </div>
  `;
  document.getElementById('msgDetailModal').classList.add('open');
  // Mark as read
  if (!m.read) {
    try {
      await API(`/api/messages/${id}/read`, { method: 'PUT' });
      loadMessages(); loadStats();
    } catch { }
  }
}

async function deleteMessage(id) {
  if (!confirm('Delete this message?')) return;
  try {
    await API(`/api/messages/${id}`, { method: 'DELETE' });
    showToast('Message deleted', 'info', '🗑️');
    loadMessages(); loadStats();
  } catch (err) { showToast(err.message, 'error', '❌'); }
}

// ── USERS ──
let allUsers = [];
async function loadUsers() {
  try {
    allUsers = await API('/api/users');
    const search = (document.getElementById('userSearch')?.value || '').toLowerCase();
    const filtered = search ? allUsers.filter(u => u.name?.toLowerCase().includes(search) || u.email?.toLowerCase().includes(search)) : allUsers;
    document.getElementById('usersTable').innerHTML = filtered.map(u => `
      <tr>
        <td><div style="display:flex;align-items:center;gap:0.7rem">
          <div style="width:34px;height:34px;background:linear-gradient(135deg,var(--primary),var(--secondary));border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem">${u.name.split(' ').map(n => n[0]).join('').toUpperCase()}</div>
          <strong>${u.name}</strong>
        </div></td>
        <td style="font-size:0.85rem">${u.email}</td>
        <td style="font-size:0.85rem">${u.phone || '—'}</td>
        <td><span class="badge ${u.role === 'admin' ? 'badge-confirmed' : 'badge-active'}">${u.role}</span></td>
        <td style="font-size:0.78rem;color:rgba(255,255,255,0.4)">${new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
        <td><div class="td-actions">
          ${u.role !== 'admin' ? `<button class="btn-action btn-delete" onclick="deleteUser('${u.id}','${u.name}')">🗑️ Delete</button>` : '<span style="font-size:0.75rem;color:rgba(255,255,255,0.3)">Protected</span>'}
        </div></td>
      </tr>
    `).join('');
  } catch (err) { showToast(err.message, 'error', '❌'); }
}

async function deleteUser(id, name) {
  if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
  try {
    await API(`/api/users/${id}`, { method: 'DELETE' });
    showToast(`User "${name}" deleted`, 'info', '🗑️');
    loadUsers(); loadStats();
  } catch (err) { showToast(err.message, 'error', '❌'); }
}
