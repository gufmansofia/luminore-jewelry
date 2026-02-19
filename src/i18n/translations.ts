export type Language = 'ru' | 'en';

export interface Translations {
  nav: {
    about: string;
    collection: string;
    contact: string;
    blog: string;
    consultation: string;
  };
  hero: {
    eyebrow: string;
    headline1: string;
    headline2: string;
    certified: string;
    personalApproach: string;
    ctaPrimary: string;
    ctaSecondary: string;
    scroll: string;
  };
  about: {
    eyebrow: string;
    headline1: string;
    headline2: string;
    p1: string;
    p2: string;
    p3: string;
    naturalLabel: string;
    naturalDesc: string;
    naturalBullet1: string;
    naturalBullet2: string;
    labLabel: string;
    labDesc: string;
    labBullet1: string;
    labBullet2: string;
    bespokeStatement: string;
    stat1Label: string;
    stat2Label: string;
    stat3Label: string;
    stat4Label: string;
  };
  products: {
    eyebrow: string;
    headline1: string;
    headline2: string;
    description: string;
    all: string;
    rings: string;
    earrings: string;
    pendants: string;
    bracelets: string;
    shown: string;
    of: string;
    items: string;
    item: string;
    itemsFew: string;
    noItems: string;
    showMore: string;
    hide: string;
    details: string;
    category: string;
    gemstoneType: string;
    allStones: string;
    labGrown: string;
    natural: string;
    priceSort: string;
    priceSortAll: string;
    priceSortLowHigh: string;
    priceSortHighLow: string;
    quickView: string;
  };
  product: {
    backToCatalog: string;
    specifications: string;
    material: string;
    stones: string;
    weight: string;
    size: string;
    telegram: string;
    whatsapp: string;
    orCall: string;
    related: string;
    relatedSuffix: string;
    labGrownDiamond: string;
    naturalDiamond: string;
    priceOnEnquiry: string;
    notFound: string;
  };
  blog: {
    eyebrow: string;
    headline1: string;
    headline2: string;
    description: string;
    readTime: string;
    read: string;
    featured: string;
    notFound: string;
    backToBlog: string;
    shareArticle: string;
  };
  testimonials: {
    eyebrow: string;
    headline1: string;
    headline2: string;
  };
  cta: {
    eyebrow: string;
    headline1: string;
    headline2: string;
    description: string;
    benefit1: string;
    benefit2: string;
    benefit3: string;
    nameLabel: string;
    namePlaceholder: string;
    contactLabel: string;
    contactPlaceholder: string;
    pieceTypeLabel: string;
    pieceTypeDefault: string;
    pieceTypeRings: string;
    pieceTypeEarrings: string;
    pieceTypePendants: string;
    pieceTypeBracelets: string;
    pieceTypeOther: string;
    budgetLabel: string;
    budgetDefault: string;
    budgetRange1: string;
    budgetRange2: string;
    budgetRange3: string;
    budgetRange4: string;
    budgetFlexible: string;
    detailsLabel: string;
    detailsPlaceholder: string;
    submit: string;
    success: string;
    successMessage: string;
    messengerDivider: string;
    privacy: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
  };
  contact: {
    eyebrow: string;
    headline1: string;
    headline2: string;
    description: string;
    hours: string;
    phone: string;
    callHours: string;
    email: string;
    responseTime: string;
    social: string;
    formTitle: string;
    name: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    message: string;
    messagePlaceholder: string;
    consent: string;
    privacyPolicy: string;
    submit: string;
    successTitle: string;
    successMessage: string;
  };
  partners: {
    eyebrow: string;
    headline1: string;
    headline2: string;
    description: string;
    partnerDescription: string;
  };
  footer: {
    description: string;
    navigation: string;
    info: string;
    delivery: string;
    warranty: string;
    care: string;
    privacy: string;
    newsletter: string;
    newsletterDesc: string;
    subscribed: string;
    copyright: string;
    terms: string;
    contactHeading: string;
  };
}

