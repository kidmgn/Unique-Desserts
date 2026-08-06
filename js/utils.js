// ===== УТИЛИТЫ SWEETBAKE =====
(function(global) {
  'use strict';

  const utils = {
    // Форматирование цены
    formatPrice(price) {
      return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
    },
    
    // Форматирование даты
    formatDate(timestamp) {
      return new Date(timestamp).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    },
    
    // Форматирование даты и времени
    formatDateTime(timestamp) {
      return new Date(timestamp).toLocaleString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    
    // Генерация ID
    generateId(prefix = '') {
      return prefix + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },
    
    // Дебаунс для поиска
    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },
    
    // Показать уведомление
    showToast(message, type = 'info') {
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.textContent = message;
      toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 15px 25px;
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 20px;
        color: var(--text);
        backdrop-filter: blur(10px);
        z-index: 10000;
        animation: slideIn 0.3s ease;
      `;
      
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    },
    
    // Получить параметр из URL
    getUrlParam(name) {
      return new URLSearchParams(window.location.search).get(name);
    },
    
    // Обновить UI в зависимости от авторизации
    async updateAuthUI() {
      const user = await SweetBakeAPI.auth.getCurrentUser();
      const isAdmin = SweetBakeAPI.auth.isAdmin();
      
      // Скрываем/показываем элементы
      document.querySelectorAll('[data-auth="user"]').forEach(el => {
        el.style.display = user ? '' : 'none';
      });
      
      document.querySelectorAll('[data-auth="guest"]').forEach(el => {
        el.style.display = user ? 'none' : '';
      });
      
      document.querySelectorAll('[data-auth="admin"]').forEach(el => {
        el.style.display = isAdmin ? '' : 'none';
      });
      
      // Обновляем приветствие
      const greetingEl = document.getElementById('userGreeting');
      if (greetingEl && user) {
        greetingEl.textContent = `👤 ${user.name || user.email}`;
      }
      
      return user;
    },
    
    // ===== ПРОВЕРКА НОВЫХ ЗАКАЗОВ =====
    async checkNewOrders() {
      const session = SweetBakeAPI.auth.getSession();
      if (!session || session.role !== 'admin') return 0;
      
      try {
        const orders = await SweetBakeAPI.api.orders.getAll();
        const newCount = orders.filter(o => o.status === 'new').length;
        
        // Красная точка на кнопке «Админ»
        document.querySelectorAll('#adminNotificationDot').forEach(dot => {
          dot.classList.toggle('show', newCount > 0);
        });
        
        // Пульсация кнопки
        document.querySelectorAll('#adminBtnWrapper').forEach(wrapper => {
          wrapper.classList.toggle('pulse', newCount > 0);
        });
        
        // Счётчик на вкладке «Заказы» в админ-панели
        const orderBadge = document.getElementById('orderBadge');
        if (orderBadge) {
          if (newCount > 0) {
            orderBadge.textContent = newCount > 99 ? '99+' : `+${newCount}`;
            orderBadge.style.display = 'inline-block';
          } else {
            orderBadge.style.display = 'none';
          }
        }
        
        return newCount;
      } catch (e) {
        return 0;
      }
    },
    
    // ===== ЗВУК УВЕДОМЛЕНИЯ =====
    playNotificationSound() {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.value = 800;
        gain.gain.value = 0.08;
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.stop(ctx.currentTime + 0.3);
      } catch (e) {
        // Браузер не поддерживает
      }
    }
  };

  // Добавляем стили для тостов
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  global.SweetBakeUtils = utils;

})(window);
