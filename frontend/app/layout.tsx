import "./globals.css";
import { Inter, Playfair_Display } from "next/font/google";
import Navbar from "@/components/Navbar/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata = {
  title: "Sisakalam-world for words",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
