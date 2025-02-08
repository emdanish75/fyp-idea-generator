import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LearningResource {
  title: string;
  type: string;
  url: string;
}

interface Roadmap {
  overview: string;
  problemStatement: string;
  solutionApproach: string;
  toolsAndTechnologies: string[];
  expectedChallenges: string[];
  learningResources: LearningResource[];
}

interface ResearchPaper {
  title: string;
  authors: string[];
  year: number;
  abstract: string;
  url: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  roadmap: Roadmap;
  researchPapers: ResearchPaper[];
  url_slug: string;
  created_at?: string;
  updated_at?: string;
  last_viewed_at?: string;
  view_count?: number;
}

interface ProjectContextType {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  getProjectById: (id: string) => Project | undefined;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);

  const getProjectById = (id: string) => {
    return projects.find(project => project.id === id);
  };

  return (
    <ProjectContext.Provider value={{ projects, setProjects, getProjectById }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
}