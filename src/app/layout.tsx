import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { JsonLd } from "@/components/seo/JsonLd";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yazintrainer.com"),
  title: {
    default: "Yazin Trainer | Premium Communication Strategist & Soft Skills Specialist",
    template: "%s | Yazin Trainer",
  },
  description:
    "Premium Soft Skills, Communicative English & IELTS Band 7.5+ Training engineered for Corporates, Higher Education Institutions, and Professionals by Yazin T. Azad.",
  keywords: [
    "Corporate Soft Skills Trainer",
    "Master Soft Skills Trainer",
    "Executive Communication Strategy",
    "IELTS Master Trainer India",
    "TEFL TESOL Certified Trainer",
    "Corporate Placement Readiness",
    "Soft Skills Interventions",
    "Yazin T Azad",
    "Yazin Trainer"
  ],
  authors: [{ name: "Yazin T. Azad", url: "https://yazintrainer.com" }],
  creator: "Yazin T. Azad",
  publisher: "Yazin Trainer",
  openGraph: {
    title: "Yazin Trainer | Premium Communication Strategist & Soft Skills Specialist",
    description:
      "Executive coaching, placement readiness, and high-stakes IELTS strategies engineered for organizations and professionals by Yazin T. Azad.",
    url: "https://yazintrainer.com",
    siteName: "Yazin Trainer",
    images: [
      {
        url: "/Yazin_professional.png",
        width: 1200,
        height: 630,
        alt: "Yazin T. Azad - Premium Communication Strategist",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yazin Trainer | Premium Communication Strategist",
    description:
      "Premium Soft Skills, Communicative English & IELTS Training for Corporates and Institutions by Yazin T. Azad.",
    images: ["/Yazin_professional.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://yazintrainer.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <head>
        <JsonLd />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}

