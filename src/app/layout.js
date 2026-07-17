import "./globals.css";
import { ClientLayout } from "../components/ClientLayout.jsx";

export const metadata = {
  title: "JAGORON - AI Youth Profiling System",
  description: "AI-Enabled Youth Profiling and Career Pathway Assessment Portal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* We can still load Google Fonts and Chart.js fallback, but CSS @import covers fonts */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
