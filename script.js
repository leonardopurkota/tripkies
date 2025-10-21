/* ---------- UTIL ---------- */
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ---------- MODAIS ---------- */
function openModal(id) {
  const modal = document.getElementById(`modal-${id}`);
  if (modal) modal.style.display = 'flex';
}

function closeModal(id) {
  const modal = document.getElementById(`modal-${id}`);
  if (modal) modal.style.display = 'none';
}

/* fechar modal ao clicar fora */
window.addEventListener('click', function (e) {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(m => { if (e.target === m) m.style.display = 'none'; });
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
  openCart(); // abre o painel para feedback
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
      line.style.display = 'flex';
      line.style.justifyContent = 'space-between';
      line.style.alignItems = 'center';
      line.style.gap = '8px';
      line.style.marginBottom = '8px';
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

/* mensagem curta */
function flashMessage(msg) {
  const el = document.createElement('div');
  el.textContent = msg;
  el.style.position = 'fixed';
  el.style.right = '20px';
  el.style.bottom = '20px';
  el.style.background = 'rgba(0,0,0,0.85)';
  el.style.color = '#fff';
  el.style.padding = '10px 14px';
  el.style.borderRadius = '8px';
  el.style.zIndex = 2000;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1600);
}

/* ---------- CART PANEL ---------- */
const cartPanel = document.getElementById('cart-panel');
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
  if (!panel) return;
  panel.classList.toggle('open');
}

/* abrir / fechar com botão */
if (cartToggle) cartToggle.addEventListener('click', toggleCart);

function updateCartCount() {
  const countEl = document.getElementById('cart-count');
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  if (countEl) countEl.textContent = totalQty;
}

/* ---------- WHATSAPP ---------- */
function sendWhatsApp() {
  if (cart.length === 0) { alert('Seu carrinho está vazio!'); return; }
  const numeroWhats = '554197825384'; // troque para seu número (formato internacional sem +)
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const itemsText = cart.map(i => `${i.qty}x ${i.name} - R$ ${(i.price * i.qty).toFixed(2)}`).join('%0A');
  const text = `🍪 *Novo pedido Tripkies* 🍪%0A%0A${itemsText}%0A%0A💰 Total: R$ ${total.toFixed(2)}`;
  window.open(`https://wa.me/${numeroWhats}?text=${encodeURIComponent(text)}`, '_blank');
}

/* ---------- ORDER FORM ---------- */
function openOrderForm() {
  if (cart.length === 0) { alert('Seu carrinho está vazio!'); return; }
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
  if (!nome || !endereco || !pagamento) { alert('Preencha todos os campos'); return; }

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

/* init */
document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  updateCartCount();
});
