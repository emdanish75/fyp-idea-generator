import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

export interface QuestionnaireData {
  major: string;
  interests: string;
  technicalSkills: string;
  projectScope: string;
}

interface QuestionnaireProps {
  onSubmit: (data: QuestionnaireData) => void;
  isLoading: boolean;
}

export function Questionnaire({ onSubmit, isLoading }: QuestionnaireProps) {
  const [formData, setFormData] = useState<QuestionnaireData>({
    major: '',
    interests: '',
    technicalSkills: '',
    projectScope: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-2xl mx-auto p-6 glass-morphism rounded-lg">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="major">Major</Label>
          <Input
            id="major"
            value={formData.major}
            onChange={(e) => setFormData({ ...formData, major: e.target.value })}
            className="bg-secondary/50 border-secondary"
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
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="technicalSkills">Technical Skills</Label>
          <Textarea
            id="technicalSkills"
            value={formData.technicalSkills}
            onChange={(e) => setFormData({ ...formData, technicalSkills: e.target.value })}
            className="bg-secondary/50 border-secondary min-h-[100px]"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="projectScope">Project Scope</Label>
          <Textarea
            id="projectScope"
            value={formData.projectScope}
            onChange={(e) => setFormData({ ...formData, projectScope: e.target.value })}
            className="bg-secondary/50 border-secondary min-h-[100px]"
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