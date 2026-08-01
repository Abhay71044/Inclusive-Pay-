/* ==========================================================================
   InclusivePay – Production JavaScript Engine
   Single-file APK Download Link Configuration at Top
   ========================================================================== */

// --------------------------------------------------------------------------
// 1. APK Link Configuration (Edit only this line to change the APK URL)
// --------------------------------------------------------------------------
const apkLink = "https://github.com/parthasarthi317-blip/UPI/releases/download/v1.0.1/app-debug.apk";

/**
 * Downloads the InclusivePay APK file.
 */
function downloadAPK() {
  speakDemo("Downloading InclusivePay APK application...");
  if (!apkLink || apkLink === "PASTE_YOUR_APK_LINK_HERE" || !apkLink.startsWith('http')) {
    // Create a demo APK file blob so the download actually works in browser fallback
    const demoContent = "InclusivePay Android App Package (v2.4.0)\nAccessible UPI Payment App for Everyone\nWCAG 2.1 Level AAA Compliant";
    const blob = new Blob([demoContent], { type: "application/vnd.android.package-archive" });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = "InclusivePay_v2.4.0.apk";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
    
    showToast("⬇️ InclusivePay_v2.4.0.apk downloaded successfully!");
  } else {
    const link = document.createElement("a");
    link.href = apkLink;
    link.target = "_blank";
    link.download = "InclusivePay-app-debug.apk";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("⬇️ Downloading InclusivePay APK from GitHub Releases...");
  }
}

// --------------------------------------------------------------------------
// 2. Client-Side Router / View Switcher (Home, Login, Sign Up) & Section Nav
// --------------------------------------------------------------------------
function switchView(viewId, autoScroll = true) {
  const views = ['home', 'login', 'signup'];
  
  views.forEach(v => {
    const el = document.getElementById(`view-${v}`);
    if (el) {
      if (v === viewId) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    }
  });

  // Update URL Hash cleanly without page refresh
  window.history.pushState(null, '', `#${viewId}`);

  if (autoScroll) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Manage Keyboard Focus for Accessibility
  setTimeout(() => {
    if (viewId === 'home') {
      const heading = document.getElementById('hero-heading');
      if (heading && autoScroll) heading.focus();
    } else if (viewId === 'login') {
      const emailInput = document.getElementById('login-email');
      if (emailInput) emailInput.focus();
    } else if (viewId === 'signup') {
      const nameInput = document.getElementById('signup-name');
      if (nameInput) nameInput.focus();
    }
  }, 100);
}

/**
 * Smoothly scrolls to a section on the home page and updates active link in navbar.
 */
function navigateToSection(sectionId) {
  closeMobileNav();

  // Ensure home view is active
  const homeView = document.getElementById('view-home');
  if (!homeView || !homeView.classList.contains('active')) {
    switchView('home', false);
  }

  if (!sectionId || sectionId === 'home') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.history.pushState(null, '', '#home');
    updateActiveNav('home');
    return;
  }

  const targetEl = document.getElementById(sectionId);
  if (targetEl) {
    const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 80;
    const a11yBarHeight = document.querySelector('.a11y-bar')?.offsetHeight || 35;
    const totalOffset = navbarHeight + a11yBarHeight + 10;
    
    const elementPosition = targetEl.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - totalOffset;

    window.scrollTo({
      top: offsetPosition > 0 ? offsetPosition : 0,
      behavior: 'smooth'
    });

    window.history.pushState(null, '', `#${sectionId}`);
    updateActiveNav(sectionId);
  }
}

/**
 * Highlight active nav item based on current section ID
 */
function updateActiveNav(sectionId) {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === `#${sectionId}`) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
}

/**
 * Scroll spy to update active navbar link as user scrolls page
 */
function initScrollSpy() {
  const sections = document.querySelectorAll('#view-home section[id]');
  if (!sections.length) return;

  const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 80;
  const a11yBarHeight = document.querySelector('.a11y-bar')?.offsetHeight || 35;
  const totalOffset = navbarHeight + a11yBarHeight + 120;

  window.addEventListener('scroll', () => {
    const homeView = document.getElementById('view-home');
    if (!homeView || !homeView.classList.contains('active')) return;

    let currentSection = 'home';
    const scrollPos = window.scrollY + totalOffset;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSection = section.getAttribute('id');
      }
    });

    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
      currentSection = 'contact';
    }

    updateActiveNav(currentSection);
  }, { passive: true });
}

