
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { BasicInformation } from './questionnaire/BasicInformation';
import { SkillsAndInterests } from './questionnaire/SkillsAndInterests';
import { WorkStyle } from './questionnaire/WorkStyle';

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
}

export function Questionnaire({ onSubmit, isLoading }: QuestionnaireProps) {
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
    <div className="min-h-screen bg-background pt-20">
      <h1 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-transparent bg-clip-text">
        FYP Idea Generator
      </h1>
      <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-3xl mx-auto p-6 glass-morphism rounded-lg">
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
