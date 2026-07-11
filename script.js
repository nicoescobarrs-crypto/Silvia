/* ============================================================
   State
   ============================================================ */
const state = {
  place: null,
  timeAnswer: null
};

/* ============================================================
   The "No" button — impossible to press
   ============================================================ */
function initNoButtonEvasion() {
  const noBtn = document.getElementById('btn-no');
  const DODGE_RADIUS = 110; // px — how close is "too close"

  function randomPosition() {
    const margin = 20;
    const btnW = noBtn.offsetWidth || 100;
    const btnH = noBtn.offsetHeight || 44;
    const maxX = window.innerWidth - btnW - margin;
    const maxY = window.innerHeight - btnH - margin;
    const x = margin + Math.random() * Math.max(0, maxX - margin);
    const y = margin + Math.random() * Math.max(0, maxY - margin);
    return { x, y };
  }

  function moveButtonTo(x, y) {
    noBtn.classList.add('escaping');
    noBtn.style.left = x + 'px';
    noBtn.style.top = y + 'px';
  }

  function dodge() {
    const { x, y } = randomPosition();
    moveButtonTo(x, y);
  }

  // Desktop: run away from the mouse cursor whenever it gets close
  window.addEventListener('mousemove', (e) => {
    if (!document.getElementById('screen-1').classList.contains('active')) return;

    const rect = noBtn.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;
    const dx = e.clientX - btnCenterX;
    const dy = e.clientY - btnCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < DODGE_RADIUS) {
      dodge();
    }
  });

  // Mobile: jump away the instant a touch begins anywhere near it,
  // before the touch can turn into a completed tap.
  noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    dodge();
  }, { passive: false });

  // Fallback for any pointer type that still manages to trigger a click:
  // reposition instead of doing anything else. The "No" option can never resolve.
  noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    dodge();
  });

  // Also dodge on hover start, for trackpads/touch-hybrids
  noBtn.addEventListener('mouseenter', dodge);
}

/* ============================================================
   Screen transitions
   ============================================================ */
function goToScreen(screenNumber, { delay = 550 } = {}) {
  const loader = document.getElementById('loader');
  loader.classList.add('visible');

  setTimeout(() => {
    document.querySelectorAll('.screen').forEach((el) => el.classList.remove('active'));
    const next = document.getElementById(`screen-${screenNumber}`);
    next.classList.add('active');

    // Re-trigger fade-in animation
    const card = next.querySelector('.card');
    card.classList.remove('fade-in');
    void card.offsetWidth; // force reflow so the animation restarts
    card.classList.add('fade-in');

    loader.classList.remove('visible');
  }, delay);
}

/* ============================================================
   Confetti (lightweight canvas implementation, no dependencies)
   ============================================================ */
function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#ff69b4', '#ff9ecb', '#ffffff', '#ffd1e6', '#ff4f9e'];
  const pieces = [];
  const pieceCount = 120;

  for (let i = 0; i < pieceCount; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.5,
      w: 6 + Math.random() * 6,
      h: 10 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: 2 + Math.random() * 3,
      speedX: (Math.random() - 0.5) * 3,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10
    });
  }

  let frame = 0;
  const totalFrames = 220;

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });

    frame++;
    if (frame < totalFrames) {
      requestAnimationFrame(tick);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  tick();
}

/* ============================================================
   Final screen — hearts floating upward inside the card
   ============================================================ */
function launchFinalHearts() {
  const container = document.getElementById('final-hearts');
  const symbols = ['💗', '💖', '💕'];

  for (let i = 0; i < 14; i++) {
    const heart = document.createElement('span');
    heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    heart.style.position = 'absolute';
    heart.style.left = (Math.random() * 90) + '%';
    heart.style.bottom = '0';
    heart.style.fontSize = (16 + Math.random() * 14) + 'px';
    heart.style.opacity = '0.85';
    heart.style.animation = `floatUp ${3 + Math.random() * 3}s ease-in forwards`;
    heart.style.animationDelay = (Math.random() * 1.5) + 's';
    container.appendChild(heart);
  }
}

/* ============================================================
   Device / browser info helpers (for the saved response)
   ============================================================ */
function getDeviceType() {
  const ua = navigator.userAgent || '';
  if (/tablet|ipad/i.test(ua)) return 'Tablet';
  if (/mobile|iphone|android/i.test(ua)) return 'Mobile';
  return 'Desktop';
}

/* ============================================================
   Save the final response to Firestore
   ============================================================ */
async function saveResponse() {
  try {
    await db.collection('responses').add({
      place: state.place,
      timeAnswer: state.timeAnswer,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      browserInfo: navigator.userAgent,
      deviceType: getDeviceType()
    });
    console.log('Response saved to Firestore 💖');
  } catch (err) {
    // We never want a Firestore hiccup to block her from seeing the final screen.
    console.error('Could not save response to Firestore:', err);
  }
}

/* ============================================================
   Wire everything up
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initNoButtonEvasion();

  // Screen 1 -> Screen 2
  document.getElementById('btn-yes').addEventListener('click', () => {
    launchConfetti();
    goToScreen(2, { delay: 900 }); // small delay so the confetti gets its moment
  });

  // Screen 2 -> Screen 3
  document.querySelectorAll('#screen-2 .btn-option').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#screen-2 .btn-option').forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
      state.place = btn.dataset.place;
      goToScreen(3);
    });
  });

  // Screen 3 -> Final screen
  document.querySelectorAll('#screen-3 .btn-option').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#screen-3 .btn-option').forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
      state.timeAnswer = btn.dataset.time;

      saveResponse();
      goToScreen(4);
      setTimeout(launchFinalHearts, 600);
    });
  });
});

// Keep the confetti canvas correctly sized if the viewport changes
window.addEventListener('resize', () => {
  const canvas = document.getElementById('confetti-canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