// --------------------------------------------------------------------------
// 3. Bank Card Balance Reveal Toggle
// --------------------------------------------------------------------------
let isBalanceRevealed = false;

function toggleCardBalance() {
  const valEl = document.getElementById('card-balance-val');
  const btnText = document.getElementById('balance-btn-text');

  if (!valEl || !btnText) return;

  if (!isBalanceRevealed) {
    valEl.textContent = '₹18,450.00';
    btnText.textContent = 'छिपाएं'; // Hide in Hindi
    isBalanceRevealed = true;
    speakDemo('Bank balance revealed: 18 thousand 4 hundred 50 rupees');
    showToast('👁️ Available Balance Revealed: ₹18,450.00');
  } else {
    valEl.textContent = '••••••••';
    btnText.textContent = 'चेक करें'; // Check in Hindi
    isBalanceRevealed = false;
    showToast('🔒 Available Balance Hidden');
  }
}

// --------------------------------------------------------------------------
// 4. Quick Action Tiles & Notifications Interaction
// --------------------------------------------------------------------------
function handleQuickAction(action) {
  const actions = {
    send: "Opening Voice Send Money... Say recipient name or phone number",
    scan: "Opening Accessible QR Camera Scanner with audio positioning cues",
    bills: "Opening Utility Bills payment manager with simplified layout",
    history: "Opening Transaction History. Last transaction: ₹500 paid to Ramesh"
  };
  const msg = actions[action] || "Quick action selected";
  showToast(`📱 ${msg}`);
  speakDemo(msg);
}

function handleNotificationClick() {
  const msg = "You have 0 pending notifications. All accounts are secured.";
  showToast(`🔔 ${msg}`);
  speakDemo(msg);
}

// --------------------------------------------------------------------------
// 5. Accessibility Persona Switcher Data & Handler
// --------------------------------------------------------------------------
const personaData = {
  visual: {
    title: "Voice-Guided Assist for Visually Impaired",
    desc: "Full screen-reader compatibility with TalkBack/VoiceOver, complete voice command navigation, audio confirmation of recipient names and transaction amounts, and high contrast tactile design.",
    features: [
      "Continuous voice prompt navigation & confirmation",
      "Sound & haptic pattern feedback on keypress",
      "Auto speech feedback of remaining bank balance"
    ],
    demoText: "Voice Assist Active: 'Say pay Ramesh 500 rupees'"
  },
  physical: {
    title: "Single-Tap & Large Touch Area for Physical Disabilities",
    desc: "Designed with generous 56px+ target areas, adjustable touch delay sensitivities, single-gesture payment shortcuts, and full support for external switch access devices.",
    features: [
      "Minimum 48px to 64px touch target zones",
      "External Bluetooth Switch Access compatibility",
      "Zero precision drag-and-drop requirements"
    ],
    demoText: "Large Target & Switch Access Mode Enabled"
  },
  hearing: {
    title: "Visual Haptics & Sign Guidance for Hearing & Speech Impaired",
    desc: "Replaces sound cues with clear high-contrast visual banners, customizable vibrations, visual QR transaction confirmations, and speech-to-text live prompts.",
    features: [
      "Vibrational haptic code pattern confirmations",
      "Instant visual transaction receipt banners",
      "Real-time visual QR & text communication"
    ],
    demoText: "Visual Haptics & High-Contrast Banner Cues Active"
  },
  elderly: {
    title: "Simple Mode & Extra-Large Text for Elderly Citizens",
    desc: "Removes overwhelming submenus in favor of a clean 4-button dashboard, extra-large clear fonts, simple language prompts, and 1-tap emergency support.",
    features: [
      "Extra-large 20pt+ font readability options",
      "Simplified 4-tile main dashboard layout",
      "Family & trusted contact payment verification"
    ],
    demoText: "Senior Citizen Simple Dashboard Mode Active"
  }
};

