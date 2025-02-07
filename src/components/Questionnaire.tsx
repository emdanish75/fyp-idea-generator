
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { BasicInformation } from './questionnaire/BasicInformation';
import { SkillsAndInterests } from './questionnaire/SkillsAndInterests';
import { WorkStyle } from './questionnaire/WorkStyle';

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

export interface QuestionnaireData {
  name: string;
  age: string;
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
    name: '',
    age: '',
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
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-3xl mx-auto p-6 glass-morphism rounded-lg">
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
        className="w-full"
      >
        {isLoading ? 'Generating Ideas...' : 'Generate Project Ideas'}
      </Button>
    </form>
  );
}
