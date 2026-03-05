// ── 로그인 페이지 이동 ──
function goLogin() {
  window.location.href = '../asd/login.html';
}

// ── 캐러셀 상태 ──
const carousels = {
  course: { index: 0, cardWidth: 0, total: 0 },
  restaurant: { index: 0, cardWidth: 0, total: 0 },
};

function initCarousel(id) {
  const track = document.getElementById(id + '-track');
  const cards = track.children;
  if (!cards.length) return;

  const gap = 20;
  const card = cards[0];
  const cardW = card.offsetWidth + gap;

  carousels[id].cardWidth = cardW;
  carousels[id].total = cards.length;

  buildDots(id, cards.length);
  updateCarousel(id);
}

function slide(id, dir) {
  const c = carousels[id];
  const visibleCount = getVisibleCount(id);
  const maxIndex = Math.max(0, c.total - visibleCount);

  c.index = Math.min(Math.max(c.index + dir, 0), maxIndex);
  updateCarousel(id);
}

function updateCarousel(id) {
  const c = carousels[id];
  const track = document.getElementById(id + '-track');
  track.style.transform = `translateX(-${c.index * c.cardWidth}px)`;
  updateDots(id);
}

function getVisibleCount(id) {
  const viewport = document.getElementById(id + '-track').parentElement;
  const c = carousels[id];
  return c.cardWidth > 0 ? Math.floor(viewport.offsetWidth / c.cardWidth) : 3;
}

// ── 도트 ──
function buildDots(id, total) {
  const wrap = document.getElementById(id + '-dots');
  if (!wrap) return;
  wrap.innerHTML = '';
  const visibleCount = getVisibleCount(id);
  const dotCount = Math.max(1, total - visibleCount + 1);
  for (let i = 0; i < dotCount; i++) {
    const btn = document.createElement('button');
    btn.className = 'dot' + (i === 0 ? ' active' : '');
    btn.onclick = () => { carousels[id].index = i; updateCarousel(id); };
    wrap.appendChild(btn);
  }
}

function updateDots(id) {
  const wrap = document.getElementById(id + '-dots');
  if (!wrap) return;
  wrap.querySelectorAll('.dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === carousels[id].index);
  });
}

// ── 지역 탭 ──
function setRegion(btn, region) {
  document.querySelectorAll('.r-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  // 실제 필터링 대신 로그인 유도
  goLogin();
}

// ── 키보드 접근성 ──
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft')  slide('course', -1);
  if (e.key === 'ArrowRight') slide('course', 1);
});

// ── 터치 스와이프 ──
function addSwipe(id) {
  const track = document.getElementById(id + '-track');
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) slide(id, diff > 0 ? 1 : -1);
  }, { passive: true });
}

// ── 초기화 ──
window.addEventListener('load', () => {
  initCarousel('course');
  initCarousel('restaurant');
  addSwipe('course');
  addSwipe('restaurant');
});

window.addEventListener('resize', () => {
  initCarousel('course');
  initCarousel('restaurant');
});
