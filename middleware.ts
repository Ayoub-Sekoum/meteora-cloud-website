import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
    locales: ['it', 'en', 'de'],
    defaultLocale: 'it'
});

export const config = {
    matcher: ['/((?!_next|.*\\..*).*)']
};
