import "./globals.css";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

export const metadata = {
  title: "MDCL - Micro Development Consulting Limited | Development Solutions in Nigeria",
  description: "MDCL is a leading development consulting firm in Nigeria, specialising in research, project management, and capacity development. We deliver sustainable solutions for development actors across various sectors.",
  keywords: "development consulting, research projects, project management, capacity development, sustainable development, Nigeria, development solutions, consulting services",
  authors: [{ name: "Micro Development Consulting Limited" }],
  creator: "Micro Development Consulting Limited",
  publisher: "Micro Development Consulting Limited",
  icons: {
    icon: [
      { url: '/logo.jpg' },
      { url: '/logo.jpg', type: 'image/png' },
    ],
    apple: [
      { url: '/logo.jpg' },
    ],
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "MDCL - Micro Development Consulting Limited | Development Solutions in Nigeria",
    description: "Leading development consulting firm in Nigeria, specialising in research, project management, and capacity development. We deliver sustainable solutions for development actors.",
    url: "https://mdcl.com.ng",
    siteName: "MDCL",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MDCL - Micro Development Consulting Limited",
    description: "Leading development consulting firm in Nigeria, specialising in research, project management, and capacity development.",
  },
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
  verification: {
    google: "your-google-site-verification", // Add your Google verification code
  },
};

export default function PublicLayout({ children }) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className="bg-white overflow-x-hidden leading-relaxed min-h-screen flex flex-col font-segoe antialiased"
        style={{ fontFamily: 'Segoe UI, system-ui, Arial, sans-serif' }}
      >
        <Navbar />
        <main className="flex-1 overflow-x-hidden">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
