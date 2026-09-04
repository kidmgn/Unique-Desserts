// ===== ЛОКАЛЬНОЕ ХРАНИЛИЩЕ ДАННЫХ (БЕЗ СЕРВЕРА) =====
(function(global) {
  'use strict';

  const SESSION_KEY = 'sweetbake_session';

  // ===== ДЕМО-ДАННЫЕ (загружаются при первом запуске) =====
  function seedData() {
    // Торты
    if (!localStorage.getItem('sweetbake_cakes')) {
      const cakes = [
        {
          id: 'cake_1',
          title: 'Шоколадный мусс',
          short: 'Нежный мусс и тёмный шоколад',
          ingredients: ['шоколад', 'сливки', 'какао'],
          price: 1990,
          categoryId: null,
          media: [
            { type: 'image', url: 'https://avatars.mds.yandex.net/i?id=6849ed1de40d6a431b18c9c667c326c0_l-5614297-images-thumbs&n=13' }
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
            { type: 'image', url: 'https://img.povar.ru/uploads/8a/00/87/b9/klubnichnii_chizkeik_s_tvorogom_bez_vipechki-748219.JPG' }
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
            { type: 'image', url: 'https://i.pinimg.com/736x/b0/33/d6/b033d6cd0eb7dd00b74583ab71ad8a11.jpg' }
          ],
          description: 'Домашний вкус, мягкие коржи и крем с карамелью.'
        }
      ];
      localStorage.setItem('sweetbake_cakes', JSON.stringify(cakes));
    }

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

    // Контент главной страницы
    if (!localStorage.getItem('sweetbake_home_content')) {
      const homeContent = {
        hero: {
          recipesValue: '20+',
          recipesLabel: 'рецептов',
          decorations: [
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
          ]
        },
        about: {
          subtitle: 'Наша история',
          titlePart1: 'Страсть, запечённая',
          titleAccent: 'в каждом десерте',
          desc1: 'Мы начали в 2018 году с небольшой домашней кондитерской. Сегодня создаём торты и десерты, которые становятся украшением праздников и радуют тысячи клиентов.',
          desc2: 'Каждое утро мы готовим свежие коржи, карамелизируем орехи, взбиваем нежные кремы и декорируем каждый торт вручную. Без компромиссов.',
          image: 'https://images.pexels.com/photos/19499006/pexels-photo-19499006.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=700',
          values: [
            { id: 'v1', icon: '🌿', title: 'Натуральные продукты', desc: 'Фермерские ягоды, бельгийский шоколад, свежие сливки' },
            { id: 'v2', icon: '🎨', title: 'Ручная работа', desc: 'Каждый торт расписан и украшен вручную' },
            { id: 'v3', icon: '🚚', title: 'Доставка вовремя', desc: 'Привезём точно к празднику в любую точку города' },
            { id: 'v4', icon: '💝', title: 'С заботой о вас', desc: 'Прислушиваемся к пожеланиям и создаём десерты мечты' }
          ]
        },
        aboutStats: [
          { id: 's1', value: '12+', label: 'лет мастерства' },
          { id: 's2', value: '200+', label: 'рецептов' },
          { id: 's3', value: '50 000+', label: 'довольных клиентов' },
          { id: 's4', value: '18', label: 'наград' }
        ],
        seasonal: {
          badgeText: 'Сезонное предложение',
          title: 'Летнее вдохновение',
          titleAccent: 'Коллекция вкусов',
          desc: 'Каждый сезон приносит новые идеи. В нашей летней коллекции — спелые ягоды, цветочные ноты и нежная сладость лучших сезонных продуктов.',
          price: '350 ₽',
          image1: 'https://images.pexels.com/photos/34569681/pexels-photo-34569681.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=500&w=400',
          image2: 'https://images.pexels.com/photos/11522869/pexels-photo-11522869.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=500&w=400',
          bg: 'https://images.pexels.com/photos/17869890/pexels-photo-17869890.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=1400'
        }
      };
      localStorage.setItem('sweetbake_home_content', JSON.stringify(homeContent));
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
        const idx = cakes.findIndex(c => c.id === id);
        if (idx === -1) return Promise.reject(new Error('Торт не найден'));
        cakes[idx] = { ...cakes[idx], ...data };
        saveAll('cakes', cakes);
        return Promise.resolve(cakes[idx]);
      },
      delete: (id) => {
        saveAll('cakes', getAll('cakes').filter(c => c.id !== id));
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
        const idx = users.findIndex(u => u.id === id);
        if (idx === -1) return Promise.reject(new Error('Пользователь не найден'));
        users[idx] = { ...users[idx], ...data };
        saveAll('users', users);
        return Promise.resolve(users[idx]);
      },
      delete: (id) => {
        saveAll('users', getAll('users').filter(u => u.id !== id));
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
    },

    // Контент главной страницы
    homeContent: {
      get: () => {
        const data = JSON.parse(localStorage.getItem('sweetbake_home_content') || '{}');
        if (data.hero && !Array.isArray(data.hero.decorations) && global.SweetBakeHeroDeco) {
          data.hero.decorations = global.SweetBakeHeroDeco.DEFAULT_DECORATIONS.map(d => ({ ...d }));
          localStorage.setItem('sweetbake_home_content', JSON.stringify(data));
        }
        return Promise.resolve(data);
      },
      update: (data) => {
        localStorage.setItem('sweetbake_home_content', JSON.stringify(data));
        return Promise.resolve(data);
      }
    }
  };

  // ===== АВТОРИЗАЦИЯ =====
  const auth = {
    async login(email, password) {
      const users = await api.users.getAll();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      if (!user) throw new Error('❌ Неверный email или пароль');
      const session = { userId: user.id, email: user.email, role: user.role };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return { user, session };
    },
    async register(userData) {
      const users = await api.users.getAll();
      if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) throw new Error('❌ Пользователь с таким email уже существует');
      const newUser = await api.users.create({ ...userData, role: 'user' });
      const session = { userId: newUser.id, email: newUser.email, role: newUser.role };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return { user: newUser, session };
    },
    logout() { localStorage.removeItem(SESSION_KEY); },
    getSession() { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); },
    async getCurrentUser() {
      const session = this.getSession();
      if (!session?.userId) return null;
      try { return await api.users.get(session.userId); } catch { this.logout(); return null; }
    },
    isAdmin() { const session = this.getSession(); return session?.role === 'admin'; }
  };

  // ===== ЗАПУСК =====
  seedData();

  // ===== ЭКСПОРТ =====
  global.SweetBakeAPI = { api, auth };

})(window);
