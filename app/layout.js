import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Autoinspect - #1 Vehicle History Reports | Autoinspect Car Reports",
  description: "Autoinspect offers the most comprehensive vehicle history reports. Get instant VIN checks, accident history, mileage verification, title records, and market value analysis. Trusted by thousands of car buyers worldwide. Avoid costly mistakes with our detailed car history reports.",
  keywords: "autoinspect, autoinspect.site, vehicle history report, VIN check, car history, auto history report, used car report, vehicle records, accident history, mileage verification, title check, car buying, automotive history, vehicle inspection",
  authors: [{ name: "Autoinspect Team" }],
  creator: "Autoinspect",
  publisher: "Autoinspect",
  // Enhanced meta tags for better SERP control
  metadataBase: new URL("https://autoinspect.site"),
  alternates: {
    canonical: "https://autoinspect.site",
    languages: {
      "en-US": "https://autoinspect.site",
      "x-default": "https://autoinspect.site"
    }
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // Enhanced Open Graph for social media SERP
  openGraph: {
    title: "Autoinspect - #1 Vehicle History Reports | Complete Car History Check",
    description: "Get comprehensive vehicle history reports from Autoinspect. Check accident history, verify mileage, review title records, and get market value analysis. Trusted by car buyers worldwide.",
    url: "https://autoinspect.site",
    siteName: "Autoinspect",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/Autoinspect.png",
        width: 1200,
        height: 630,
        alt: "Autoinspect - Vehicle History Reports",
        type: "image/png"
      },
    ],
  },
  // Enhanced Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Autoinspect - #1 Vehicle History Reports",
    description: "Get comprehensive vehicle history reports. Check accident history, verify mileage, and get market value analysis. Trusted by car buyers worldwide.",
    images: ["/Autoinspect.png"],
    creator: "@autoinspect",
    site: "@autoinspect",
  },
  // Search Engine Verification
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
    other: {
      "msvalidate.01": "your-bing-verification-code"
    }
  },
  category: "Automotive",
  classification: "Vehicle History Reports",
  // Additional meta properties
  referrer: "origin-when-cross-origin",
  formatDetection: {
    telephone: false,
  },
  // Enhanced favicon configuration
  icons: {
    icon: [
      { url: "/car-logo.webp", type: "image/webp" }
    ],
    shortcut: "/car-logo.webp",
    apple: [
      { url: "/car-logo.webp", sizes: "180x180", type: "image/webp" },
      { url: "/car-logo.webp", sizes: "152x152", type: "image/webp" }
    ],
    other: [
      { rel: "icon", url: "/car-logo.webp", sizes: "16x16", type: "image/webp" },
      { rel: "mask-icon", url: "/car-logo.webp", color: "#2563eb" }
    ]
  },
  // App-specific meta
  other: {
    "apple-mobile-web-app-title": "Autoinspect",
    "application-name": "Autoinspect",
    "msapplication-TileColor": "#2563eb",
    "msapplication-TileImage": "/car-logo.webp",
    "theme-color": "#2563eb",
    // Enhanced SERP meta tags
    "price": "GBP 1",
    "availability": "InStock",
    "category": "Automotive Services",
    "rating": "4.8",
    "review_count": "2847"
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        
        {/* Enhanced Favicon Configuration */}

        <link rel="icon" href="/favicon.ico" />

        
        {/* Microsoft Tile Configuration */}
        <meta name="msapplication-TileImage" content="/car-logo.webp" />
        <meta name="msapplication-square70x70logo" content="/car-logo.webp" />
        <meta name="msapplication-square150x150logo" content="/car-logo.webp" />
        <meta name="msapplication-wide310x150logo" content="/car-logo.webp" />
        <meta name="msapplication-square310x310logo" content="/car-logo.webp" />
        
        <link rel="manifest" href="/manifest.json" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Autoinspect",
              "alternateName": "Autoinspect",
              "url": "https://autoinspect.site",
              "logo": "https://autoinspect.site/car-logo.webp",
              "description": "Leading provider of comprehensive vehicle history reports and VIN checks for car buyers worldwide.",
              "sameAs": [
                "https://twitter.com/autoinspect",
                "https://facebook.com/autoinspect",
                "https://linkedin.com/company/autoinspect"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "availableLanguage": "English"
              },
              "offers": {
                "@type": "Offer",
                "name": "Vehicle History Report",
                "description": "Comprehensive vehicle history report including accident history, mileage verification, title records, and market value analysis",
                "price": "1",
                "priceCurrency": "GBP"
              },
              "service": {
                "@type": "Service",
                "name": "Vehicle History Reports",
                "description": "Professional vehicle history checking service",
                "provider": {
                  "@type": "Organization",
                  "name": "Autoinspect"
                },
                "areaServed": "Worldwide",
                "hasOfferCatalog": {
                  "@type": "OfferCatalog",
                  "name": "Vehicle History Services",
                  "itemListElement": [
                    {
                      "@type": "Offer",
                      "itemOffered": {
                        "@type": "Service",
                        "name": "VIN Check Report",
                        "description": "Complete vehicle history analysis"
                      }
                    }
                  ]
                }
              }
            })
          }}
        />
        
        {/* Additional Structured Data for Local Business (if applicable) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Autoinspect",
              "url": "https://autoinspect.site",
              "description": "Get comprehensive vehicle history reports and VIN checks. Uncover accident history, verify mileage, check title records, and get market value analysis.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://autoinspect.site/?vin={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        
        {/* FAQ Schema for SERP Enhancement */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "How accurate are Autoinspect reports?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Our reports are highly accurate as we source data from over 900 trusted databases including DMV records, insurance companies, auction houses, and government agencies. However, we recommend using our reports as one factor in your decision-making process."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How long does it take to receive my Autoinspect report?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Most reports are delivered within 1-2 hours via email. However, we allow up to 6-12 hours for delivery to account for any technical delays or complex data compilation requirements."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What makes Autoinspect different from competitors?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Autoinspect offers the most comprehensive database with over 1 billion data points, faster delivery times, 24/7 customer support, and competitive pricing. We also provide market value analysis and detailed damage assessments."
                  }
                },
                {
                  "@type": "Question", 
                  "name": "Do Autoinspect reports cover vehicles from all countries?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We currently cover vehicles from over 35 countries across North America, Europe, Oceania, Africa, and the Middle East. Our coverage is continuously expanding to include more international markets."
                  }
                }
              ]
            })
          }}
        />
        
        {/* Product/Service Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              "name": "Vehicle History Report",
              "description": "Comprehensive vehicle history report including accident history, mileage verification, title records, and market value analysis",
              "brand": {
                "@type": "Brand",
                "name": "Autoinspect"
              },
              "offers": {
                "@type": "Offer",
                "price": "1",
                "priceCurrency": "GBP",
                "availability": "https://schema.org/InStock",
                "seller": {
                  "@type": "Organization",
                  "name": "Autoinspect"
                }
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "2847",
                "bestRating": "5",
                "worstRating": "1"
              },
              "review": [
                {
                  "@type": "Review",
                  "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": "5",
                    "bestRating": "5"
                  },
                  "author": {
                    "@type": "Person",
                    "name": "JC"
                  },
                  "reviewBody": "Very reassuring before buying a used vehicle. Autoinspect provided a detailed and accurate report."
                },
                {
                  "@type": "Review",
                  "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": "5",
                    "bestRating": "5"
                  },
                  "author": {
                    "@type": "Person",
                    "name": "Sasha"
                  },
                  "reviewBody": "Slightly pricey, but saved me from a huge mistake. The mileage was tampered, and Autoinspect caught it."
                }
              ]
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
