/** The public Luminore Telegram account, supplied by the owner. */
export const TELEGRAM_USERNAME = 'luminore_diamonds';
/** Opens the message thread rather than the account profile. */
export const TELEGRAM_LINK = `tg://resolve?domain=${TELEGRAM_USERNAME}`;

/**
 * Opens the Luminore chat from an enquiry CTA with a ready-to-send message.
 */
export const telegramMessageLink = (message: string) => `${TELEGRAM_LINK}&text=${encodeURIComponent(message)}`;
