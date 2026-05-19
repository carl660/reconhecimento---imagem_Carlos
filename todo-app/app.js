/* ═══════════════════════════════════════════════════════════════
   TaskFlow — app.js
   localStorage structure: { users: [], todos: [] }
   currentUser key: "currentUser"
   ═══════════════════════════════════════════════════════════════ */

// ── DB Layer ──────────────────────────────────────────────────

const DB_KEY = 'taskflow_db';
const CU_KEY = 'currentUser';

function getDB() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    return raw ? JSON.parse(raw) : { users: [], todos: [] };
  } catch {
    return { users: [], todos: [] };
  }
}

function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

// ── Current User ──────────────────────────────────────────────

function getCurrentUser() {
  try {
    const raw = localStorage.getItem(CU_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setCurrentUser(user) {
  localStorage.setItem(CU_KEY, JSON.stringify(user));
}

function clearCurrentUser() {
  localStorage.removeItem(CU_KEY);
}

// ── Utilities ─────────────────────────────────────────────────

let toastTimer = null;

function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  const icon  = document.getElementById('toast-icon');
  const text  = document.getElementById('toast-msg');

  const icons = {
    success: `<svg class="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>`,
    error:   `<svg class="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>`,
    info:    `<svg class="w-4 h-4 text-sky-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-7-4a1 1 0 00-1 1v4a1 1 0 102 0V7a1 1 0 00-1-1zm0 8a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd"/></svg>`,
  };

  icon.innerHTML = icons[type] || icons.info;
  text.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

function showInlineError(boxId, msgId, message) {
  const box = document.getElementById(boxId);
  const msg = msgId ? document.getElementById(msgId) : null;
  box.classList.remove('hidden');
  box.classList.add('flex');
  if (msg) msg.textContent = message;
  box.classList.add('animate-shake');
  setTimeout(() => box.classList.remove('animate-shake'), 450);
}

function hideInlineError(boxId) {
  const box = document.getElementById(boxId);
  if (!box) return;
  box.classList.add('hidden');
  box.classList.remove('flex');
}

function getInitials(name) {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day:    '2-digit',
    month:  'short',
    hour:   '2-digit',
    minute: '2-digit',
  });
}

function escapeHTML(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getGreeting(name) {
  const hour = new Date().getHours();
  const first = name.split(' ')[0];
  if (hour < 12) return `Bom dia, ${first}! ☀️`;
  if (hour < 18) return `Boa tarde, ${first}! 👋`;
  return `Boa noite, ${first}! 🌙`;
}

// ── Screen Navigation ─────────────────────────────────────────

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (!target) return;
  target.classList.add('active');
  // re-trigger slide-up animations
  target.querySelectorAll('.animate-slide-up').forEach(el => {
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = '';
  });
}

// ── Auth ──────────────────────────────────────────────────────

function handleLogin(e) {
  e.preventDefault();
  hideInlineError('login-error');

  const email    = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  if (!email || !password) {
    showInlineError('login-error', 'login-error-msg', 'Por favor, preencha e-mail e senha.');
    return;
  }

  const db   = getDB();
  const user = db.users.find(u => u.email === email);

  if (!user) {
    showInlineError('login-error', 'login-error-msg', 'E-mail não encontrado. Verifique ou crie uma conta.');
    return;
  }
  if (user.password !== password) {
    showInlineError('login-error', 'login-error-msg', 'Senha incorreta. Tente novamente.');
    return;
  }

  setCurrentUser({ id: user.id, name: user.name, email: user.email });
  showToast(`Bem-vindo de volta, ${user.name.split(' ')[0]}!`);
  loadApp();
}

function handleRegister(e) {
  e.preventDefault();
  hideInlineError('reg-error');

  const name     = document.getElementById('reg-name').value.trim();
  const email    = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;

  if (!name || !email || !password) {
    showInlineError('reg-error', 'reg-error-msg', 'Preencha todos os campos.');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showInlineError('reg-error', 'reg-error-msg', 'Informe um e-mail válido.');
    return;
  }
  if (password.length < 6) {
    showInlineError('reg-error', 'reg-error-msg', 'A senha deve ter pelo menos 6 caracteres.');
    return;
  }

  const db = getDB();
  if (db.users.find(u => u.email === email)) {
    showInlineError('reg-error', 'reg-error-msg', 'Este e-mail já está cadastrado. Faça login.');
    return;
  }

  const newUser = { id: generateId(), name, email, password, createdAt: new Date().toISOString() };
  db.users.push(newUser);
  saveDB(db);

  setCurrentUser({ id: newUser.id, name: newUser.name, email: newUser.email });
  showToast(`Conta criada! Bem-vindo, ${name.split(' ')[0]}!`);
  loadApp();
}

function handleLogout() {
  clearCurrentUser();
  currentFilter = 'all';
  document.getElementById('form-login').reset();
  hideInlineError('login-error');
  showScreen('screen-login');
  showToast('Você saiu da sua conta.', 'info');
}

// ── App Core ──────────────────────────────────────────────────

let currentFilter = 'all';

function loadApp() {
  const user = getCurrentUser();
  if (!user) { showScreen('screen-login'); return; }

  // Header
  document.getElementById('greeting').textContent         = getGreeting(user.name);
  document.getElementById('user-initials').textContent    = getInitials(user.name);
  document.getElementById('user-name-display').textContent = user.name;
  document.getElementById('user-email-display').textContent = user.email;

  showScreen('screen-app');
  renderTodos();
}

// ── Todo CRUD ─────────────────────────────────────────────────

function getUserTodos() {
  const user = getCurrentUser();
  const db   = getDB();
  // Filter by userId (e-mail serves as userId in this version)
  return db.todos.filter(t => t.userId === user.email);
}

/**
 * @param {string} title
 * @param {string} type  — 'trabalho' | 'pessoal' | 'estudos'
 * @param {string} description
 */
function addTodo(title, type, description) {
  const user = getCurrentUser();
  const db   = getDB();

  const todo = {
    id:          Date.now(),          // numeric timestamp as id
    userId:      user.email,          // filter key = e-mail
    title,
    type,
    description: description || '',
    done:        false,
    createdAt:   new Date().toISOString(),
  };

  db.todos.push(todo);
  saveDB(db);
  return todo;
}

function completeTodo(id) {
  const db  = getDB();
  const idx = db.todos.findIndex(t => t.id === id);
  if (idx === -1) return;
  db.todos[idx].done = true;
  saveDB(db);
}

function deleteTodo(id) {
  const db  = getDB();
  const idx = db.todos.findIndex(t => t.id === id);
  if (idx === -1) return;
  db.todos.splice(idx, 1);
  saveDB(db);
}

// ── Render ────────────────────────────────────────────────────

const TYPE_META = {
  trabalho: { label: 'Trabalho', cls: 'badge-trabalho', icon: '💼' },
  pessoal:  { label: 'Pessoal',  cls: 'badge-pessoal',  icon: '🙂' },
  estudos:  { label: 'Estudos',  cls: 'badge-estudos',  icon: '📚' },
};

function renderTodos() {
  const allTodos = getUserTodos();
  const total    = allTodos.length;
  const done     = allTodos.filter(t => t.done).length;
  const pending  = total - done;
  const pct      = total === 0 ? 0 : Math.round((done / total) * 100);

  // Stats
  document.getElementById('stat-total').textContent   = total;
  document.getElementById('stat-pending').textContent = pending;
  document.getElementById('stat-done').textContent    = done;
  document.getElementById('progress-pct').textContent = pct + '%';
  document.getElementById('progress-bar').style.width  = pct + '%';

  // Apply filter
  let filtered;
  if      (currentFilter === 'pending') filtered = allTodos.filter(t => !t.done);
  else if (currentFilter === 'done')    filtered = allTodos.filter(t => t.done);
  else                                   filtered = allTodos;

  const list       = document.getElementById('todo-list');
  const emptyState = document.getElementById('empty-state');
  const emptyMsg   = document.getElementById('empty-msg');

  list.innerHTML = '';

  if (filtered.length === 0) {
    emptyState.classList.remove('hidden');
    if      (currentFilter === 'pending') emptyMsg.textContent = 'Nenhuma tarefa pendente. 🎉';
    else if (currentFilter === 'done')    emptyMsg.textContent = 'Nenhuma tarefa concluída ainda.';
    else                                  emptyMsg.textContent = 'Nenhuma tarefa cadastrada ainda.';
    return;
  }

  emptyState.classList.add('hidden');

  // Sort: pending first, then by creation date desc
  const sorted = [...filtered].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    return b.id - a.id;
  });

  sorted.forEach(todo => list.appendChild(buildTodoCard(todo)));
}