export const translations: Record<Language, Translations> = {
  ru: {
    nav: {
      about: 'О нас',
      collection: 'Коллекция',
      contact: 'Контакты',
      blog: 'Блог',
      consultation: 'Индивидуальный заказ',
    },
    hero: {
      eyebrow: 'Премиум ювелирные украшения',
      headline1: 'Бриллиантовые украшения',
      headline2: 'высшего качества',
      certified: 'Сертифицированные камни',
      personalApproach: 'Персональный подход',
      ctaPrimary: 'Смотреть коллекцию',
      ctaSecondary: 'Индивидуальный заказ',
      scroll: 'ЛИСТАЙТЕ',
    },
    about: {
      eyebrow: 'Философия',
      headline1: 'Искусство',
      headline2: 'индивидуального выражения',
      p1: 'Luminore работает как с природными, так и с выращенными в лаборатории бриллиантами — каждый из них соответствует одинаково высокому стандарту совершенства. Происхождение камня не имеет значения; его безупречность — имеет.',
      p2: 'Двойная экспертиза освобождает наших дизайнеров от любых ограничений, открывая безграничный выбор камней для воплощения украшений любой сложности, масштаба и эстетики.',
      p3: 'Каждое изделие создаётся исключительно под заказ — в тесном диалоге с вами и с абсолютной точностью мастера. Мы создаём не просто украшения — мы создаём уникальные воплощения вашей индивидуальности.',
      naturalLabel: 'Природные бриллианты',
      naturalDesc: 'Созданы в недрах земли за миллиарды лет. Каждый камень несёт неповторимую геологическую историю и характер.',
      naturalBullet1: 'Сертификаты IGI & GIA',
      naturalBullet2: 'Этические источники поставок',
      labLabel: 'Лабораторные бриллианты',
      labDesc: 'Выращены с научной точностью — идентичная атомная структура, тот же блеск, та же твёрдость, та же красота.',
      labBullet1: 'Сертификация IGI',
      labBullet2: 'Физически идентичны природным',
      bespokeStatement: 'Любой камень. Любой дизайн. Любая сложность. Создано исключительно для вас.',
      stat1Label: 'Довольных клиентов',
      stat2Label: 'Золото высшей пробы',
      stat3Label: 'Сертификация IGI',
      stat4Label: 'Лет мастерства',
    },
    products: {
      eyebrow: 'Каталог',
      headline1: 'Коллекция',
      headline2: 'украшений',
      description: 'Каждое изделие создано вручную с использованием лучших материалов и драгоценных камней',
      all: 'Все',
      rings: 'Кольца',
      earrings: 'Серьги',
      pendants: 'Подвески',
      bracelets: 'Браслеты',
      shown: 'Показано',
      of: 'из',
      items: 'товаров',
      item: 'товар',
      itemsFew: 'товара',
      noItems: 'Нет товаров в этой категории',
      showMore: 'Показать ещё',
      hide: 'Скрыть',
      details: 'Подробнее',
      category: 'Категория',
      gemstoneType: 'Тип камня',
      allStones: 'Все',
      labGrown: 'Лабораторные',
      natural: 'Натуральные',
      priceSort: 'Цена',
      priceSortAll: 'Все',
      priceSortLowHigh: 'По возрастанию',
      priceSortHighLow: 'По убыванию',
      quickView: 'Быстрый просмотр',
    },
    product: {
      backToCatalog: '← Назад в каталог',
      specifications: 'ХАРАКТЕРИСТИКИ',
      material: 'Материал',
      stones: 'Камни',
      weight: 'Вес',
      size: 'Размер',
      telegram: 'Написать в Telegram',
      whatsapp: 'Написать в WhatsApp',
      orCall: 'Или позвоните нам:',
      related: 'Похожие',
      relatedSuffix: 'изделия',
      labGrownDiamond: 'Лабораторный бриллиант',
      naturalDiamond: 'Натуральный бриллиант',
      priceOnEnquiry: 'Цена по запросу',
      notFound: 'Товар не найден',
    },
    blog: {
      eyebrow: 'Блог',
      headline1: 'Полезные',
      headline2: 'статьи',
      description: 'Делимся экспертными знаниями о ювелирном искусстве, уходе за украшениями и последних модных трендах',
      readTime: 'чтения',
      read: 'Читать →',
      featured: 'ИЗБРАННОЕ',
      notFound: 'Статья не найдена',
      backToBlog: '← Назад в блог',
      shareArticle: 'ПОДЕЛИТЬСЯ СТАТЬЕЙ',
    },
    testimonials: {
      eyebrow: 'Отзывы',
      headline1: 'Что говорят ',
      headline2: 'наши клиенты',
    },
    cta: {
      eyebrow: 'Индивидуальный заказ',
      headline1: 'Закажите ваше',
      headline2: 'уникальное украшение',
      description: 'Создадим ювелирное украшение вашей мечты — любой дизайн, любой камень, любой размер. Расскажите нам о вашей идее.',
      benefit1: 'Любой дизайн и сложность',
      benefit2: 'Бриллианты любых размеров',
      benefit3: 'Бесплатная консультация',
      nameLabel: 'Ваше имя',
      namePlaceholder: 'Иван Иванов',
      contactLabel: 'Телефон или Email',
      contactPlaceholder: '+7 (___) ___-__-__ или email',
      pieceTypeLabel: 'Тип украшения',
      pieceTypeDefault: 'Выберите тип',
      pieceTypeRings: 'Кольца',
      pieceTypeEarrings: 'Серьги',
      pieceTypePendants: 'Подвески',
      pieceTypeBracelets: 'Браслеты',
      pieceTypeOther: 'Другое',
      budgetLabel: 'Бюджет',
      budgetDefault: 'Укажите бюджет',
      budgetRange1: 'До $2 000',
      budgetRange2: '$2 000 – $5 000',
      budgetRange3: '$5 000 – $15 000',
      budgetRange4: '$15 000+',
      budgetFlexible: 'Гибкий бюджет',
      detailsLabel: 'Детали',
      detailsPlaceholder: 'Расскажите о вашем замысле...',
      submit: 'Отправить заявку',
      success: 'Заявка принята!',
      successMessage: 'Мы свяжемся с вами для обсуждения деталей',
      messengerDivider: 'или свяжитесь напрямую',
      privacy: 'Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности',
      step1Title: 'Консультация',
      step1Desc: 'Обсуждаем ваши идеи и пожелания',
      step2Title: 'Дизайн',
      step2Desc: 'Создаем эскиз вашего украшения',
      step3Title: 'Создание',
      step3Desc: 'Мастера воплощают замысел в жизнь',
      step4Title: 'Доставка',
      step4Desc: 'Бережная доставка в любую точку мира',
    },
    contact: {
      eyebrow: 'Контакты',
      headline1: 'Свяжитесь с',
      headline2: 'нами',
      description: 'Запишитесь на бесплатную консультацию или задайте вопрос — мы с радостью поможем вам с выбором идеального украшения',
      hours: 'Ежедневно с 10:00 до 21:00',
      phone: 'Телефон',
      callHours: 'Звоните с 10:00 до 21:00',
      email: 'Email',
      responseTime: 'Отвечаем в течение 24 часов',
      social: 'Найдите нас',
      formTitle: 'Отправить сообщение',
      name: 'Ваше имя',
      namePlaceholder: 'Иван Иванов',
      emailLabel: 'Email',
      emailPlaceholder: 'ivan@example.com',
      phoneLabel: 'Телефон',
      phonePlaceholder: '+7 (___) ___-__-__',
      message: 'Сообщение',
      messagePlaceholder: 'Расскажите о том, какое украшение вы ищете...',
      consent: 'Я согласен(на) на обработку моих',
      privacyPolicy: 'персональных данных',
      submit: 'Отправить сообщение',
      successTitle: 'Сообщение отправлено!',
      successMessage: 'Мы свяжемся с вами в ближайшее время',
    },
    partners: {
      eyebrow: 'Партнёры',
      headline1: 'Наши',
      headline2: 'партнёры',
      description: 'Мы гордимся сотрудничеством с лучшими представителями мира роскоши и утончённого вкуса',
      partnerDescription: 'Изысканный винный дом, объединяющий традиции виноделия с современным искусством гостеприимства',
    },
    footer: {
      description: 'Создаем уникальные ювелирные украшения премиум-класса. Каждое изделие — произведение искусства.',
      navigation: 'Навигация',
      info: 'Информация',
      delivery: 'Доставка и оплата',
      warranty: 'Гарантия и возврат',
      care: 'Уход за украшениями',
      privacy: 'Политика конфиденциальности',
      newsletter: 'Подписка',
      newsletterDesc: 'Получайте первыми информацию о новых коллекциях',
      subscribed: 'Вы подписаны!',
      copyright: '© 2026 Luminore Jewelry. Все права защищены.',
      terms: 'Пользовательское соглашение',
      contactHeading: 'Контакты',
    },
  },
  en: {
    nav: {
      about: 'About',
      collection: 'Collection',
      contact: 'Contact',
      blog: 'Blog',
      consultation: 'Custom Order',
    },
    hero: {
      eyebrow: 'Premium Diamond Jewelry',
      headline1: 'Fine Diamond Jewelry',
      headline2: 'of the highest quality',
      certified: 'Certified Stones',
      personalApproach: 'Personal Approach',
      ctaPrimary: 'View Collection',
      ctaSecondary: 'Custom Order',
      scroll: 'SCROLL',
    },
    about: {
      eyebrow: 'Philosophy',
      headline1: 'The Art of',
      headline2: 'Individual Expression',
      p1: 'Luminore works with both natural and laboratory-grown diamonds — each held to the same uncompromising standard of excellence. The origin of a stone is irrelevant; its perfection is not.',
      p2: 'This dual mastery frees our designers from conventional constraints, opening an unrestricted palette of stones to realise pieces of any complexity, scale, or aesthetic.',
      p3: 'Every creation is entirely bespoke — conceived in close dialogue with you and executed with exacting artisanal precision. We do not simply make jewelry; we craft singular expressions of individual character.',
      naturalLabel: 'Natural Diamonds',
      naturalDesc: 'Formed deep within the earth over billions of years. Each stone carries a geological signature entirely its own.',
      naturalBullet1: 'IGI & GIA certified',
      naturalBullet2: 'Conflict-free sourcing',
      labLabel: 'Lab-Grown Diamonds',
      labDesc: 'Grown with scientific precision to the same atomic structure — identical in brilliance, hardness, and beauty.',
      labBullet1: 'IGI certified',
      labBullet2: 'Physically identical to earth diamonds',
      bespokeStatement: 'Any stone. Any design. Any complexity. Crafted solely for you.',
      stat1Label: 'Happy Clients',
      stat2Label: 'Finest Gold Standard',
      stat3Label: 'IGI Certified',
      stat4Label: 'Years of Mastery',
    },
    products: {
      eyebrow: 'Catalog',
      headline1: 'Jewelry',
      headline2: 'Collection',
      description: 'Each piece is handcrafted using the finest materials and precious stones',
      all: 'All',
      rings: 'Rings',
      earrings: 'Earrings',
      pendants: 'Pendants',
      bracelets: 'Bracelets',
      shown: 'Showing',
      of: 'of',
      items: 'items',
      item: 'item',
      itemsFew: 'items',
      noItems: 'No items in this category',
      showMore: 'Show More',
      hide: 'Show Less',
      details: 'Details',
      category: 'Category',
      gemstoneType: 'Stone Type',
      allStones: 'All',
      labGrown: 'Lab-Grown',
      natural: 'Natural',
      priceSort: 'Price',
      priceSortAll: 'All',
      priceSortLowHigh: 'Low to High',
      priceSortHighLow: 'High to Low',
      quickView: 'Quick View',
    },
    product: {
      backToCatalog: '← Back to Catalog',
      specifications: 'SPECIFICATIONS',
      material: 'Material',
      stones: 'Stones',
      weight: 'Weight',
      size: 'Size',
      telegram: 'Message on Telegram',
      whatsapp: 'Message on WhatsApp',
      orCall: 'Or call us:',
      related: 'Similar',
      relatedSuffix: 'pieces',
      labGrownDiamond: 'Lab-Grown Diamond',
      naturalDiamond: 'Natural Diamond',
      priceOnEnquiry: 'Price on Enquiry',
      notFound: 'Product not found',
    },
    blog: {
      eyebrow: 'Blog',
      headline1: 'Helpful',
      headline2: 'Articles',
      description: 'Sharing expert knowledge about jewelry art, jewelry care, and latest fashion trends',
      readTime: 'read',
      read: 'Read →',
      featured: 'FEATURED',
      notFound: 'Article not found',
      backToBlog: '← Back to blog',
      shareArticle: 'SHARE ARTICLE',
    },
    testimonials: {
      eyebrow: 'Testimonials',
      headline1: 'What Our ',
      headline2: 'Clients Say',
    },
    cta: {
      eyebrow: 'Custom Order',
      headline1: 'Order Your',
      headline2: 'Custom Jewelry',
      description: 'We will create the jewelry of your dreams — any design, any stone, any size. Tell us about your idea.',
      benefit1: 'Any design & complexity',
      benefit2: 'Diamonds of any size & color',
      benefit3: 'Free consultation',
      nameLabel: 'Your Name',
      namePlaceholder: 'John Smith',
      contactLabel: 'Phone or Email',
      contactPlaceholder: '+1 (___) ___-____ or email',
      pieceTypeLabel: 'Piece Type',
      pieceTypeDefault: 'Select type',
      pieceTypeRings: 'Rings',
      pieceTypeEarrings: 'Earrings',
      pieceTypePendants: 'Pendants',
      pieceTypeBracelets: 'Bracelets',
      pieceTypeOther: 'Other',
      budgetLabel: 'Budget',
      budgetDefault: 'Select range',
      budgetRange1: 'Up to $2,000',
      budgetRange2: '$2,000 – $5,000',
      budgetRange3: '$5,000 – $15,000',
      budgetRange4: '$15,000+',
      budgetFlexible: 'Flexible',
      detailsLabel: 'Details',
      detailsPlaceholder: 'Tell us about your vision...',
      submit: 'Submit Request',
      success: 'Request Received!',
      successMessage: 'We will contact you to discuss the details',
      messengerDivider: 'or speak with us directly',
      privacy: 'By clicking the button, you agree to the privacy policy',
      step1Title: 'Consultation',
      step1Desc: 'We discuss your ideas and preferences',
      step2Title: 'Design',
      step2Desc: 'We create a sketch of your piece',
      step3Title: 'Crafting',
      step3Desc: 'Our masters bring the vision to life',
      step4Title: 'Delivery',
      step4Desc: 'Careful delivery anywhere in the world',
    },
    contact: {
      eyebrow: 'Contact',
      headline1: 'Get in Touch',
      headline2: 'With Us',
      description: 'Schedule a free consultation or ask a question — we will be happy to help you choose the perfect piece of jewelry',
      hours: 'Daily from 10:00 AM to 9:00 PM',
      phone: 'Phone',
      callHours: 'Call us from 10:00 AM to 9:00 PM',
      email: 'Email',
      responseTime: 'We respond within 24 hours',
      social: 'Find Us',
      formTitle: 'Send a Message',
      name: 'Your Name',
      namePlaceholder: 'John Smith',
      emailLabel: 'Email',
      emailPlaceholder: 'john@example.com',
      phoneLabel: 'Phone',
      phonePlaceholder: '+1 (___) ___-__-__',
      message: 'Message',
      messagePlaceholder: 'Tell us about the jewelry you are looking for...',
      consent: 'I agree to the processing of my',
      privacyPolicy: 'personal data',
      submit: 'Send Message',
      successTitle: 'Message Sent!',
      successMessage: 'We will contact you shortly',
    },
    partners: {
      eyebrow: 'Partners',
      headline1: 'Our',
      headline2: 'Partners',
      description: 'We work with the best in the industry',
      partnerDescription: 'An exquisite wine house combining winemaking traditions with the modern art of hospitality',
    },
    footer: {
      description: 'Creating unique premium jewelry. Each piece is a work of art.',
      navigation: 'Navigation',
      info: 'Information',
      delivery: 'Shipping & Payment',
      warranty: 'Warranty & Returns',
      care: 'Jewelry Care',
      privacy: 'Privacy Policy',
      newsletter: 'Newsletter',
      newsletterDesc: 'Be the first to know about new collections',
      subscribed: 'You are subscribed!',
      copyright: '© 2026 Luminore Jewelry. All rights reserved.',
      terms: 'Terms of Service',
      contactHeading: 'Contact',
    },
  },
};
