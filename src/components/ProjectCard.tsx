import { Button } from '@/components/ui/button';

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
    <div className="bg-dark-200 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-2">{project.title}</h3>
      <p className="text-gray-300 mb-4">{project.description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {project.keywords.map((keyword, index) => (
          <span
            key={index}
            className="bg-blue-600 px-2 py-1 rounded-full text-sm"
          >
            {keyword}
          </span>
        ))}
      </div>
      <Button variant="default">Learn More</Button>
    </div>
  );
}