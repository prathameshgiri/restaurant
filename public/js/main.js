// ── CONSTANTS ──
const API = '';
let cart = JSON.parse(localStorage.getItem('sg_cart') || '[]');
let allMenuItems = [];
let currentCategory = 'all';
let reviewRating = 0;
let reviewsData = [];
let reviewOffset = 0;

// ── AUTH HELPERS ──
const getToken = () => localStorage.getItem('sg_token');
const getUser = () => { try { return JSON.parse(localStorage.getItem('sg_user')); } catch { return null; } };

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initNavbar();
    loadMenu();
    loadReviews();
    updateCartUI();
    renderNavAuth();
    initLazyLoad();
    initBookingMinDate();
});

// ── PARTICLES (decorative - no element needed) ──
function initParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return; // not present in new layout
    for (let i = 0; i < 20; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 8 + 4;
        p.style.cssText = `width:${size}px;height:${size}px;left:${Math.random() * 100}%;animation-duration:${Math.random() * 15 + 10}s;animation-delay:${Math.random() * 10}s;`;
        container.appendChild(p);
    }
}

// ── NAVBAR ──
function initNavbar() {
    window.addEventListener('scroll', () => {
        document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
    });
}

// ── NAV AUTH ──
function renderNavAuth() {
    const user = getUser();
    const area = document.getElementById('navAuthArea');
    if (!area) return;
    if (user) {
        const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
        area.innerHTML = `<div class="nav-user">
      <div class="nav-avatar">${initials}</div>
      <span style="font-size:0.85rem;color:var(--text);font-weight:500">${user.name.split(' ')[0]}</span>
      <div class="nav-dropdown">
        <a href="/dashboard">📦 My Orders</a>
        <button onclick="logout()">🚪 Logout</button>
      </div>
    </div>`;
    } else {
        area.innerHTML = `<a href="/user/login" class="btn-nav-login">Login</a>`;
    }
}

function logout() {
    localStorage.removeItem('sg_token');
    localStorage.removeItem('sg_user');
    localStorage.removeItem('sg_cart');
    cart = [];
    updateCartUI();
    renderNavAuth();
    showToast('Logged out successfully', 'info', '👋');
}

// ── MOBILE NAV ──
function toggleMobileNav() {
    document.getElementById('mobileNav').classList.toggle('open');
}

// ── BOOKING ──
function initBookingMinDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('bkDate').setAttribute('min', today);
}

document.getElementById('bookingForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('bookingBtn');
    const btnText = document.getElementById('bookingBtnText');
    btnText.textContent = 'Booking...';
    btn.disabled = true;
    try {
        const res = await fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: document.getElementById('bkName').value,
                email: document.getElementById('bkEmail').value,
                phone: document.getElementById('bkPhone').value,
                date: document.getElementById('bkDate').value,
                time: document.getElementById('bkTime').value,
                guests: document.getElementById('bkGuests').value,
                occasion: document.getElementById('bkOccasion').value,
                specialRequests: document.getElementById('bkSpecial').value,
            })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        showToast(`Table reserved! Booking ID: ${data.bookingId}`, 'success', '🪑');
        document.getElementById('bookingForm').reset();
    } catch (err) {
        showToast(err.message || 'Booking failed', 'error', '❌');
    } finally {
        btnText.textContent = '🪑 Reserve Table';
        btn.disabled = false;
    }
});

// ── MENU ──
async function loadMenu() {
    try {
        const res = await fetch('/api/menu');
        allMenuItems = await res.json();
        renderMenu(allMenuItems);
    } catch {
        document.getElementById('menuGrid').innerHTML = '<p style="color:rgba(255,255,255,0.4);text-align:center;padding:3rem;">Failed to load menu</p>';
    }
}

function filterMenu(cat) {
    currentCategory = cat;
    document.querySelectorAll('.cat-card').forEach(card => {
        card.classList.toggle('active', card.dataset.cat === cat);
    });
    const filtered = cat === 'all' ? allMenuItems : allMenuItems.filter(item => item.category === cat);
    renderMenu(filtered);
}

