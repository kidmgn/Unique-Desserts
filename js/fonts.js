// ===== ПРИМЕНЕНИЕ ШРИФТА =====
(function(global) {
  'use strict';

  const FONTS = {
    nunito: "'Nunito', sans-serif",
    georgia: "Georgia, serif",
    times: "'Times New Roman', serif",
    arial: "Arial, sans-serif",
    verdana: "Verdana, sans-serif",
    roboto: "'Roboto', sans-serif",
    greatvibes: "'Great Vibes', cursive"
  };

  // Увеличенный размер для каллиграфических шрифтов
  const SIZES = {
    greatvibes: '1.2em'
  };

  function applyFont(fontName) {
    const font = FONTS[fontName] || FONTS.nunito;
    const size = SIZES[fontName] || '1em';
    
    // Удаляем старый стиль
    const oldStyle = document.getElementById('dynamic-font-style');
    if (oldStyle) oldStyle.remove();
    
    // Создаём новый стиль
    const style = document.createElement('style');
    style.id = 'dynamic-font-style';
    style.textContent = `
      body, div, p, span, a, h1, h2, h3, h4, h5, h6,
      button, input, select, textarea, label, table, th, td,
      header, footer, main, nav, section, article,
      .btn, .pill, .tag, .card-title, .card-desc, .price,
      .form-group input, .form-group textarea, .form-group select,
      * {
        font-family: ${font} !important;
        font-size: ${size};
      }
    `;
    document.head.appendChild(style);
    
    localStorage.setItem('sweetbake_font', fontName);
  }

  function getSavedFont() {
    return localStorage.getItem('sweetbake_font') || 'nunito';
  }

  // Применяем сохранённый шрифт при загрузке
  const savedFont = getSavedFont();
  applyFont(savedFont);

  global.SweetBakeFonts = {
    apply: applyFont,
    getSaved: getSavedFont,
    FONTS: FONTS
  };

})(window);
