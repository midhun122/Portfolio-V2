// CURSOR
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', function(e) {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});

(function loop() {
  rx += (mx - rx) * 0.1;
  ry += (my - ry) * 0.1;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(loop);
})();

document.querySelectorAll('a, button, .tag, .proj-card').forEach(function(el) {
  el.addEventListener('mouseenter', function() {
    cursor.classList.add('hov');
    ring.classList.add('hov');
  });
  el.addEventListener('mouseleave', function() {
    cursor.classList.remove('hov');
    ring.classList.remove('hov');
  });
});

// NAV SCROLL
var nav = document.getElementById('mainNav');
window.addEventListener('scroll', function() {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// SCROLL REVEAL
var ro = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) {
      e.target.classList.add('on');
      ro.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.rv').forEach(function(el) { ro.observe(el); });

// PROGRESS BARS
var po = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.prof-fill').forEach(function(b) {
        b.style.width = b.dataset.w + '%';
      });
      po.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.skills-panel').forEach(function(el) { po.observe(el); });


// Set email link (avoids spam bots)
var el = document.getElementById('emailLink');
if (el) {
  var e = 'midhunsujith42' + '@' + 'gmail.com';
  el.href = 'mailto:' + e;
  el.textContent = e + ' \u2197';
}
