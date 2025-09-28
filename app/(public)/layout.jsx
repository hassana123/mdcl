import "./globals.css";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

// Metadata for SEO, social sharing, and browser configuration
export const metadata = {
  // Main title and description for the site
  title: "MDCL - Micro Development Consulting Limited | Development Solutions in Nigeria",
  description: "MDCL is a leading development consulting firm in Nigeria, specialising in research, project management, and capacity development. We deliver sustainable solutions for development actors across various sectors.",
  keywords: "development consulting, research projects, project management, capacity development, sustainable development, Nigeria, development solutions, consulting services",
  // Author and publisher information
  authors: [{ name: "Micro Development Consulting Limited" }],
  creator: "Micro Development Consulting Limited",
  publisher: "Micro Development Consulting Limited",
  // Favicon and icons for various devices
  icons: {
    icon: [
      { url: '/logo.jpg' },
      { url: '/logo.jpg', type: 'image/png' },
    ],
    apple: [
      { url: '/logo.jpg' },
    ],
  },
  // Prevent automatic detection of certain data types
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // Open Graph metadata for social sharing (Facebook, LinkedIn, etc.)
  openGraph: {
    title: "MDCL - Micro Development Consulting Limited | Development Solutions in Nigeria",
    description: "Leading development consulting firm in Nigeria, specialising in research, project management, and capacity development. We deliver sustainable solutions for development actors.",
    url: "https://mdcl.com.ng",
    siteName: "MDCL",
    locale: "en_GB",
    type: "website",
  },
  // Twitter card metadata for sharing
  twitter: {
    card: "summary_large_image",
    title: "MDCL - Micro Development Consulting Limited",
    description: "Leading development consulting firm in Nigeria, specialising in research, project management, and capacity development.",
  },
  // Robots and Googlebot crawling instructions
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // Google Search Console site verification
  verification: {
    google: "your-google-site-verification", // Add your Google verification code
  },
};

// PublicLayout component wraps all public pages with Navbar and Footer
export default function PublicLayout({ children }) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className="bg-white overflow-x-hidden leading-relaxed min-h-screen flex flex-col font-segoe antialiased"
        style={{ fontFamily: 'Segoe UI, system-ui, Arial, sans-serif' }}
      >
        {/* Site-wide navigation bar */}
        <Navbar />
        {/* Main content area for all child pages */}
        <main className="flex-1 overflow-x-hidden">{children}</main>
        {/* Site-wide footer */}
        <Footer />
      </body>
    </html>
  );
}
