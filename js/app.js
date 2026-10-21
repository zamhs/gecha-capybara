(() => {
  'use strict';
  const STORAGE_KEY = 'gecha-capycare-today-v1';
  const inputs = [...document.querySelectorAll('[data-care]')];
  const progress = document.getElementById('progress-bar');
  const progressFill = document.getElementById('progress-fill');
  const progressCount = document.getElementById('progress-count');
  const progressMessage = document.getElementById('progress-message');
  const resetButton = document.getElementById('reset-care');
  const toast = document.getElementById('hug-toast');
  const confetti = document.getElementById('hug-confetti');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let dismissToastId;

  function readSaved() {
    try { const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); return parsed && typeof parsed === 'object' ? parsed : {}; }
    catch { return {}; }
  }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(inputs.map(input => [input.dataset.care, input.checked])))); }
    catch { /* Safari private mode or browser restrictions: checklist still works. */ }
  }
  function renderProgress() {
    const complete = inputs.filter(input => input.checked).length;
    progress.setAttribute('aria-valuenow', String(complete));
    progressFill.style.width = `${Math.round(100 * complete / inputs.length)}%`;
    progressCount.textContent = `${complete} de ${inputs.length} mimitos`;
    progressMessage.textContent = complete === inputs.length ? '¡Misión cumplida! Hoy te cuidaste muy bonito ♡' : complete >= 3 ? '¡Vas súper bien! Tu capibara está orgullosa ♡' : complete ? 'Qué bonito que te estés cuidando ♡' : 'Poquito a poquito también cuenta ♡';
    inputs.forEach(input => input.closest('.check-item')?.classList.toggle('is-done', input.checked));
  }
  const saved = readSaved();
  inputs.forEach(input => { input.checked = !!saved[input.dataset.care]; input.addEventListener('change', () => { save(); renderProgress(); }); });
  resetButton.addEventListener('click', () => { inputs.forEach(input => { input.checked = false; }); save(); renderProgress(); });
  renderProgress();

  const emojis = ['♡','✿','♥','✦','♡','✿','♥','✦'];
  function createHearts() {
    if (reduceMotion) return;
    confetti.replaceChildren();
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 17; i++) {
      const span = document.createElement('span');
      span.className = 'flying-heart'; span.textContent = emojis[i % emojis.length];
      span.style.setProperty('--x', `${Math.round((i - 8) * 23)}px`);
      span.style.setProperty('--delay', `${i * 27}ms`);
      span.style.setProperty('--rotate', `${(i % 2 ? 1 : -1) * (15 + 5 * i)}deg`);
      span.style.setProperty('--scale', `${0.7 + i % 3 * .22}`);
      fragment.appendChild(span);
    }
    confetti.appendChild(fragment);
    window.setTimeout(() => confetti.replaceChildren(), 1900);
  }
  document.querySelectorAll('[data-hug]').forEach(button => button.addEventListener('click', () => {
    toast.hidden = false;
    toast.classList.remove('toast-enter');
    void toast.offsetWidth;
    toast.classList.add('toast-enter');
    createHearts();
    window.clearTimeout(dismissToastId);
    dismissToastId = window.setTimeout(() => { toast.hidden = true; }, 4900);
  }));
})();
