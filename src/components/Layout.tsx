import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex flex-col">
        {children}
      </main>
      {!isLandingPage && <Footer />}
    </div>
  );
} 