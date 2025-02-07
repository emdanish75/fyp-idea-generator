
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
          Our Journey
        </h1>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="space-y-8 text-lg text-muted-foreground"
        >
          <p>
            IdeaGen started as a simple hobby project, born from the frustration of seeing talented students struggle to find the perfect Final Year Project idea. What began as a basic suggestion tool has evolved into a sophisticated AI-powered platform that's transforming how students approach their academic projects.
          </p>

          <p>
            Our mission is simple yet ambitious: to empower every student with personalized, innovative project ideas that align perfectly with their interests, skills, and academic goals. We believe that the right project can not only lead to academic success but also ignite a lifelong passion for innovation and problem-solving.
          </p>

          <p>
            Today, IdeaGen stands at the intersection of artificial intelligence and academic excellence. Our advanced algorithms analyze multiple factors - from technical skills to personal interests - to generate project suggestions that are both challenging and achievable. We're not just generating ideas; we're opening doors to opportunities that can shape careers.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
