/**
 * SSC CPO 2025 Result Checker - Widget Controller
 */

(function () {
  'use strict';

  // DOM Elements
  const form = document.getElementById('resultForm');
  const inputName = document.getElementById('inputName');
  const inputRoll = document.getElementById('inputRoll');
  const inputMobile = document.getElementById('inputMobile');
  const rollCounter = document.getElementById('rollCounter');

  const nameError = document.getElementById('nameError');
  const rollError = document.getElementById('rollError');
  const mobileError = document.getElementById('mobileError');
  const btnSubmit = document.getElementById('btnSubmit');

  // Views
  const qualifiedView = document.getElementById('qualifiedView');
  const notQualifiedView = document.getElementById('notQualifiedView');

  // Qualified View Fields
  const resName = document.getElementById('resName');
  const resRoll = document.getElementById('resRoll');
  const resList = document.getElementById('resList');
  const resFather = document.getElementById('resFather');
  const resMother = document.getElementById('resMother');
  const resCategory = document.getElementById('resCategory');

  // Not Qualified View Fields
  const nqRoll = document.getElementById('nqRoll');

  // Action Buttons
  const btnPrint = document.getElementById('btnPrint');
  const btnShare = document.getElementById('btnShare');
  const btnRecheckQ = document.getElementById('btnRecheckQ');
  const btnRecheckNQ = document.getElementById('btnRecheckNQ');

  // Settings Modal Elements
  const btnSettings = document.getElementById('btnSettings');
  const settingsModal = document.getElementById('settingsModal');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const inputDeploymentId = document.getElementById('inputDeploymentId');
  const btnSaveDeployment = document.getElementById('btnSaveDeployment');
  const sheetStatusIndicator = document.getElementById('sheetStatusIndicator');
  const statusIndicatorText = document.getElementById('statusIndicatorText');

  // Canvas Confetti
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas ? canvas.getContext('2d') : null;

  // Retrieve Active Script URL
  function getScriptUrl() {
    const saved = localStorage.getItem('SSC_CPO_SCRIPT_URL');
    if (saved && saved.trim()) return formatScriptUrl(saved.trim());

    if (window.CONFIG && window.CONFIG.GOOGLE_SCRIPT_URL && window.CONFIG.GOOGLE_SCRIPT_URL.trim()) {
      return formatScriptUrl(window.CONFIG.GOOGLE_SCRIPT_URL.trim());
    }
    return '';
  }

  function formatScriptUrl(raw) {
    if (!raw) return '';
    if (raw.startsWith('http://') || raw.startsWith('https://')) {
      return raw;
    }
    // If user provided just the Deployment ID:
    return `https://script.google.com/macros/s/${raw}/exec`;
  }

  // Update Settings UI Status
  function updateSettingsStatus() {
    const activeUrl = getScriptUrl();
    if (!sheetStatusIndicator || !statusIndicatorText) return;

    if (activeUrl) {
      sheetStatusIndicator.className = 'status-indicator connected';
      statusIndicatorText.textContent = 'Google Sheet Connected: Ready to capture data';
      if (inputDeploymentId) inputDeploymentId.value = activeUrl;
    } else {
      sheetStatusIndicator.className = 'status-indicator not-connected';
      statusIndicatorText.textContent = 'Google Sheet not connected yet (Paste Deployment ID below)';
      if (inputDeploymentId) inputDeploymentId.value = '';
    }
  }

  // ==========================================
  // Form Input Formatters & Live Counters
  // ==========================================

  // Roll Number: digits only, max 12 digits
  inputRoll.addEventListener('input', function () {
    const cleaned = this.value.replace(/\D/g, '').slice(0, 12);
    this.value = cleaned;
    rollCounter.textContent = `${cleaned.length} / 12 digits`;
    if (cleaned.length === 12) {
      rollCounter.style.color = '#34d399'; // green
      hideError(rollError);
    } else {
      rollCounter.style.color = '';
    }
  });

  // Mobile Number: digits only, max 10 digits
  inputMobile.addEventListener('input', function () {
    this.value = this.value.replace(/\D/g, '').slice(0, 10);
    if (this.value.length === 10) {
      hideError(mobileError);
    }
  });

  inputName.addEventListener('input', function () {
    if (this.value.trim().length >= 2) {
      hideError(nameError);
    }
  });

  function showError(el, msg) {
    el.textContent = msg;
    el.classList.add('visible');
  }

  function hideError(el) {
    el.classList.remove('visible');
  }

  // ==========================================
  // Result Checking & Data Logging
  // ==========================================

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = inputName.value.trim();
    const roll = inputRoll.value.trim();
    const mobile = inputMobile.value.trim();

    let hasError = false;

    // Validate Name
    if (!name || name.length < 2) {
      showError(nameError, 'Please enter your full name as in admit card');
      hasError = true;
    } else {
      hideError(nameError);
    }

    // Validate Roll Number
    if (!/^\d{12}$/.test(roll)) {
      showError(rollError, 'Please enter a valid 12-digit roll number');
      hasError = true;
    } else {
      hideError(rollError);
    }

    // Validate Mobile Number (Indian 10-digit number)
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      showError(mobileError, 'Please enter a valid 10-digit mobile number');
      hasError = true;
    } else {
      hideError(mobileError);
    }

    if (hasError) return;

    // Set Loading State
    btnSubmit.classList.add('loading');
    btnSubmit.disabled = true;

    // Simulate 350ms verification delay for smooth UX
    setTimeout(() => {
      processResult(name, roll, mobile);
    }, 350);
  });

  function processResult(studentName, rollNumber, mobileNumber) {
    // Lookup in extracted candidates dataset
    // Compact dataset format: [Name, Father, Mother, Gender(F/M), Cat1, Cat2, Cat3, RecNo]
    const candidates = window.SSC_CPO_DATA || {};
    const match = candidates[rollNumber];

    let resultStatus = 'NOT QUALIFIED';
    let candidateData = null;

    if (match) {
      resultStatus = 'QUALIFIED';
      const catMap = (window.CONFIG && window.CONFIG.CATEGORY_MAP) || {};
      const formatCat = (code) => {
        if (!code) return '';
        return catMap[code] ? `${code} - ${catMap[code]}` : code;
      };

      const catParts = [formatCat(match[4]), formatCat(match[5]), formatCat(match[6])].filter(Boolean);

      candidateData = {
        officialName: match[0] || studentName,
        fatherName: match[1] || 'N/A',
        motherName: match[2] || 'N/A',
        gender: match[3] === 'F' ? 'Female' : 'Male',
        listName: match[3] === 'F' ? 'LIST-1 (Female Candidates)' : 'LIST-2 (Male Candidates)',
        category: catParts.join(', ') || 'N/A',
        recNo: match[7] || ''
      };
    }

    // Prepare payload to log in Google Sheet
    const payload = {
      timestamp: new Date().toISOString(),
      name: studentName,
      rollNumber: rollNumber,
      mobileNumber: mobileNumber,
      status: resultStatus,
      officialName: candidateData ? candidateData.officialName : '',
      gender: candidateData ? candidateData.gender : '',
      category: candidateData ? candidateData.category : '',
      fatherName: candidateData ? candidateData.fatherName : '',
      motherName: candidateData ? candidateData.motherName : '',
      listName: candidateData ? candidateData.listName : '',
      source: window.location.hostname || 'Direct / Iframe'
    };

    // Log to Google Sheet asynchronously (fire and forget)
    sendToGoogleSheet(payload);

    // Save submission locally in localStorage as backup
    saveLocalSubmission(payload);

    // Switch View
    btnSubmit.classList.remove('loading');
    btnSubmit.disabled = false;
    form.style.display = 'none';

    if (resultStatus === 'QUALIFIED' && candidateData) {
      // Populate Qualified View
      resName.textContent = candidateData.officialName;
      resRoll.textContent = rollNumber;
      resList.textContent = `${candidateData.listName} (Record #${candidateData.recNo})`;
      resFather.textContent = candidateData.fatherName;
      resMother.textContent = candidateData.motherName;
      resCategory.textContent = candidateData.category;

      qualifiedView.style.display = 'block';

      // Launch Confetti Celebration!
      launchConfetti();
    } else {
      // Populate Not Qualified View
      nqRoll.textContent = rollNumber;
      notQualifiedView.style.display = 'block';
    }
  }

  // ==========================================
  // Google Apps Script API Logging
  // ==========================================

  function sendToGoogleSheet(payload) {
    const url = getScriptUrl();
    if (!url) {
      console.log('SSC CPO: Google Sheet URL not configured. Payload stored in localStorage:', payload);
      return;
    }

    // Try POST with text/plain (avoids CORS preflight)
    try {
      fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(payload)
      }).catch(err => {
        console.warn('POST failed, attempting GET fallback:', err);
        // Fallback: Send via GET query parameter
        const getUrl = `${url}?data=${encodeURIComponent(JSON.stringify(payload))}`;
        fetch(getUrl, { mode: 'no-cors' }).catch(e => console.error('GET fallback failed:', e));
      });
    } catch (e) {
      console.error('Error logging to Google Sheet:', e);
    }
  }

  function saveLocalSubmission(item) {
    try {
      const existing = JSON.parse(localStorage.getItem('SSC_CPO_SUBMISSIONS') || '[]');
      existing.unshift(item);
      // Keep last 50
      if (existing.length > 50) existing.pop();
      localStorage.setItem('SSC_CPO_SUBMISSIONS', JSON.stringify(existing));
    } catch (e) {}
  }

  // ==========================================
  // Recheck / Reset Flow
  // ==========================================

  function resetForm() {
    qualifiedView.style.display = 'none';
    notQualifiedView.style.display = 'none';
    form.style.display = 'block';
    inputRoll.value = '';
    rollCounter.textContent = '0 / 12 digits';
    rollCounter.style.color = '';
    inputRoll.focus();
  }

  btnRecheckQ.addEventListener('click', resetForm);
  btnRecheckNQ.addEventListener('click', resetForm);

  // Print Slip
  btnPrint.addEventListener('click', function () {
    window.print();
  });

  // WhatsApp Share
  btnShare.addEventListener('click', function () {
    const roll = resRoll.textContent;
    const name = resName.textContent;
    const shareText = `🎉 Qualified in SSC CPO 2025 (PST/PET) for Paper-II!\nCandidate: ${name}\nRoll: ${roll}\n\nCheck your result here: ${window.location.href}`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank');
  });

  // ==========================================
  // Settings Modal Handlers
  // ==========================================

  btnSettings.addEventListener('click', function () {
    updateSettingsStatus();
    settingsModal.classList.add('active');
  });

  btnCloseModal.addEventListener('click', function () {
    settingsModal.classList.remove('active');
  });

  settingsModal.addEventListener('click', function (e) {
    if (e.target === settingsModal) {
      settingsModal.classList.remove('active');
    }
  });

  btnSaveDeployment.addEventListener('click', function () {
    const rawVal = inputDeploymentId.value.trim();
    if (rawVal) {
      localStorage.setItem('SSC_CPO_SCRIPT_URL', rawVal);
      // Send a test ping
      const testUrl = formatScriptUrl(rawVal);
      btnSaveDeployment.textContent = 'Testing...';
      fetch(`${testUrl}?test=ping`, { mode: 'no-cors' })
        .then(() => {
          btnSaveDeployment.textContent = 'Saved & Tested ✓';
          updateSettingsStatus();
          setTimeout(() => {
            btnSaveDeployment.textContent = 'Save & Test';
            settingsModal.classList.remove('active');
          }, 1200);
        })
        .catch(() => {
          btnSaveDeployment.textContent = 'Saved ✓';
          updateSettingsStatus();
          setTimeout(() => {
            btnSaveDeployment.textContent = 'Save & Test';
            settingsModal.classList.remove('active');
          }, 1200);
        });
    } else {
      localStorage.removeItem('SSC_CPO_SCRIPT_URL');
      updateSettingsStatus();
      btnSaveDeployment.textContent = 'Cleared ✓';
      setTimeout(() => {
        btnSaveDeployment.textContent = 'Save & Test';
      }, 1000);
    }
  });

  // ==========================================
  // Lightweight Confetti Particle Engine
  // ==========================================

  let confettiParticles = [];
  let confettiAnimId = null;

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function launchConfetti() {
    if (!ctx) return;
    resizeCanvas();
    confettiParticles = [];

    const colors = ['#10b981', '#34d399', '#6366f1', '#818cf8', '#f59e0b', '#ec4899', '#38bdf8'];
    const particleCount = 120;

    for (let i = 0; i < particleCount; i++) {
      confettiParticles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 200,
        y: canvas.height * 0.4 + (Math.random() - 0.5) * 50,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.9) * 16,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 10,
        gravity: 0.35,
        opacity: 1
      });
    }

    if (confettiAnimId) cancelAnimationFrame(confettiAnimId);
    animateConfetti();
  }

  function animateConfetti() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let active = false;
    for (let p of confettiParticles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.vRot;
      p.opacity -= 0.007;

      if (p.opacity > 0 && p.y < canvas.height) {
        active = true;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }
    }

    if (active) {
      confettiAnimId = requestAnimationFrame(animateConfetti);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  // Initialize
  updateSettingsStatus();
  console.log('SSC CPO 2025 Result Checker Initialized. Total Indexed:', (window.SSC_CPO_DATA ? Object.keys(window.SSC_CPO_DATA).length : 0));

})();
