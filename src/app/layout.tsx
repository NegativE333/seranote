import type { Metadata } from "next";
import { Epilogue } from "next/font/google";
import "./globals.css";
import { Navbar } from "./[components]/navbar";

const epilogue = Epilogue({
  subsets: ["latin"],
  variable: "--font-epilogue",
});

export const metadata: Metadata = {
  title: "Seranote",
  description: "A song, a letter, a feeling...",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={epilogue.variable}>
      <body
        className={`${epilogue.variable} antialiased bg-primary font-epilogue max-w-[1440px] mx-auto`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
