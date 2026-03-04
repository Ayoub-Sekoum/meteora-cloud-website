export const dynamic = "force-static";

export default function sitemap() {
    const baseUrl = "https://metteora.uk"; // Replace with actual domain
    const locales = ["it", "en", "de"];

    const routes = [""].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString(),
        alternates: {
            languages: locales.reduce((acc, locale) => {
                acc[locale] = `${baseUrl}/${locale}${route}`;
                return acc;
            }, {} as Record<string, string>),
        },
    }));

    // Add locale specific route objects
    const localizedRoutes = locales.map((locale) => ({
        url: `${baseUrl}/${locale}`,
        lastModified: new Date().toISOString(),
        alternates: {
            languages: locales.reduce((acc, altLocale) => {
                acc[altLocale] = `${baseUrl}/${altLocale}`;
                return acc;
            }, {} as Record<string, string>),
        },
    }));

    return [...routes, ...localizedRoutes];
}
