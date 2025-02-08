import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

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
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 glass-morphism rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-transparent bg-clip-text">
          {isSignUp ? 'Create Account' : 'Sign In'}
        </h2>
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
  );
}
