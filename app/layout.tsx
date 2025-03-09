import "@/styles/globals.css";

import { Metadata } from "next";
import clsx from "clsx";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { Providers } from "./providers";
import { UserProvider } from "./contexts/UserContext";
import { CartProvider } from "./contexts/CartContext";
import Footer from "./footer/footer";
import { CategoriesProvider } from "./contexts/CategoriesContext";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import CustomNavBar from "@/components/navbar";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};
type Viewport = {
  themeColor: { media: string; color: string }[];
};
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "max-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        {/*<AppWrapper>*/}
        <UserProvider>
          <CartProvider>
            <CategoriesProvider>
              <Providers
                themeProps={{ attribute: "class", defaultTheme: "light" }}
              >
                <div className="relative flex flex-col h-screen">
                  <CustomNavBar />
                  <main className="pt-10 flex-grow">
                    {children}
                    <Analytics />
                    <SpeedInsights />
                  </main>
                  <footer>
                    <Footer />
                  </footer>
                </div>
              </Providers>
            </CategoriesProvider>
          </CartProvider>
        </UserProvider>
        {/*</AppWrapper>*/}
      </body>
    </html>
  );
}
