/**
 * Hero decorations — редактор (admin) и просмотр (главная).
 * mode: 'edit' | 'view'
 */
(function (global) {
  'use strict';

  const DEFAULT_DECORATIONS = [
    { id: 'd1', type: 'circle', size: 250, x: 10, y: 25, opacity: 0.5, depth: 0.05, animation: 'spin', duration: 20 },
    { id: 'd2', type: 'circle', size: 160, x: 16, y: 33, opacity: 0.4, depth: 0.06, animation: 'spin-reverse', duration: 15 },
    { id: 'd3', type: 'circle', size: 190, x: 8, y: 70, opacity: 0.4, depth: 0.05, animation: 'spin', duration: 25 },
    { id: 'd4', type: 'dots', size: 120, x: 8, y: 18, opacity: 0.5, depth: 0.08, animation: 'none', duration: 20 },
    { id: 'd5', type: 'ring', size: 180, x: 82, y: 72, opacity: 0.4, depth: 0.1, animation: 'spin-reverse', duration: 18 },
    { id: 'd6', type: 'wave', size: 200, x: 15, y: 80, opacity: 0.4, depth: 0.06, animation: 'float', duration: 3 },
    { id: 'd7', type: 'arc', size: 260, x: 72, y: 6, opacity: 0.5, depth: 0.07, animation: 'spin', duration: 24 },
    { id: 'd8', type: 'glow', size: 340, x: 58, y: 48, opacity: 0.5, depth: 0.04, animation: 'float', duration: 6 },
    { id: 'd9', type: 'diamond', size: 90, x: 32, y: 10, opacity: 0.55, depth: 0.14, animation: 'spin-reverse', duration: 28 },
    { id: 'd10', type: 'cross', size: 36, x: 62, y: 16, opacity: 0.7, depth: 0.16, animation: 'spin', duration: 30 },
    { id: 'd11', type: 'stripes', size: 150, x: 86, y: 38, opacity: 0.35, depth: 0.09, animation: 'none', duration: 20 },
    { id: 'd12', type: 'dots', size: 100, x: 42, y: 78, opacity: 0.4, depth: 0.12, animation: 'none', duration: 20 }
  ];

  function cloneDecorations(list) {
    return (list || []).map(d => ({ ...d }));
  }

  /**
   * @param {object} opts
   * @param {'edit'|'view'} opts.mode
   * @param {HTMLElement} opts.heroEl
   * @param {HTMLElement} opts.decorationsEl
   * @param {HTMLElement} [opts.bgEl]
   * @param {HTMLElement} [opts.decoListEl]
   * @param {object} [opts.form] — id полей формы (только edit)
   * @param {HTMLElement} [opts.addBtn]
   * @param {Array} [opts.decorations]
   * @param {(list: Array) => void} [opts.onChange]
   */
  function mount(opts) {
    const mode = opts.mode || 'view';
    const heroEl = opts.heroEl;
    const decorationsEl = opts.decorationsEl;
    const bgEl = opts.bgEl || null;
    const decoListEl = opts.decoListEl || null;
    const form = opts.form || null;
    const addBtn = opts.addBtn || null;
    const onChange = typeof opts.onChange === 'function' ? opts.onChange : null;

    if (!heroEl || !decorationsEl) {
      return { getDecorations: () => [], setDecorations: () => {}, destroy: () => {} };
    }

    let decorations = cloneDecorations(
      Array.isArray(opts.decorations)
        ? opts.decorations
        : DEFAULT_DECORATIONS
    );

    let selectedId = null;
    let editingId = null;
    let dragData = null;
    let isMouseOverHero = false;
    let animItems = [];
    let animStart = null;
    let rafId = null;
    let destroyed = false;

    function notify() {
      if (onChange) onChange(cloneDecorations(decorations));
    }

    function rebuildAnimRegistry() {
      animItems = decorations.map(d => ({
        inner: decorationsEl.querySelector(`.hero-deco[data-id="${d.id}"] .hero-deco-inner`),
        animation: d.animation,
        duration: d.duration || 20,
        size: d.size
      })).filter(i => i.inner);
    }

    function updateDecoPosition(id) {
      const el = decorationsEl.querySelector(`.hero-deco[data-id="${id}"]`);
      const d = decorations.find(item => item.id === id);
      if (!el || !d) return;
      el.style.left = d.x + '%';
      el.style.top = d.y + '%';
    }

    function renderDecoList() {
      if (!decoListEl || mode !== 'edit') return;
      decoListEl.innerHTML = '';
      decorations.forEach((d, index) => {
        const item = document.createElement('div');
        item.className = 'deco-item' + (selectedId === d.id ? ' deco-item-selected' : '');
        item.innerHTML = `
          <span>${d.type} · ${d.size}px · (${Number(d.x).toFixed(1)}%,${Number(d.y).toFixed(1)}%) · ${d.animation} · ${d.duration}s</span>
          <div>
            <button type="button" data-index="${index}" class="select-deco" aria-label="Выбрать">👁</button>
            <button type="button" data-index="${index}" class="edit-deco" aria-label="Редактировать">✏️</button>
            <button type="button" data-index="${index}" class="delete-deco" aria-label="Удалить">✕</button>
          </div>
        `;
        decoListEl.appendChild(item);
      });
    }

    function renderDecorations() {
      decorationsEl.innerHTML = '';
      decorations.forEach(d => {
        const outer = document.createElement('div');
        outer.className = `hero-deco hero-deco-${d.type}`;
        outer.dataset.id = d.id;
        outer.dataset.depth = d.depth;
        outer.dataset.animation = d.animation;
        outer.style.cssText = `
          width: ${d.size}px;
          height: ${d.size}px;
          left: ${d.x}%;
          top: ${d.y}%;
          opacity: ${d.opacity};
        `;
        if (mode === 'edit' && selectedId === d.id) outer.classList.add('selected');
        if (mode === 'view') outer.style.pointerEvents = 'none';

        const inner = document.createElement('div');
        inner.className = 'hero-deco-inner';
        outer.appendChild(inner);
        decorationsEl.appendChild(outer);
      });
      rebuildAnimRegistry();
      renderDecoList();
    }

    function animLoop(now) {
      if (destroyed) return;
      if (animStart === null) animStart = now;
      const t = (now - animStart) / 1000;
      for (const it of animItems) {
        if (!it.inner) continue;
        const phase = (t / it.duration) % 1;
        if (it.animation === 'spin') {
          it.inner.style.transform = `rotate(${(phase * 360).toFixed(2)}deg)`;
        } else if (it.animation === 'spin-reverse') {
          it.inner.style.transform = `rotate(${(360 - phase * 360).toFixed(2)}deg)`;
        } else if (it.animation === 'float') {
          const amp = Math.min(18, 8 + it.size * 0.04);
          it.inner.style.transform =
            `translateY(${(-amp * Math.sin(phase * Math.PI * 2)).toFixed(2)}px)`;
        } else {
          it.inner.style.transform = '';
        }
      }
      rafId = requestAnimationFrame(animLoop);
    }

    function formEl(id) {
      return form && form[id] ? document.getElementById(form[id]) : null;
    }

    function resetForm() {
      if (mode !== 'edit' || !form) return;
      editingId = null;
      if (addBtn) addBtn.textContent = '➕ Добавить';
      const type = formEl('type'); if (type) type.value = 'circle';
      const size = formEl('size'); if (size) size.value = 150;
      const x = formEl('x'); if (x) x.value = 10;
      const y = formEl('y'); if (y) y.value = 20;
      const opacity = formEl('opacity'); if (opacity) opacity.value = 0.5;
      const depth = formEl('depth'); if (depth) depth.value = 0.03;
      const animation = formEl('animation'); if (animation) animation.value = 'none';
      const duration = formEl('duration'); if (duration) duration.value = 20;
    }

    function getFormData() {
      const num = (key, fallback) => {
        const el = formEl(key);
        const v = el ? parseFloat(el.value) : NaN;
        return Number.isFinite(v) ? v : fallback;
      };
      return {
        type: (formEl('type') && formEl('type').value) || 'circle',
        size: Math.max(1, num('size', 150)),
        x: Math.min(95, Math.max(0, num('x', 0))),
        y: Math.min(95, Math.max(0, num('y', 0))),
        opacity: num('opacity', 0.5),
        depth: num('depth', 0.03),
        animation: (formEl('animation') && formEl('animation').value) || 'none',
        duration: Math.max(0.1, num('duration', 20))
      };
    }

    function updateSelectedForm() {
      if (mode !== 'edit' || !form) return;
      const d = decorations.find(item => item.id === selectedId);
      if (!d) return;
      const type = formEl('type'); if (type) type.value = d.type;
      const size = formEl('size'); if (size) size.value = d.size;
      const x = formEl('x'); if (x) x.value = d.x;
      const y = formEl('y'); if (y) y.value = d.y;
      const opacity = formEl('opacity'); if (opacity) opacity.value = d.opacity;
      const depth = formEl('depth'); if (depth) depth.value = d.depth;
      const animation = formEl('animation'); if (animation) animation.value = d.animation;
      const duration = formEl('duration'); if (duration) duration.value = d.duration;
    }

    function selectDeco(id) {
      selectedId = id;
      editingId = id;
      if (addBtn) addBtn.textContent = '💾 Сохранить изменения';
      renderDecorations();
      updateSelectedForm();
    }

    // --- Events ---
    function onMouseEnter() { isMouseOverHero = true; }
    function onMouseLeave() {
      isMouseOverHero = false;
      if (bgEl) bgEl.style.transform = 'translate(0,0) scale(1.1)';
      decorationsEl.querySelectorAll('.hero-deco').forEach(el => {
        el.style.transform = 'translate(0,0)';
      });
    }

    function onPointerDown(e) {
      if (mode !== 'edit') return;
      const deco = e.target.closest('.hero-deco');
      if (!deco) return;
      e.preventDefault();
      selectDeco(deco.dataset.id);

      const el = decorationsEl.querySelector(`.hero-deco[data-id="${selectedId}"]`);
      if (el) {
        el.setPointerCapture(e.pointerId);
        el.classList.add('dragging');
      }

      const rect = heroEl.getBoundingClientRect();
      const decoData = decorations.find(d => d.id === selectedId);
      if (!decoData) return;
      dragData = {
        id: selectedId,
        offsetX: e.clientX - rect.left - (decoData.x / 100) * rect.width,
        offsetY: e.clientY - rect.top - (decoData.y / 100) * rect.height,
        rect
      };
    }

    function onPointerMove(e) {
      if (dragData) {
        const d = decorations.find(item => item.id === dragData.id);
        if (!d) return;
        const rect = dragData.rect;
        const x = ((e.clientX - rect.left - dragData.offsetX) / rect.width) * 100;
        const y = ((e.clientY - rect.top - dragData.offsetY) / rect.height) * 100;
        d.x = Math.min(95, Math.max(0, x));
        d.y = Math.min(95, Math.max(0, y));
        updateDecoPosition(dragData.id);
        updateSelectedForm();
        notify();
      } else if (isMouseOverHero) {
        const rect = heroEl.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        if (bgEl) {
          bgEl.style.transform = `translate(${x * -0.01}px, ${y * -0.01}px) scale(1.1)`;
        }
        decorationsEl.querySelectorAll('.hero-deco').forEach(el => {
          if (mode === 'edit' && el.dataset.id === selectedId) {
            el.style.transform = 'translate(0,0)';
            return;
          }
          const depth = parseFloat(el.dataset.depth) || 0.03;
          const size = parseFloat(el.style.width) || 100;
          const scaleFactor = Math.max(1, size / 300);
          const effectiveDepth = depth * scaleFactor;
          el.style.transform = `translate(${x * effectiveDepth}px, ${y * effectiveDepth}px)`;
        });
      }
    }

    function onPointerUp() {
      if (dragData) {
        const el = decorationsEl.querySelector(`.hero-deco[data-id="${dragData.id}"]`);
        if (el) el.classList.remove('dragging');
        notify();
      }
      dragData = null;
    }

    function onKeyDown(e) {
      if (mode !== 'edit') return;
      if (e.target.closest && e.target.closest('input, select, textarea')) return;
      if (!selectedId) return;
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
      e.preventDefault();
      const step = e.shiftKey ? 10 : 1;
      const d = decorations.find(item => item.id === selectedId);
      if (!d) return;
      if (e.key === 'ArrowLeft') d.x = Math.max(0, d.x - step);
      if (e.key === 'ArrowRight') d.x = Math.min(95, d.x + step);
      if (e.key === 'ArrowUp') d.y = Math.max(0, d.y - step);
      if (e.key === 'ArrowDown') d.y = Math.min(95, d.y + step);
      updateDecoPosition(selectedId);
      updateSelectedForm();
      notify();
    }

    function onListClick(e) {
      const btn = e.target.closest('button');
      if (!btn || btn.dataset.index === undefined) return;
      const index = parseInt(btn.dataset.index, 10);
      if (btn.classList.contains('select-deco') || btn.classList.contains('edit-deco')) {
        selectDeco(decorations[index].id);
      }
      if (btn.classList.contains('delete-deco')) {
        decorations.splice(index, 1);
        if (selectedId && !decorations.find(d => d.id === selectedId)) selectedId = null;
        renderDecorations();
        resetForm();
        notify();
      }
    }

    function onAddClick() {
      const data = getFormData();
      if (editingId) {
        const index = decorations.findIndex(d => d.id === editingId);
        if (index !== -1) decorations[index] = { ...decorations[index], ...data };
        editingId = null;
        if (addBtn) addBtn.textContent = '➕ Добавить';
      } else {
        decorations.push({ id: 'd' + Date.now(), ...data });
      }
      selectedId = null;
      renderDecorations();
      resetForm();
      notify();
    }

    heroEl.addEventListener('mouseenter', onMouseEnter);
    heroEl.addEventListener('mouseleave', onMouseLeave);
    decorationsEl.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('keydown', onKeyDown);
    if (decoListEl) decoListEl.addEventListener('click', onListClick);
    if (addBtn) addBtn.addEventListener('click', onAddClick);

    renderDecorations();
    rafId = requestAnimationFrame(animLoop);

    return {
      getDecorations() {
        return cloneDecorations(decorations);
      },
      setDecorations(list) {
        decorations = cloneDecorations(
          Array.isArray(list) ? list : DEFAULT_DECORATIONS
        );
        selectedId = null;
        editingId = null;
        renderDecorations();
        resetForm();
      },
      destroy() {
        destroyed = true;
        if (rafId) cancelAnimationFrame(rafId);
        heroEl.removeEventListener('mouseenter', onMouseEnter);
        heroEl.removeEventListener('mouseleave', onMouseLeave);
        decorationsEl.removeEventListener('pointerdown', onPointerDown);
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('keydown', onKeyDown);
        if (decoListEl) decoListEl.removeEventListener('click', onListClick);
        if (addBtn) addBtn.removeEventListener('click', onAddClick);
      }
    };
  }

  global.SweetBakeHeroDeco = {
    DEFAULT_DECORATIONS,
    mount,
    cloneDecorations
  };
})(window);
