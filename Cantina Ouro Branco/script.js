// =========================================================
// Cantina Ouro Branco — script.js
// =========================================================

// ---------- Menu mobile (hambúrguer) ----------
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.textContent = isOpen ? '✕' : '☰';
  });

  // fecha o menu ao clicar em um link (mobile)
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.textContent = '☰';
    });
  });
}

// ---------- Ano dinâmico no rodapé ----------
const anoEl = document.getElementById('ano');
if (anoEl) anoEl.textContent = new Date().getFullYear();

// ---------- Toast simples ----------
function showToast(msg, duration = 3200) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('show'), duration);
}

// ---------- Formulário de reserva -> WhatsApp ----------
const WHATSAPP_NUMERO = '5511914770387';

const reservaForm = document.getElementById('reservaForm');
const formMsg = document.getElementById('formMsg');

if (reservaForm) {
  reservaForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const pessoas = document.getElementById('pessoas').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const data = document.getElementById('data').value;
    const horario = document.getElementById('horario').value;
    const obs = document.getElementById('obs').value.trim();

    if (!nome || !pessoas || !telefone || !data || !horario) {
      formMsg.textContent = 'Preencha todos os campos obrigatórios antes de enviar.';
      return;
    }

    const dataFormatada = formatarData(data);

    let texto = `Olá! Gostaria de reservar uma mesa na Cantina Ouro Branco.%0A`;
    texto += `Nome: ${nome}%0A`;
    texto += `Pessoas: ${pessoas}%0A`;
    texto += `Data: ${dataFormatada}%0A`;
    texto += `Horário: ${horario}%0A`;
    texto += `Telefone para contato: ${telefone}`;
    if (obs) texto += `%0AObservações: ${obs}`;

    const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${texto}`;
    window.open(url, '_blank', 'noopener');

    formMsg.textContent = 'Abrindo o WhatsApp com sua reserva preenchida...';
    showToast('Reserva pronta para envio pelo WhatsApp!');
  });
}

function formatarData(isoDate) {
  const [ano, mes, dia] = isoDate.split('-');
  return `${dia}/${mes}/${ano}`;
}

// ---------- PWA: prompt de instalação ----------
let deferredPrompt;
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredPrompt = event;
  if (installBtn) installBtn.classList.add('show');
});

if (installBtn) {
  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      showToast('Aplicativo instalado! Obrigado ✨');
    }
    deferredPrompt = null;
    installBtn.classList.remove('show');
  });
}

window.addEventListener('appinstalled', () => {
  if (installBtn) installBtn.classList.remove('show');
});

// ---------- Aviso simples de status offline/online ----------
window.addEventListener('offline', () => showToast('Você está offline — mostrando conteúdo salvo.'));
window.addEventListener('online', () => showToast('Conexão restabelecida.'));

// ---------- Registro do Service Worker ----------
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(err => {
      console.log('Falha ao registrar o Service Worker:', err);
    });
  });
}
