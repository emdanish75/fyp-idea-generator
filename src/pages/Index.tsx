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
import { useNavigate } from 'react-router-dom';

export default function Index() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { projects, setProjects } = useProjects();
  const [showQuestionnaire, setShowQuestionnaire] = useState(true);
  const navigate = useNavigate();

  const handleQuestionnaireSubmit = async (data: QuestionnaireData) => {
    setIsLoading(true);
    try {
      const { data: response, error } = await supabase.functions.invoke('generate-projects', {
        body: { data }
      });
  
      if (error) {
        console.error('Project generation error:', error);
        throw error;
      }
  
      // Add URL slugs and prepare projects for saving
      const projectsToSave = response.projects.map(project => ({
        title: project.title,
        description: project.description,
        keywords: project.keywords,
        roadmap: project.roadmap,
        research_papers: project.researchPapers,
        user_id: user?.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_viewed_at: new Date().toISOString(),
        view_count: 0
      }));
  
      // Save projects to Supabase
      const { error: saveError } = await supabase
        .from('projects')
        .insert(projectsToSave);
  
      if (saveError) throw saveError;
  
      // Fetch the inserted projects to get the generated url_slugs
      const { data: insertedProjects, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(projectsToSave.length);
  
      if (fetchError) throw fetchError;
  
      // Convert to frontend format
      const projectsForState = insertedProjects.map(project => ({
        ...project,
        researchPapers: project.research_papers,
        research_papers: undefined
      }));
  
      setProjects(projectsForState);
      setShowQuestionnaire(false);
      
      toast({
        title: "Success",
        description: "Projects generated successfully!",
        variant: "success",
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
    <div className="min-h-screen bg-background">
      {isLoading && <LoadingScreen />}

      {showQuestionnaire ? (
        <Questionnaire
          onSubmit={handleQuestionnaireSubmit}
          isLoading={isLoading}
        />
      ) : (
        <div className="space-y-6 p-8">
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
  );
}