function renderMenu(items) {
    const grid = document.getElementById('menuGrid');
    if (!items.length) {
        grid.innerHTML = '<p style="color:rgba(255,255,255,0.4);text-align:center;padding:3rem;grid-column:1/-1;">No items in this category</p>';
        return;
    }
    grid.innerHTML = items.map((item, i) => `
    <div class="menu-card lazy-scale lazy-delay-${(i % 3) + 1}">
      <div class="menu-card-img">
        <img src="${item.image}" alt="${item.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'"/>
        ${item.popular ? '<div class="menu-badge">🔥 Popular</div>' : ''}
        <div class="menu-veg-badge ${item.veg ? 'veg' : 'nonveg'}"></div>
      </div>
      <div class="menu-card-body">
        <div class="menu-card-name">${item.name}</div>
        <div class="menu-card-desc">${item.description}</div>
        <div class="spicy-dots">
          ${[1, 2, 3].map(n => `<div class="spicy-dot ${n <= item.spicy ? 'hot' : ''}"></div>`).join('')}
        </div>
        <div class="menu-card-footer">
          <div class="menu-price">₹${item.price} <span>incl. taxes</span></div>
          <div class="menu-actions">
            <button class="btn-add-cart" title="Add to cart" onclick="addToCart('${item.id}')">🛒</button>
            <button class="btn-order-now" onclick="quickOrder('${item.id}')">Order Now</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
    initLazyLoad();
}

// ── CART ──
function addToCart(itemId) {
    const item = allMenuItems.find(m => m.id === itemId);
    if (!item) return;
    const existing = cart.find(c => c.id === itemId);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ id: item.id, name: item.name, price: item.price, image: item.image, qty: 1 });
    }
    saveCart();
    updateCartUI();
    showToast(`${item.name} added to cart`, 'success', '🛒');
}

function removeFromCart(itemId) {
    cart = cart.filter(c => c.id !== itemId);
    saveCart();
    updateCartUI();
    renderCartItems();
}

function updateQty(itemId, delta) {
    const item = cart.find(c => c.id === itemId);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) removeFromCart(itemId);
    else { saveCart(); updateCartUI(); renderCartItems(); }
}

function saveCart() { localStorage.setItem('sg_cart', JSON.stringify(cart)); }

function updateCartUI() {
    const total = cart.reduce((s, i) => s + i.qty, 0);
    document.getElementById('cartBadge').textContent = total;
    renderCartItems();
}

function renderCartItems() {
    const container = document.getElementById('cartItems');
    const footer = document.getElementById('cartFooter');
    if (!cart.length) {
        container.innerHTML = '<div class="cart-empty"><div class="cart-empty-icon">🛒</div><p>Your cart is empty</p><a href="#menu" class="btn-primary" onclick="toggleCart()" style="font-size:0.8rem;padding:0.5rem 1rem;margin-top:0.5rem">Browse Menu</a></div>';
        footer.style.display = 'none';
        return;
    }
    container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img class="cart-item-img" src="${item.image}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'"/>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">₹${item.price * item.qty}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="updateQty('${item.id}',-1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="updateQty('${item.id}',1)">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">🗑️</button>
    </div>
  `).join('');
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    document.getElementById('cartTotal').textContent = `₹${total}`;
    footer.style.display = 'block';
}

function toggleCart() {
    document.getElementById('cartSidebar').classList.toggle('open');
    document.getElementById('cartOverlay').classList.toggle('open');
}

// ── CHECKOUT ──
function proceedCheckout() {
    const user = getUser();
    if (!user) {
        toggleCart();
        showToast('Please login to checkout', 'info', '🔐');
        setTimeout(() => { window.location.href = '/user/login?redirect=/'; }, 1500);
        return;
    }
    toggleCart();
    openCheckoutModal();
}

function openCheckoutModal() {
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const user = getUser();
    document.getElementById('checkoutContent').innerHTML = `
    <div style="margin-bottom:1rem;">
      <p style="color:var(--text-muted);font-size:0.9rem;margin-bottom:1rem;">Review your order before placing</p>
      <div style="background:var(--cream);border:1px solid var(--border);border-radius:12px;padding:1rem;margin-bottom:1rem;max-height:200px;overflow-y:auto;">
        ${cart.map(i => `<div style="display:flex;justify-content:space-between;font-size:0.9rem;padding:0.4rem 0;border-bottom:1px solid var(--border);">
          <span style="color:var(--text);font-weight:500;">${i.name} × ${i.qty}</span><span style="color:var(--secondary);font-weight:600;">₹${i.price * i.qty}</span>
        </div>`).join('')}
        <div style="display:flex;justify-content:space-between;font-weight:700;margin-top:0.8rem;font-size:1.1rem;color:var(--dark);">
          <span>Total</span><span style="color:var(--primary);font-family:'Playfair Display',serif;">₹${total}</span>
        </div>
      </div>
      <div class="form-group" style="margin-bottom:1rem;">
        <label>Delivery Address *</label>
        <textarea id="coAddress" rows="2" placeholder="Enter full delivery address..." required style="width:100%">${user?.address || ''}</textarea>
      </div>
      <div class="form-group" style="margin-bottom:1rem;">
        <label>Payment Method *</label>
        <select id="coPayment" required style="width:100%">
          <option value="cash">💵 Cash on Delivery</option>
          <option value="upi">📱 UPI</option>
          <option value="card">💳 Card</option>
        </select>
      </div>
      <div class="form-group" style="margin-bottom:1.5rem;">
        <label>Special Instructions</label>
        <input type="text" id="coNotes" placeholder="Any special requests? (Optional)" style="width:100%"/>
      </div>
      <button class="btn-primary w-full" onclick="placeOrder()">Place Order — ₹${total}</button>
    </div>
  `;
    document.getElementById('checkoutModal').classList.add('open');
}

function closeCheckoutModal() { document.getElementById('checkoutModal').classList.remove('open'); }

