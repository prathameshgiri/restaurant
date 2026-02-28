function checkAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    const navAuth = document.getElementById('nav-auth');
    if (!navAuth) return;

    if (user) {
        navAuth.innerHTML = `
            <span style="font-weight:600; color:var(--text-muted); font-size:0.88rem; margin-right:4px;">Hi, ${user.name}</span>
            ${user.role === 'user'
                ? `<a href="my-orders.html" class="btn btn-outline" style="padding:0.6rem 1.1rem; font-size:0.85rem; margin-right:4px;">
                       My Orders
                   </a>`
                : `<a href="admin.html" class="btn btn-outline" style="padding:0.6rem 1.1rem; font-size:0.85rem; margin-right:4px;">
                       Dashboard
                   </a>`
            }
            <button class="btn btn-primary" onclick="logout()" style="padding:0.6rem 1.1rem; font-size:0.85rem;">
                Logout
            </button>
        `;
    }
}

function logout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', checkAuth);

