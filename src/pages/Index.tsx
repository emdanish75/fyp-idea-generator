import { useAuth } from '@/context/AuthContext';
import Auth from '@/components/Auth';
import { Questionnaire, QuestionnaireData } from '@/components/Questionnaire';
import { useProjects } from '@/context/ProjectContext';
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { supabase } from "@/integrations/supabase/client";
import { LoadingScreen } from '@/components/LoadingScreen';
import { ProjectList } from '@/components/ProjectList';

export default function Index() {
  const { user, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { projects, setProjects } = useProjects();
  const [showQuestionnaire, setShowQuestionnaire] = useState(true);

  const handleQuestionnaireSubmit = async (data: QuestionnaireData) => {
    setIsLoading(true);
    try {
      console.log('Submitting questionnaire data:', data);
      
      const { data: response, error } = await supabase.functions.invoke('generate-projects', {
        body: { data }
      });

      if (error) {
        console.error('Project generation error:', error);
        throw error;
      }

      console.log('Generated projects:', response.projects);
      setProjects(response.projects);
      setShowQuestionnaire(false);
      
      toast({
        title: "Success",
        description: "Projects generated successfully!",
      });
    } catch (error: any) {
      console.error('Project generation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate projects",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setShowQuestionnaire(true);
  };

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">FYP Idea Generator</h1>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">{user.email}</span>
            <Button variant="secondary" onClick={() => signOut()}>
              Sign Out
            </Button>
          </div>
        </div>

        {isLoading && <LoadingScreen />}

        {showQuestionnaire ? (
          <Questionnaire
            onSubmit={handleQuestionnaireSubmit}
            isLoading={isLoading}
          />
        ) : (
          <div className="space-y-6">
            <Button 
              onClick={handleBack}
              variant="outline"
              className="mb-4"
            >
              ← Generate New Ideas
            </Button>
            <ProjectList projects={projects} />
          </div>
        )}
      </div>
    </div>
  );
}