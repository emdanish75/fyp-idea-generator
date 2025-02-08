import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 pb-16">
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-transparent bg-clip-text">
            The Story Behind IdeaGen
          </h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-8 text-lg text-muted-foreground"
          >
            <p>
              IdeaGen started as a simple hobby project. It was just me, trying to solve a real problem.  
              I saw how challenging it was for students to find the right Final Year Project idea, and I wanted to make that process easier.  
              That's how IdeaGen was born. It handles the research for students, saving extensive time spent finding the perfect idea that aligns with their skills, interests, and goals, is novel, fills a market gap, and has business potential, allowing them to focus on building rather than just researching.
            </p>

            <p>
              But this is just the beginning. My vision goes far beyond FYP ideas.  
              I want to build a comprehensive platform that empowers students, business professionals, and individuals  
              to make real progress in their lives, one step at a time. Whether it's through research, innovation, or practical solutions,  
              I want to help people unlock their potential and, ultimately, serve humanity in meaningful ways.  
            </p>

            <p>
              IdeaGen is the first step toward this mission. Right now, it's small, I know. But every great journey starts somewhere, right?
              I'll keep improving it, expanding its possibilities, and making it more valuable.  
              Because at the end of the day, <strong>it all starts with an idea!</strong> ;) 
            </p>
          </motion.div>
        </motion.div>
      </div>

      <footer className="py-8 text-center">
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
    </div>
  );
}
