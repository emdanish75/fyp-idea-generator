import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        // Trim the name to remove any whitespace
        const trimmedName = name.trim();
        
        if (!trimmedName || trimmedName.length === 0) {
          toast({
            title: "Error",
            description: "Name is required and cannot be empty",
            variant: "destructive",
          });
          return;
        }

        if (!age) {
          toast({
            title: "Error",
            description: "Age is required for signup",
            variant: "destructive",
          });
          return;
        }

        const ageNumber = parseInt(age);
        if (isNaN(ageNumber) || ageNumber < 1) {
          toast({
            title: "Error",
            description: "Please enter a valid age",
            variant: "destructive",
          });
          return;
        }

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (signUpError) throw signUpError;
        
        // Create profile on successful signup
        if (signUpData.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: signUpData.user.id,
              name: trimmedName, // Use the trimmed name
              age: ageNumber,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (profileError) {
            console.error('Profile creation error:', profileError);
            toast({
              title: "Error",
              description: "Failed to create user profile",
              variant: "destructive",
            });
            return;
          }
        }

        toast({
          title: "Success",
          description: "Please check your email to confirm your account, then sign in.",
          variant: "success"
        });
        setIsSignUp(false);
      } else {
        await signIn(email, password);
        toast({
          title: "Success",
          description: "Successfully signed in",
          variant: "success"
        });
        navigate('/landing');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="w-full max-w-md space-y-8 p-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">
              {isSignUp ? 'Make an Account' : 'Welcome Back'}
            </h1>
            <p className="text-muted-foreground">
              {isSignUp 
                ? 'Create an account to start generating ideas' 
                : 'Sign in to continue to IdeaGen'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <div>
                  <Input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    placeholder="Age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                    className="w-full"
                    min="1"
                  />
                </div>
              </>
            )}
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full">
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </Button>
          </form>
          <p className="mt-4 text-center text-muted-foreground">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary hover:underline"
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"}
            </button>
          </p>
        </div>
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
