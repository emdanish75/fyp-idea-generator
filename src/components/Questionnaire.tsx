import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from '@/components/ui/use-toast';

const majors = [
  "Computer Science",
  "Software Engineering",
  "Information Technology",
  "Artificial Intelligence",
  "Data Science",
  "Cybersecurity",
  "Electrical Engineering",
  "Mechanical Engineering",
];

export interface QuestionnaireData {
  name: string;
  age: string;
  university: string;
  semester: string;
  major: string;
  interests: string;
  technicalSkills: string;
  problemSolvingStyle: string;
  preferredWorkStyle: string;
  projectScope: string;
}

interface QuestionnaireProps {
  onSubmit: (data: QuestionnaireData) => void;
  isLoading: boolean;
}

export function Questionnaire({ onSubmit, isLoading }: QuestionnaireProps) {
  const [formData, setFormData] = useState<QuestionnaireData>({
    name: '',
    age: '',
    university: '',
    semester: '',
    major: '',
    interests: '',
    technicalSkills: '',
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
      onSubmit(formData);
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
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground mb-6">Basic Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-secondary/50 border-secondary"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="bg-secondary/50 border-secondary"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="university">University</Label>
            <Input
              id="university"
              value={formData.university}
              onChange={(e) => setFormData({ ...formData, university: e.target.value })}
              className="bg-secondary/50 border-secondary"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="semester">Semester</Label>
            <Input
              id="semester"
              value={formData.semester}
              onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
              className="bg-secondary/50 border-secondary"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="major">Major</Label>
          <Select 
            value={formData.major}
            onValueChange={(value) => setFormData({ ...formData, major: value })}
          >
            <SelectTrigger className="bg-secondary/50 border-secondary">
              <SelectValue placeholder="Select your major" />
            </SelectTrigger>
            <SelectContent>
              {majors.map((major) => (
                <SelectItem key={major} value={major}>
                  {major}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-6">Skills & Interests</h2>

        <div className="space-y-2">
          <Label htmlFor="technicalSkills">Technical Skills</Label>
          <Textarea
            id="technicalSkills"
            value={formData.technicalSkills}
            onChange={(e) => setFormData({ ...formData, technicalSkills: e.target.value })}
            className="bg-secondary/50 border-secondary min-h-[100px]"
            placeholder="List your technical skills (e.g., programming languages, tools, frameworks)"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="interests">Interests</Label>
          <Textarea
            id="interests"
            value={formData.interests}
            onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
            className="bg-secondary/50 border-secondary min-h-[100px]"
            placeholder="What areas of technology interest you the most?"
            required
          />
        </div>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-6">Work Style</h2>

        <div className="space-y-2">
          <Label htmlFor="problemSolvingStyle">Problem-Solving Approach</Label>
          <Textarea
            id="problemSolvingStyle"
            value={formData.problemSolvingStyle}
            onChange={(e) => setFormData({ ...formData, problemSolvingStyle: e.target.value })}
            className="bg-secondary/50 border-secondary min-h-[100px]"
            placeholder="How do you typically approach complex problems?"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="preferredWorkStyle">Preferred Work Style</Label>
          <Textarea
            id="preferredWorkStyle"
            value={formData.preferredWorkStyle}
            onChange={(e) => setFormData({ ...formData, preferredWorkStyle: e.target.value })}
            className="bg-secondary/50 border-secondary min-h-[100px]"
            placeholder="Do you prefer working independently or in teams? Theory or practical implementation?"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="projectScope">Desired Project Scope</Label>
          <Textarea
            id="projectScope"
            value={formData.projectScope}
            onChange={(e) => setFormData({ ...formData, projectScope: e.target.value })}
            className="bg-secondary/50 border-secondary min-h-[100px]"
            placeholder="What kind of impact do you want your project to have?"
            required
          />
        </div>
      </div>

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