function buildTodoCard(todo) {
  const meta   = TYPE_META[todo.type] || { label: todo.type, cls: 'badge-trabalho', icon: '📌' };
  const isDone = todo.done;

  const card = document.createElement('div');
  card.className = `todo-card glass-light rounded-2xl p-4 animate-pop ${isDone ? 'is-done' : ''}`;
  card.dataset.id = todo.id;

  card.innerHTML = `
    <div class="flex items-start gap-3">
      <!-- Status icon -->
      <div class="shrink-0 mt-0.5">
        ${isDone
          ? `<div class="w-5 h-5 rounded-full flex items-center justify-center" style="background:rgba(16,185,129,.2)">
               <svg class="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
             </div>`
          : `<div class="w-5 h-5 rounded-full border-2 border-slate-600"></div>`
        }
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <p class="todo-title text-sm font-semibold text-slate-200 leading-snug break-words">${escapeHTML(todo.title)}</p>

        <!-- Badges + date -->
        <div class="flex items-center flex-wrap gap-2 mt-2">
          <span class="badge ${isDone ? 'badge-done' : meta.cls}">
            ${isDone ? '' : meta.icon + ' '}${meta.label}${isDone ? ' · Concluída' : ''}
          </span>
          <span class="text-xs text-slate-600">${formatDate(todo.createdAt)}</span>
        </div>

        <!-- Description -->
        ${todo.description
          ? `<p class="todo-desc text-xs text-slate-400 mt-2 leading-relaxed break-words">${escapeHTML(todo.description)}</p>`
          : ''}
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-1.5 shrink-0 ml-1">
        ${!isDone
          ? `<button data-action="complete" title="Marcar como concluída" class="btn-complete">
               Concluir
             </button>`
          : ''}
        <button data-action="delete" title="Excluir tarefa"
          class="text-slate-600 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/10">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
        </button>
      </div>
    </div>
  `;

  return card;
}

