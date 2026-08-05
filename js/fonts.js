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
    pacifico: "'Pacifico', cursive"
  };

  function applyFont(fontName) {
    const font = FONTS[fontName] || FONTS.nunito;
    // Применяем ко ВСЕМ элементам с !important
    document.documentElement.style.setProperty('font-family', font, 'important');
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
