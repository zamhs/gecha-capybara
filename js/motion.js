/* Respectful, dependency-free adaptation of contemporary scroll-reveal patterns. */
(() => {
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const groups = [
    ...document.querySelectorAll('.section-header'),
    ...document.querySelectorAll('.step-card'),
    ...document.querySelectorAll('.routine-copy'),
    ...document.querySelectorAll('.checklist-panel'),
    ...document.querySelectorAll('.care-card'),
    ...document.querySelectorAll('.love-inner')
  ];
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px 20px 0px' });
  groups.forEach((el, index) => {
    el.classList.add('reveal');
    if (el.classList.contains('step-card') || el.classList.contains('care-card')) {
      const indexInGroup = [...el.parentElement.children].indexOf(el);
      el.style.setProperty('--reveal-delay', `${indexInGroup * 75}ms`);
    }
    io.observe(el);
  });
  document.body.classList.add('js-motion');
})();
