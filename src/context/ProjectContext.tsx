
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';

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
  user_id?: string;
}

interface ProjectContextType {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  getProjectById: (id: string) => Project | undefined;
  saveProjectsToDatabase: (projects: Project[]) => Promise<void>;
  fetchUserProjects: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const { user } = useAuth();

  const getProjectById = (id: string) => {
    return projects.find(project => project.id === id);
  };

  const saveProjectsToDatabase = async (projectsToSave: Project[]) => {
    if (!user) {
      console.error('No user found');
      return;
    }

    try {
      for (const project of projectsToSave) {
        const { error } = await supabase
          .from('projects')
          .upsert({
            ...project,
            user_id: user.id,
          });

        if (error) throw error;
      }

      console.log('Projects saved successfully');
    } catch (error: any) {
      console.error('Error saving projects:', error);
      toast({
        title: "Error",
        description: "Failed to save projects to database",
        variant: "destructive",
      });
    }
  };

  const fetchUserProjects = async () => {
    if (!user) {
      console.error('No user found');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      if (data) {
        setProjects(data);
        console.log('Projects fetched successfully:', data);
      }
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to fetch your projects",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserProjects();
    }
  }, [user]);

  return (
    <ProjectContext.Provider value={{ 
      projects, 
      setProjects, 
      getProjectById, 
      saveProjectsToDatabase,
      fetchUserProjects
    }}>
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
