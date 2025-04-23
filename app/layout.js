import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { AuthContextProvider } from "./_utils/auth-context";

export const metadata = {
  title: "Trek Canada",
  description: "Discover and explore trails across Canada",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="forced-colors-mode">
        <AuthContextProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </AuthContextProvider>
      </body>
    </html>
  );
}
