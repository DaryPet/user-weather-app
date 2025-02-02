import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "User Weather App",
  description: "Get weather by User location",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <Toaster position="top-right" reverseOrder={false} />
        {children}
      </body>
    </html>
  );
}
