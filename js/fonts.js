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

  function applyFont(fontName) {
    const font = FONTS[fontName] || FONTS.nunito;
    
    // Удаляем старый стиль
    const oldStyle = document.getElementById('dynamic-font-style');
    if (oldStyle) oldStyle.remove();
    
    // Создаём новый стиль
    const style = document.createElement('style');
    style.id = 'dynamic-font-style';
    style.textContent = `* { font-family: ${font} !important; }`;
    document.head.appendChild(style);
    
    // Для каллиграфических шрифтов увеличиваем базовый размер body
    if (fontName === 'greatvibes') {
      document.body.style.fontSize = '1.15em';
    } else {
      document.body.style.fontSize = '';
    }
    
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
