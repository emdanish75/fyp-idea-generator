import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface Project {
  id: string;
  title: string;
  description: string;
  roadmap: {
    overview: string;
  };
  url_slug: string;
}

interface ProjectListProps {
  projects: Project[];
}

export function ProjectList({ projects }: ProjectListProps) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Card key={project.id} className="flex flex-col">
          <CardHeader>
            <CardTitle>{project.title}</CardTitle>
            <CardDescription>{project.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {project.roadmap.overview}
            </p>
          </CardContent>
          <CardFooter className="mt-auto">
            <Button 
              className="w-full"
              onClick={() => navigate(`/project/${project.url_slug}`)}
            >
              Explore
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}