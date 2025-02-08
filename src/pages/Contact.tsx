
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { Send, Star, MessageSquare, Heart } from "lucide-react";

export default function Contact() {
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [reviewForm, setReviewForm] = useState({ name: "", rating: "", review: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://formspree.io/f/xgvozzky", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactForm),
      });

      if (!response.ok) throw new Error("Failed to send message");

      toast({
        title: "Message received",
        description: "I'll get back to you soon :)",
        variant: "success",
      });

      setContactForm({ name: "", email: "", message: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://formspree.io/f/xpwqlldl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewForm),
      });

      if (!response.ok) throw new Error("Failed to submit review");

      toast({
        title: "Thank you!",
        description: "Your review has been submitted.",
        variant: "success",
      });

      setReviewForm({ name: "", rating: "", review: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-transparent bg-clip-text"
        >
          Get in Touch
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center text-lg text-muted-foreground mb-12"
        >
          I value your feedback and suggestions. Help me improve IdeaGen and make it even better for everyone!
        </motion.p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-morphism p-6 rounded-lg"
          >
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare className="text-blue-400 animate-pulse" />
              <h2 className="text-2xl font-semibold">Send a Message</h2>
            </div>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <Input
                  placeholder="Your Name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Textarea
                  placeholder="Your Message"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  required
                  className="min-h-[150px]"
                />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </form>
          </motion.div>

          {/* Review Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-morphism p-6 rounded-lg"
          >
            <div className="flex items-center gap-2 mb-6">
              <Star className="text-yellow-400 animate-pulse" />
              <h2 className="text-2xl font-semibold">Leave a Review</h2>
            </div>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <Input
                  placeholder="Your Name"
                  value={reviewForm.name}
                  onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  placeholder="Rating (1-5)"
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
                  required
                />
              </div>
              <div>
                <Textarea
                  placeholder="Your Review"
                  value={reviewForm.review}
                  onChange={(e) => setReviewForm({ ...reviewForm, review: e.target.value })}
                  required
                  className="min-h-[150px]"
                />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                <Heart className="mr-2 h-4 w-4" />
                Submit Review
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
