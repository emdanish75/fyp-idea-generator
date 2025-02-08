
import { useNavigate, useParams } from 'react-router-dom';
import { ProjectCard } from '@/components/ProjectCard';
import { useProjects } from '@/context/ProjectContext';
import { useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, fetchUserProjects } = useProjects();
  
  const project = projects.find(p => p.id === id);

  useEffect(() => {
    // Fetch projects if they're not loaded
    if (projects.length === 0) {
      fetchUserProjects().catch((error) => {
        console.error('Error fetching projects:', error);
        toast({
          title: "Error",
          description: "Failed to load project details",
          variant: "destructive",
        });
      });
    }
  }, []);

  if (!project) {
    return (
      <div className="min-h-screen bg-background text-foreground p-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Project Not Found</h1>
          <button 
            onClick={() => navigate('/')}
            className="text-primary hover:underline"
          >
            Go back to projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-7xl mx-auto">
        <ProjectCard project={project} onBack={() => navigate('/')} />
      </div>
    </div>
  );
}
