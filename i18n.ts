import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

const locales = ['it', 'en', 'de'];

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = (await requestLocale) as string;
    if (!locale || !locales.includes(locale as any)) locale = 'it'; // fallback

    return {
        locale,
        messages: (await import(`./messages/${locale}.json`)).default
    };
});
