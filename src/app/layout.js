import { Outfit } from "next/font/google";
import "./globals.css";
import { GameProvider } from "@/context/GameState";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
});

export const metadata = {
  title: "Hành Trình Anh Hùng Quốc Bảo - Game Phát Triển Bản Thân",
  description: "Biến quá trình phát triển bản thân, học tập và rèn luyện của trẻ thành một cuộc phiêu lưu nhập vai kỳ thú ngoài đời thực.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={`${outfit.variable} font-outfit antialiased bg-sand-light text-forest-dark`}>
        <div className="min-h-screen flex flex-col max-w-md mx-auto bg-sand-light shadow-2xl relative border-x border-sand">
          <GameProvider>
            {children}
          </GameProvider>
        </div>
      </body>
    </html>
  );
}
