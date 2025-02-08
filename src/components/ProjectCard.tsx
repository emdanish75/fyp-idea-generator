
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Project } from '@/context/ProjectContext';

interface ProjectCardProps {
  project: Project;
  onBack: () => void;
}

export function ProjectCard({ project, onBack }: ProjectCardProps) {
  return (
    <Card className="glass-morphism w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold text-foreground mb-2">{project.title}</CardTitle>
            <CardDescription className="text-muted-foreground">{project.description}</CardDescription>
          </div>
          <Button variant="outline" onClick={onBack} className="shrink-0">
            Back
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {project.keywords.map((keyword, index) => (
            <Badge key={index} variant="secondary" className="bg-secondary/50">
              {keyword}
            </Badge>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Project Roadmap</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-foreground">Overview</h4>
              <p className="text-muted-foreground">{project.roadmap.overview}</p>
            </div>
            <div>
              <h4 className="font-medium text-foreground">Problem Statement</h4>
              <p className="text-muted-foreground">{project.roadmap.problemStatement}</p>
            </div>
            <div>
              <h4 className="font-medium text-foreground">Solution Approach</h4>
              <p className="text-muted-foreground">{project.roadmap.solutionApproach}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Tools & Technologies</h3>
          <div className="flex flex-wrap gap-2">
            {project.roadmap.toolsAndTechnologies.map((tool, index) => (
              <Badge key={index} variant="outline">
                {tool}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Expected Challenges</h3>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            {project.roadmap.expectedChallenges.map((challenge, index) => (
              <li key={index}>{challenge}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Learning Resources</h3>
          <ScrollArea className="h-[200px] rounded-md border p-4">
            <div className="space-y-4">
              {project.roadmap.learningResources.map((resource, index) => (
                <div key={index} className="space-y-1">
                  <h4 className="font-medium text-foreground">{resource.title}</h4>
                  <p className="text-sm text-muted-foreground">Type: {resource.type}</p>
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:underline"
                  >
                    Access Resource
                  </a>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Related Research Papers</h3>
          <ScrollArea className="h-[300px] rounded-md border p-4">
            <div className="space-y-6">
              {project.researchPapers.map((paper, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="font-medium text-foreground">{paper.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    Authors: {paper.authors.join(', ')} ({paper.year})
                  </p>
                  <p className="text-sm text-muted-foreground">{paper.abstract}</p>
                  {paper.url && (
                    <a 
                      href={paper.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:underline"
                    >
                      View Paper
                    </a>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
