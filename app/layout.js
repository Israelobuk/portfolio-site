import { IBM_Plex_Mono, Inter } from "next/font/google";
import fs from "node:fs";
import path from "node:path";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

const globalStyles = fs.readFileSync(path.join(process.cwd(), "app", "globals.css"), "utf8");

export const metadata = {
  title: "Israel Obukonise | Software Engineering + Data Science Portfolio",
  description:
    "Portfolio focused on software engineering, data science, analytics engineering, and practical system delivery.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <style id="globals-inline" dangerouslySetInnerHTML={{ __html: globalStyles }} />
      </head>
      <body className={`${inter.variable} ${ibmPlexMono.variable}`}>{children}</body>
    </html>
  );
}

