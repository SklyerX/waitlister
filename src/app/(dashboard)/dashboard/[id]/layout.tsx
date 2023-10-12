import Tabs from "@/components/Tabs";
import { Inter } from "next/font/google";
import "../../../globals.css";
import DashboardNavbar from "@/components/misc/DashboardNav";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DashboardNavbar />
        <Tabs />
        <Toaster position="bottom-right" />
        {children}
      </body>
    </html>
  );
}
