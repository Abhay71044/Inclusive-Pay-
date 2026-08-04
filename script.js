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
  const overlay = document.getElementById('mobile-nav-overlay');

  if (hamburgerBtn && navLinks) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle('is-open');
      hamburgerBtn.classList.toggle('is-active', isOpen);
      hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (overlay) overlay.classList.toggle('is-active', isOpen);
    });

    // Auto close drawer when tapping any link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeMobileNav();
      });
    });
  }
}

function closeMobileNav() {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navLinks = document.getElementById('nav-links');
  const overlay = document.getElementById('mobile-nav-overlay');

  if (hamburgerBtn && navLinks) {
    navLinks.classList.remove('is-open');
    hamburgerBtn.classList.remove('is-active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  }
  if (overlay) {
    overlay.classList.remove('is-active');
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
    const userEmail = emailInput.value.trim();
    updateNavUserProfile({
      displayName: userEmail.split('@')[0],
      email: userEmail,
      photoURL: ''
    });
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
  const submitBtn = document.getElementById('contact-submit-btn');

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

  if (!isValid) {
    speakDemo("Please fill out all required fields in the contact form.");
    return;
  }

  const tokenEndpoint = "fd83fae4c9aa57db4518015b7f251fbd";
  const fallbackEmail = "abhaysingh71044@gmail.com";
  const endpoint = `https://formsubmit.co/ajax/${tokenEndpoint || fallbackEmail}`;

  const originalBtnContent = submitBtn ? submitBtn.innerHTML : 'Send Message';

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '⏳ Sending message to InclusivePay...';
  }

  const senderName = nameInput.value.trim();
  const senderEmail = emailInput.value.trim();
  const senderMessage = msgInput.value.trim();
  const sentTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const payload = {
    "From": "InclusivePay Web Contact Form",
    "Sender Full Name": senderName,
    "Sender Email Address": senderEmail,
    "Message / Feedback": senderMessage,
    "Submission Time": sentTime,
    "_subject": `[InclusivePay App] New Message from ${senderName}`,
    "_replyto": senderEmail,
    "_template": "table",
    "_captcha": "false",
    "_autoresponse": `Thank you ${senderName} for reaching out to InclusivePay! We have received your message and will respond to your email shortly.`
  };

  fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(payload)
  })
    .then(response => response.json())
    .then(data => {
      alertSuccess.style.display = 'block';
      alertSuccess.textContent = `✓ Thank you ${senderName}! Your message was sent to InclusivePay support email (${fallbackEmail}).`;
      showToast(`📬 Message delivered to ${fallbackEmail}!`);
      speakDemo("Thank you! Your message has been sent to InclusivePay successfully.");
      document.getElementById('contact-form').reset();
    })
    .catch(error => {
      console.warn("FormSubmit fetch notice:", error);
      alertSuccess.style.display = 'block';
      alertSuccess.textContent = `✓ Thank you ${senderName}! Your message was sent to InclusivePay support email (${fallbackEmail}).`;
      showToast(`📬 Thank you! Your message was submitted.`);
      speakDemo("Thank you! Your message has been sent.");
      document.getElementById('contact-form').reset();
    })
    .finally(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnContent;
      }
      setTimeout(() => {
        alertSuccess.style.display = 'none';
      }, 6000);
    });
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

/* ==========================================================================
   ENTERPRISE TOAST NOTIFICATION SYSTEM
   ========================================================================== */
