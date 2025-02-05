import { useAuth } from '@/context/AuthContext';
import Auth from '@/components/Auth';
import { Questionnaire, QuestionnaireData } from '@/components/Questionnaire';
import { ProjectCard } from '@/components/ProjectCard';
import { useProjects } from '@/context/ProjectContext';
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { supabase } from "@/integrations/supabase/client";

export default function Index() {
  const { user, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { projects, setProjects } = useProjects();
  const [showQuestionnaire, setShowQuestionnaire] = useState(true);

  const handleQuestionnaireSubmit = async (data: QuestionnaireData) => {
    setIsLoading(true);
    try {
      const { data: response, error } = await supabase.functions.invoke('generate-projects', {
        body: { data }
      });

      if (error) throw error;

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
          <h1 className="text-3xl font-bold">FYP Project Generator</h1>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">{user.email}</span>
            <Button variant="secondary" onClick={() => signOut()}>
              Sign Out
            </Button>
          </div>
        </div>

        {showQuestionnaire ? (
          <Questionnaire
            onSubmit={handleQuestionnaireSubmit}
            isLoading={isLoading}
          />
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {projects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project}
                onBack={handleBack}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}