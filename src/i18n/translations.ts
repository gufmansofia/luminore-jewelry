export type Language = 'en' | 'uk' | 'ru';

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
    necklaces: string;
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
    emailError: string;
    consentError: string;
    privacyAriaLabel: string;
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
  en: {
    nav: {
      about: 'About',
      collection: 'Collection',
      contact: 'Contact',
      blog: 'Journal',
      consultation: 'Custom order',
    },
    hero: {
      eyebrow: 'Premium Diamond Jewelry',
      headline1: 'Fine Diamond Jewelry',
      headline2: 'Crafted Without Compromise',
      certified: 'Certified Stones',
      personalApproach: 'Personal Approach',
      ctaPrimary: 'View Collection',
      ctaSecondary: 'Custom order',
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
      naturalDesc: 'A natural diamond is time made tangible — rare, unrepeatable, and entirely your own.',
      naturalBullet1: 'IGI & GIA certified',
      naturalBullet2: 'Conflict-free sourcing',
      labLabel: 'Lab-Grown Diamonds',
      labDesc: 'Grown atom by atom to the exact same standard — a diamond in every way that matters.',
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
      headline1: 'Jewellery',
      headline2: 'collection',
      description: 'Explore rings, earrings, necklaces, pendants and bracelets.',
      all: 'All',
      rings: 'Rings',
      earrings: 'Earrings',
      pendants: 'Pendants',
      bracelets: 'Bracelets',
      necklaces: 'Necklaces',
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
      priceSort: 'Sort by',
      priceSortAll: 'Featured',
      priceSortLowHigh: 'Price: low to high',
      priceSortHighLow: 'Price: high to low',
      quickView: 'Quick View',
    },
    product: {
      backToCatalog: '← Back to collection',
      specifications: 'Specifications',
      material: 'Material',
      stones: 'Stones',
      weight: 'Weight',
      size: 'Size',
      telegram: 'Message on Telegram',
      whatsapp: 'Message on WhatsApp',
      orCall: 'Or call us:',
      related: 'Similar',
      relatedSuffix: 'Pieces',
      labGrownDiamond: 'Lab-grown diamonds',
      naturalDiamond: 'Natural diamonds',
      priceOnEnquiry: 'Price on request',
      notFound: 'Product not found',
    },
    blog: {
      eyebrow: 'Journal',
      headline1: 'Jewellery,',
      headline2: 'explained',
      description: 'Guides to choosing stones, understanding settings and caring for your jewellery.',
      readTime: 'read',
      read: 'Read →',
      featured: 'FEATURED',
      notFound: 'Article not found',
      backToBlog: '← Back to Journal',
      shareArticle: 'SHARE ARTICLE',
    },
    testimonials: {
      eyebrow: 'Testimonials',
      headline1: 'What Our ',
      headline2: 'Clients Say',
    },
    cta: {
      eyebrow: 'Custom order',
      headline1: 'Create Your',
      headline2: 'Bespoke Piece',
      description: 'Tell us what you have in mind. We’ll discuss the design, stones and budget with you.',
      benefit1: 'Any design & complexity',
      benefit2: 'Diamonds of any size & color',
      benefit3: 'Free consultation',
      nameLabel: 'Your Name',
      namePlaceholder: '',
      contactLabel: 'Phone or Email',
      contactPlaceholder: 'Phone or email',
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
      detailsPlaceholder: 'Tell us about your vision…',
      submit: 'Submit Request',
      success: 'Request Received!',
      successMessage: 'We will be in touch to discuss the details',
      messengerDivider: 'or speak with us directly',
      privacy: 'By submitting, you agree to our privacy policy',
      step1Title: 'Consultation',
      step1Desc: 'We discuss your ideas and preferences',
      step2Title: 'Design',
      step2Desc: 'We prepare a sketch and agree on it with you.',
      step3Title: 'Crafting',
      step3Desc: 'Our artisans bring the vision to life',
      step4Title: 'Delivery',
      step4Desc: 'We confirm delivery options for your destination',
    },
    contact: {
      eyebrow: 'Contact',
      headline1: 'Talk to us',
      headline2: '',
      description: 'Ask about a piece, a stone or a design. We’ll help you work through the details.',
      hours: 'Daily, 10:00 AM – 9:00 PM',
      phone: 'Phone',
      callHours: 'Available 10:00 AM – 9:00 PM',
      email: 'Email',
      responseTime: 'We respond within 24 hours',
      social: 'Find Us',
      formTitle: 'Send a Message',
      name: 'Your Name',
      namePlaceholder: '',
      emailLabel: 'Email',
      emailPlaceholder: 'john@example.com',
      phoneLabel: 'Phone',
      phonePlaceholder: 'Phone number',
      message: 'Message',
      messagePlaceholder: 'Tell us about the piece you have in mind…',
      consent: 'I agree to the processing of my',
      privacyPolicy: 'personal data',
      submit: 'Send Message',
      successTitle: 'Message Sent!',
      successMessage: 'We will be in touch shortly',
      emailError: 'Please enter a valid email address',
      consentError: 'Please consent to the processing of personal data',
      privacyAriaLabel: 'Read our privacy policy',
    },
    partners: {
      eyebrow: 'Partners',
      headline1: 'Our',
      headline2: 'Partners',
      description: 'We are proud to collaborate with the finest names in luxury and refined taste',
      partnerDescription: 'An exquisite wine house that unites winemaking tradition with the modern art of hospitality',
    },
    footer: {
      description: 'Diamond jewellery from our collection or made to order.',
      navigation: 'Navigation',
      info: 'Information',
      delivery: 'Delivery & payment',
      warranty: 'Warranty & returns',
      care: 'Jewellery care',
      privacy: 'Privacy information',
      newsletter: 'Newsletter',
      newsletterDesc: 'Be the first to discover new collections',
      subscribed: 'You are subscribed!',
      copyright: '© 2026 Luminore. All rights reserved.',
      terms: 'Terms of Service',
      contactHeading: 'Contact',
    },
  },

  uk: {
    nav: {
      about: 'Про нас',
      collection: 'Колекція',
      contact: 'Контакти',
      blog: 'Журнал',
      consultation: 'Індивідуальне замовлення',
    },
    hero: {
      eyebrow: 'Преміальні діамантові прикраси',
      headline1: 'Вишукані діамантові прикраси',
      headline2: 'Створені без компромісів',
      certified: 'Сертифіковані камені',
      personalApproach: 'Індивідуальний підхід',
      ctaPrimary: 'Переглянути колекцію',
      ctaSecondary: 'Індивідуальне замовлення',
      scroll: 'ГОРТАЙТЕ',
    },
    about: {
      eyebrow: 'Філософія',
      headline1: 'Мистецтво',
      headline2: 'індивідуального вираження',
      p1: 'У Luminore природні й вирощені в лабораторії діаманти підкоряються єдиному незламному стандарту досконалості — кожен без компромісів. Походження каменю не має значення; його бездоганність — має.',
      p2: 'Подвійна експертиза звільняє наших дизайнерів від будь-яких обмежень, відкриваючи безмежний вибір каменів для втілення виробів будь-якої складності, масштабу та естетики.',
      p3: 'Кожен виріб створюється виключно на замовлення — у тісному діалозі з вами та з абсолютною точністю майстра. Ми створюємо не просто прикраси — ми творимо унікальні втілення вашої індивідуальності.',
      naturalLabel: 'Природні діаманти',
      naturalDesc: 'Природний діамант — це час, що став видимим. Рідкісний, неповторний і лише ваш.',
      naturalBullet1: 'Сертифікати IGI & GIA',
      naturalBullet2: 'Етичні джерела постачання',
      labLabel: 'Лабораторні діаманти',
      labDesc: 'Вирощені атом за атомом за тим самим стандартом — діамант у всьому, що має значення.',
      labBullet1: 'Сертифікація IGI',
      labBullet2: 'Фізично ідентичні природним',
      bespokeStatement: 'Будь-який камінь. Будь-який дизайн. Будь-яка складність. Створено виключно для вас.',
      stat1Label: 'Задоволених клієнтів',
      stat2Label: 'Золото найвищої проби',
      stat3Label: 'Сертифікація IGI',
      stat4Label: 'Років майстерності',
    },
    products: {
      eyebrow: 'Каталог',
      headline1: 'Колекція',
      headline2: 'прикрас',
      description: 'Каблучки, сережки, кольє, підвіски та браслети.',
      all: 'Усі',
      rings: 'Каблучки',
      earrings: 'Сережки',
      pendants: 'Підвіски',
      bracelets: 'Браслети',
      necklaces: 'Кольє',
      shown: 'Показано',
      of: 'з',
      items: 'товарів',
      item: 'товар',
      itemsFew: 'товари',
      noItems: 'Немає товарів у цій категорії',
      showMore: 'Показати більше',
      hide: 'Сховати',
      details: 'Детальніше',
      category: 'Категорія',
      gemstoneType: 'Тип каменю',
      allStones: 'Усі',
      labGrown: 'Лабораторні',
      natural: 'Натуральні',
      priceSort: 'Сортування',
      priceSortAll: 'Добірка',
      priceSortLowHigh: 'За зростанням',
      priceSortHighLow: 'За спаданням',
      quickView: 'Швидкий перегляд',
    },
    product: {
      backToCatalog: '← Назад до каталогу',
      specifications: 'ХАРАКТЕРИСТИКИ',
      material: 'Матеріал',
      stones: 'Камені',
      weight: 'Вага',
      size: 'Розмір',
      telegram: 'Написати в Telegram',
      whatsapp: 'Написати в WhatsApp',
      orCall: 'Або зателефонуйте нам:',
      related: 'Схожі',
      relatedSuffix: 'вироби',
      labGrownDiamond: 'Лабораторні діаманти',
      naturalDiamond: 'Природні діаманти',
      priceOnEnquiry: 'Ціна за запитом',
      notFound: 'Товар не знайдено',
    },
    blog: {
      eyebrow: 'Журнал',
      headline1: 'Про прикраси —',
      headline2: 'докладніше',
      description: 'Як обрати камені й оправу, розібратися в характеристиках і доглядати за прикрасами.',
      readTime: 'читання',
      read: 'Читати →',
      featured: 'ВИБРАНЕ',
      notFound: 'Статтю не знайдено',
      backToBlog: '← Назад до журналу',
      shareArticle: 'ПОДІЛИТИСЯ СТАТТЕЮ',
    },
    testimonials: {
      eyebrow: 'Відгуки',
      headline1: 'Що кажуть ',
      headline2: 'наші клієнти',
    },
    cta: {
      eyebrow: 'Індивідуальне замовлення',
      headline1: 'Замовте свою',
      headline2: 'унікальну прикрасу',
      description: 'Розкажіть про свою ідею. Обговоримо з вами дизайн, камені та бюджет.',
      benefit1: 'Будь-який дизайн і складність',
      benefit2: 'Діаманти будь-яких розмірів і кольорів',
      benefit3: 'Безкоштовна консультація',
      nameLabel: 'Ваше ім\'я',
      namePlaceholder: '',
      contactLabel: 'Телефон або Email',
      contactPlaceholder: 'Телефон або email',
      pieceTypeLabel: 'Тип прикраси',
      pieceTypeDefault: 'Оберіть тип',
      pieceTypeRings: 'Каблучки',
      pieceTypeEarrings: 'Сережки',
      pieceTypePendants: 'Підвіски',
      pieceTypeBracelets: 'Браслети',
      pieceTypeOther: 'Інше',
      budgetLabel: 'Бюджет',
      budgetDefault: 'Вкажіть бюджет',
      budgetRange1: 'До $2 000',
      budgetRange2: '$2 000 – $5 000',
      budgetRange3: '$5 000 – $15 000',
      budgetRange4: '$15 000+',
      budgetFlexible: 'Гнучкий бюджет',
      detailsLabel: 'Деталі',
      detailsPlaceholder: 'Розкажіть про ваш задум…',
      submit: 'Надіслати заявку',
      success: 'Заявку прийнято!',
      successMessage: 'Ми зв\'яжемося з вами для обговорення деталей',
      messengerDivider: 'або зв\'яжіться напряму',
      privacy: 'Надсилаючи заявку, ви погоджуєтесь з нашою політикою конфіденційності',
      step1Title: 'Консультація',
      step1Desc: 'Обговорюємо ваші ідеї та побажання',
      step2Title: 'Дизайн',
      step2Desc: 'Готуємо та погоджуємо ескіз.',
      step3Title: 'Виготовлення',
      step3Desc: 'Майстри втілюють задум у життя',
      step4Title: 'Доставка',
      step4Desc: 'Погодимо доставку за вашою адресою',
    },
    contact: {
      eyebrow: 'Контакти',
      headline1: 'Зв\'яжіться',
      headline2: 'з нами',
      description: 'Запитайте про прикрасу, камінь або дизайн. Допоможемо розібратися в деталях.',
      hours: 'Щодня з 10:00 до 21:00',
      phone: 'Телефон',
      callHours: 'Дзвоніть з 10:00 до 21:00',
      email: 'Email',
      responseTime: 'Відповідаємо протягом 24 годин',
      social: 'Знайдіть нас',
      formTitle: 'Надіслати повідомлення',
      name: 'Ваше ім\'я',
      namePlaceholder: '',
      emailLabel: 'Email',
      emailPlaceholder: 'ivan@example.com',
      phoneLabel: 'Телефон',
      phonePlaceholder: 'Номер телефону',
      message: 'Повідомлення',
      messagePlaceholder: 'Розкажіть, яку прикрасу ви шукаєте…',
      consent: 'Я погоджуюся на обробку моїх',
      privacyPolicy: 'персональних даних',
      submit: 'Надіслати повідомлення',
      successTitle: 'Повідомлення надіслано!',
      successMessage: 'Ми зв\'яжемося з вами найближчим часом',
      emailError: 'Будь ласка, введіть коректний email',
      consentError: 'Будь ласка, дайте згоду на обробку персональних даних',
      privacyAriaLabel: 'Читати політику конфіденційності',
    },
    partners: {
      eyebrow: 'Партнери',
      headline1: 'Наші',
      headline2: 'партнери',
      description: 'Ми пишаємося співпрацею з найкращими представниками світу розкоші та витонченого смаку',
      partnerDescription: 'Вишуканий винний дім, що поєднує традиції виноробства із сучасним мистецтвом гостинності',
    },
    footer: {
      description: 'Прикраси з діамантами — з колекції або на замовлення.',
      navigation: 'Навігація',
      info: 'Інформація',
      delivery: 'Доставка та оплата',
      warranty: 'Гарантія та повернення',
      care: 'Догляд за прикрасами',
      privacy: 'Політика конфіденційності',
      newsletter: 'Підписка',
      newsletterDesc: 'Дізнавайтесь першими про нові колекції',
      subscribed: 'Ви підписані!',
      copyright: '© 2026 Luminore. Всі права захищені.',
      terms: 'Умови використання',
      contactHeading: 'Контакти',
    },
  },

  ru: {
    nav: {
      about: 'О нас',
      collection: 'Коллекция',
      contact: 'Контакты',
      blog: 'Журнал',
      consultation: 'Индивидуальный заказ',
    },
    hero: {
      eyebrow: 'Премиальные ювелирные украшения',
      headline1: 'Бриллиантовые украшения',
      headline2: 'Созданные без компромиссов',
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
      p1: 'В Luminore природные и выращенные в лаборатории бриллианты отвечают единому непреклонному стандарту совершенства. Происхождение камня не имеет значения; его безупречность — имеет.',
      p2: 'Двойная экспертиза освобождает наших дизайнеров от любых ограничений, открывая безграничный выбор камней для воплощения украшений любой сложности, масштаба и эстетики.',
      p3: 'Каждое изделие создаётся исключительно под заказ — в тесном диалоге с вами и с абсолютной точностью мастера. Мы создаём не просто украшения — мы воплощаем уникальное выражение вашей индивидуальности.',
      naturalLabel: 'Природные бриллианты',
      naturalDesc: 'Природный бриллиант — это время, ставшее видимым. Редкий, неповторимый и только ваш.',
      naturalBullet1: 'Сертификаты IGI & GIA',
      naturalBullet2: 'Этические источники поставок',
      labLabel: 'Лабораторные бриллианты',
      labDesc: 'Выращены атом за атомом по тому же стандарту — бриллиант во всём, что имеет значение.',
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
      description: 'Кольца, серьги, колье, подвески и браслеты.',
      all: 'Все',
      rings: 'Кольца',
      earrings: 'Серьги',
      pendants: 'Подвески',
      bracelets: 'Браслеты',
      necklaces: 'Колье',
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
      priceSort: 'Сортировка',
      priceSortAll: 'Подборка',
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
      labGrownDiamond: 'Лабораторные бриллианты',
      naturalDiamond: 'Натуральные бриллианты',
      priceOnEnquiry: 'Цена по запросу',
      notFound: 'Товар не найден',
    },
    blog: {
      eyebrow: 'Журнал',
      headline1: 'Об украшениях —',
      headline2: 'подробнее',
      description: 'Как выбрать камни и оправу, разобраться в характеристиках и ухаживать за украшениями.',
      readTime: 'чтения',
      read: 'Читать →',
      featured: 'ИЗБРАННОЕ',
      notFound: 'Статья не найдена',
      backToBlog: '← Назад в журнал',
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
      description: 'Расскажите о своей идее. Обсудим с вами дизайн, камни и бюджет.',
      benefit1: 'Любой дизайн и сложность',
      benefit2: 'Бриллианты любых размеров и цветов',
      benefit3: 'Бесплатная консультация',
      nameLabel: 'Ваше имя',
      namePlaceholder: '',
      contactLabel: 'Телефон или Email',
      contactPlaceholder: 'Телефон или email',
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
      detailsPlaceholder: 'Расскажите о вашем замысле…',
      submit: 'Отправить заявку',
      success: 'Заявка принята!',
      successMessage: 'Мы свяжемся с вами для обсуждения деталей',
      messengerDivider: 'или свяжитесь напрямую',
      privacy: 'Отправляя заявку, вы соглашаетесь с нашей политикой конфиденциальности',
      step1Title: 'Консультация',
      step1Desc: 'Обсуждаем ваши идеи и пожелания',
      step2Title: 'Дизайн',
      step2Desc: 'Готовим и согласовываем эскиз.',
      step3Title: 'Создание',
      step3Desc: 'Мастера воплощают замысел в жизнь',
      step4Title: 'Доставка',
      step4Desc: 'Согласуем доставку по вашему адресу',
    },
    contact: {
      eyebrow: 'Контакты',
      headline1: 'Свяжитесь с',
      headline2: 'нами',
      description: 'Спросите об украшении, камне или дизайне. Поможем разобраться в деталях.',
      hours: 'Ежедневно с 10:00 до 21:00',
      phone: 'Телефон',
      callHours: 'Звоните с 10:00 до 21:00',
      email: 'Email',
      responseTime: 'Отвечаем в течение 24 часов',
      social: 'Найдите нас',
      formTitle: 'Отправить сообщение',
      name: 'Ваше имя',
      namePlaceholder: '',
      emailLabel: 'Email',
      emailPlaceholder: 'ivan@example.com',
      phoneLabel: 'Телефон',
      phonePlaceholder: 'Номер телефона',
      message: 'Сообщение',
      messagePlaceholder: 'Расскажите о том, какое украшение вы ищете…',
      consent: 'Я согласен(на) на обработку моих',
      privacyPolicy: 'персональных данных',
      submit: 'Отправить сообщение',
      successTitle: 'Сообщение отправлено!',
      successMessage: 'Мы свяжемся с вами в ближайшее время',
      emailError: 'Пожалуйста, введите корректный email',
      consentError: 'Пожалуйста, дайте согласие на обработку персональных данных',
      privacyAriaLabel: 'Читать политику конфиденциальности',
    },
    partners: {
      eyebrow: 'Партнёры',
      headline1: 'Наши',
      headline2: 'партнёры',
      description: 'Мы гордимся сотрудничеством с лучшими представителями мира роскоши и утончённого вкуса',
      partnerDescription: 'Изысканный винный дом, объединяющий традиции виноделия с современным искусством гостеприимства',
    },
    footer: {
      description: 'Украшения с бриллиантами — из коллекции или на заказ.',
      navigation: 'Навигация',
      info: 'Информация',
      delivery: 'Доставка и оплата',
      warranty: 'Гарантия и возврат',
      care: 'Уход за украшениями',
      privacy: 'Политика конфиденциальности',
      newsletter: 'Подписка',
      newsletterDesc: 'Получайте первыми информацию о новых коллекциях',
      subscribed: 'Вы подписаны!',
      copyright: '© 2026 Luminore. Все права защищены.',
      terms: 'Пользовательское соглашение',
      contactHeading: 'Контакты',
    },
  },
};
