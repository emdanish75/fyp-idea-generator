import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Project {
  id: string;
  title: string;
  description: string;
  keywords: string[];
}

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="glass-morphism p-6 rounded-lg space-y-4">
      <h3 className="text-xl font-bold text-foreground">{project.title}</h3>
      <p className="text-muted-foreground">{project.description}</p>
      <div className="flex flex-wrap gap-2">
        {project.keywords.map((keyword, index) => (
          <Badge 
            key={index}
            variant="secondary"
            className="bg-secondary/50"
          >
            {keyword}
          </Badge>
        ))}
      </div>
      <Button variant="secondary" className="w-full">
        Learn More
      </Button>
    </div>
  );
}