import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n';
const logoFullUrl = '/logo-full.png';

const TELEGRAM_LINK = 'https://t.me/luminore_jewelry';
const WHATSAPP_LINK = 'https://wa.me/421940600708';

function InfoPopup({ onClose, language, infoKey }: { onClose: () => void; language: string; infoKey: string }) {
  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const allContent: Record<string, { ru: { title: string; text: string; cta: string }; uk: { title: string; text: string; cta: string }; en: { title: string; text: string; cta: string } }> = {
    terms: {
      ru: {
        title: 'Пользовательское соглашение',
        text: 'Используя сайт luminore.eu, вы соглашаетесь с настоящим соглашением. Все материалы сайта, включая тексты, изображения и логотипы, являются интеллектуальной собственностью Luminore Jewelry. Цены и наличие товаров могут быть изменены без предварительного уведомления. Luminore оставляет за собой право отказать в обслуживании по своему усмотрению. Для получения дополнительной информации свяжитесь с нами.',
        cta: 'Напишите нам',
      },
      uk: {
        title: 'Умови використання',
        text: 'Використовуючи сайт luminore.eu, ви погоджуєтесь з цими умовами. Усі матеріали сайту, включаючи тексти, зображення та логотипи, є інтелектуальною власністю Luminore Jewelry. Ціни та наявність товарів можуть змінюватися без попереднього повідомлення. Luminore залишає за собою право відмовити в обслуговуванні на власний розсуд. Для отримання додаткової інформації зв\'яжіться з нами.',
        cta: 'Напишіть нам',
      },
      en: {
        title: 'Terms of Service',
        text: 'By using luminore.eu you agree to these terms. All content on this site, including text, images, and logos, is the intellectual property of Luminore Jewelry. Prices and product availability are subject to change without notice. Luminore reserves the right to refuse service at its discretion. For further information, please contact us.',
        cta: 'Message us',
      },
    },
    delivery: {
      ru: {
        title: 'Доставка и оплата',
        text: 'Мы стремимся сделать процесс покупки максимально удобным и прозрачным. Каждый заказ обрабатывается индивидуально, и наша команда сопровождает вас на каждом этапе — от выбора украшения до его доставки к вашей двери. Мы осуществляем доставку по всему миру. Способы оплаты включают банковский перевод и оплату при получении. Для получения подробной информации — свяжитесь с нами удобным для вас способом.',
        cta: 'Напишите нам',
      },
      uk: {
        title: 'Доставка та оплата',
        text: 'Ми прагнемо зробити процес купівлі максимально зручним і прозорим. Кожне замовлення обробляється індивідуально, і наша команда супроводжує вас на кожному етапі — від вибору прикраси до доставки до ваших дверей. Ми здійснюємо доставку по всьому світу. Способи оплати включають банківський переказ та оплату при отриманні. Для отримання детальної інформації — зв\'яжіться з нами зручним для вас способом.',
        cta: 'Напишіть нам',
      },
      en: {
        title: 'Shipping & Payment',
        text: 'We strive to make your purchasing experience as seamless and transparent as possible. Every order is handled individually, and our team guides you through each step — from selecting your piece to delivering it to your door. We offer worldwide shipping. Payment methods include bank transfer and cash on delivery. For detailed information about shipping options and timelines — please reach out to us.',
        cta: 'Message us',
      },
    },
    warranty: {
      ru: {
        title: 'Гарантия и возврат',
        text: 'Все изделия Luminore сопровождаются пожизненной гарантией на производственные дефекты. Мы уверены в качестве каждого украшения, потому что каждое изделие проходит строгий контроль качества. Если вы не полностью довольны покупкой, мы предлагаем возврат или обмен в течение 14 дней с момента получения при сохранении оригинальной упаковки. Свяжитесь с нами для оформления возврата.',
        cta: 'Напишите нам',
      },
      uk: {
        title: 'Гарантія та повернення',
        text: 'Усі вироби Luminore супроводжуються довічною гарантією на виробничі дефекти. Ми впевнені в якості кожної прикраси, адже кожен виріб проходить суворий контроль якості. Якщо ви не повністю задоволені покупкою, ми пропонуємо повернення або обмін протягом 14 днів з моменту отримання за умови збереження оригінальної упаковки. Зв\'яжіться з нами для оформлення повернення.',
        cta: 'Напишіть нам',
      },
      en: {
        title: 'Warranty & Returns',
        text: 'All Luminore pieces come with a lifetime warranty against manufacturing defects. We stand behind the quality of every piece because each item undergoes rigorous quality control. If you are not completely satisfied with your purchase, we offer returns or exchanges within 14 days of delivery, provided the original packaging is preserved. Contact us to arrange a return.',
        cta: 'Message us',
      },
    },
    care: {
      ru: {
        title: 'Уход за украшениями',
        text: 'Чтобы ваши украшения Luminore сияли долгие годы, рекомендуем соблюдать простые правила ухода. Храните изделия в мягком футляре отдельно друг от друга. Снимайте украшения перед занятиями спортом, посещением бассейна и нанесением косметики. Для чистки используйте мягкий мыльный раствор и безворсовую ткань. Раз в год приносите украшения на профессиональный осмотр и чистку.',
        cta: 'Напишите нам',
      },
      uk: {
        title: 'Догляд за прикрасами',
        text: 'Щоб ваші прикраси Luminore сяяли довгі роки, рекомендуємо дотримуватися простих правил догляду. Зберігайте вироби в м\'якому чохлі окремо один від одного. Знімайте прикраси перед заняттями спортом, відвідуванням басейну та нанесенням косметики. Для чистки використовуйте м\'який мильний розчин і безворсову тканину. Раз на рік приносьте прикраси на професійний огляд і чищення.',
        cta: 'Напишіть нам',
      },
      en: {
        title: 'Jewelry Care',
        text: 'To keep your Luminore jewelry sparkling for years to come, follow these simple care guidelines. Store each piece separately in a soft pouch. Remove jewelry before exercising, swimming, or applying cosmetics. Clean with a mild soapy solution and a lint-free cloth. Bring your pieces in once a year for a professional inspection and deep cleaning.',
        cta: 'Message us',
      },
    },
    privacy: {
      ru: {
        title: 'Политика конфиденциальности',
        text: 'Luminore Jewelry уважает вашу конфиденциальность и защищает ваши персональные данные. Мы собираем только необходимую информацию для обработки заказов и улучшения обслуживания. Ваши данные никогда не передаются третьим лицам без вашего согласия. Мы используем современные методы шифрования для защиты ваших данных. Вы можете запросить удаление ваших данных в любое время, связавшись с нами.',
        cta: 'Напишите нам',
      },
      uk: {
        title: 'Політика конфіденційності',
        text: 'Luminore Jewelry поважає вашу конфіденційність і захищає ваші персональні дані. Ми збираємо лише необхідну інформацію для обробки замовлень і покращення обслуговування. Ваші дані ніколи не передаються третім особам без вашої згоди. Ми використовуємо сучасні методи шифрування для захисту ваших даних. Ви можете запросити видалення ваших даних будь-коли, зв\'язавшись з нами.',
        cta: 'Напишіть нам',
      },
      en: {
        title: 'Privacy Policy',
        text: 'Luminore Jewelry respects your privacy and protects your personal data. We collect only the information necessary to process orders and improve our service. Your data is never shared with third parties without your consent. We use modern encryption methods to safeguard your information. You may request deletion of your data at any time by contacting us.',
        cta: 'Message us',
      },
    },
  };

  const lang = language === 'ru' ? 'ru' : language === 'uk' ? 'uk' : 'en';
  const content = allContent[infoKey]?.[lang] || allContent.delivery[lang];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#1B0D14]/80 backdrop-blur-sm"></div>

      {/* Popup */}
      <div
        className="relative bg-[#564C5B] border border-[#C5C9C6]/15 max-w-lg w-full p-8 md:p-10 animate-[fadeInUp_0.3s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-[#C5C9C6]/60 hover:text-white transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Title */}
        <h3
          className="font-cinzel text-xl text-white mb-6"
          style={{ letterSpacing: '0.05em' }}
        >
          {content.title}
        </h3>

        {/* Text */}
        <p className="font-body text-[#C5C9C6]/80 leading-relaxed mb-8">
          {content.text}
        </p>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-white/15"></div>
          <span className="font-body text-sm text-white/40">
            {content.cta}
          </span>
          <div className="flex-1 h-px bg-white/15"></div>
        </div>

        {/* Messenger buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href={TELEGRAM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-3 px-6 py-4 border border-white/20 hover:border-[#29A9EB]/50 hover:bg-[#29A9EB]/10 transition-all duration-300 group"
          >
            <svg className="w-5 h-5 text-white/70 group-hover:text-[#29A9EB] transition-colors" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
            <span className="font-cinzel text-sm text-white/80 group-hover:text-white transition-colors" style={{ letterSpacing: '0.05em' }}>
              Telegram
            </span>
          </a>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-3 px-6 py-4 border border-white/20 hover:border-[#25D366]/50 hover:bg-[#25D366]/10 transition-all duration-300 group"
          >
            <svg className="w-5 h-5 text-white/70 group-hover:text-[#25D366] transition-colors" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
            </svg>
            <span className="font-cinzel text-sm text-white/80 group-hover:text-white transition-colors" style={{ letterSpacing: '0.05em' }}>
              WhatsApp
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}

export function Footer() {
  const { t, language } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showInfoPopup, setShowInfoPopup] = useState<string | null>(null);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const key = (e as CustomEvent<string>).detail;
      setShowInfoPopup(key);
    };
    window.addEventListener('luminore:open-info', handler);
    return () => window.removeEventListener('luminore:open-info', handler);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && emailRegex.test(email)) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { id: 'about', label: t.nav?.about || 'О нас' },
    { id: 'products', label: t.nav?.collection || 'Коллекция' },
    { id: 'custom-order', label: t.nav?.consultation || 'Индивидуальный заказ' },
    { id: 'blog', label: t.nav?.blog || 'Блог' },
    { id: 'contact', label: t.nav?.contact || 'Контакты' },
  ];

  const infoLinks = [
    { key: 'delivery', label: t.footer.delivery },
    { key: 'warranty', label: t.footer.warranty },
    { key: 'care', label: t.footer.care },
    { key: 'privacy', label: t.footer.privacy },
  ];

  return (
    <>
      <footer
        ref={footerRef}
        className="relative bg-[#1B0D14] overflow-hidden"
      >
        {/* Texture overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div
            className={`grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {/* Brand Column */}
            <div className="lg:col-span-1 space-y-6">
              <button
                onClick={() => scrollToSection('hero')}
                className="block hover:opacity-80 transition-opacity"
              >
                <img
                  src={logoFullUrl}
                  alt="Luminore Jewelry"
                  className="h-12 w-auto brightness-0 invert"
                />
              </button>
              <p className="font-body text-[#C5C9C6]/70 text-sm leading-relaxed">
                {t.footer.description}
              </p>
            </div>

            {/* Navigation Column */}
            <div className="space-y-6">
              <h4
                className="font-cinzel text-sm text-white"
                style={{ letterSpacing: '0.1em' }}
              >
                {t.footer.navigation}
              </h4>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => scrollToSection(link.id)}
                      className="relative font-body text-[#C5C9C6]/70 hover:text-[#D1642E] transition-colors text-sm group"
                    >
                      {link.label}
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-[#D1642E] group-hover:w-full transition-all duration-300"></span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Info Column */}
            <div className="space-y-6">
              <h4
                className="font-cinzel text-sm text-white"
                style={{ letterSpacing: '0.1em' }}
              >
                {t.footer.info}
              </h4>
              <ul className="space-y-3">
                {infoLinks.map((item) => (
                  <li key={item.key}>
                    <button
                      onClick={() => setShowInfoPopup(item.key)}
                      className="relative font-body text-[#C5C9C6]/70 hover:text-[#D1642E] transition-colors text-sm group"
                    >
                      {item.label}
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-[#D1642E] group-hover:w-full transition-all duration-300"></span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Column */}
            <div className="space-y-6">
              <h4
                className="font-cinzel text-sm text-white"
                style={{ letterSpacing: '0.1em' }}
              >
                {t.footer.contactHeading}
              </h4>
              <ul className="space-y-3">
                <li>
                  <a href="tel:+421940600708" className="font-body text-[#C5C9C6]/70 hover:text-[#D1642E] transition-colors text-sm">
                    +421 940 600 708
                  </a>
                </li>
                <li>
                  <a href="mailto:jewelry@luminore.eu" className="font-body text-[#C5C9C6]/70 hover:text-[#D1642E] transition-colors text-sm">
                    jewelry@luminore.eu
                  </a>
                </li>
                <li>
                  <a href="https://t.me/luminore_jewelry" target="_blank" rel="noopener noreferrer" className="font-body text-[#C5C9C6]/70 hover:text-[#D1642E] transition-colors text-sm">
                    Telegram
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/421940600708" target="_blank" rel="noopener noreferrer" className="font-body text-[#C5C9C6]/70 hover:text-[#D1642E] transition-colors text-sm">
                    WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div
            className={`pt-8 border-t border-[#C5C9C6]/10 flex flex-col md:flex-row justify-between items-center gap-4 transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <p className="font-body text-[#C5C9C6]/50 text-sm">
              {t.footer.copyright}
            </p>
            <div className="flex gap-6">
              <button
                onClick={() => setShowInfoPopup('terms')}
                className="font-body text-[#C5C9C6]/50 hover:text-[#D1642E] transition-colors text-sm"
              >
                {t.footer.terms}
              </button>
              <button
                onClick={() => setShowInfoPopup('privacy')}
                className="font-body text-[#C5C9C6]/50 hover:text-[#D1642E] transition-colors text-sm"
              >
                {t.footer.privacy}
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Info Popup */}
      {showInfoPopup && (
        <InfoPopup
          onClose={() => setShowInfoPopup(null)}
          language={language}
          infoKey={showInfoPopup}
        />
      )}
    </>
  );
}
