import PopupError from "@/components/Popup/PopupError";
import { lato } from "@/config/constants/fonts";
import clsx from "clsx";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Cloudfront Proxy Test",
    default: "Cloudfront Proxy Test",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={clsx(lato.className, "text-black-text")}>
        <div className="min-h-[100vh] relative">
          <div className="z-20 relative">{children}</div>
        </div>
        <PopupError />
      </body>
    </html>
  );
}