async function placeOrder() {
    const token = getToken();
    if (!token) { showToast('Please login first', 'error', '🔐'); return; }
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    try {
        const res = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
                items: cart.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
                totalAmount: total,
                deliveryAddress: document.getElementById('coAddress').value,
                paymentMethod: document.getElementById('coPayment').value,
                notes: document.getElementById('coNotes').value,
            })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        cart = []; saveCart(); updateCartUI();
        closeCheckoutModal();
        showToast(`Order placed! ID: ${data.orderId}`, 'success', '🎉');
        setTimeout(() => { window.location.href = '/dashboard'; }, 2000);
    } catch (err) {
        showToast(err.message || 'Order failed', 'error', '❌');
    }
}

// ── QUICK ORDER ──
function quickOrder(itemId) {
    addToCart(itemId);
    toggleCart();
}

// ── REVIEWS ──
async function loadReviews() {
    try {
        const res = await fetch('/api/reviews');
        reviewsData = await res.json();
        renderReviews();
    } catch { }
}

function renderReviews() {
    const track = document.getElementById('reviewsTrack');
    const dots = document.getElementById('reviewsDots');
    track.innerHTML = reviewsData.map(r => `
    <div class="review-card">
      <div class="review-stars">${'⭐'.repeat(r.rating)}</div>
      <p class="review-text">"${r.comment}"</p>
      <div class="review-author">
        <div class="review-avatar">${r.avatar || r.name.split(' ').map(n => n[0]).join('').toUpperCase()}</div>
        <div><div class="review-author-name">${r.name}</div><div class="review-author-date">${r.date}</div></div>
      </div>
    </div>
  `).join('');
    dots.innerHTML = reviewsData.map((_, i) => `<div class="rev-dot ${i === 0 ? 'active' : ''}" onclick="goToReview(${i})"></div>`).join('');
}

function slideReviews(dir) {
    const maxOffset = Math.max(0, reviewsData.length - getVisibleCards());
    reviewOffset = Math.max(0, Math.min(maxOffset, reviewOffset + dir));
    applyReviewSlide();
}

function goToReview(idx) {
    reviewOffset = Math.min(idx, Math.max(0, reviewsData.length - getVisibleCards()));
    applyReviewSlide();
}

function getVisibleCards() { return window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3; }

function applyReviewSlide() {
    const cardWidth = 340 + 24;
    document.getElementById('reviewsTrack').style.transform = `translateX(-${reviewOffset * cardWidth}px)`;
    document.querySelectorAll('.rev-dot').forEach((d, i) => d.classList.toggle('active', i === reviewOffset));
}

// ── REVIEW MODAL ──
function openReviewModal() {
    if (!getUser()) {
        showToast('Please login to write a review', 'info', '🔐');
        setTimeout(() => { window.location.href = '/user/login?redirect=/'; }, 1500);
        return;
    }
    document.getElementById('reviewModal').classList.add('open');
}
function closeReviewModal() { document.getElementById('reviewModal').classList.remove('open'); }

function setRating(val) {
    reviewRating = val;
    document.querySelectorAll('.star-btn').forEach(s => {
        s.style.opacity = parseInt(s.dataset.val) <= val ? '1' : '0.3';
    });
}

async function submitReview() {
    if (!reviewRating) { showToast('Please select a rating', 'error', '⭐'); return; }
    const comment = document.getElementById('reviewText').value.trim();
    if (!comment) { showToast('Please write a comment', 'error', '✍️'); return; }
    try {
        const res = await fetch('/api/reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
            body: JSON.stringify({ rating: reviewRating, comment })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        showToast('Review submitted! Thank you 🙏', 'success', '⭐');
        closeReviewModal();
        loadReviews();
    } catch (err) { showToast(err.message, 'error', '❌'); }
}

// ── CONTACT FORM ──
document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('contactBtn');
    const btnText = document.getElementById('contactBtnText');
    btnText.textContent = 'Sending...';
    btn.disabled = true;
    try {
        const res = await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: document.getElementById('ctName').value,
                email: document.getElementById('ctEmail').value,
                phone: document.getElementById('ctPhone').value,
                subject: document.getElementById('ctSubject').value,
                message: document.getElementById('ctMessage').value,
            })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        showToast('Message sent! We\'ll respond within 24 hours.', 'success', '📨');
        document.getElementById('contactForm').reset();
    } catch (err) {
        showToast(err.message || 'Failed to send message', 'error', '❌');
    } finally {
        btnText.textContent = '📨 Send Message';
        btn.disabled = false;
    }
});

// ── TOAST ──
function showToast(message, type = 'info', icon = 'ℹ️') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.4s ease forwards';
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

// ── LAZY LOAD ──
function initLazyLoad() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05, rootMargin: '0px 0px 0px 0px' });
    document.querySelectorAll('.lazy-fade, .lazy-left, .lazy-right, .lazy-scale').forEach(el => {
        if (!el.classList.contains('visible')) observer.observe(el);
    });
}
