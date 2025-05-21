import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import { CustomProvider } from "rsuite";
import 'rsuite/dist/rsuite-no-reset.min.css';
import "./globals.css";
import { Footer } from "@/components/home_ui/footer";
import { AnimationProvider } from "@/components/animation/provider";

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
});

export const metadata: Metadata = {
  title: "Kopkas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <CustomProvider>
        <body
          className={`${quicksand.variable} font-sans`}
        >
          <AnimationProvider>
            {children}
          </AnimationProvider>
        </body>
      </CustomProvider>
    </html>
  );
}
