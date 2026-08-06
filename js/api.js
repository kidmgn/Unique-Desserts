// ===== ЛОКАЛЬНОЕ ХРАНИЛИЩЕ ДАННЫХ (БЕЗ СЕРВЕРА) =====
(function(global) {
  'use strict';

  const SESSION_KEY = 'sweetbake_session';

  // ===== ДЕМО-ДАННЫЕ (загружаются при первом запуске) =====
  function seedData() {
    // Торты (пустой каталог)
if (!localStorage.getItem('sweetbake_cakes')) {
  localStorage.setItem('sweetbake_cakes', JSON.stringify([]));
}
    /*if (!localStorage.getItem('sweetbake_cakes')) {
      const cakes = [
        {
          id: 'cake_1',
          title: 'Шоколадный мусс',
          short: 'Нежный мусс и тёмный шоколад',
          ingredients: ['шоколад', 'сливки', 'какао'],
          price: 1990,
          categoryId: null,
          media: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80' },
            { type: 'video', url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4' }
          ],
          description: 'Слой за слоем: влажный бисквит, шоколадный мусс, тонкая глазурь.'
        },
        {
          id: 'cake_2',
          title: 'Клубничный чизкейк',
          short: 'Классика с ягодной кислинкой',
          ingredients: ['сливочный сыр', 'клубника', 'печенье'],
          price: 2390,
          categoryId: null,
          media: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=600&q=80' }
          ],
          description: 'Нежный крем-чиз, песочная основа и клубничная шапка.'
        },
        {
          id: 'cake_3',
          title: 'Медовик карамельный',
          short: 'Медовые коржи + карамельный крем',
          ingredients: ['мёд', 'сметана', 'карамель'],
          price: 1790,
          categoryId: null,
          media: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?auto=format&fit=crop&w=600&q=80' }
          ],
          description: 'Домашний вкус, мягкие коржи и крем с карамелью.'
        }
      ];
      localStorage.setItem('sweetbake_cakes', JSON.stringify(cakes));
    }*/

    // Пользователи
    if (!localStorage.getItem('sweetbake_users')) {
      const users = [
        { id: 'u_admin', email: 'admin@sweetbake.ru', password: 'admin123', role: 'admin', name: 'Администратор' },
        { id: 'u_user1', email: 'user@test.ru', password: '123456', role: 'user', name: 'Анна' }
      ];
      localStorage.setItem('sweetbake_users', JSON.stringify(users));
    }

    // Контакты
    if (!localStorage.getItem('sweetbake_contacts')) {
      const contacts = {
        items: [
          { id: 'c1', type: 'phone', label: 'Телефон', value: '+7 (999) 123-45-67' },
          { id: 'c2', type: 'email', label: 'Почта', value: 'order@sweetbake.ru' },
          { id: 'c3', type: 'other', label: 'Telegram', value: '@sweetbake' },
          { id: 'c4', type: 'other', label: 'Адрес', value: 'ул. Кондитерская, д. 5' }
        ]
      };
      localStorage.setItem('sweetbake_contacts', JSON.stringify(contacts));
    }

    // Заказы
    if (!localStorage.getItem('sweetbake_orders')) {
      localStorage.setItem('sweetbake_orders', JSON.stringify([]));
    }

    // Отзывы
    if (!localStorage.getItem('sweetbake_reviews')) {
      const reviews = [
        {
          id: 'r1',
          cakeId: 'cake_1',
          authorId: 'u_user1',
          authorName: 'Анна',
          rating: 5,
          text: 'Потрясающий торт! Очень нежный и вкусный.',
          createdAt: 1704067200000
        }
      ];
      localStorage.setItem('sweetbake_reviews', JSON.stringify(reviews));
    }

    // Категории
    if (!localStorage.getItem('sweetbake_categories')) {
      const categories = [
        { id: 'cat_1', name: 'Шоколадные', icon: '🍫' },
        { id: 'cat_2', name: 'Фруктовые', icon: '🍓' },
        { id: 'cat_3', name: 'Без глютена', icon: '🌾' }
      ];
      localStorage.setItem('sweetbake_categories', JSON.stringify(categories));
    }
  }

  // ===== ПОМОЩНИКИ =====
  function getAll(key) {
    return JSON.parse(localStorage.getItem('sweetbake_' + key) || '[]');
  }

  function saveAll(key, data) {
    localStorage.setItem('sweetbake_' + key, JSON.stringify(data));
  }

  function generateId(prefix) {
    return prefix + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // ===== API =====
  const api = {
    // Торты
    cakes: {
      getAll: () => Promise.resolve(getAll('cakes')),
      get: (id) => {
        const cake = getAll('cakes').find(c => c.id === id);
        if (!cake) return Promise.reject(new Error('Торт не найден'));
        return Promise.resolve(cake);
      },
      create: (data) => {
        const cakes = getAll('cakes');
        const newCake = { ...data, id: data.id || generateId('cake_') };
        cakes.push(newCake);
        saveAll('cakes', cakes);
        return Promise.resolve(newCake);
      },
      update: (id, data) => {
        const cakes = getAll('cakes');
        const index = cakes.findIndex(c => c.id === id);
        if (index === -1) return Promise.reject(new Error('Торт не найден'));
        cakes[index] = { ...cakes[index], ...data };
        saveAll('cakes', cakes);
        return Promise.resolve(cakes[index]);
      },
      delete: (id) => {
        const cakes = getAll('cakes').filter(c => c.id !== id);
        saveAll('cakes', cakes);
        return Promise.resolve({ success: true });
      }
    },
    
    // Пользователи
    users: {
      getAll: () => Promise.resolve(getAll('users')),
      get: (id) => {
        const user = getAll('users').find(u => u.id === id);
        if (!user) return Promise.reject(new Error('Пользователь не найден'));
        return Promise.resolve(user);
      },
      create: (data) => {
        const users = getAll('users');
        const newUser = { ...data, id: data.id || generateId('u_') };
        users.push(newUser);
        saveAll('users', users);
        return Promise.resolve(newUser);
      },
      update: (id, data) => {
        const users = getAll('users');
        const index = users.findIndex(u => u.id === id);
        if (index === -1) return Promise.reject(new Error('Пользователь не найден'));
        users[index] = { ...users[index], ...data };
        saveAll('users', users);
        return Promise.resolve(users[index]);
      },
      delete: (id) => {
        const users = getAll('users').filter(u => u.id !== id);
        saveAll('users', users);
        return Promise.resolve({ success: true });
      }
    },
    
    // Контакты
    contacts: {
      get: () => Promise.resolve(JSON.parse(localStorage.getItem('sweetbake_contacts') || '{"items":[]}')),
      update: (data) => {
        localStorage.setItem('sweetbake_contacts', JSON.stringify(data));
        return Promise.resolve(data);
      }
    },
    
    // Отзывы
    reviews: {
      getAll: (cakeId) => {
        let reviews = getAll('reviews');
        if (cakeId) reviews = reviews.filter(r => r.cakeId === cakeId);
        reviews.sort((a, b) => b.createdAt - a.createdAt);
        return Promise.resolve(reviews);
      },
      create: (data) => {
        const reviews = getAll('reviews');
        const newReview = { ...data, id: data.id || generateId('r_') };
        reviews.push(newReview);
        saveAll('reviews', reviews);
        return Promise.resolve(newReview);
      }
    },
    
    // Заказы
    orders: {
      getAll: () => {
        const orders = getAll('orders');
        orders.sort((a, b) => b.createdAt - a.createdAt);
        return Promise.resolve(orders);
      },
      getUserOrders: (userId) => {
        const orders = getAll('orders').filter(o => o.userId === userId);
        orders.sort((a, b) => b.createdAt - a.createdAt);
        return Promise.resolve(orders);
      },
      create: (data) => {
        const orders = getAll('orders');
        const newOrder = { ...data, id: data.id || generateId('o_') };
        orders.push(newOrder);
        saveAll('orders', orders);
        return Promise.resolve(newOrder);
      },
      update: (id, data) => {
        const orders = getAll('orders');
        const idx = orders.findIndex(o => o.id === id);
        if (idx === -1) return Promise.reject(new Error('Не найдено'));
        orders[idx] = { ...orders[idx], ...data };
        saveAll('orders', orders);
        return Promise.resolve(orders[idx]);
      },
      delete: (id) => {
        saveAll('orders', getAll('orders').filter(o => o.id !== id));
        return Promise.resolve({ success: true });
      }
    },
    
    // Категории
    categories: {
      getAll: () => Promise.resolve(getAll('categories')),
      get: (id) => {
        const cat = getAll('categories').find(c => c.id === id);
        return cat ? Promise.resolve(cat) : Promise.reject(new Error('Не найдено'));
      },
      create: (data) => {
        const categories = getAll('categories');
        const newCat = { ...data, id: data.id || generateId('cat_') };
        categories.push(newCat);
        saveAll('categories', categories);
        return Promise.resolve(newCat);
      },
      update: (id, data) => {
        const categories = getAll('categories');
        const idx = categories.findIndex(c => c.id === id);
        if (idx === -1) return Promise.reject(new Error('Не найдено'));
        categories[idx] = { ...categories[idx], ...data };
        saveAll('categories', categories);
        return Promise.resolve(categories[idx]);
      },
      delete: (id) => {
        saveAll('categories', getAll('categories').filter(c => c.id !== id));
        return Promise.resolve({ success: true });
      }
    }
  };

  // ===== АВТОРИЗАЦИЯ =====
  const auth = {
    async login(email, password) {
      const users = await api.users.getAll();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      
      if (!user) {
        throw new Error('❌ Неверный email или пароль');
      }
      
      const session = { userId: user.id, email: user.email, role: user.role };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      
      return { user, session };
    },
    
    async register(userData) {
      const users = await api.users.getAll();
      
      if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
        throw new Error('❌ Пользователь с таким email уже существует');
      }
      
      const newUser = await api.users.create({
        ...userData,
        role: 'user'
      });
      
      const session = { userId: newUser.id, email: newUser.email, role: newUser.role };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      
      return { user: newUser, session };
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

  // ===== ЗАПУСК =====
  seedData();

  // ===== ЭКСПОРТ =====
  global.SweetBakeAPI = {
    api,
    auth
  };

})(window);
