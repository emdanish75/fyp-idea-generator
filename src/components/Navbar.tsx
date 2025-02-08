import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleFYPClick = () => {
    if (!user) {
      toast({
        title: "Please sign in first",
        description: "You need to be signed in to access the FYP Idea Generator",
        variant: "default"
      });
      navigate("/auth");
    } else {
      navigate("/generator");
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/landing" className="text-2xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-transparent bg-clip-text hover:scale-105 transition-transform">
            IdeaGen
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Button
              variant="ghost"
              onClick={handleFYPClick}
            >
              FYP Idea Generator
            </Button>
            <Link to="/about">
              <Button variant="ghost">About</Button>
            </Link>
            <Link to="/contact">
              <Button variant="ghost">Contact</Button>
            </Link>
            {user ? (
              <Button variant="secondary" onClick={() => signOut()}>
                Sign Out
              </Button>
            ) : (
              <Button onClick={() => navigate("/auth")}>
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b shadow-lg">
            <div className="flex flex-col gap-2 p-4">
              <Button
                variant="ghost"
                onClick={handleFYPClick}
                className="w-full justify-start"
              >
                FYP Idea Generator
              </Button>
              <Link to="/about" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  About
                </Button>
              </Link>
              <Link to="/contact" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  Contact
                </Button>
              </Link>
              {user ? (
                <Button 
                  variant="secondary" 
                  onClick={() => {
                    signOut();
                    setIsOpen(false);
                  }}
                  className="w-full justify-start"
                >
                  Sign Out
                </Button>
              ) : (
                <Button 
                  onClick={() => {
                    navigate("/auth");
                    setIsOpen(false);
                  }}
                  className="w-full justify-start"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
