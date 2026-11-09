import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/manrope";
import "@fontsource-variable/jetbrains-mono";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Architect Vault", template: "%s · Architect Vault" },
  description: "Personal learning hub for system design, LLD and DSA.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
