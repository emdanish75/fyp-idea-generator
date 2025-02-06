import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from '@/components/ui/use-toast';

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
  const [formData, setFormData] = useState<QuestionnaireData>({
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
      <div className="space-y-5">
        <h2 className="text-2xl font-bold text-foreground mb-6">Basic Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-secondary/50 border-secondary"
              required
            />
          </div>
          
          <div className="space-y-4">
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
          <div className="space-y-4">
            <Label htmlFor="university">University</Label>
            <Input
              id="university"
              value={formData.university}
              onChange={(e) => setFormData({ ...formData, university: e.target.value })}
              className="bg-secondary/50 border-secondary"
              required
            />
          </div>
          
          <div className="space-y-4">
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

        <div className="space-y-4">
          <Label htmlFor="major">Field of Study</Label>
          <Select 
            value={formData.major}
            onValueChange={(value) => setFormData({ ...formData, major: value })}
          >
            <SelectTrigger className="bg-secondary/50 border-secondary">
              <SelectValue placeholder="Select your field of study" />
            </SelectTrigger>
            <SelectContent>
              {fieldofstudy.map((major) => (
                <SelectItem key={major} value={major}>
                  {major}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-6">Skills & Interests</h2>

        <div className="space-y-4">
          <Label htmlFor="technicalSkills">Skills</Label>
          <Textarea
            id="technicalSkills"
            value={formData.skills}
            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            className="bg-secondary/50 border-secondary min-h-[100px]"
            placeholder="List your key skills and expertise areas. Examples: Python, data analysis, UI/UX design, business strategy, 3D modeling, chemistry research, digital marketing, embedded systems, psychology studies, etc."
            required
          />
        </div>

        <div className="space-y-4">
          <Label htmlFor="interests">Interests</Label>
          <Textarea
            id="interests"
            value={formData.interests}
            onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
            className="bg-secondary/50 border-secondary min-h-[150px]"
            placeholder="Describe your areas of interest. Examples: Artificial Intelligence, cybersecurity, fintech, renewable energy, psychology and human behavior, robotics, healthcare innovation, e-commerce, space exploration, game development, environmental science, etc."
            required
          />
        </div>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-6">Work Style</h2>

        <div className="space-y-4">
          <Label htmlFor="problemSolvingStyle">Problem-Solving Approach</Label>
          <Textarea
            id="problemSolvingStyle"
            value={formData.problemSolvingStyle}
            onChange={(e) => setFormData({ ...formData, problemSolvingStyle: e.target.value })}
            className="bg-secondary/50 border-secondary min-h-[150px]"
            placeholder="Describe how you tackle complex problems. Examples: Breaking them into smaller steps, using data-driven analysis, brainstorming creative solutions, applying logical reasoning, experimenting with different approaches, collaborating with others, leveraging technology, etc. Example: 'I first break the problem into smaller parts, research possible solutions, and then test different approaches systematically to find the most efficient one.'"
            required
          />
        </div>

        <div className="space-y-4">
          <Label htmlFor="preferredWorkStyle">Preferred Work Style</Label>
          <Textarea
            id="preferredWorkStyle"
            value={formData.preferredWorkStyle}
            onChange={(e) => setFormData({ ...formData, preferredWorkStyle: e.target.value })}
            className="bg-secondary/50 border-secondary min-h-[150px]"
            placeholder="Describe your preferred work style. Examples: Working independently, collaborating in teams, leading projects, hands-on practical work, theoretical research, structured planning, flexible problem-solving, etc. Example: 'I enjoy working in teams where I can brainstorm ideas, but I prefer structured tasks with clear deadlines to stay productive.'"
            required
          />
        </div>

        <div className="space-y-4">
          <Label htmlFor="projectScope">Desired Project Scope</Label>
          <Textarea
            id="projectScope"
            value={formData.projectScope}
            onChange={(e) => setFormData({ ...formData, projectScope: e.target.value })}
            className="bg-secondary/50 border-secondary min-h-[150px]"
            placeholder="What kind of impact do you want your project to have? Examples: Solving real-world problems, innovating in a specific industry, improving efficiency, raising awareness, benefiting a local community, advancing research, or building a scalable business solution. Example: 'I want to create a project that helps small businesses automate their workflows, saving them time and resources.'"
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