import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-8 text-center mt-auto">
      <p className="flex items-center justify-center gap-2 text-muted-foreground">
        Made with <Heart className="text-red-500 animate-pulse" size={16} /> by{" "}
        <a 
          href="https://emdanish.vercel.app/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:text-primary/80 underline-offset-4 hover:underline transition-colors"
        >
          Danish
        </a>
      </p>
    </footer>
  );
} 