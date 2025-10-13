import "./globals.css";
import StoreProvider from "./StoreProvider";
import Header from "./login/Header";
import Sidebar from "./Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <html lang="en">
        <body>
          <div className="@container mx-auto flex flex-col h-screen">
            <Header />

            <div className="flex flex-grow">
              <Sidebar />
              {children}
            </div>
            <footer className="border-t border-gray-300 py-4">
              <p className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Jedai Saboteur. All rights
                reserved.
              </p>
            </footer>
          </div>
        </body>
      </html>
    </StoreProvider>
  );
}
