// ===== API КЛИЕНТ ДЛЯ SWEETBAKE =====
(function(global) {
  'use strict';

  const API_URL = 'http://localhost:3000';
  const SESSION_KEY = 'sweetbake_session';

  // ===== ОБРАБОТЧИК ОШИБОК НА РУССКОМ =====
  function handleError(error, action) {
    console.error('API Error:', error);
    
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      throw new Error('❌ Не удалось подключиться к серверу.\n\n📌 Убедитесь, что JSON Server запущен:\n   npm start\n\n📌 Или откройте сайт через Live Server, а не просто файл.');
    }
    
    if (error.message.includes('404')) {
      throw new Error(`❌ Не найдено: ${action || 'данные'}`);
    }
    if (error.message.includes('500')) {
      throw new Error('❌ Ошибка сервера. Попробуйте позже.');
    }
    if (error.message.includes('400')) {
      throw new Error('❌ Неверный запрос. Проверьте данные.');
    }
    if (error.message.includes('401')) {
      throw new Error('❌ Неверный email или пароль.');
    }
    if (error.message.includes('403')) {
      throw new Error('❌ Доступ запрещён.');
    }
    
    throw error;
  }

  // ===== БАЗОВЫЕ ЗАПРОСЫ =====
  async function request(endpoint, options = {}) {
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options
      });
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      
      return await res.json();
    } catch (e) {
      throw handleError(e, endpoint);
    }
  }

  const api = {
    cakes: {
      getAll: () => request('/cakes'),
      get: (id) => request(`/cakes/${id}`),
      create: (data) => request('/cakes', { method: 'POST', body: JSON.stringify(data) }),
      update: (id, data) => request(`/cakes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
      delete: (id) => request(`/cakes/${id}`, { method: 'DELETE' })
    },
    users: {
      getAll: () => request('/users'),
      get: (id) => request(`/users/${id}`),
      create: (data) => request('/users', { method: 'POST', body: JSON.stringify(data) }),
      update: (id, data) => request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
      delete: (id) => request(`/users/${id}`, { method: 'DELETE' })
    },
    contacts: {
      get: () => request('/contacts'),
      update: (data) => request('/contacts', { method: 'PUT', body: JSON.stringify(data) })
    },
    reviews: {
      getAll: (cakeId) => request(`/reviews${cakeId ? `?cakeId=${cakeId}&_sort=createdAt&_order=desc` : ''}`),
      create: (data) => request('/reviews', { method: 'POST', body: JSON.stringify(data) })
    },
    orders: {
      getAll: () => request('/orders?_sort=createdAt&_order=desc'),
      getUserOrders: (userId) => request(`/orders?userId=${userId}&_sort=createdAt&_order=desc`),
      create: (data) => request('/orders', { method: 'POST', body: JSON.stringify(data) })
    }
  };

  // ===== АВТОРИЗАЦИЯ =====
  const auth = {
    async login(email, password) {
      try {
        const users = await api.users.getAll();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        
        if (!user) {
          throw new Error('❌ Неверный email или пароль');
        }
        
        const session = { userId: user.id, email: user.email, role: user.role };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        
        return { user, session };
      } catch (e) {
        if (e.message.includes('подключиться')) throw e;
        throw new Error('❌ Неверный email или пароль');
      }
    },
    
    async register(userData) {
      try {
        const users = await api.users.getAll();
        
        if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
          throw new Error('❌ Пользователь с таким email уже существует');
        }
        
        const newUser = {
          id: 'u_' + Date.now(),
          ...userData,
          role: 'user'
        };
        
        await api.users.create(newUser);
        
        const session = { userId: newUser.id, email: newUser.email, role: newUser.role };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        
        return { user: newUser, session };
      } catch (e) {
        if (e.message.includes('подключиться')) throw e;
        throw new Error(e.message || '❌ Ошибка при регистрации');
      }
    },
    
    logout() {
      localStorage.removeItem(SESSION_KEY);
    },
    
    getSession() {
      return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    },
    
    async getCurrentUser() {
      const session = this.getSession();
      if (!session?.userId) return null;
      
      try {
        return await api.users.get(session.userId);
      } catch {
        this.logout();
        return null;
      }
    },
    
    isAdmin() {
      const session = this.getSession();
      return session?.role === 'admin';
    }
  };

  // ===== ЭКСПОРТ =====
  global.SweetBakeAPI = {
    api,
    auth,
    API_URL
  };

})(window);