
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (!user) {
      toast({
        title: "Please sign in first",
        description: "You need to be signed in to access the FYP Idea Generator",
      });
      navigate("/auth");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative h-screen flex flex-col items-center justify-center text-center px-4"
      >
        <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-transparent bg-clip-text hover:scale-105 transform transition-transform duration-300">
          IdeaGen
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-8">
          Unlock your potential with AI-powered FYP ideas tailored to your interests and expertise
        </p>
        <Button 
          size="lg" 
          onClick={handleGetStarted}
          className="animate-fade-in"
        >
          Get Started
        </Button>
      </motion.section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-secondary/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose IdeaGen?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "AI-Powered Intelligence",
                description: "Our advanced AI algorithms analyze your profile to generate personalized project ideas"
              },
              {
                title: "Tailored to You",
                description: "Get suggestions based on your skills, interests, and academic background"
              },
              {
                title: "Save Time",
                description: "Focus on what matters - building your project, not searching for ideas"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-morphism p-6 rounded-lg hover:scale-105 transition-transform duration-300"
              >
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
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
