import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n';

export function Contact() {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    consent: false,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<{ email?: string; consent?: string }>({});
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
    // Clear the relevant error when the user updates the field
    if (name === 'email' || name === 'consent') {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { email?: string; consent?: string } = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = language === 'ru' ? 'Пожалуйста, введите корректный email' : 'Please enter a valid email address';
    }
    if (!formData.consent) {
      errors.consent = language === 'ru' ? 'Пожалуйста, дайте согласие на обработку персональных данных' : 'Please consent to the processing of personal data';
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    setIsSubmitted(true);
    setFormData({ name: '', email: '', phone: '', message: '', consent: false });
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <section 
      ref={sectionRef}
      id="contact" 
      className="relative py-24 lg:py-32 bg-[#C5C9C6] overflow-hidden"
    >
      {/* Concrete Silver background with subtle texture */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[#C5C9C6]"></div>
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Luminore Rust warm accent */}
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-[#D1642E]/10 rounded-full blur-[120px]"></div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div 
          className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-8 h-px bg-[#D1642E]"></div>
            <span 
              className="font-cinzel text-xs text-[#564C5B]"
              style={{ letterSpacing: '0.2em' }}
            >
              {t.contact.eyebrow}
            </span>
            <div className="w-8 h-px bg-[#D1642E]"></div>
          </div>

          {/* Headline - Cinzel with 3% tracking */}
          <h2 
            className="font-cinzel text-3xl md:text-4xl lg:text-5xl font-normal text-[#1B0D14] leading-[1.15] mb-6"
            style={{ letterSpacing: '0.03em' }}
          >
            {t.contact.headline1}<br />
            <span className="text-[#D1642E]">{t.contact.headline2}</span>
          </h2>

          <p className="font-body text-[#564C5B] text-lg leading-relaxed">
            {t.contact.description}
          </p>
        </div>

        <div 
          className={`grid lg:grid-cols-2 gap-12 lg:gap-16 transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Contact Info */}
          <div className="space-y-8">
            {/* Phone */}
            <div className="flex gap-5">
              <div className="w-12 h-12 bg-[#1B0D14] flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#D1642E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h3 
                  className="font-cinzel text-sm text-[#1B0D14] mb-1"
                  style={{ letterSpacing: '0.05em' }}
                >
                  {t.contact.phone}
                </h3>
                <a href="tel:+421940600708" className="font-body text-[#564C5B] hover:text-[#D1642E] transition-colors">
                  +421 940 600 708
                </a>
                <p className="font-body text-sm text-[#564C5B]/70 mt-1">{t.contact.callHours}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex gap-5">
              <div className="w-12 h-12 bg-[#1B0D14] flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#D1642E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 
                  className="font-cinzel text-sm text-[#1B0D14] mb-1"
                  style={{ letterSpacing: '0.05em' }}
                >
                  {t.contact.email}
                </h3>
                <a href="mailto:jewelry@luminore.eu" className="font-body text-[#564C5B] hover:text-[#D1642E] transition-colors">
                  jewelry@luminore.eu
                </a>
                <p className="font-body text-sm text-[#564C5B]/70 mt-1">{t.contact.responseTime}</p>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-6 border-t border-[#1B0D14]/10">
              <h3
                className="font-cinzel text-sm text-[#1B0D14] mb-4"
                style={{ letterSpacing: '0.05em' }}
              >
                {t.contact.social}
              </h3>
              <div className="flex gap-3">
                <a
                  href="https://www.instagram.com/luminore_jewelry/?utm_source=ig_web_button_share_sheet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#1B0D14] flex items-center justify-center hover:bg-[#D1642E] transition-colors"
                  title="Instagram"
                >
                  <svg className="w-4 h-4 text-[#C5C9C6]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
                <a
                  href="https://t.me/luminore_jewelry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#1B0D14] flex items-center justify-center hover:bg-[#D1642E] transition-colors"
                  title="Telegram"
                >
                  <svg className="w-4 h-4 text-[#C5C9C6]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                </a>
                <a
                  href="https://wa.me/421940600708"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#1B0D14] flex items-center justify-center hover:bg-[#D1642E] transition-colors"
                  title="WhatsApp"
                >
                  <svg className="w-4 h-4 text-[#C5C9C6]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 shadow-xl shadow-[#1B0D14]/5 border border-[#1B0D14]/5">
            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-6 bg-[#D1642E]/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#D1642E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 
                  className="font-cinzel text-2xl text-[#1B0D14] mb-2"
                  style={{ letterSpacing: '0.03em' }}
                >
                  {t.contact.successTitle}
                </h3>
                <p className="font-body text-[#564C5B]">{t.contact.successMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 
                  className="font-cinzel text-xl text-[#1B0D14] mb-6"
                  style={{ letterSpacing: '0.03em' }}
                >
                  {t.contact.formTitle}
                </h3>

                {/* Name Field */}
                <div>
                  <label 
                    htmlFor="name" 
                    className="font-cinzel text-xs text-[#1B0D14] block mb-2"
                    style={{ letterSpacing: '0.05em' }}
                  >
                    {t.contact.name}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[#C5C9C6]/30 border border-[#1B0D14]/10 font-body text-[#1B0D14] placeholder:text-[#564C5B]/50 focus:border-[#D1642E] focus:outline-none focus:ring-2 focus:ring-[#D1642E] transition-all duration-300"
                    placeholder={t.contact.namePlaceholder}
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="font-cinzel text-xs text-[#1B0D14] block mb-2"
                    style={{ letterSpacing: '0.05em' }}
                  >
                    {t.contact.emailLabel}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    aria-invalid={!!formErrors.email}
                    aria-describedby={formErrors.email ? 'email-error' : undefined}
                    className={`w-full px-4 py-3 bg-[#C5C9C6]/30 border font-body text-[#1B0D14] placeholder:text-[#564C5B]/50 focus:border-[#D1642E] focus:outline-none focus:ring-2 focus:ring-[#D1642E] transition-all duration-300 ${formErrors.email ? 'border-[#D1642E]' : 'border-[#1B0D14]/10'}`}
                    placeholder={t.contact.emailPlaceholder}
                  />
                  {formErrors.email && (
                    <p id="email-error" className="font-body text-sm text-[#D1642E] mt-1" role="alert">
                      {formErrors.email}
                    </p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label
                    htmlFor="phone"
                    className="font-cinzel text-xs text-[#1B0D14] block mb-2"
                    style={{ letterSpacing: '0.05em' }}
                  >
                    {t.contact.phoneLabel}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#C5C9C6]/30 border border-[#1B0D14]/10 font-body text-[#1B0D14] placeholder:text-[#564C5B]/50 focus:border-[#D1642E] focus:outline-none focus:ring-2 focus:ring-[#D1642E] transition-all duration-300"
                    placeholder={t.contact.phonePlaceholder}
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label
                    htmlFor="message"
                    className="font-cinzel text-xs text-[#1B0D14] block mb-2"
                    style={{ letterSpacing: '0.05em' }}
                  >
                    {t.contact.message}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-[#C5C9C6]/30 border border-[#1B0D14]/10 font-body text-[#1B0D14] placeholder:text-[#564C5B]/50 focus:border-[#D1642E] focus:outline-none focus:ring-2 focus:ring-[#D1642E] transition-all duration-300 resize-none"
                    placeholder={t.contact.messagePlaceholder}
                  />
                </div>

                {/* Legal Consent Checkbox */}
                <div>
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="consent"
                      name="consent"
                      checked={formData.consent}
                      onChange={handleChange}
                      aria-invalid={!!formErrors.consent}
                      aria-describedby={formErrors.consent ? 'consent-error' : undefined}
                      className="w-5 h-5 mt-0.5 border border-[#1B0D14]/30 bg-[#C5C9C6]/30 text-[#D1642E] focus:ring-2 focus:ring-[#D1642E] rounded-none cursor-pointer"
                    />
                    <label
                      htmlFor="consent"
                      className="font-body text-sm text-[#564C5B] leading-relaxed cursor-pointer"
                    >
                      {t.contact.consent}{' '}
                      <a href="/privacy-policy" aria-label={language === 'ru' ? 'Читать политику конфиденциальности' : 'Read our privacy policy'} className="text-[#D1642E] hover:underline">{t.contact.privacyPolicy}</a>
                    </label>
                  </div>
                  {formErrors.consent && (
                    <p id="consent-error" className="font-body text-sm text-[#D1642E] mt-1 ml-8" role="alert">
                      {formErrors.consent}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button 
                  type="submit"
                  disabled={!formData.consent}
                  className={`w-full py-4 font-cinzel text-sm transition-all duration-300 ${
                    formData.consent 
                      ? 'bg-[#D1642E] text-white hover:bg-[#B85420]' 
                      : 'bg-[#C5C9C6] text-[#564C5B] cursor-not-allowed'
                  }`}
                  style={{ letterSpacing: '0.1em' }}
                >
                  {t.contact.submit}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
