import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Online library",
  description: "Website where we can read books whose copyrights have expired",
  keywords: [
    "biblioteka",
    "free",
    "booksforfree",
    "bookswithnocopyrights",
    "books",
    "library",
    "onlinelibrary",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-stone-200">{children}</body>
    </html>
  );
}
