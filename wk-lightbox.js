/* 워크룸 사진 크게 보기 (라이트박스) — a.wk-lb 링크를 누르면 큰 사진을 띄운다.
   같은 .wk-photos 묶음 안에서 좌우 버튼·키보드 화살표·스와이프로 넘기고, ×·Esc·배경 누르기로 닫는다. */
(function () {
  if (window.__wkLightbox) return;
  window.__wkLightbox = 1;
  var css = '#wk-lb{position:fixed;inset:0;z-index:2147483000;background:rgba(10,12,15,.94);display:none;align-items:center;justify-content:center;-webkit-tap-highlight-color:transparent}' +
    '#wk-lb.on{display:flex}#wk-lb figure{margin:0;display:flex;flex-direction:column;align-items:center;max-width:94vw}' +
    '#wk-lb img{max-width:94vw;max-height:80vh;width:auto;height:auto;object-fit:contain;border-radius:6px;user-select:none;-webkit-user-drag:none;background:#222}' +
    '#wk-lb figcaption{color:#e6e8ec;font:500 14px/1.5 "Pretendard Variable",Pretendard,sans-serif;margin-top:12px;text-align:center}' +
    '#wk-lb button{position:absolute;background:rgba(255,255,255,.14);color:#fff;border:0;width:48px;height:48px;border-radius:50%;font:300 28px/48px sans-serif;cursor:pointer;padding:0;text-align:center}' +
    '#wk-lb button:hover{background:rgba(255,255,255,.26)}#wk-lb .x{top:16px;right:16px}#wk-lb .p{left:16px;top:50%;margin-top:-24px}#wk-lb .n{right:16px;top:50%;margin-top:-24px}' +
    '@media (max-width:640px){#wk-lb .p,#wk-lb .n{top:auto;bottom:24px;margin:0}#wk-lb img{max-height:70vh}}';
  var box, img, cap, list = [], idx = 0, sx = null, sy = null, prevOverflow = '';

  function build() {
    if (box) return;
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    box = document.createElement('div'); box.id = 'wk-lb';
    box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', '사진 크게 보기');
    box.innerHTML = '<figure><img alt=""><figcaption></figcaption></figure>' +
      '<button class="p" type="button" aria-label="이전 사진">‹</button><button class="n" type="button" aria-label="다음 사진">›</button>' +
      '<button class="x" type="button" aria-label="닫기">×</button>';
    document.body.appendChild(box);
    img = box.querySelector('img'); cap = box.querySelector('figcaption');
    box.querySelector('.x').onclick = close;
    box.querySelector('.p').onclick = function () { go(-1); };
    box.querySelector('.n').onclick = function () { go(1); };
    box.addEventListener('click', function (e) { if (e.target === box || e.target.tagName === 'FIGURE') close(); });
    box.addEventListener('touchstart', function (e) { var t = e.touches[0]; sx = t.clientX; sy = t.clientY; }, { passive: true });
    box.addEventListener('touchend', function (e) {
      if (sx === null) return;
      var t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy; sx = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
      else if (dy > 90 && Math.abs(dy) > Math.abs(dx)) close();
    }, { passive: true });
  }
  function show() {
    var a = list[idx];
    img.src = a.href; img.alt = (a.querySelector('img') || {}).alt || '';
    cap.textContent = (a.getAttribute('data-cap') || img.alt) + (list.length > 1 ? '  (' + (idx + 1) + '/' + list.length + ')' : '');
    var many = list.length > 1;
    box.querySelector('.p').style.display = many ? '' : 'none';
    box.querySelector('.n').style.display = many ? '' : 'none';
    [idx + 1, idx - 1].forEach(function (k) { var b = list[(k + list.length) % list.length]; if (b) { var i = new Image(); i.src = b.href; } });
  }
  function go(d) { idx = (idx + d + list.length) % list.length; show(); }
  function open(a) {
    build();
    var group = a.closest('.wk-photos') || document;
    list = Array.prototype.slice.call(group.querySelectorAll('a.wk-lb'));
    idx = Math.max(0, list.indexOf(a));
    show();
    box.classList.add('on');
    prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    box.querySelector('.x').focus();
  }
  function close() {
    if (!box || !box.classList.contains('on')) return;
    box.classList.remove('on'); img.removeAttribute('src');
    document.documentElement.style.overflow = prevOverflow;
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a.wk-lb');
    if (!a) return;
    e.preventDefault(); open(a);
  });
  document.addEventListener('keydown', function (e) {
    if (!box || !box.classList.contains('on')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') go(1);
    else if (e.key === 'ArrowLeft') go(-1);
  });
})();
