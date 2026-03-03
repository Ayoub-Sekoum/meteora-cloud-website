import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = "https://meteora-cloud.com";

    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: [
                "/api/",
                "/private/"
            ],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
