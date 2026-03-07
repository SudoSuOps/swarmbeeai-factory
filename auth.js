/**
 * Swarm & Bee — Shared Auth Module
 * =================================
 * Supabase Auth + nav integration + login modal.
 * Load on every page: <script src="/auth.js"></script>
 * Requires: <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
 */

(function () {
  'use strict';

  const SUPABASE_URL = 'https://gizwfmgowyfadmvjjitb.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpendmbWdvd3lmYWRtdmpqaXRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMTk5OTQsImV4cCI6MjA4NzY5NTk5NH0.2yfADZ83GHk0lNlanwOWPieV3sgrCGStdiGNAFEBqAI';
  const API_BASE = 'https://api.swarmandbee.ai';
  const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1479111054570033152/O8PUHYDZ-XFoxmFjTLFrqly5xn8l84l_oy_6AfIEgKvYaijz6pJrLQiaOjQyYMj-mYhM';

  let sb = null;
  let currentUser = null;
  let currentSession = null;

  // ── Initialize ────────────────────────────────────

  async function init() {
    if (!window.supabase) {
      console.warn('[auth] Supabase JS not loaded. Load CDN script first.');
      return;
    }
    sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Restore session
    const { data } = await sb.auth.getSession();
    if (data.session) {
      currentSession = data.session;
      currentUser = data.session.user;
    }

    // Listen for changes
    sb.auth.onAuthStateChange((event, session) => {
      currentSession = session;
      currentUser = session ? session.user : null;
      updateNav();
    });

    updateNav();
    injectModal();
  }

  // ── Auth Methods ──────────────────────────────────

  async function signup(email, password) {
    if (!sb) throw new Error('Auth not initialized');
    const { data, error } = await sb.auth.signUp({ email, password });
    if (error) throw error;

    // Fire Discord webhook for lead notification
    notifyDiscord(email, 'signup');

    return data;
  }

  async function login(email, password) {
    if (!sb) throw new Error('Auth not initialized');
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async function logout() {
    if (!sb) return;
    await sb.auth.signOut();
    currentUser = null;
    currentSession = null;
    localStorage.removeItem('swarm_api_key');
    updateNav();
  }

  function getUser() {
    return currentUser;
  }

  function getSession() {
    return currentSession;
  }

  function isLoggedIn() {
    return !!currentUser;
  }

  // ── API Key Management ────────────────────────────

  function getApiKey() {
    return localStorage.getItem('swarm_api_key');
  }

  function setApiKey(key) {
    localStorage.setItem('swarm_api_key', key);
  }

  // ── Stripe Checkout ───────────────────────────────

  async function startCheckout(tier, product) {
    if (!isLoggedIn()) {
      showLoginModal('signup');
      return;
    }

    const res = await fetch(API_BASE + '/api/data/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tier: tier, product: product || 'cre' }),
    });

    const data = await res.json();
    if (data.ok && data.url) {
      window.location.href = data.url;
    } else {
      throw new Error(data.error || 'Checkout failed');
    }
  }

  // ── Discord Notification ──────────────────────────

  function notifyDiscord(email, action) {
    const page = window.location.pathname || '/';
    fetch(DISCORD_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [{
          title: 'Swarm Account — ' + action,
          color: 0xf59e0b,
          fields: [
            { name: 'Email', value: email, inline: true },
            { name: 'Action', value: action, inline: true },
            { name: 'Page', value: page, inline: true },
          ],
          timestamp: new Date().toISOString(),
        }],
      }),
    }).catch(function () { /* silent */ });
  }

  // ── Nav Integration ───────────────────────────────

  function updateNav() {
    var dashLink = document.getElementById('navDashLink');
    var signInLink = document.getElementById('navSignInLink');
    if (!dashLink || !signInLink) return;

    if (isLoggedIn()) {
      dashLink.style.display = '';
      signInLink.style.display = 'none';
    } else {
      dashLink.style.display = 'none';
      signInLink.style.display = '';
    }
  }

  // ── Login Modal ───────────────────────────────────

  function injectModal() {
    if (document.getElementById('swarmAuthModal')) return;

    var overlay = document.createElement('div');
    overlay.id = 'swarmAuthModal';
    overlay.className = 'sa-modal-overlay';
    overlay.style.cssText = 'display:none;position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.7);backdrop-filter:blur(6px);align-items:center;justify-content:center;';
    overlay.onclick = function (e) { if (e.target === overlay) closeLoginModal(); };

    overlay.innerHTML =
      '<div class="sa-modal" style="background:#111;border:1px solid #222;border-radius:12px;padding:40px 36px;max-width:400px;width:90%;position:relative;">' +
        '<button onclick="swarmAuth.closeLoginModal()" style="position:absolute;top:12px;right:16px;background:none;border:none;color:#737373;font-size:1.4rem;cursor:pointer;">&times;</button>' +
        '<h3 id="saModalTitle" style="font-family:\'Space Grotesk\',sans-serif;font-size:1.3rem;font-weight:700;color:#fff;margin-bottom:4px;">Create Account</h3>' +
        '<p style="font-size:0.82rem;color:#737373;margin-bottom:24px;">Join the Swarm. Access datasets, skills, and intelligence.</p>' +
        '<div id="saModalError" style="display:none;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);color:#ef4444;font-size:0.82rem;padding:10px 14px;border-radius:6px;margin-bottom:16px;"></div>' +
        '<form id="saModalForm" onsubmit="swarmAuth.handleModalSubmit(event)">' +
          '<input type="email" id="saEmail" placeholder="your@email.com" required style="width:100%;padding:12px 16px;font-size:0.88rem;background:#0A0A0A;border:1px solid #333;border-radius:6px;color:#fff;outline:none;margin-bottom:12px;font-family:\'DM Sans\',sans-serif;" />' +
          '<input type="password" id="saPassword" placeholder="Password (min 6 chars)" required minlength="6" style="width:100%;padding:12px 16px;font-size:0.88rem;background:#0A0A0A;border:1px solid #333;border-radius:6px;color:#fff;outline:none;margin-bottom:16px;font-family:\'DM Sans\',sans-serif;" />' +
          '<button type="submit" id="saSubmitBtn" style="width:100%;padding:14px;font-size:0.88rem;font-weight:700;background:#f59e0b;color:#000;border:none;border-radius:6px;cursor:pointer;font-family:\'Space Grotesk\',sans-serif;letter-spacing:0.02em;">Create Account</button>' +
        '</form>' +
        '<p style="text-align:center;margin-top:16px;font-size:0.82rem;color:#737373;">' +
          '<span id="saToggleText">Already have an account?</span> ' +
          '<a href="#" id="saToggleLink" onclick="swarmAuth.toggleMode(event)" style="color:#f59e0b;font-weight:600;">Sign In</a>' +
        '</p>' +
      '</div>';

    document.body.appendChild(overlay);
  }

  var modalMode = 'signup'; // 'signup' or 'login'

  function showLoginModal(mode) {
    modalMode = mode || 'signup';
    var overlay = document.getElementById('swarmAuthModal');
    if (!overlay) { injectModal(); overlay = document.getElementById('swarmAuthModal'); }
    overlay.style.display = 'flex';
    updateModalMode();
    var emailInput = document.getElementById('saEmail');
    if (emailInput) emailInput.focus();
  }

  function closeLoginModal() {
    var overlay = document.getElementById('swarmAuthModal');
    if (overlay) overlay.style.display = 'none';
    var errEl = document.getElementById('saModalError');
    if (errEl) errEl.style.display = 'none';
  }

  function toggleMode(e) {
    if (e) e.preventDefault();
    modalMode = modalMode === 'signup' ? 'login' : 'signup';
    updateModalMode();
  }

  function updateModalMode() {
    var title = document.getElementById('saModalTitle');
    var btn = document.getElementById('saSubmitBtn');
    var toggleText = document.getElementById('saToggleText');
    var toggleLink = document.getElementById('saToggleLink');

    if (modalMode === 'signup') {
      if (title) title.textContent = 'Create Account';
      if (btn) btn.textContent = 'Create Account';
      if (toggleText) toggleText.textContent = 'Already have an account?';
      if (toggleLink) toggleLink.textContent = 'Sign In';
    } else {
      if (title) title.textContent = 'Sign In';
      if (btn) btn.textContent = 'Sign In';
      if (toggleText) toggleText.textContent = "Don't have an account?";
      if (toggleLink) toggleLink.textContent = 'Create Account';
    }
  }

  async function handleModalSubmit(e) {
    e.preventDefault();
    var email = document.getElementById('saEmail').value.trim();
    var password = document.getElementById('saPassword').value;
    var btn = document.getElementById('saSubmitBtn');
    var errEl = document.getElementById('saModalError');

    btn.disabled = true;
    btn.textContent = modalMode === 'signup' ? 'Creating...' : 'Signing in...';
    errEl.style.display = 'none';

    try {
      if (modalMode === 'signup') {
        await signup(email, password);
        closeLoginModal();
        // Auto-login after signup
        try { await login(email, password); } catch (_) { /* email confirmation may be required */ }
        if (isLoggedIn()) {
          window.location.href = '/dashboard';
        } else {
          showMessage('Account created! Check your email to confirm, then sign in.');
        }
      } else {
        await login(email, password);
        closeLoginModal();
        updateNav();
        // If on a product page, stay. If coming from sign-in click, go to dashboard.
        if (window._swarmAuthRedirect) {
          window.location.href = window._swarmAuthRedirect;
          window._swarmAuthRedirect = null;
        }
      }
    } catch (err) {
      errEl.textContent = err.message || 'Something went wrong';
      errEl.style.display = 'block';
    } finally {
      btn.disabled = false;
      btn.textContent = modalMode === 'signup' ? 'Create Account' : 'Sign In';
    }
  }

  function showMessage(msg) {
    var el = document.getElementById('saModalError');
    if (el) {
      el.style.background = 'rgba(16,185,129,0.1)';
      el.style.borderColor = 'rgba(16,185,129,0.3)';
      el.style.color = '#10b981';
      el.textContent = msg;
      el.style.display = 'block';
    }
  }

  // ── Signup with Checkout ──────────────────────────

  async function signupAndCheckout(email, password, tier, product) {
    if (!isLoggedIn()) {
      try {
        // Try signup first
        await signup(email, password);
        await login(email, password);
      } catch (err) {
        // If user exists, try login
        if (err.message && err.message.includes('already registered')) {
          await login(email, password);
        } else {
          throw err;
        }
      }
    }

    if (tier && tier !== 'free') {
      await startCheckout(tier, product);
    } else {
      window.location.href = '/dashboard';
    }
  }

  // ── Public API ────────────────────────────────────

  window.swarmAuth = {
    init: init,
    signup: signup,
    login: login,
    logout: logout,
    getUser: getUser,
    getSession: getSession,
    isLoggedIn: isLoggedIn,
    getApiKey: getApiKey,
    setApiKey: setApiKey,
    startCheckout: startCheckout,
    signupAndCheckout: signupAndCheckout,
    showLoginModal: showLoginModal,
    closeLoginModal: closeLoginModal,
    toggleMode: toggleMode,
    handleModalSubmit: handleModalSubmit,
    updateNav: updateNav,
    API_BASE: API_BASE,
  };

  // Auto-init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
