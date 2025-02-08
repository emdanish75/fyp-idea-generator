import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="min-h-screen bg-background py-20 px-4">
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
            IdeaGen started as a simple hobby project—just me, trying to solve a real problem.  
            I saw how challenging it was for students to find the right Final Year Project idea, and I wanted to make that process easier.  
            That’s how IdeaGen was born—an AI-powered tool designed to provide meaningful, tailored project suggestions.  
          </p>

          <p>
            But this is just the beginning. My vision goes far beyond project ideas.  
            I want to build a comprehensive platform that empowers students, business professionals, and individuals  
            to make real progress in their lives—one step at a time. Whether it's through research, innovation, or practical solutions,  
            I want to help people unlock their potential and, ultimately, serve humanity in meaningful ways.  
          </p>

          <p>
            IdeaGen is the first step toward this mission. Right now, it’s small, but every great journey starts somewhere.  
            I’ll keep improving it, expanding its possibilities, and making it more valuable.  
            Because at the end of the day, <strong>it all starts with an idea!</strong> ;) 
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
