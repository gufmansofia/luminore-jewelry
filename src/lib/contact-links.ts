/** The current Luminore Telegram account, supplied by the owner. */
export const TELEGRAM_LINK = 'tg://user?id=8437265614';

/**
 * Opens the Luminore chat from an enquiry CTA. Telegram clients that support
 * a prefilled draft receive the text; clients that do not still open the
 * correct account.
 */
export const telegramMessageLink = (message: string) => `${TELEGRAM_LINK}&text=${encodeURIComponent(message)}`;
