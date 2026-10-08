import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clubhouse | Find your people",
  description: "Explore school clubs and find your place in the community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
