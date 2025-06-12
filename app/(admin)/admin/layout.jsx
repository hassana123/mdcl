'use client';

import "../../(public)/globals.css"
import SideNav from "@/components/admin/SideNav";
import { AuthProvider } from "./AuthProvider";
import { useAuth } from "./AuthProvider";
import { usePathname } from 'next/navigation';

function getHeaderTitle(pathname) {
  const path = pathname.split('/').pop();
  
  const titles = {
    'dashboard': 'Dashboard',
    'projects': 'Projects & Programmes',
    'blogs': 'Blog',
    'gallery': 'Gallery',
    'resources': 'Resources',
    'login': 'Login',
    'signup': 'Sign Up'
  };

  return titles[path] || 'Dashboard';
}

const publicRoutes = ['/admin/login', '/admin/signup'];

function ProtectedLayout({ children }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const headerTitle = getHeaderTitle(pathname);
  const isPublicRoute = publicRoutes.includes(pathname);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-700"></div>
      </div>
    );
  }

  // For public routes (login and signup), render without the admin layout
  if (isPublicRoute) {
    return children;
  }

  // For protected routes, show the admin layout
  return (
    <div className="flex flex-1">
      <SideNav />
      {/* Main Content */}
      <section className="flex-1 overflow-y-auto">
        <header className="mb-6 px-5 py-6 bg-[#FFFFFF]">
          <h1 className="text-xl font-bold text-gray-800">{headerTitle}</h1>
        </header>
        <main className="bg-[#f5f5f5] w-[96%] mx-auto">{children}</main>
      </section>
    </div>
  );
}

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body className="!bg-[#f5f5f5] min-h-screen font-segoe flex flex-col overflow-x-hidden antialiased">
        <AuthProvider>
          <ProtectedLayout>{children}</ProtectedLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
