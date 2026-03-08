/* ══ DROPDOWN ══ */
function toggleDropdown(e) {
  e.preventDefault();
  document.querySelector('.dropdown-menu').classList.toggle('open');
}
document.addEventListener('click', e => {
  if (!e.target.closest('.dropdown')) document.querySelector('.dropdown-menu').classList.remove('open');
});

/* ══ COUNTERS ══ */
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10), suffix = el.dataset.suffix || '', duration = 1400, start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(easeOutCubic(p) * target) + suffix;
    if (p < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = target + suffix;
      el.classList.add('pop');
      el.addEventListener('animationend', () => el.classList.remove('pop'), { once: true });
    }
  }
  requestAnimationFrame(tick);
}
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.counter').forEach(animateCounter);
      statsObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.6 });
const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

/* ══ SCROLL REVEAL ══ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* card stagger */
const cardObserver = new IntersectionObserver((entries) => {
  let delay = 0;
  entries.forEach(e => {
    if (e.isIntersecting && !e.target._rev) {
      e.target.style.animationDelay = delay + 'ms';
      e.target._rev = 1; delay += 60;
      cardObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.job-card').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'opacity .5s ease, transform .5s ease';
  cardObserver.observe(card);
});

function revealVisibleCards() {
  document.querySelectorAll('.job-card:not(.hidden)').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, i * 55);
  });
}

/* timeline line fill */
new IntersectionObserver((entries, obs) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('.timeline-step').forEach((s, i) =>
        setTimeout(() => s.classList.add('line-filled'), i * 280)
      );
      obs.disconnect();
    }
  });
}, { threshold: 0.4 }).observe(document.querySelector('.timeline'));

/* ══ FILTERS ══ */
let activeType = 'all', activeDept = 'all';

function setFilter(ft, v, btn) {
  if (ft === 'type') activeType = v; else activeDept = v;
  document.querySelectorAll(`[data-filter-type="${ft}"]`).forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  applyFilters();
}

function applyFilters() {
  const q = document.getElementById('searchInput').value.toLowerCase().trim();
  let vis = 0;
  document.querySelectorAll('.job-card').forEach(card => {
    const ok = (activeType === 'all' || card.dataset.type === activeType) &&
               (activeDept === 'all' || card.dataset.dept === activeDept) &&
               (!q || (card.dataset.keywords + ' ' + card.querySelector('.job-title').textContent).toLowerCase().includes(q));
    card.classList.toggle('hidden', !ok);
    if (ok) vis++;
  });
  document.getElementById('resultsCount').innerHTML = `<strong>${vis}</strong> role${vis !== 1 ? 's' : ''}`;
  document.getElementById('noResults').classList.toggle('visible', vis === 0);
  revealVisibleCards();
}

/* ══ APPLY MODAL ══ */
function openApply(title) {
  document.getElementById('modalJobTitle').textContent = title;
  document.getElementById('applyModal').classList.add('open');
  document.body.style.overflow = 'hidden';
  clearFormErrors();
}

function closeApply() {
  document.getElementById('applyModal').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('applyModal').addEventListener('click', function (e) {
  if (e.target === this) closeApply();
});

function handleFile(input) {
  document.getElementById('fileText').textContent = input.files[0] ? input.files[0].name : 'Upload PDF or DOC';
}

function clearFormErrors() {
  document.querySelectorAll('.field-error').forEach(el => el.classList.remove('visible'));
  document.querySelectorAll('.form-group input').forEach(el => el.classList.remove('error'));
  document.getElementById('fileUploadWrap').classList.remove('error');
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

['field-name', 'field-email', 'field-phone', 'field-college'].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('input', () => {
    if (el.value.trim()) {
      el.classList.remove('error');
      const errEl = document.getElementById('err-' + id.replace('field-', ''));
      if (errEl) errEl.classList.remove('visible');
    }
  });
});

