import { Button } from "@mda/components";
import Link from "next/link";

import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="@container mx-auto flex flex-col h-screen">
          <header className="flex items-center justify-between p-4 border-b border-gray-300 mb-4">
            <span className="text-lg font-semibold">Music Discovery App</span>
            <Link href="/discover">
              <Button label="Discover" />
            </Link>
          </header>
          <div className="flex-grow">{children}</div>
          <footer className="border-t border-gray-300 py-4">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Jedai Saboteur. All rights
              reserved.
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