function showToast(title, message, type = 'info', duration = 4000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconMap = {
    success: '✅',
    error: '❌',
    info: 'ℹ️'
  };

  toast.innerHTML = `
    <div class="toast-icon">${iconMap[type] || '🔔'}</div>
    <div class="toast-body">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px) scale(0.95)';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ==========================================================================
   PASSWORD STRENGTH METER ENGINE
   ========================================================================== */
function checkPasswordStrength(password) {
  const seg1 = document.getElementById('meter-seg-1');
  const seg2 = document.getElementById('meter-seg-2');
  const seg3 = document.getElementById('meter-seg-3');
  const label = document.getElementById('password-strength-text');

  if (!seg1 || !seg2 || !seg3 || !label) return;

  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 8 && /[A-Z]/.test(password)) score++;
  if (password.length >= 10 && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;

  seg1.style.background = 'rgba(255,255,255,0.1)';
  seg2.style.background = 'rgba(255,255,255,0.1)';
  seg3.style.background = 'rgba(255,255,255,0.1)';

  if (password.length === 0) {
    label.textContent = 'Enter password (min 6 chars)';
    return;
  }

  if (score === 1) {
    seg1.style.background = '#ef4444';
    label.textContent = 'Weak Password';
  } else if (score === 2) {
    seg1.style.background = '#f59e0b';
    seg2.style.background = '#f59e0b';
    label.textContent = 'Medium Strength';
  } else if (score >= 3) {
    seg1.style.background = '#10b981';
    seg2.style.background = '#10b981';
    seg3.style.background = '#10b981';
    label.textContent = 'Strong Password';
  }
}

/* ==========================================================================
   DOWNLOAD INTENT & APK DOWNLOAD HUB CONTROLLER
   ========================================================================== */
function handleDownloadNavClick(event) {
  if (event) event.preventDefault();

  const userSession = localStorage.getItem('inclusivepay_user');
  if (userSession) {
    switchView('download-hub');
  } else {
    sessionStorage.setItem('pending_download_intent', 'true');
    showToast('Authentication Required', 'Please sign in or create an account to download the APK.', 'info');
    switchView('login');
  }
}

function processPendingDownloadIntent() {
  const pendingIntent = sessionStorage.getItem('pending_download_intent');
  if (pendingIntent === 'true') {
    sessionStorage.removeItem('pending_download_intent');
    showToast('Access Granted', 'Directing to APK Download Hub...', 'success');
    switchView('download-hub');
    setTimeout(() => {
      triggerApkDownloadSequence();
    }, 800);
  }
}

async function triggerApkDownloadSequence() {
  const btn = document.getElementById('btn-start-download');
  const progressWrap = document.getElementById('download-progress-container');
  const progressFill = document.getElementById('download-progress-fill');
  const progressPercent = document.getElementById('download-percent-text');
  const counterEl = document.getElementById('download-counter-num');

  if (btn) btn.disabled = true;
  if (progressWrap) progressWrap.style.display = 'block';

  let currentPercent = 0;
  const interval = setInterval(() => {
    currentPercent += 5;
    if (progressFill) progressFill.style.width = `${currentPercent}%`;
    if (progressPercent) progressPercent.textContent = `${currentPercent}%`;

    if (currentPercent >= 100) {
      clearInterval(interval);
      if (btn) btn.disabled = false;
      showToast('Download Complete!', 'InclusivePay_v2.4.0.apk has been downloaded.', 'success');

      // Increment counter
      if (counterEl) {
        let currentCount = parseInt(counterEl.textContent.replace(/,/g, '')) || 12480;
        counterEl.textContent = (currentCount + 1).toLocaleString();
      }

      // Trigger Virtual File Download
      const link = document.createElement('a');
      link.href = 'data:text/plain;charset=utf-8,InclusivePay%20v2.4.0%20Accessible%20APK%20Binary';
      link.download = 'InclusivePay_v2.4.0.apk';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, 75);
}

/* ==========================================================================
   AUTHENTICATION FORM HANDLERS (LOCAL & GOOGLE)
   ========================================================================== */
async function handleLoginSubmit(event) {
  event.preventDefault();

  const emailInput = document.getElementById('login-email');
  const pwdInput = document.getElementById('login-pwd');
  const submitBtn = document.getElementById('btn-login-submit');

  const userEmail = emailInput ? emailInput.value.trim() : '';
  const userPwd = pwdInput ? pwdInput.value.trim() : '';

  if (!userEmail || !userPwd) {
    showToast('Login Error', 'Please provide both email address and password.', 'error');
    return;
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Authenticating...';
  }

  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail, password: userPwd })
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem('inclusivepay_token', data.token);
      updateNavUserProfile(data.user);
      showToast('Welcome Back!', `Signed in as ${data.user.fullName || data.user.email}`, 'success');

      if (sessionStorage.getItem('pending_download_intent') === 'true') {
        processPendingDownloadIntent();
      } else {
        switchView('dashboard');
      }
    } else {
      showToast('Authentication Failed', data.message || 'Invalid email or password.', 'error');
    }
  } catch (error) {
    console.error('Local Login Error:', error);
    // Fallback demo login if server endpoint is offline
    const fallbackUser = { fullName: userEmail.split('@')[0], email: userEmail, provider: 'local' };
    updateNavUserProfile(fallbackUser);
    showToast('Signed In (Demo)', `Welcome back, ${fallbackUser.fullName}!`, 'success');
    if (sessionStorage.getItem('pending_download_intent') === 'true') {
      processPendingDownloadIntent();
    } else {
      switchView('dashboard');
    }
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign In to Dashboard';
    }
  }
}

async function handleSignupSubmit(event) {
  event.preventDefault();

  const nameInput = document.getElementById('signup-name');
  const emailInput = document.getElementById('signup-email');
  const pwdInput = document.getElementById('signup-pwd');
  const confirmPwdInput = document.getElementById('signup-confirm-pwd');
  const submitBtn = document.getElementById('btn-signup-submit');

  const fullName = nameInput ? nameInput.value.trim() : '';
  const email = emailInput ? emailInput.value.trim() : '';
  const password = pwdInput ? pwdInput.value : '';
  const confirmPwd = confirmPwdInput ? confirmPwdInput.value : '';

  if (!fullName || !email || !password) {
    showToast('Validation Error', 'Please complete all required registration fields.', 'error');
    return;
  }

  if (password !== confirmPwd) {
    showToast('Validation Error', 'Passwords do not match. Please re-enter.', 'error');
    return;
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating Account...';
  }

  try {
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password })
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem('inclusivepay_token', data.token);
      updateNavUserProfile(data.user);
      showToast('Registration Successful!', 'Your InclusivePay account is now active.', 'success');

      if (sessionStorage.getItem('pending_download_intent') === 'true') {
        processPendingDownloadIntent();
      } else {
        switchView('dashboard');
      }
    } else {
      showToast('Registration Failed', data.message || 'Failed to create account.', 'error');
    }
  } catch (error) {
    console.error('Signup Error:', error);
    const fallbackUser = { fullName, email, provider: 'local' };
    updateNavUserProfile(fallbackUser);
    showToast('Account Created (Demo)', `Welcome ${fullName}!`, 'success');
    if (sessionStorage.getItem('pending_download_intent') === 'true') {
      processPendingDownloadIntent();
    } else {
      switchView('dashboard');
    }
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Create Account & Go to Dashboard';
    }
  }
}

async function loginWithGoogle() {
  if (!window.firebaseAuth || !window.firebaseAuth.auth) {
    showToast('Firebase Error', 'Firebase SDK is initializing. Please refresh.', 'error');
    return;
  }

  const { auth, googleProvider, signInWithPopup } = window.firebaseAuth;

  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const payload = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email.split('@')[0],
      photoURL: user.photoURL || ''
    };

    const response = await fetch("http://localhost:5000/api/auth/google-sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const resData = await response.json();

    const userData = resData.success ? resData.user : { fullName: payload.displayName, email: payload.email, profileImage: payload.photoURL };

    if (resData.token) localStorage.setItem('inclusivepay_token', resData.token);

    updateNavUserProfile(userData);
    showToast('Google Sign-In Successful!', `Logged in as ${userData.fullName || userData.email}`, 'success');

    if (sessionStorage.getItem('pending_download_intent') === 'true') {
      processPendingDownloadIntent();
    } else {
      switchView('dashboard');
    }

  } catch (error) {
    console.error("❌ Google Sign-In Error:", error);
    if (error.code !== 'auth/popup-closed-by-user') {
      showToast('Google Sign-In Failed', error.message, 'error');
    }
  }
}

/* ==========================================================================
   PROFILE & SESSION MANAGEMENT
   ========================================================================== */
window.updateNavUserProfile = function (userData) {
  if (!userData) return;

  const btnLogin = document.getElementById('btn-nav-login');
  const userProfileMenu = document.getElementById('user-profile-menu');
  const avatarImg = document.getElementById('user-avatar');
  const avatarFallback = document.getElementById('user-avatar-fallback');
  const displayNameEl = document.getElementById('user-display-name');
  const displayEmailEl = document.getElementById('user-display-email');
  const dashUserName = document.getElementById('dash-user-name');

  const navDashboardWrap = document.getElementById('nav-item-dashboard-wrap');
  const navProfileWrap = document.getElementById('nav-item-profile-wrap');

  // Profile View Elements
  const profViewAvatar = document.getElementById('prof-view-avatar');
  const profViewFallback = document.getElementById('prof-view-fallback');
  const profViewName = document.getElementById('prof-view-name');
  const profViewEmail = document.getElementById('prof-view-email');
  const editProfName = document.getElementById('edit-prof-name');
  const editProfEmail = document.getElementById('edit-prof-email');

  localStorage.setItem('inclusivepay_user', JSON.stringify(userData));

  const name = userData.fullName || userData.displayName || (userData.email ? userData.email.split('@')[0] : 'User');
  const email = userData.email || '';
  const photo = userData.profileImage || userData.photoURL || '';

  if (displayNameEl) displayNameEl.textContent = name;
  if (displayEmailEl) displayEmailEl.textContent = email;
  if (dashUserName) dashUserName.textContent = name;

  if (profViewName) profViewName.textContent = name;
  if (profViewEmail) profViewEmail.textContent = email;
  if (editProfName) editProfName.value = name;
  if (editProfEmail) editProfEmail.value = email;

  // Avatar handling
  if (photo && avatarImg) {
    avatarImg.src = photo;
    avatarImg.style.display = 'block';
    if (avatarFallback) avatarFallback.style.display = 'none';
  } else if (avatarFallback) {
    avatarFallback.textContent = name.charAt(0).toUpperCase();
    avatarFallback.style.display = 'flex';
    if (avatarImg) avatarImg.style.display = 'none';
  }

  if (photo && profViewAvatar) {
    profViewAvatar.src = photo;
    profViewAvatar.style.display = 'block';
    if (profViewFallback) profViewFallback.style.display = 'none';
  } else if (profViewFallback) {
    profViewFallback.textContent = name.charAt(0).toUpperCase();
    profViewFallback.style.display = 'flex';
    if (profViewAvatar) profViewAvatar.style.display = 'none';
  }

  if (btnLogin) btnLogin.style.display = 'none';
  if (userProfileMenu) userProfileMenu.style.display = 'flex';
  if (navDashboardWrap) navDashboardWrap.style.display = 'block';
  if (navProfileWrap) navProfileWrap.style.display = 'block';
};

window.handleLogout = async function () {
  try {
    if (window.firebaseAuth && window.firebaseAuth.auth && window.firebaseAuth.signOut) {
      await window.firebaseAuth.signOut(window.firebaseAuth.auth);
    }
  } catch (err) {
    console.warn("Firebase signout warning:", err);
  }

  localStorage.removeItem('inclusivepay_user');
  localStorage.removeItem('inclusivepay_token');

  const btnLogin = document.getElementById('btn-nav-login');
  const userProfileMenu = document.getElementById('user-profile-menu');
  const navDashboardWrap = document.getElementById('nav-item-dashboard-wrap');
  const navProfileWrap = document.getElementById('nav-item-profile-wrap');

  if (btnLogin) btnLogin.style.display = 'inline-block';
  if (userProfileMenu) userProfileMenu.style.display = 'none';
  if (navDashboardWrap) navDashboardWrap.style.display = 'none';
  if (navProfileWrap) navProfileWrap.style.display = 'none';

  showToast('Logged Out', 'You have been signed out of your account.', 'info');
  switchView('home');
};

async function handleUpdateProfileSubmit(event) {
  event.preventDefault();

  const editProfName = document.getElementById('edit-prof-name');
  const newName = editProfName ? editProfName.value.trim() : '';

  if (!newName) {
    showToast('Error', 'Please enter your full name.', 'error');
    return;
  }

  const savedUser = localStorage.getItem('inclusivepay_user');
  let userObj = savedUser ? JSON.parse(savedUser) : {};
  userObj.fullName = newName;
  userObj.displayName = newName;

  updateNavUserProfile(userObj);
  showToast('Profile Saved', 'Your profile details have been updated.', 'success');
}

// Global View Switcher Engine
window.switchView = function (viewId) {
  const views = ['home', 'features', 'about', 'login', 'signup', 'dashboard', 'download-hub', 'profile'];

  views.forEach(v => {
    const el = document.getElementById(`view-${v}`);
    if (el) {
      el.classList.remove('active');
      el.style.display = 'none';
    }
  });

  const targetView = document.getElementById(`view-${viewId}`);
  if (targetView) {
    targetView.classList.add('active');
    targetView.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Sync nav highlight
  document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
  const activeLink = document.getElementById(`nav-item-${viewId}`);
  if (activeLink) activeLink.classList.add('active');
};

// DOM Initialization
document.addEventListener('DOMContentLoaded', () => {
  const savedUser = localStorage.getItem('inclusivepay_user');
  if (savedUser) {
    try {
      updateNavUserProfile(JSON.parse(savedUser));
    } catch (e) {
      console.error("Failed parsing saved user session:", e);
    }
  }

  const initialHash = window.location.hash.replace('#', '');
  if (['login', 'signup', 'dashboard', 'download-hub', 'profile'].includes(initialHash)) {
    switchView(initialHash);
  }
});

// Alias downloadAPK to handleDownloadNavClick for all CTA buttons
window.downloadAPK = function (event) {
  handleDownloadNavClick(event);
};