function submitApply() {
  clearFormErrors();
  let valid = true;
  const n = document.getElementById('field-name').value.trim();
  const e = document.getElementById('field-email').value.trim();
  const p = document.getElementById('field-phone').value.trim();
  const c = document.getElementById('field-college').value.trim();
  const r = document.getElementById('field-resume').files[0];

  if (!n)                  { document.getElementById('field-name').classList.add('error');    document.getElementById('err-name').classList.add('visible');    valid = false; }
  if (!e || !validateEmail(e)) { document.getElementById('field-email').classList.add('error');   document.getElementById('err-email').classList.add('visible');   valid = false; }
  if (!p)                  { document.getElementById('field-phone').classList.add('error');   document.getElementById('err-phone').classList.add('visible');   valid = false; }
  if (!c)                  { document.getElementById('field-college').classList.add('error'); document.getElementById('err-college').classList.add('visible'); valid = false; }
  if (!r)                  { document.getElementById('fileUploadWrap').classList.add('error'); document.getElementById('err-resume').classList.add('visible'); valid = false; }

  if (!valid) {
    const box = document.querySelector('.modal-box');
    box.style.animation = 'none';
    box.offsetHeight;
    box.style.animation = 'shake .4s ease';
    return;
  }

  closeApply();
  toast('<i class="fa-solid fa-circle-check"></i> Application submitted successfully!');
  ['field-name', 'field-email', 'field-phone', 'field-college'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('field-resume').value = '';
  document.getElementById('fileText').textContent = 'Upload PDF or DOC';
  document.getElementById('field-why').value = '';
}

/* ══ SHARE ══ */
function openShare(title) {
  const u = 'https://brightaerospace.in/careers?role=' + encodeURIComponent(title.toLowerCase().replace(/\s+/g, '-'));
  const m = 'Check out this role at Bright Aerospace: ' + title + ' — ' + u;
  document.getElementById('shareJobTitle').textContent = title;
  document.getElementById('shareLinkInput').value = u;
  document.getElementById('shareWhatsapp').href  = 'https://wa.me/?text=' + encodeURIComponent(m);
  document.getElementById('shareLinkedin').href  = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(u);
  document.getElementById('shareTwitter').href   = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(m);
  document.getElementById('shareEmail').href     = 'mailto:?subject=' + encodeURIComponent('Job: ' + title) + '&body=' + encodeURIComponent(m);
  document.getElementById('shareModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeShare() {
  document.getElementById('shareModal').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('shareModal').addEventListener('click', function (e) {
  if (e.target === this) closeShare();
});

function copyLink() {
  document.getElementById('shareLinkInput').select();
  document.execCommand('copy');
  toast('<i class="fa-solid fa-link"></i> Link copied to clipboard!');
}

/* ══ TOAST ══ */
let toastTimer;
function toast(html) {
  const t = document.getElementById('toast');
  t.innerHTML = html;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 4000);
}

/* ══ SCROLL TO FOOTER ══ */
function scrollToFooter() {
  window.scrollTo({ top: 0, behavior: 'instant' });
  setTimeout(() => document.getElementById('footer').scrollIntoView({ behavior: 'smooth' }), 50);
}

/* ══ MAGNETIC APPLY BUTTONS ══ */
document.querySelectorAll('.apply-btn').forEach(btn => {
  btn.addEventListener('mousemove', function (e) {
    const rc = this.getBoundingClientRect();
    this.style.transform = `translate(${(e.clientX - rc.left - rc.width / 2) * .18}px,${(e.clientY - rc.top - rc.height / 2) * .18}px)`;
  });
  btn.addEventListener('mouseleave', function () { this.style.transform = ''; });
});

/* ══ RIPPLE ON FILTER BUTTONS ══ */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const r = document.createElement('span'), rc = this.getBoundingClientRect(), sz = Math.max(rc.width, rc.height);
    r.style.cssText = `position:absolute;border-radius:50%;width:${sz}px;height:${sz}px;left:${e.clientX - rc.left - sz / 2}px;top:${e.clientY - rc.top - sz / 2}px;background:rgba(250,219,15,.35);transform:scale(0);animation:rippleOut .5s ease forwards;pointer-events:none`;
    this.appendChild(r);
    r.addEventListener('animationend', () => r.remove());
  });
});

/* ══ PARALLAX GRID ON HERO ══ */
const hero = document.querySelector('.career-hero');
if (hero) {
  window.addEventListener('scroll', () => {
    hero.style.backgroundPositionY = window.scrollY * 0.3 + 'px';
  }, { passive: true });
}

/* ══ INJECTED KEYFRAMES ══ */
document.head.insertAdjacentHTML('beforeend', `<style>
  @keyframes shake { 0%,100%{transform:translateX(0)} 15%{transform:translateX(-8px)} 30%{transform:translateX(7px)} 45%{transform:translateX(-5px)} 60%{transform:translateX(4px)} 75%{transform:translateX(-2px)} }
  @keyframes rippleOut { to{transform:scale(2.5);opacity:0} }
</style>`);
