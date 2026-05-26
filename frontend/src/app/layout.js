import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "AIdiscover | AI Discoverability Platform",
  description: "Monitor and optimize your business discoverability, visibility scores, and search recommendations on leading AI engines like ChatGPT, Claude, and Gemini.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="h-full bg-gray-950 text-gray-100 flex flex-col font-sans antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
        {/* Decorative ambient background glows */}
        <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-full max-w-7xl -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.08),transparent_50%)] pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 -z-10 h-[300px] w-[300px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-[150px] pointer-events-none" />
        
        <Navbar />
        <main className="flex-grow flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