function selectPersona(type) {
  const tabs = document.querySelectorAll('.persona-tab');
  tabs.forEach(tab => {
    if (tab.id === `tab-${type}`) {
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
    } else {
      tab.classList.remove('active');
      tab.setAttribute('aria-selected', 'false');
    }
  });

  const data = personaData[type];
  if (!data) return;

  const titleEl = document.getElementById('persona-title');
  const descEl = document.getElementById('persona-desc');
  const listEl = document.getElementById('persona-list');

  if (titleEl) titleEl.textContent = data.title;
  if (descEl) descEl.textContent = data.desc;
  
  if (listEl) {
    listEl.innerHTML = data.features.map(f => `<li><span>✓</span> ${f}</li>`).join('');
  }

  showToast(`👤 Profile selected: ${data.title}`);
  speakDemo(data.demoText);
}

// --------------------------------------------------------------------------
// 6. Accessibility Quick Bar Engine (Font Scaler, High Contrast, Text-To-Speech)
// --------------------------------------------------------------------------
let currentFontScale = 100;

function initAccessibilityToolbar() {
  const btnIncrease = document.getElementById('btn-font-increase');
  const btnDecrease = document.getElementById('btn-font-decrease');
  const btnReset = document.getElementById('btn-font-reset');
  const btnContrast = document.getElementById('btn-contrast-toggle');
  const btnTTS = document.getElementById('btn-tts-toggle');

  if (btnIncrease) {
    btnIncrease.addEventListener('click', () => {
      if (currentFontScale < 130) {
        currentFontScale += 10;
        document.documentElement.style.fontSize = `${currentFontScale}%`;
        showToast(`🔤 Font Size: ${currentFontScale}%`);
      }
    });
  }

  if (btnDecrease) {
    btnDecrease.addEventListener('click', () => {
      if (currentFontScale > 90) {
        currentFontScale -= 10;
        document.documentElement.style.fontSize = `${currentFontScale}%`;
        showToast(`🔤 Font Size: ${currentFontScale}%`);
      }
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      currentFontScale = 100;
      document.documentElement.style.fontSize = `100%`;
      showToast(`🔤 Font Size Reset to Default (100%)`);
    });
  }

  if (btnContrast) {
    btnContrast.addEventListener('click', () => {
      document.body.classList.toggle('high-contrast-mode');
      const contrastText = document.getElementById('contrast-text');
      const isHigh = document.body.classList.contains('high-contrast-mode');
      if (contrastText) {
        contrastText.textContent = isHigh ? 'Normal Contrast' : 'High Contrast';
      }
      btnContrast.classList.toggle('active', isHigh);
      showToast(isHigh ? '👁️ High Contrast Mode Enabled' : '👁️ Normal Contrast Mode Enabled');
    });
  }

  if (btnTTS) {
    btnTTS.addEventListener('click', () => {
      const activeState = btnTTS.classList.toggle('active');
      if (activeState) {
        showToast('🔊 Voice Reader Demo Activated');
        speakDemo("InclusivePay Text-to-Speech assistant activated. Hover or tap headings to hear audio feedback.");
      } else {
        showToast('🔇 Voice Reader Demo Deactivated');
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      }
    });
  }
}

/**
 * Text-to-speech helper function for accessibility audio feedback.
 */
function speakDemo(text) {
  const btnTTS = document.getElementById('btn-tts-toggle');
  if (btnTTS && !btnTTS.classList.contains('active')) return;

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel(); // Stop current speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95; // Slightly slower clear speech rate
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }
}

// --------------------------------------------------------------------------
// 7. Mobile Navigation Menu Toggle
// --------------------------------------------------------------------------
function initMobileNav() {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navLinks = document.getElementById('nav-links');

  if (hamburgerBtn && navLinks) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      hamburgerBtn.classList.toggle('is-active', isOpen);
      hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }
}

