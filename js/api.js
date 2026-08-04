// ===== ЛОКАЛЬНОЕ ХРАНИЛИЩЕ ДАННЫХ (БЕЗ СЕРВЕРА) =====
(function(global) {
  'use strict';

  const SESSION_KEY = 'sweetbake_session';

  function seedData() {
    if (!localStorage.getItem('sweetbake_cakes')) {
      const cakes = [
        { id: 'cake_1', title: 'Шоколадный мусс', short: 'Нежный мусс и тёмный шоколад', ingredients: ['шоколад', 'сливки', 'какао'], price: 1990, media: [{ type: 'image', url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80' }], description: 'Слой за слоем: влажный бисквит, шоколадный мусс, тонкая глазурь.' },
        { id: 'cake_2', title: 'Клубничный чизкейк', short: 'Классика с ягодной кислинкой', ingredients: ['сливочный сыр', 'клубника', 'печенье'], price: 2390, media: [{ type: 'image', url: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=600&q=80' }], description: 'Нежный крем-чиз, песочная основа и клубничная шапка.' },
        { id: 'cake_3', title: 'Медовик карамельный', short: 'Медовые коржи + карамельный крем', ingredients: ['мёд', 'сметана', 'карамель'], price: 1790, media: [{ type: 'image', url: 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?auto=format&fit=crop&w=600&q=80' }], description: 'Домашний вкус, мягкие коржи и крем с карамелью.' }
      ];
      localStorage.setItem('sweetbake_cakes', JSON.stringify(cakes));
    }
    if (!localStorage.getItem('sweetbake_users')) {
      const users = [
        { id: 'u_admin', email: 'admin@sweetbake.ru', password: 'admin123', role: 'admin', name: 'Администратор' },
        { id: 'u_user1', email: 'user@test.ru', password: '123456', role: 'user', name: 'Анна' }
      ];
      localStorage.setItem('sweetbake_users', JSON.stringify(users));
    }
    if (!localStorage.getItem('sweetbake_contacts')) {
      const contacts = { items: [
        { id: 'c1', type: 'phone', label: 'Телефон', value: '+7 (999) 123-45-67' },
        { id: 'c2', type: 'email', label: 'Почта', value: 'order@sweetbake.ru' }
      ]};
      localStorage.setItem('sweetbake_contacts', JSON.stringify(contacts));
    }
    if (!localStorage.getItem('sweetbake_orders')) localStorage.setItem('sweetbake_orders', JSON.stringify([]));
    if (!localStorage.getItem('sweetbake_reviews')) localStorage.setItem('sweetbake_reviews', JSON.stringify([]));
  }

  function getAll(key) { return JSON.parse(localStorage.getItem('sweetbake_' + key) || '[]'); }
  function saveAll(key, data) { localStorage.setItem('sweetbake_' + key, JSON.stringify(data)); }
  function generateId(prefix) { return prefix + Date.now() + '_' + Math.random().toString(36).substr(2, 9); }

  const api = {
    cakes: {
      getAll: () => Promise.resolve(getAll('cakes')),
      get: (id) => { const cake = getAll('cakes').find(c => c.id === id); return cake ? Promise.resolve(cake) : Promise.reject(new Error('Не найдено')); },
      create: (data) => { const cakes = getAll('cakes'); const newCake = { ...data, id: data.id || generateId('cake_') }; cakes.push(newCake); saveAll('cakes', cakes); return Promise.resolve(newCake); },
      update: (id, data) => { const cakes = getAll('cakes'); const idx = cakes.findIndex(c => c.id === id); if (idx === -1) return Promise.reject(new Error('Не найдено')); cakes[idx] = { ...cakes[idx], ...data }; saveAll('cakes', cakes); return Promise.resolve(cakes[idx]); },
      delete: (id) => { saveAll('cakes', getAll('cakes').filter(c => c.id !== id)); return Promise.resolve({ success: true }); }
    },
    users: {
      getAll: () => Promise.resolve(getAll('users')),
      get: (id) => { const user = getAll('users').find(u => u.id === id); return user ? Promise.resolve(user) : Promise.reject(new Error('Не найдено')); },
      create: (data) => { const users = getAll('users'); const newUser = { ...data, id: data.id || generateId('u_') }; users.push(newUser); saveAll('users', users); return Promise.resolve(newUser); },
      update: (id, data) => { const users = getAll('users'); const idx = users.findIndex(u => u.id === id); if (idx === -1) return Promise.reject(new Error('Не найдено')); users[idx] = { ...users[idx], ...data }; saveAll('users', users); return Promise.resolve(users[idx]); },
      delete: (id) => { saveAll('users', getAll('users').filter(u => u.id !== id)); return Promise.resolve({ success: true }); }
    },
    contacts: {
      get: () => Promise.resolve(JSON.parse(localStorage.getItem('sweetbake_contacts') || '{"items":[]}')),
      update: (data) => { localStorage.setItem('sweetbake_contacts', JSON.stringify(data)); return Promise.resolve(data); }
    },
    reviews: {
      getAll: (cakeId) => { let reviews = getAll('reviews'); if (cakeId) reviews = reviews.filter(r => r.cakeId === cakeId); reviews.sort((a, b) => b.createdAt - a.createdAt); return Promise.resolve(reviews); },
      create: (data) => { const reviews = getAll('reviews'); const newReview = { ...data, id: data.id || generateId('r_') }; reviews.push(newReview); saveAll('reviews', reviews); return Promise.resolve(newReview); }
    },
    orders: {
      getAll: () => { const orders = getAll('orders'); orders.sort((a, b) => b.createdAt - a.createdAt); return Promise.resolve(orders); },
      getUserOrders: (userId) => { const orders = getAll('orders').filter(o => o.userId === userId); orders.sort((a, b) => b.createdAt - a.createdAt); return Promise.resolve(orders); },
      create: (data) => { const orders = getAll('orders'); const newOrder = { ...data, id: data.id || generateId('o_') }; orders.push(newOrder); saveAll('orders', orders); return Promise.resolve(newOrder); },
      update: (id, data) => { const orders = getAll('orders'); const idx = orders.findIndex(o => o.id === id); if (idx === -1) return Promise.reject(new Error('Не найдено')); orders[idx] = { ...orders[idx], ...data }; saveAll('orders', orders); return Promise.resolve(orders[idx]); },
      delete: (id) => { saveAll('orders', getAll('orders').filter(o => o.id !== id)); return Promise.resolve({ success: true }); }
    }
  };

  const auth = {
    async login(email, password) { const users = await api.users.getAll(); const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password); if (!user) throw new Error('❌ Неверный email или пароль'); localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id, email: user.email, role: user.role })); return { user, session: { userId: user.id } }; },
    async register(userData) { const users = await api.users.getAll(); if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) throw new Error('❌ Такой email уже существует'); const newUser = await api.users.create({ ...userData, role: 'user' }); localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: newUser.id, email: newUser.email, role: newUser.role })); return { user: newUser }; },
    logout() { localStorage.removeItem(SESSION_KEY); },
    getSession() { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); },
    async getCurrentUser() { const session = this.getSession(); if (!session?.userId) return null; try { return await api.users.get(session.userId); } catch { this.logout(); return null; } },
    isAdmin() { const session = this.getSession(); return session?.role === 'admin'; }
  };

  seedData();

  global.SweetBakeAPI = { api, auth };

})(window);