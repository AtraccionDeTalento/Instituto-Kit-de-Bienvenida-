const $ = id => document.getElementById(id);

// Abrir y Cerrar Modales
function openModal(id) {
  const modal = $(id);
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Actualizar hash en URL sin recargar la página para habilitar enlaces directos
    const hash = id.replace('Modal', '');
    history.replaceState(null, null, '#' + hash);
  }
}

function closeModal(id) {
  const modal = $(id);
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    // Limpiar hash de la URL
    history.replaceState(null, null, ' ');
  }
}

// Cerrar modales clickeando afuera (en el overlay)
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) {
      closeModal(overlay.id);
    }
  });
});

// Cerrar modales con la tecla Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(openOverlay => {
      closeModal(openOverlay.id);
    });
  }
});

// Asignar eventos de click a los cards de enlace
document.querySelectorAll('.link-card').forEach(card => {
  card.addEventListener('click', e => {
    // Si se clickea el botón de tres puntos (menú de contexto), mostrar el menú y frenar el click general
    if (e.target.closest('.link-menu-btn')) {
      e.stopPropagation();
      showContextMenu(e, card);
      return;
    }

    const modalId = card.dataset.modal;
    if (modalId) {
      openModal(modalId);
    }
  });
});

// Botón compartir general (Top Right)
$('shareBtn').addEventListener('click', () => openModal('shareModal'));

// Copiar enlace general en Share Modal
$('copyLinkBtn').addEventListener('click', () => {
  const url = window.location.origin + window.location.pathname;
  copyToClipboard(url);
});

// Compartir por WhatsApp
function shareWhatsApp() {
  const url = window.location.origin + window.location.pathname;
  const text = encodeURIComponent("¡Hola! Te comparto el Toolkit de Bienvenida del Instituto de Emprendedores USIL: " + url);
  window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
}

// Compartir por Facebook
function shareFacebook() {
  const url = encodeURIComponent(window.location.origin + window.location.pathname);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
}

// Compartir por LinkedIn
function shareLinkedIn() {
  const url = encodeURIComponent(window.location.origin + window.location.pathname);
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
}

// Compartir por X (Twitter)
function shareX() {
  const url = encodeURIComponent(window.location.origin + window.location.pathname);
  const text = encodeURIComponent("¡Hola! Te comparto el Toolkit de Bienvenida del Instituto de Emprendedores USIL: ");
  window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
}

// Compartir por Correo
function shareEmail() {
  const url = encodeURIComponent(window.location.origin + window.location.pathname);
  const subject = encodeURIComponent("Toolkit de Bienvenida del Instituto de Emprendedores USIL");
  const body = encodeURIComponent("¡Hola! Te comparto el Toolkit de Bienvenida del Instituto de Emprendedores USIL:\n\n" + decodeURIComponent(url));
  window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
}

// Función de copiar al portapapeles con fallback
function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(showToast);
  } else {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast();
  }
}

function showToast() {
  const t = $('toast');
  t.style.display = 'block';
  setTimeout(() => t.style.display = 'none', 3000);
}

// Navegación de Pestañas (Tabs) en el modal de Campus
function switchTab(event, tabId) {
  // Ocultar todos los contenidos de pestaña
  const modalBody = event.target.closest('.modal-body');
  modalBody.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });

  // Desactivar todos los botones de pestaña
  modalBody.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  // Mostrar el contenido seleccionado y activar el botón
  $(tabId).classList.add('active');
  event.target.classList.add('active');
}

// Menú contextual de 3 puntos
let activeContextMenu = null;

function showContextMenu(e, card) {
  removeContextMenu();
  
  const modalId = card.dataset.modal;
  const sectionHash = modalId.replace('Modal', '');
  const directLink = window.location.origin + window.location.pathname + '#' + sectionHash;

  const menu = document.createElement('div');
  menu.style.cssText = `
    position: absolute; background: #fff; border-radius: 12px;
    box-shadow: 0 8px 30px rgba(0, 43, 94, 0.15); z-index: 500;
    min-width: 170px; overflow: hidden; border: 1px solid #e2e8f0;
  `;
  menu.innerHTML = `
    <button class="ctx-item" data-action="open" style="width:100%; text-align:left; padding:12px 16px; border:none; background:none; cursor:pointer; font-weight:600; color:#002b5e; font-family:'Inter', sans-serif; border-bottom:1px solid #eee; font-size:13px; display:flex; align-items:center; gap:8px;">
      <i class="fas fa-arrow-up-right-from-square" style="color:#64748b;"></i> Ver detalles
    </button>
    <button class="ctx-item" data-action="copy" style="width:100%; text-align:left; padding:12px 16px; border:none; background:none; cursor:pointer; font-weight:600; color:#002b5e; font-family:'Inter', sans-serif; border-bottom:1px solid #eee; font-size:13px; display:flex; align-items:center; gap:8px;">
      <i class="fas fa-link" style="color:#64748b;"></i> Copiar sección
    </button>
    <button class="ctx-item" data-action="share" style="width:100%; text-align:left; padding:12px 16px; border:none; background:none; cursor:pointer; font-weight:600; color:#002b5e; font-family:'Inter', sans-serif; font-size:13px; display:flex; align-items:center; gap:8px;">
      <i class="fas fa-share-nodes" style="color:#64748b;"></i> Compartir
    </button>
  `;

  const rect = e.currentTarget.getBoundingClientRect();
  menu.style.top = (rect.bottom + window.scrollY + 6) + 'px';
  menu.style.left = (rect.right + window.scrollX - 170) + 'px';

  // Añadir eventos a los botones del menú
  menu.querySelectorAll('.ctx-item').forEach(item => {
    item.addEventListener('click', () => {
      const action = item.dataset.action;
      if (action === 'open') {
        openModal(modalId);
      } else if (action === 'copy') {
        copyToClipboard(directLink);
      } else if (action === 'share') {
        openModal('shareModal');
      }
      removeContextMenu();
    });
  });

  document.body.appendChild(menu);
  activeContextMenu = menu;
  
  // Registrar cierre al hacer click en cualquier parte
  setTimeout(() => {
    document.addEventListener('click', removeContextMenu, { once: true });
  }, 10);
}

function removeContextMenu() {
  if (activeContextMenu) {
    activeContextMenu.remove();
    activeContextMenu = null;
  }
}

// Soporte de enrutamiento por Hash en URL al cargar la página
window.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash.substring(1);
  if (hash) {
    const modalId = hash + 'Modal';
    if ($(modalId)) {
      setTimeout(() => openModal(modalId), 300);
    }
  }
});
