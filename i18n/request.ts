import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = (await requestLocale) as string;
    if (!locale) locale = 'it';
    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default
    };
});
