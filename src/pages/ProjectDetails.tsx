import { useNavigate, useParams } from 'react-router-dom';
import { ProjectCard } from '@/components/ProjectCard';
import { useProjects } from '@/context/ProjectContext';
import { Button } from '@/components/ui/button';

export default function ProjectDetails() {
  const { url_slug } = useParams();
  const navigate = useNavigate();
  const { projects, recentlyGeneratedIds } = useProjects();
  
  const project = projects.find(p => p.url_slug === url_slug);

  const handleBack = () => {
    navigate('/generator', { 
      state: { 
        showRecent: true 
      } 
    });
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-background text-foreground p-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Project Not Found</h1>
          <Button
            onClick={handleBack}
            variant="outline"
            className="mb-6"
          >
            ← Back to Generated Ideas
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <Button
        onClick={handleBack}
        variant="outline"
        className="mb-6"
      >
        ← Back to Generated Ideas
      </Button>
      <div className="max-w-7xl mx-auto">
        <ProjectCard project={project} onBack={handleBack} />
      </div>
    </div>
  );
}