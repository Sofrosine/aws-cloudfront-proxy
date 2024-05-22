import { Lato, Roboto } from "next/font/google";

export const roboto = Roboto({
  weight: ["100", "300", "400", "700", "900"],
  display: "swap",
  style: "normal",
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const lato = Lato({
  weight: ["100", "300", "400", "700", "900"],
  display: "swap",
  style: "normal",
  subsets: ["latin"],
  variable: "--font-lato",
});
