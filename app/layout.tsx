import TanstackQueryProvider from "@/providers/TanstackQueryProvider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TanStack Query - Queries",
  description:
    "A playground codespace for TanStack Official Docs - Guides & Concepts - Advanced",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <TanstackQueryProvider>{children}</TanstackQueryProvider>
      </body>
    </html>
  );
}
