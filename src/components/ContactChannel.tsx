const channels = {
  Telegram: 'https://t.me/luminore_jewelry',
  WhatsApp: 'https://wa.me/421940600708',
  Instagram: 'https://www.instagram.com/luminore_jewelry/',
} as const;

export function ContactChannel({ channel, className = '', href = channels[channel] }: {
  channel: keyof typeof channels;
  className?: string;
  href?: string;
}) {
  return <a className={`outline-button contact-channel ${className}`} href={href} target="_blank" rel="noopener noreferrer">
    {channel === 'Instagram' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".75" fill="currentColor" stroke="none" />
    </svg>}
    <span>{channel}</span>
  </a>;
}
