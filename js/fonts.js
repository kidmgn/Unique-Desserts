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
    playfair: "'Playfair Display', serif"
  };

  function applyFont(fontName) {
    // Если выбранный шрифт не найден — используем Nunito
    const font = FONTS[fontName] || FONTS.nunito;

    // Удаляем старый динамический стиль
    const oldStyle = document.getElementById('dynamic-font-style');
    if (oldStyle) oldStyle.remove();

    // Создаём новый стиль с максимальным приоритетом
    const style = document.createElement('style');
    style.id = 'dynamic-font-style';
    style.textContent = `* { font-family: ${font} !important; }`;
    document.head.appendChild(style);

    // Сохраняем выбор
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
