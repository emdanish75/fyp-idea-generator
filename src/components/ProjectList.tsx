
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Project } from "@/context/ProjectContext";

interface ProjectListProps {
  projects: Project[];
}

export function ProjectList({ projects }: ProjectListProps) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Card key={project.id} className="glass-morphism flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-foreground">{project.title}</CardTitle>
            <CardDescription className="text-muted-foreground line-clamp-2">
              {project.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground line-clamp-3">
              {project.roadmap.overview}
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full"
              onClick={() => navigate(`/project/${project.id}`)}
            >
              Explore
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
