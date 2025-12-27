import "./globals.css";

export const metadata = {
  title: "Wedding Invitation",
  description: "A simple wedding invitation",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
