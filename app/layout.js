import "./globals.css";

export const metadata = {
  title: "TrekCanada | Explore Parks Canada Trails",
  description:
    "Personalized trail guide with real-time info and offline access for Parks Canada.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">{children}</body>
    </html>
  );
}
