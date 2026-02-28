const menuItems = [
    // Starters
    { id: 1, name: 'Bruschetta al Pomodoro', price: 299, desc: 'Toasted ciabatta with fresh tomatoes, basil & aged balsamic glaze.', img: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=500&q=80', category: 'starters', badge: 'Popular', veg: true, rating: 5, time: '10 min' },
    { id: 2, name: 'Crispy Calamari', price: 349, desc: 'Golden fried squid rings served with zesty lemon aioli and marinara.', img: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500&q=80', category: 'starters', badge: '', veg: false, rating: 4, time: '12 min' },
    { id: 3, name: 'Garlic Prawn Toast', price: 449, desc: 'Juicy tiger prawns on golden sourdough toast with herb butter.', img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&q=80', category: 'starters', badge: "Chef's Pick", veg: false, rating: 5, time: '15 min' },
    { id: 13, name: 'Caprese Salad', price: 279, desc: 'Fresh mozzarella, heirloom tomatoes, basil & balsamic reduction.', img: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=500&q=80', category: 'starters', badge: 'Veg', veg: true, rating: 4, time: '8 min' },

    // Mains
    { id: 4, name: 'Ribeye Steak', price: 1299, desc: '300g grain-fed ribeye with roasted garlic mash and red wine jus.', img: 'https://images.unsplash.com/photo-1558030006-450675393462?w=500&q=80', category: 'mains', badge: 'Bestseller', veg: false, rating: 5, time: '30 min' },
    { id: 5, name: 'Grilled Sea Bass', price: 999, desc: 'Mediterranean sea bass with capers, olives, lemon and fresh herbs.', img: 'https://images.unsplash.com/photo-1485921325833-c519793a4e0b?w=500&q=80', category: 'mains', badge: '', veg: false, rating: 4, time: '25 min' },
    { id: 6, name: 'Wild Mushroom Risotto', price: 749, desc: 'Creamy Arborio rice with porcini, truffle oil, and aged parmesan.', img: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=500&q=80', category: 'mains', badge: 'Veg', veg: true, rating: 5, time: '20 min' },
    { id: 14, name: 'Butter Chicken', price: 499, desc: 'Tender chicken in rich, creamy tomato-based sauce with aromatic spices.', img: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&q=80', category: 'mains', badge: 'Spicy', veg: false, rating: 5, time: '20 min' },

    // Pasta
    { id: 7, name: 'Truffle Fettuccine', price: 899, desc: 'Handmade pasta with black truffle shavings, cream, and parmesan.', img: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=500&q=80', category: 'pasta', badge: "Chef's Pick", veg: true, rating: 5, time: '20 min' },
    { id: 8, name: 'Seafood Linguine', price: 999, desc: 'Tiger prawns, clams & mussels tossed in white wine and garlic sauce.', img: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=500&q=80', category: 'pasta', badge: '', veg: false, rating: 4, time: '22 min' },
    { id: 9, name: 'Pesto Chicken Penne', price: 749, desc: 'Grilled chicken, penne and house-made basil pesto with cherry tomatoes.', img: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&q=80', category: 'pasta', badge: 'Popular', veg: false, rating: 4, time: '18 min' },
    { id: 15, name: 'Arrabbiata Pasta', price: 599, desc: 'Penne in a spicy tomato sauce with garlic, chilli flakes and fresh basil.', img: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=500&q=80', category: 'pasta', badge: 'Veg', veg: true, rating: 4, time: '15 min' },

    // Desserts
    { id: 10, name: 'Tiramisu Classico', price: 329, desc: 'Authentic Italian tiramisu â€” espresso-soaked ladyfingers & mascarpone.', img: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&q=80', category: 'desserts', badge: 'Popular', veg: true, rating: 5, time: '5 min' },
    { id: 11, name: 'Molten Lava Cake', price: 399, desc: 'Warm dark chocolate fondant with vanilla ice cream & berry coulis.', img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&q=80', category: 'desserts', badge: '', veg: true, rating: 5, time: '15 min' },
    { id: 12, name: 'CrÃ¨me BrÃ»lÃ©e', price: 349, desc: 'Classic vanilla custard with a perfectly caramelised sugar crust.', img: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=500&q=80', category: 'desserts', badge: "Chef's Pick", veg: true, rating: 4, time: '10 min' },
    { id: 16, name: 'Mango Panna Cotta', price: 299, desc: 'Silky Italian cream dessert topped with fresh mango coulis and mint.', img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&q=80', category: 'desserts', badge: 'Seasonal', veg: true, rating: 5, time: '5 min' }
];

let cart = [];

function rupee(amount) {
    return 'â‚¹' + amount.toLocaleString('en-IN');
}

function renderStars(rating) {
    let h = '';
    for (let i = 1; i <= 5; i++) h += i <= rating ? '' : '';
    return h;
}

function loadMenu(filter = 'all') {
    const container = document.getElementById('menu-container');
    if (!container) return;
    const filtered = filter === 'all' ? menuItems : menuItems.filter(i => i.category === filter);
    container.innerHTML = filtered.map(item => `
        <div class="food-card lazy-fade">
            <div class="food-card-img-wrap">
                ${item.badge ? `<span class="food-card-badge ${item.veg ? 'veg' : ''}">${item.badge}</span>` : ''}
                <span class="food-card-time">${item.time}</span>
                <img src="${item.img}" class="food-img" alt="${item.name}" loading="lazy"
                     onerror="this.src='https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&q=80'">
                <div class="food-card-overlay">
                    <button class="quick-add-btn" onclick="addToCart(${item.id})">
                        Quick Add
                    </button>
                </div>
            </div>
            <div class="food-card-body">
                <div class="food-card-meta">
                    <span class="food-cat-tag">${item.category}</span>
                    <div class="stars">${renderStars(item.rating)}</div>
                </div>
                <h3>${item.name}</h3>
                <p>${item.desc}</p>
                <div class="card-footer">
                    <span class="price">${rupee(item.price)}</span>
                    <button class="add-btn" onclick="addToCart(${item.id})">
                        Add to Order
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Staggered entrance animation
    const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) setTimeout(() => entry.target.classList.add('visible'), i * 80);
        });
    }, { threshold: 0.08 });
    container.querySelectorAll('.lazy-fade').forEach(el => obs.observe(el));
}

function filterMenu(category, btn) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    const container = document.getElementById('menu-container');
    if (container) {
        container.style.opacity = '0';
        container.style.transform = 'translateY(10px)';
        setTimeout(() => {
            loadMenu(category);
            container.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
        }, 200);
    }
}

function addToCart(id) {
    const item = menuItems.find(i => i.id === id);
    const inCart = cart.find(i => i.id === id);
    if (inCart) inCart.qty++;
    else cart.push({ ...item, qty: 1 });
    updateCartUI();
    toggleCart(true);
}

function removeFromCart(id) {
    const inCart = cart.find(i => i.id === id);
    if (inCart && inCart.qty > 1) inCart.qty--;
    else cart = cart.filter(i => i.id !== id);
    updateCartUI();
}

function deleteFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    updateCartUI();
}

function updateCartUI() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('total-price');
    const countEl = document.getElementById('cart-count');
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const count = cart.reduce((s, i) => s + i.qty, 0);
    if (countEl) countEl.innerText = count;
    if (totalEl) totalEl.innerText = rupee(total);
    if (!container) return;
    if (cart.length === 0) {
        container.innerHTML = `
            <div style="text-align:center;color:var(--text-muted);padding:3rem 0;">
                <p style="font-weight:600;">🛒 Your cart is empty</p>
                <p style="font-size:0.85rem;margin-top:0.4rem;">Browse our menu and add something delicious!</p>
            </div>`;
    } else {
        container.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div style="flex:1;min-width:0;">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${rupee(item.price)} each</div>
                </div>
                <div style="display:flex;align-items:center;gap:8px;">
                    <button onclick="removeFromCart(${item.id})" style="background:var(--bg-alt);border:1px solid var(--border);border-radius:6px;width:28px;height:28px;cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center;">âˆ’</button>
                    <span style="font-weight:700;min-width:20px;text-align:center;">${item.qty}</span>
                    <button onclick="addToCart(${item.id})" style="background:var(--primary);color:white;border:none;border-radius:6px;width:28px;height:28px;cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center;">+</button>
                </div>
                <div class="cart-item-total" style="min-width:70px;text-align:right;">${rupee(item.price * item.qty)}</div>
                <button onclick="deleteFromCart(${item.id})" style="background:none;border:none;color:#e74c3c;cursor:pointer;font-size:0.9rem;margin-left:4px;"></button>
            </div>
        `).join('');
    }
}

function toggleCart(show = null) {
    const cartOverlay = document.getElementById('cart-overlay');
    const backdrop = document.getElementById('cart-backdrop');
    if (!cartOverlay) return;
    const shouldShow = show === null ? !cartOverlay.classList.contains('active') : show;
    cartOverlay.classList.toggle('active', shouldShow);
    if (backdrop) backdrop.style.display = shouldShow ? 'block' : 'none';
    document.body.style.overflow = shouldShow ? 'hidden' : '';
}

async function placeOrder() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) { alert('Please login to place an order.'); window.location.href = 'login.html'; return; }
    if (cart.length === 0) { alert('Your cart is empty.'); return; }
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    try {
        const res = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user: user.name,
                items: cart.map(i => `${i.name} (${i.qty})`).join(', '),
                total: rupee(total)
            })
        });
        const result = await res.json();
        if (result.success) {
            alert('ðŸŽ‰ Order placed! Check My Orders to track status.');
            cart = []; updateCartUI(); toggleCart(false);
        }
    } catch {
        alert('ðŸŽ‰ Order placed! (Demo mode)');
        cart = []; updateCartUI(); toggleCart(false);
    }
}

document.addEventListener('DOMContentLoaded', () => { loadMenu(); updateCartUI(); });