function closeMobileNav() {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navLinks = document.getElementById('nav-links');
  if (hamburgerBtn && navLinks) {
    navLinks.classList.remove('is-open');
    hamburgerBtn.classList.remove('is-active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  }
}

// --------------------------------------------------------------------------
// 8. FAQ Accordion Handler
// --------------------------------------------------------------------------
function toggleFAQ(button) {
  const item = button.closest('.faq-item');
  if (!item) return;

  const isOpen = item.classList.contains('is-open');

  // Close all other accordion items for clean presentation
  document.querySelectorAll('.faq-item').forEach(i => {
    i.classList.remove('is-open');
    const btn = i.querySelector('.faq-header');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  });

  if (!isOpen) {
    item.classList.add('is-open');
    button.setAttribute('aria-expanded', 'true');
    const answerText = item.querySelector('.faq-body p');
    if (answerText) speakDemo(answerText.textContent);
  }
}

// --------------------------------------------------------------------------
// 9. Toast & Modal Dialog Systems
// --------------------------------------------------------------------------
function showToast(message) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    container.setAttribute('aria-live', 'polite');
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function showModal(title, content) {
  let backdrop = document.getElementById('modal-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'modal-backdrop';
    backdrop.className = 'modal-backdrop';
    backdrop.onclick = (e) => {
      if (e.target === backdrop) closeModal();
    };

    const dialog = document.createElement('div');
    dialog.className = 'modal-dialog';
    dialog.innerHTML = `
      <div class="modal-header">
        <h3 id="modal-title" class="modal-title"></h3>
        <button class="modal-close" onclick="closeModal()" aria-label="Close dialog">&times;</button>
      </div>
      <div class="modal-body" id="modal-body"></div>
      <div class="modal-footer">
        <button class="btn btn-primary" onclick="closeModal()">Got it</button>
      </div>
    `;
    backdrop.appendChild(dialog);
    document.body.appendChild(backdrop);
  }

  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').textContent = content;
  backdrop.classList.add('active');
  speakDemo(`${title}: ${content}`);
}

function closeModal() {
  const backdrop = document.getElementById('modal-backdrop');
  if (backdrop) backdrop.classList.remove('active');
}

// --------------------------------------------------------------------------
// 10. Client-Side Form Validations (Login, Sign Up, Contact)
// --------------------------------------------------------------------------
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobileRegex = /^[0-9]{10}$/;

function handleLoginSubmit(event) {
  event.preventDefault();
  
  const emailInput = document.getElementById('login-email');
  const pwdInput = document.getElementById('login-pwd');
  const groupEmail = document.getElementById('group-login-email');
  const groupPwd = document.getElementById('group-login-pwd');

  const alertError = document.getElementById('login-alert-error');
  const alertSuccess = document.getElementById('login-alert-success');

  let isValid = true;

  groupEmail.classList.remove('has-error');
  groupPwd.classList.remove('has-error');
  alertError.style.display = 'none';
  alertSuccess.style.display = 'none';

  if (!emailInput.value || !emailRegex.test(emailInput.value.trim())) {
    groupEmail.classList.add('has-error');
    isValid = false;
  }

  if (!pwdInput.value || pwdInput.value.trim() === '') {
    groupPwd.classList.add('has-error');
    isValid = false;
  }

  if (!isValid) {
    alertError.textContent = "Please provide a valid email address and password.";
    alertError.style.display = 'block';
    speakDemo("Login error: Please check your email and password.");
    return;
  }

  alertSuccess.textContent = "✓ Login successful! Redirecting to home dashboard...";
  alertSuccess.style.display = 'block';
  speakDemo("Login successful! Returning to home dashboard.");

  setTimeout(() => {
    emailInput.value = '';
    pwdInput.value = '';
    alertSuccess.style.display = 'none';
    switchView('home');
  }, 1200);
}

function handleSignupSubmit(event) {
  event.preventDefault();

  const nameInput = document.getElementById('signup-name');
  const emailInput = document.getElementById('signup-email');
  const mobileInput = document.getElementById('signup-mobile');
  const pwdInput = document.getElementById('signup-pwd');
  const confirmPwdInput = document.getElementById('signup-confirm-pwd');

  const groupName = document.getElementById('group-signup-name');
  const groupEmail = document.getElementById('group-signup-email');
  const groupMobile = document.getElementById('group-signup-mobile');
  const groupPwd = document.getElementById('group-signup-pwd');
  const groupConfirmPwd = document.getElementById('group-signup-confirm-pwd');

  const alertError = document.getElementById('signup-alert-error');
  const alertSuccess = document.getElementById('signup-alert-success');

  let isValid = true;

  [groupName, groupEmail, groupMobile, groupPwd, groupConfirmPwd].forEach(g => g.classList.remove('has-error'));
  alertError.style.display = 'none';
  alertSuccess.style.display = 'none';

  if (!nameInput.value || nameInput.value.trim().length < 2) {
    groupName.classList.add('has-error');
    isValid = false;
  }

  if (!emailInput.value || !emailRegex.test(emailInput.value.trim())) {
    groupEmail.classList.add('has-error');
    isValid = false;
  }

  if (!mobileInput.value || !mobileRegex.test(mobileInput.value.trim())) {
    groupMobile.classList.add('has-error');
    isValid = false;
  }

  if (!pwdInput.value || pwdInput.value.length < 6) {
    groupPwd.classList.add('has-error');
    isValid = false;
  }

  if (!confirmPwdInput.value || confirmPwdInput.value !== pwdInput.value) {
    groupConfirmPwd.classList.add('has-error');
    isValid = false;
  }

  if (!isValid) {
    alertError.textContent = "Please fix highlighted fields. Passwords must match and mobile must be 10 digits.";
    alertError.style.display = 'block';
    speakDemo("Registration error: Please complete all required fields correctly.");
    return;
  }

  alertSuccess.textContent = "✓ Account created successfully! Transitioning to login...";
  alertSuccess.style.display = 'block';
  speakDemo("Account successfully created! Transitioning to login page.");

  setTimeout(() => {
    document.getElementById('signup-form').reset();
    alertSuccess.style.display = 'none';
    switchView('login');
  }, 1400);
}

function handleContactSubmit(event) {
  event.preventDefault();

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const msgInput = document.getElementById('contact-msg');

  const groupName = document.getElementById('group-contact-name');
  const groupEmail = document.getElementById('group-contact-email');
  const groupMsg = document.getElementById('group-contact-msg');

  const alertSuccess = document.getElementById('contact-alert-success');

  let isValid = true;

  [groupName, groupEmail, groupMsg].forEach(g => g.classList.remove('has-error'));

  if (!nameInput.value || nameInput.value.trim() === '') {
    groupName.classList.add('has-error');
    isValid = false;
  }

  if (!emailInput.value || !emailRegex.test(emailInput.value.trim())) {
    groupEmail.classList.add('has-error');
    isValid = false;
  }

  if (!msgInput.value || msgInput.value.trim() === '') {
    groupMsg.classList.add('has-error');
    isValid = false;
  }

  if (!isValid) return;

  alertSuccess.style.display = 'block';
  showToast("📬 Thank you! Your message has been received.");
  speakDemo("Thank you! Your message has been sent successfully.");

  setTimeout(() => {
    document.getElementById('contact-form').reset();
  }, 500);

  setTimeout(() => {
    alertSuccess.style.display = 'none';
  }, 5000);
}

// --------------------------------------------------------------------------
// 11. Intersection Observer for Scroll Fade-In Animations
// --------------------------------------------------------------------------
function initScrollObserver() {
  const cards = document.querySelectorAll('.glass-card, .screenshot-card, .feature-card');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(24px)';
      card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      observer.observe(card);
    });
  }
}

// --------------------------------------------------------------------------
// 12. Initialization on DOM Content Loaded
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initAccessibilityToolbar();
  initMobileNav();
  initScrollObserver();
  initScrollSpy();

  // Set Dynamic Copyright Year
  const yearEl = document.getElementById('copyright-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Handle URL Hash Routing on Load
  const initialHash = window.location.hash.replace('#', '');
  if (['login', 'signup'].includes(initialHash)) {
    switchView(initialHash);
  } else if (initialHash) {
    navigateToSection(initialHash);
  } else {
    switchView('home');
  }

  // Listen to PopState (Browser Back/Forward navigation)
  window.addEventListener('popstate', () => {
    const hash = window.location.hash.replace('#', '') || 'home';
    if (['login', 'signup'].includes(hash)) {
      switchView(hash);
    } else {
      navigateToSection(hash);
    }
  });
});
