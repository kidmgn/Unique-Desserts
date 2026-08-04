// ===== СИСТЕМА ТЕМ SWEETBAKE (С ЭМОДЗИ-ФОНОМ) =====
(function(global) {
  'use strict';

  const THEMES = {
    pink: {
      name: '🌸 Розовая',
      bg: '#fff0f5',
      card: 'rgba(255, 255, 255, 0.85)',
      muted: '#d53f8c',
      text: '#2d1b2e',
      textOnPrimary: '#1e1020',
      accent: '#f472b6',
      accent2: '#fbcfe8',
      border: 'rgba(244, 114, 182, 0.25)',
      shadow: '0 20px 30px -10px rgba(244, 114, 182, 0.15)',
      headerBg: 'rgba(255, 240, 245, 0.8)',
      footerBg: 'rgba(255, 240, 245, 0.9)',
      bgGradient: 'radial-gradient(1100px 600px at 10% -5%, rgba(255,140,200,0.2), transparent 55%), radial-gradient(900px 500px at 90% 5%, rgba(255,200,220,0.18), transparent 60%), #fff0f5',
      emojis: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍒', '🍑', '🥭', '🍍', '🥝']
    },
    brown: {
      name: '☕ Шоколад',
      bg: '#f5e6d3',
      card: 'rgba(255, 255, 255, 0.85)',
      muted: '#b45309',
      text: '#3d2b1a',
      textOnPrimary: '#2d1a0a',
      accent: '#b45309',
      accent2: '#d97706',
      border: 'rgba(180, 83, 9, 0.25)',
      shadow: '0 20px 30px -10px rgba(180, 83, 9, 0.12)',
      headerBg: 'rgba(245, 230, 211, 0.8)',
      footerBg: 'rgba(245, 230, 211, 0.9)',
      bgGradient: 'radial-gradient(1100px 600px at 10% -5%, rgba(234,179,8,0.15), transparent 55%), radial-gradient(900px 500px at 90% 5%, rgba(217,119,6,0.12), transparent 60%), #f5e6d3',
      emojis: ['🍦', '🍨', '🍩', '🍪', '🎂', '🍰', '🧁', '🥧', '🍫', '🍬', '🍭', '🍡', '🍧', '🍮', '🍯']
    },
    green: {
      name: '🌿 Матча',
      bg: '#ecfdf5',
      card: 'rgba(255, 255, 255, 0.85)',
      muted: '#166534',
      text: '#064e3b',
      textOnPrimary: '#0d1f12',
      accent: '#10b981',
      accent2: '#34d399',
      border: 'rgba(16, 185, 129, 0.25)',
      shadow: '0 20px 30px -10px rgba(16, 185, 129, 0.12)',
      headerBg: 'rgba(236, 253, 245, 0.8)',
      footerBg: 'rgba(236, 253, 245, 0.9)',
      bgGradient: 'radial-gradient(1100px 600px at 10% -5%, rgba(74,222,128,0.15), transparent 55%), radial-gradient(900px 500px at 90% 5%, rgba(34,197,94,0.12), transparent 60%), #ecfdf5',
      emojis: ['☕', '🍵', '🍶', '🍾', '🍷', '🍸', '🍹', '🍺', '🍻', '🥂', '🥃', '🧃', '🧉', '🥛', '🫖']
    },
    yellow: {
      name: '🍋 Лимон',
      bg: '#fefce8',
      card: 'rgba(255, 255, 255, 0.85)',
      muted: '#a16207',
      text: '#713f12',
      textOnPrimary: '#2d1f05',
      accent: '#eab308',
      accent2: '#facc15',
      border: 'rgba(234, 179, 8, 0.25)',
      shadow: '0 20px 30px -10px rgba(234, 179, 8, 0.12)',
      headerBg: 'rgba(254, 252, 232, 0.8)',
      footerBg: 'rgba(254, 252, 232, 0.9)',
      bgGradient: 'radial-gradient(1100px 600px at 10% -5%, rgba(250,204,21,0.18), transparent 55%), radial-gradient(900px 500px at 90% 5%, rgba(234,179,8,0.12), transparent 60%), #fefce8',
      emojis: ['🥐', '🍞', '🥖', '🥨', '🥯', '🥞', '🧇', '🍕', '🍔', '🍟', '🌭', '🥪', '🥙', '🌮', '🌯']
    },
    dark: {
      name: '🌙 Тёмная',
      bg: '#0f172a',
      card: 'rgba(30, 41, 59, 0.8)',
      muted: '#9aa7c7',
      text: '#e2e8f0',
      textOnPrimary: '#0b0f1a',
      accent: '#f472b6',
      accent2: '#8b5cf6',
      border: 'rgba(255,255,255,0.12)',
      shadow: '0 20px 30px -10px rgba(0,0,0,0.4)',
      headerBg: 'rgba(15, 23, 42, 0.8)',
      footerBg: 'rgba(15, 23, 42, 0.9)',
      bgGradient: 'radial-gradient(1200px 700px at 10% -10%, rgba(139,92,246,0.35), transparent 55%), radial-gradient(1000px 500px at 90% 0%, rgba(244,114,182,0.25), transparent 60%), #0f172a',
      emojis: []
    }
  };

  const STORAGE_KEY = 'sweetbake_theme';
  const EMOJI_ENABLED_KEY = 'sweetbake_emoji_enabled';
  const DEFAULT_THEME = 'pink';

  let animationId = null;
  let allEmojis = [];
  let emojiEnabled = true;

  // ===== ПРОВЕРКА ПЕРЕСЕЧЕНИЙ =====
  function hasCollision(newX, newY, newSize, existingEmojis, minGap) {
    for (const existing of existingEmojis) {
      const dx = newX - existing.startX;
      const dy = newY - existing.startY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const minDistance = (newSize + existing.size) / 100 / 2 + minGap;
      if (distance < minDistance) return true;
    }
    return false;
  }

  // ===== ОТТАЛКИВАНИЕ =====
  function applyRepulsion(data, allData, index) {
    const repulsionRadius = 15;
    const repulsionForce = 0.08;
    const maxSpeed = 0.015;
    const minSpeed = 0.004;
    
    let repelX = 0;
    let repelY = 0;
    
    for (let i = 0; i < allData.length; i++) {
      if (i === index) continue;
      const other = allData[i];
      
      let dx = data.x - other.x;
      let dy = data.y - other.y;
      
      if (Math.abs(dx) > 50) dx = dx > 0 ? dx - 100 : dx + 100;
      if (Math.abs(dy) > 50) dy = dy > 0 ? dy - 100 : dy + 100;
      
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < repulsionRadius && distance > 0.001) {
        const force = Math.pow((repulsionRadius - distance) / repulsionRadius, 2) * repulsionForce;
        repelX += (dx / distance) * force;
        repelY += (dy / distance) * force;
      }
    }
    
    data.directionX += repelX;
    data.directionY += repelY;
    
    const currentSpeed = Math.sqrt(data.directionX * data.directionX + data.directionY * data.directionY);
    if (currentSpeed > maxSpeed) {
      data.directionX = data.directionX / currentSpeed * maxSpeed;
      data.directionY = data.directionY / currentSpeed * maxSpeed;
    }
    if (currentSpeed < minSpeed && currentSpeed > 0) {
      data.directionX = data.directionX / currentSpeed * minSpeed;
      data.directionY = data.directionY / currentSpeed * minSpeed;
    }
  }

  // ===== СОЗДАНИЕ ОДНОГО ЭМОДЗИ =====
  function createEmoji(themeEmojis, existingEmojis) {
    const randomEmoji = themeEmojis[Math.floor(Math.random() * themeEmojis.length)];
    const size = Math.floor(Math.random() * 20) + 45;
    
    let startX, startY;
    let attempts = 0;
    const maxAttempts = 1000;
    const minGap = 3;
    
    do {
      startX = Math.random() * 90 + 5;
      startY = Math.random() * 90 + 5;
      attempts++;
    } while (hasCollision(startX, startY, size, existingEmojis, minGap) && attempts < maxAttempts);
    
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 0.006 + 0.004;
    const rotation = Math.floor(Math.random() * 60) - 30;
    
    const emoji = document.createElement('div');
    emoji.className = 'emoji-item';
    emoji.textContent = randomEmoji;
    
    const emojiData = {
      el: emoji,
      x: startX,
      y: startY,
      startX: startX,
      startY: startY,
      size: size,
      rotation: rotation,
      directionX: Math.cos(angle) * speed,
      directionY: Math.sin(angle) * speed
    };
    
    emoji.style.fontSize = size + 'px';
    emoji.style.transform = `rotate(${rotation}deg)`;
    emoji.style.left = startX + '%';
    emoji.style.top = startY + '%';
    
    return emojiData;
  }

  // ===== АНИМАЦИЯ =====
  function animateEmojis() {
    if (!emojiEnabled) {
      animationId = requestAnimationFrame(animateEmojis);
      return;
    }
    
    for (let i = 0; i < allEmojis.length; i++) {
      applyRepulsion(allEmojis[i], allEmojis, i);
    }
    
    for (const data of allEmojis) {
      data.x += data.directionX;
      data.y += data.directionY;
      
      if (data.x > 105) data.x = -5;
      if (data.x < -5) data.x = 105;
      if (data.y > 105) data.y = -5;
      if (data.y < -5) data.y = 105;
      
      data.el.style.left = data.x + '%';
      data.el.style.top = data.y + '%';
    }
    
    animationId = requestAnimationFrame(animateEmojis);
  }

  // ===== ГЕНЕРАЦИЯ ЭМОДЗИ =====
  function generateEmojis(themeId) {
    // Очищаем старые
    const existingBg = document.getElementById('emojiBg');
    if (existingBg) existingBg.innerHTML = '';
    allEmojis = [];
    
    const theme = THEMES[themeId];
    if (!theme.emojis || theme.emojis.length === 0) return;
    if (!emojiEnabled) return;
    
    // Создаём контейнер если нет
    let container = document.getElementById('emojiBg');
    if (!container) {
      container = document.createElement('div');
      container.id = 'emojiBg';
      container.className = 'emoji-bg';
      document.body.appendChild(container);
    }
    
    const count = Math.floor(Math.random() * 5) + 16;
    
    for (let i = 0; i < count; i++) {
      const emojiData = createEmoji(theme.emojis, allEmojis);
      allEmojis.push(emojiData);
      container.appendChild(emojiData.el);
    }
    
    // Показываем/скрываем в зависимости от настройки
    container.style.display = emojiEnabled ? 'block' : 'none';
  }

  // ===== ПРИМЕНЕНИЕ ТЕМЫ =====
  function applyTheme(themeId) {
    const theme = THEMES[themeId] || THEMES[DEFAULT_THEME];
    const root = document.documentElement;
    const body = document.body;
    
    Object.entries(theme).forEach(([key, val]) => {
      if (key !== 'name' && key !== 'bgGradient' && key !== 'emojis') {
        root.style.setProperty(`--${key}`, val);
      }
    });
    
    if (theme.bgGradient) {
      body.style.background = theme.bgGradient;
    }
    
    body.setAttribute('data-theme', themeId);
    localStorage.setItem(STORAGE_KEY, themeId);
    updateActiveButton(themeId);
    
    // Генерируем эмодзи
    generateEmojis(themeId);
    
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: themeId, themeData: theme } }));
  }

  function updateActiveButton(themeId) {
    document.querySelectorAll('[data-theme-btn]').forEach(btn => {
      const isActive = btn.dataset.themeBtn === themeId;
      btn.classList.toggle('active', isActive);
      if (btn.classList.contains('theme-btn')) {
        btn.classList.toggle('active', isActive);
      }
    });
  }

  // ===== ПЕРЕКЛЮЧАТЕЛЬ ТЕМ =====
  function createThemeSwitcher(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    container.className = 'theme-switcher';
    
    Object.entries(THEMES).forEach(([id, theme]) => {
      const btn = document.createElement('div');
      btn.className = 'theme-btn';
      btn.dataset.themeBtn = id;
      btn.style.background = `linear-gradient(145deg, ${theme.accent2}, ${theme.accent})`;
      btn.title = theme.name;
      btn.setAttribute('role', 'button');
      btn.setAttribute('tabindex', '0');
      btn.addEventListener('click', () => applyTheme(id));
      container.appendChild(btn);
    });
    
    // Загружаем настройку эмодзи
    const savedEmojiSetting = localStorage.getItem(EMOJI_ENABLED_KEY);
    if (savedEmojiSetting !== null) {
      emojiEnabled = savedEmojiSetting === 'true';
    }
    
    // Запускаем анимацию
    if (!animationId) {
      animationId = requestAnimationFrame(animateEmojis);
    }
    
    const savedTheme = localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME;
    applyTheme(savedTheme);
  }

  // ===== УПРАВЛЕНИЕ ЭМОДЗИ =====
  function toggleEmoji(enabled) {
    emojiEnabled = enabled;
    localStorage.setItem(EMOJI_ENABLED_KEY, enabled);
    
    const container = document.getElementById('emojiBg');
    if (container) {
      container.style.display = enabled ? 'block' : 'none';
    }
    
    if (enabled && allEmojis.length === 0) {
      const currentTheme = getCurrentTheme();
      generateEmojis(currentTheme);
    }
  }

  function isEmojiEnabled() {
    return emojiEnabled;
  }

  function getCurrentTheme() {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME;
  }

  function getThemeData(themeId) {
    return THEMES[themeId] || THEMES[DEFAULT_THEME];
  }

  function getThemesList() {
    return Object.entries(THEMES).map(([id, data]) => ({
      id,
      name: data.name,
      accent: data.accent,
      accent2: data.accent2
    }));
  }

  // ===== ЭКСПОРТ =====
  global.SweetBakeTheme = {
    apply: applyTheme,
    createSwitcher: createThemeSwitcher,
    getCurrent: getCurrentTheme,
    getData: getThemeData,
    getList: getThemesList,
    toggleEmoji: toggleEmoji,
    isEmojiEnabled: isEmojiEnabled,
    THEMES: THEMES
  };

})(window);