/* ══════════════════════════════════════
   MUARÉ — A Resurrección do Baile
   main.js
══════════════════════════════════════ */

// ── Estado ──
let selectedTicket = null;
let qty = 1;

// ── Audio ──
const audio = document.getElementById('bg-audio');
const audioBtn = document.getElementById('audio-btn');
let audioPlaying = false;

function toggleAudio() {
  if (audioPlaying) {
    audio.pause();
    audioBtn.textContent = '♪';
    audioBtn.title = 'Reproducir música';
  } else {
    audio.play().catch(() => {});
    audioBtn.textContent = '■';
    audioBtn.title = 'Pausar música';
  }
  audioPlaying = !audioPlaying;
}

function startAudio() {
  audio.volume = 0.35;
  audio.play().then(() => {
    audioPlaying = true;
    audioBtn.textContent = '■';
    audioBtn.title = 'Pausar música';
  }).catch(() => {
    // Si el navegador bloquea autoplay, el botón permite activarlo
    audioPlaying = false;
    audioBtn.textContent = '♪';
    audioBtn.title = 'Reproducir música';
  });
}

// ── Seleccionar ticket ──
function selectTicket(el) {
  document.querySelectorAll('.ticket-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  selectedTicket = {
    type: el.dataset.type,
    price: parseInt(el.dataset.price)
  };
  document.getElementById('ticket-warning').classList.remove('visible');
  updateTotal();
}

// ── Cantidad ──
function changeQty(delta) {
  qty = Math.max(1, Math.min(20, qty + delta));
  document.getElementById('qty-display').textContent = qty;
  updateTotal();
}

function updateTotal() {
  const el = document.getElementById('total-display');
  if (selectedTicket) {
    el.textContent = (selectedTicket.price * qty) + ' €';
  } else {
    el.textContent = '—';
  }
}

// ── Validación ──
function validateEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}
function validatePhone(v) {
  return /^[\d\s\+\-]{6,15}$/.test(v.trim());
}

// ── Submit ──
function handleSubmit() {
  let valid = true;

  const email = document.getElementById('inp-email').value;
  const phone = document.getElementById('inp-phone').value;

  // Reset errors
  ['email', 'phone'].forEach(f => {
    document.getElementById('inp-' + f).classList.remove('error');
    document.getElementById('err-' + f).classList.remove('visible');
  });
  document.getElementById('ticket-warning').classList.remove('visible');

  // Validate ticket
  if (!selectedTicket) {
    document.getElementById('ticket-warning').classList.add('visible');
    document.getElementById('ticket-grid').scrollIntoView({ behavior: 'smooth', block: 'center' });
    valid = false;
  }

  // Validate email
  if (!validateEmail(email)) {
    document.getElementById('inp-email').classList.add('error');
    document.getElementById('err-email').classList.add('visible');
    valid = false;
  }

  // Validate phone
  if (!validatePhone(phone)) {
    document.getElementById('inp-phone').classList.add('error');
    document.getElementById('err-phone').classList.add('visible');
    valid = false;
  }

  if (!valid) return;

  const total = selectedTicket.price * qty;

  // Enviar email vía mailto
  const subject = encodeURIComponent('Reserva Muaré — ' + selectedTicket.type + ' x' + qty);
  const body = encodeURIComponent(
    'RESERVA MUARÉ — A RESURRECCIÓN DO BAILE\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
    'E-mail: ' + email.trim() + '\n' +
    'Teléfono: ' + phone.trim() + '\n' +
    'Tipo de entrada: ' + selectedTicket.type + ' (' + selectedTicket.price + '€)\n' +
    'Número de entradas: ' + qty + '\n' +
    'TOTAL: ' + total + '€\n\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    'Pendente de Bizum: ' + total + '€ ó 650 88 71 09\n' +
    'Concepto Bizum: ' + email.trim()
  );
  window.location.href = 'mailto:muare.music@gmail.com?subject=' + subject + '&body=' + body;

  // Populate confirm page
  document.getElementById('c-email').textContent = email.trim();
  document.getElementById('c-phone').textContent = phone.trim();
  document.getElementById('c-type').textContent = selectedTicket.type + ' — ' + selectedTicket.price + '€';
  document.getElementById('c-qty').textContent = qty;
  document.getElementById('c-total').textContent = total + ' €';
  document.getElementById('c-bizum-amount').textContent = total + ' €';

  // Switch view
  document.getElementById('page-main').style.display = 'none';
  document.getElementById('page-confirm').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Start audio on confirm page
  startAudio();
}