// ── Event Delegation — Todo List ──────────────────────────────

document.getElementById('todo-list').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const card = btn.closest('[data-id]');
  if (!card) return;

  const id     = Number(card.dataset.id);
  const action = btn.dataset.action;

  if (action === 'complete') {
    completeTodo(id);
    showToast('Tarefa concluída! 🎉');
    renderTodos();
  }

  if (action === 'delete') {
    deleteTodo(id);
    showToast('Tarefa excluída.', 'info');
    renderTodos();
  }
});

// ── Form: Nova Tarefa ─────────────────────────────────────────

document.getElementById('form-todo').addEventListener('submit', (e) => {
  e.preventDefault();

  const titleEl = document.getElementById('todo-title');
  const title   = titleEl.value.trim();

  if (!title) {
    showInlineError('todo-error', null, '');
    return;
  }

  hideInlineError('todo-error');

  const type = document.getElementById('todo-type').value;
  const desc = document.getElementById('todo-desc').value.trim();

  addTodo(title, type, desc);

  // Reset only task fields
  titleEl.value = '';
  document.getElementById('todo-desc').value = '';

  showToast('Tarefa adicionada!');
  renderTodos();
});

// ── Filter Tabs ───────────────────────────────────────────────

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTodos();
  });
});

// ── Auth Navigation ───────────────────────────────────────────

document.getElementById('go-register').addEventListener('click', () => {
  hideInlineError('login-error');
  showScreen('screen-register');
});

document.getElementById('go-login').addEventListener('click', () => {
  hideInlineError('reg-error');
  showScreen('screen-login');
});

document.getElementById('form-login').addEventListener('submit', handleLogin);
document.getElementById('form-register').addEventListener('submit', handleRegister);
document.getElementById('btn-logout').addEventListener('click', handleLogout);

// ── Boot ──────────────────────────────────────────────────────

(function init() {
  if (getCurrentUser()) {
    loadApp();
  } else {
    showScreen('screen-login');
  }
})();
