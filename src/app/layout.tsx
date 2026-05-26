import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "TableEco | Modern Tables and Furniture",
  description:
    "Shop premium tables and modern furniture with a clean, responsive ecommerce experience built for design-focused homes.",
};

import { ReduxProvider } from "@/redux/provider";
import AuthInitializer from "@/redux/auth-initializer";
import { AuthProvider } from "@/auth/AuthProvider";
import CartDrawer from "@/components/cart/CartDrawer";
import { CartDrawerProvider } from "@/components/cart/CartDrawerProvider";
import { ToastProvider } from "@/components/ui/toast-provider";
import { AppQueryProvider } from "@/providers/AppQueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full scroll-smooth`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="h-full bg-white antialiased transition-colors duration-300">
        <ThemeProvider>
          <ReduxProvider>
            <AppQueryProvider>
              <AuthProvider>
                <ToastProvider>
                  <CartDrawerProvider>
                    <AuthInitializer>
                      <main className="min-h-screen">
                        {children}
                      </main>
                      <CartDrawer />
                    </AuthInitializer>
                  </CartDrawerProvider>
                </ToastProvider>
              </AuthProvider>
            </AppQueryProvider>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
