import { useAuth } from '@/context/AuthContext';
import Auth from '@/components/Auth';
import { Questionnaire, QuestionnaireData } from '@/components/Questionnaire';
import { ProjectCard } from '@/components/ProjectCard';
import { useProjects } from '@/context/ProjectContext';
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

export default function Index() {
  const { user, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { projects, setProjects } = useProjects();

  const handleQuestionnaireSubmit = async (data: QuestionnaireData) => {
    setIsLoading(true);
    try {
      // Example project generation based on user input
      const generatedProjects = [
        {
          id: '1',
          title: `${data.major} Project Management System`,
          description: `A comprehensive project management system tailored for ${data.major} students, incorporating ${data.technicalSkills} technologies.`,
          keywords: data.interests.split(',').map(k => k.trim()),
        },
        {
          id: '2',
          title: `Smart ${data.major} Analytics Platform`,
          description: `An analytics platform focusing on ${data.major} data analysis using ${data.technicalSkills}.`,
          keywords: data.technicalSkills.split(',').map(k => k.trim()),
        },
        {
          id: '3',
          title: `${data.major} Learning Hub`,
          description: `An interactive learning platform for ${data.major} students with ${data.projectScope} features.`,
          keywords: [...data.interests.split(','), ...data.technicalSkills.split(',')].map(k => k.trim()),
        }
      ];

      setProjects(generatedProjects);
      toast({
        title: "Success",
        description: "Projects generated successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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

        {projects.length === 0 ? (
          <Questionnaire
            onSubmit={handleQuestionnaireSubmit}
            isLoading={isLoading}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}