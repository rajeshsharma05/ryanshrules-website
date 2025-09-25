import './global.css'

export const metadata = {
    title: "Ryansh Sharma - Creative Artist & Comic Creator from Sydney",
    description: 'Discover the amazing world of Ryansh Sharma - a young creative artist from Sydney, Australia. Explore original comic strips, creative videos, and artistic works by this talented creative kid.',
    keywords: 'Ryansh Sharma, creative artist, comic creator, Sydney artist, creative kid, comics, videos, Australian artist, young artist, creative portfolio, comic strips',
    author: 'Ryansh Sharma',
    robots: 'index, follow',
    canonical: 'https://ryanshrules.com',
    openGraph: {
        type: 'website',
        locale: 'en_AU',
        url: 'https://ryanshrules.com',
        siteName: "Ryansh's Creative World",
        title: "Ryansh Sharma - Creative Artist & Comic Creator from Sydney",
        description: 'Discover the amazing world of Ryansh Sharma - a young creative artist from Sydney, Australia. Explore original comic strips, creative videos, and artistic works.',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Ryansh Sharma Creative Portfolio'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: "Ryansh Sharma - Creative Artist & Comic Creator from Sydney",
        description: 'Discover the amazing world of Ryansh Sharma - a young creative artist from Sydney, Australia.',
        images: ['/twitter-image.jpg'],
        creator: '@ryanshsharma'
    },
    alternates: {
        canonical: 'https://ryanshrules.com'
    }
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <head>
            {/* Additional SEO Meta Tags */}
            <meta name="theme-color" content="#000000" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
            <link rel="icon" href="/favicon.ico" />
            <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

            {/* Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Person",
                        "name": "Ryansh Sharma",
                        "alternateName": "Ryansh",
                        "description": "Creative artist and comic creator from Sydney, Australia",
                        "jobTitle": "Artist & Content Creator",
                        "url": "https://ryanshrules.com",
                        "address": {
                            "@type": "PostalAddress",
                            "addressLocality": "Sydney",
                            "addressRegion": "NSW",
                            "addressCountry": "Australia"
                        },
                        "sameAs": [
                            "https://ryanshrules.com"
                        ],
                        "knowsAbout": ["Comic Art", "Digital Art", "Creative Content", "Video Creation"],
                        "hasOccupation": {
                            "@type": "Occupation",
                            "name": "Creative Artist"
                        }
                    })
                }}
            />

            {/* Google Analytics */}
            <script
                async
                src="https://www.googletagmanager.com/gtag/js?id=G-EW4CM8TVEQ"
            />
            <script
                dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-EW4CM8TVEQ', {
                            page_title: 'Ryansh Sharma - Creative Portfolio',
                            page_location: 'https://ryanshrules.com'
                        });
                    `
                }}
            />
        </head>
        <body>{children}</body>
        </html>
    )
}