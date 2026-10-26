
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KW Translations Spanish Explorers",
  description:
    "A fun and interactive Spanish learning adventure for Grade 3 students. Learn vocabulary, practise pronunciation, play games, complete quizzes and earn rewards.",
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
