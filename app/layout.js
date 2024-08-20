import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AppWrapper } from "@/context";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Drivers Live Tracking App",
  description: "Saboo RKS Drivers Live Tracking App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppWrapper>
          {children}
          <Toaster />
        </AppWrapper>
      </body>
    </html>
  );
}
