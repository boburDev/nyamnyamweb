import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Providers from "@/components/provider/Provider";
import { Toaster } from "react-hot-toast";
import { RootProviders } from "@/components/provider/RootProviders";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  setRequestLocale(locale);
  const t = await getTranslations("Metadata");
  return {
    title: t("title"),
    description: t("description"),
    keywords: t.raw("keywords") as string[],
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressContentEditableWarning>
      <body className={`${poppins.variable} antialiased`}>
        <NextIntlClientProvider>
          <RootProviders>
            <Providers>{children}</Providers>
          </RootProviders>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
