const channels = {
  Telegram: 'https://t.me/luminore_jewelry',
  WhatsApp: 'https://wa.me/421940600708',
  Instagram: 'https://www.instagram.com/luminore_jewelry/',
} as const;

export function ContactChannel({ channel, className = '' }: {
  channel: keyof typeof channels;
  className?: string;
}) {
  return <a className={`outline-button contact-channel ${className}`} href={channels[channel]} target="_blank" rel="noopener noreferrer">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {channel === 'Telegram' && <><path d="m21 3-4 18-6-7-8-3 18-8Z" /><path d="m11 14 5-6M11 14l-1 5 4-2" /></>}
      {channel === 'WhatsApp' && <><path d="M20.5 11.8a8.5 8.5 0 0 1-12.7 7.4L3 20.5l1.3-4.7a8.5 8.5 0 1 1 16.2-4Z" /><path d="m8.4 7.6 1.5 2.5-1 1.1a9.4 9.4 0 0 0 3.9 3.9l1.1-1 2.5 1.5c-.4 1.5-1.4 2-2.7 1.5-3.5-1.2-6.7-4.4-7.1-7.3-.2-1.1.5-2 1.8-2.2Z" /></>}
      {channel === 'Instagram' && <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".75" fill="currentColor" stroke="none" /></>}
    </svg>
    <span>{channel}</span>
  </a>;
}
