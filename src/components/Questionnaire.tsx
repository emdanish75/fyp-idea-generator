import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { BasicInformation } from './questionnaire/BasicInformation';
import { SkillsAndInterests } from './questionnaire/SkillsAndInterests';
import { WorkStyle } from './questionnaire/WorkStyle';
import { Heart } from "lucide-react";

export interface QuestionnaireData {
  university: string;
  semester: string;
  major: string;
  interests: string;
  skills: string;
  problemSolvingStyle: string;
  preferredWorkStyle: string;
  projectScope: string;
}

interface QuestionnaireProps {
  onSubmit: (data: QuestionnaireData) => void;
  isLoading: boolean;
  onBack: () => void;
}

export function Questionnaire({ onSubmit, isLoading, onBack }: QuestionnaireProps) {
  const [formData, setFormData] = useState<Partial<QuestionnaireData>>({
    university: '',
    semester: '',
    major: '',
    interests: '',
    skills: '',
    problemSolvingStyle: '',
    preferredWorkStyle: '',
    projectScope: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (Object.values(formData).some(value => !value)) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      onSubmit(formData as QuestionnaireData);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 pb-16">
        <div className="max-w-2xl mx-auto space-y-8">

          <form onSubmit={handleSubmit} className="space-y-6">
            <BasicInformation 
              formData={formData} 
              setFormData={setFormData}
              fieldofstudy={fieldofstudy}
            />
            
            <SkillsAndInterests 
              formData={formData} 
              setFormData={setFormData}
            />
            
            <WorkStyle 
              formData={formData} 
              setFormData={setFormData}
            />

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full mt-8"
            >
              {isLoading ? 'Generating Ideas...' : 'Generate Project Ideas'}
            </Button>
          </form>
        </div>
      </div>

      <footer className="py-8 text-center">
        <p className="flex items-center justify-center gap-2 text-muted-foreground">
          Made with <Heart className="text-red-500 animate-pulse" size={16} /> by{" "}
          <a 
            href="https://emdanish.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 underline-offset-4 hover:underline transition-colors"
          >
            Danish
          </a>
        </p>
      </footer>
    </div>
  );
}

const fieldofstudy = [
  "Computer Science",
  "Software Engineering",
  "Cybersecurity",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Aviation Management",
  "Business Studies",
  "Economics",
  "Finance",
  "Psychology",
  "Sociology",
  "Political Science",
  "Physics",
  "Chemistry",
  "Biology",
  "Mathematics",
  "Environmental Science",
  "Media and Communication",
  "Education",
  "Architecture",
  "Art and Design",
  "Music and Performing Arts",
  "Law",
  "Humanities"
];
