/* =====================================================
   TRIPKIES — main.js
   Funções organizadas e padronizadas
   ===================================================== */

/* ---------- UTIL ---------- */
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ---------- MODAIS ---------- */
function openModal(id) {
  const modal = document.getElementById(id) || document.getElementById(`modal-${id}`);
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // trava o scroll
  }
}

function closeModal(id) {
  const modal = document.getElementById(id) || document.getElementById(`modal-${id}`);
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = ''; // libera o scroll
  }
}

// Fechar modais ao clicar fora
window.addEventListener('click', (e) => {
  document.querySelectorAll('.modal').forEach(m => {
    if (e.target === m) {
      m.style.display = 'none';
      document.body.style.overflow = '';
    }
  });
});

/* ---------- CARRINHO ---------- */
const CART_KEY = 'tripkies_cart_v1';
let cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  renderCart();
  updateCartCount();
}

function addToCart(name, price) {
  const existing = cart.find(i => i.name === name);
  if (existing) existing.qty += 1;
  else cart.push({ name, price, qty: 1 });
  saveCart();
  flashMessage(`${name} adicionado ao carrinho`);
  openCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
}

function changeQty(index, delta) {
  if (!cart[index]) return;
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  saveCart();
}

function renderCart() {
  const container = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  if (!container) return;

  container.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    container.innerHTML = '<p>Seu carrinho está vazio.</p>';
  } else {
    cart.forEach((it, idx) => {
      const line = document.createElement('div');
      Object.assign(line.style, {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '8px'
      });
      line.innerHTML = `
        <div style="min-width:120px;">${it.qty}x ${it.name}</div>
        <div style="min-width:70px;">R$ ${(it.price * it.qty).toFixed(2)}</div>
        <div>
          <button onclick="changeQty(${idx}, -1)">➖</button>
          <button onclick="changeQty(${idx}, 1)">➕</button>
          <button onclick="removeFromCart(${idx})">❌</button>
        </div>
      `;
      container.appendChild(line);
      total += it.price * it.qty;
    });
  }

  if (totalEl) totalEl.textContent = `Total: R$ ${total.toFixed(2)}`;
  updateCartCount();
}

/* ---------- MENSAGEM FLASH ---------- */
function flashMessage(msg) {
  const el = document.createElement('div');
  el.textContent = msg;
  Object.assign(el.style, {
    position: 'fixed',
    right: '20px',
    bottom: '20px',
    background: 'rgba(0,0,0,0.85)',
    color: '#fff',
    padding: '10px 14px',
    borderRadius: '8px',
    zIndex: 2000
  });
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1600);
}

/* ---------- CART PANEL ---------- */
const cartToggle = document.getElementById('cart-toggle');

function openCart() {
  const panel = document.getElementById('cart-panel');
  if (panel) panel.classList.add('open');
}

function closeCart() {
  const panel = document.getElementById('cart-panel');
  if (panel) panel.classList.remove('open');
}

function toggleCart() {
  const panel = document.getElementById('cart-panel');
  if (panel) panel.classList.toggle('open');
}

if (cartToggle) cartToggle.addEventListener('click', toggleCart);

function updateCartCount() {
  const countEl = document.getElementById('cart-count');
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  if (countEl) countEl.textContent = totalQty;
}

/* ---------- WHATSAPP ---------- */
function sendWhatsApp() {
  if (cart.length === 0) {
    alert('Seu carrinho está vazio!');
    return;
  }

  const numeroWhats = '554197825384';
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const itemsText = cart.map(i => `${i.qty}x ${i.name} - R$ ${(i.price * i.qty).toFixed(2)}`).join('%0A');
  const text = `🍪 *Novo pedido Tripkies* 🍪%0A%0A${itemsText}%0A%0A💰 Total: R$ ${total.toFixed(2)}`;
  window.open(`https://wa.me/${numeroWhats}?text=${encodeURIComponent(text)}`, '_blank');
}

/* ---------- ORDER FORM ---------- */
function openOrderForm() {
  if (cart.length === 0) {
    alert('Seu carrinho está vazio!');
    return;
  }
  document.getElementById('order-form').style.display = 'flex';
}

function closeOrderForm() {
  document.getElementById('order-form').style.display = 'none';
}

function submitOrder(e) {
  e.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const endereco = document.getElementById('endereco').value.trim();
  const pagamento = document.getElementById('pagamento').value;

  if (!nome || !endereco || !pagamento) {
    alert('Preencha todos os campos');
    return;
  }

  const numeroWhats = '554197825384';
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const itemsText = cart.map(i => `${i.qty}x ${i.name} - R$ ${(i.price * i.qty).toFixed(2)}`).join('%0A');
  const baseText = `🍪 *Novo pedido Tripkies* 🍪%0A%0A👤 Nome: ${nome}%0A🏠 Endereço: ${endereco}%0A💳 Pagamento: ${pagamento}%0A%0A📦 Pedido:%0A${itemsText}%0A%0A💰 Total: R$ ${total.toFixed(2)}`;
  window.open(`https://wa.me/${numeroWhats}?text=${encodeURIComponent(baseText)}`, '_blank');

  cart = [];
  saveCart();
  document.getElementById('checkout-form').reset();
  closeOrderForm();
  closeCart();
}

/* ---------- LOGIN / CADASTRO ---------- */
document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  updateCartCount();

  const showRegister = document.getElementById('show-register');
  const showLogin = document.getElementById('show-login');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const loginTitle = document.getElementById('modal-login-title');

  if (showRegister) {
    showRegister.addEventListener('click', (e) => {
      e.preventDefault();
      loginForm.style.display = 'none';
      registerForm.style.display = 'block';
      loginTitle.textContent = 'Criar Conta';
    });
  }

  if (showLogin) {
    showLogin.addEventListener('click', (e) => {
      e.preventDefault();
      registerForm.style.display = 'none';
      loginForm.style.display = 'block';
      loginTitle.textContent = 'Entrar';
    });
  }
});

const cartDropdown = document.getElementById('cart-dropdown');

if (cartToggle && cartDropdown) {
  cartToggle.addEventListener('click', () => {
    cartDropdown.classList.toggle('active');
  });
}
