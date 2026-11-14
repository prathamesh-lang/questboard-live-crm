import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Questboard | Customer Intelligence",
  description: "Live customer success intelligence for Eastern Counties and Aldermoor."
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
