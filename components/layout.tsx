import clsx from "clsx";
import { Inter } from "next/font/google";
import { PropsWithChildren } from "react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export default function Layout(props: PropsWithChildren) {
  return <div className={clsx(inter.className)}>{props.children}</div>;
}
