import "~/styles/globals.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import SideNav from "./_components/SideNav";
import { NextAuthProvider } from "~/NextAuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Twitter Clone",
  description: "This is a twitter clone",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <NextAuthProvider>
          <TRPCReactProvider>
            <div className="container mx-auto flex items-start sm:pr-4">
              <SideNav />
              <div className="min-h-screen flex-grow border-x">{children}</div>
            </div>
          </TRPCReactProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
