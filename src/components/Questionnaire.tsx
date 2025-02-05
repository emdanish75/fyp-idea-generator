import { useState } from 'react';
import { Button } from '@/components/ui/button';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Major</label>
          <input
            type="text"
            value={formData.major}
            onChange={(e) => setFormData({ ...formData, major: e.target.value })}
            className="w-full px-3 py-2 bg-dark-300 rounded-lg"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Interests</label>
          <textarea
            value={formData.interests}
            onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
            className="w-full px-3 py-2 bg-dark-300 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Technical Skills</label>
          <textarea
            value={formData.technicalSkills}
            onChange={(e) => setFormData({ ...formData, technicalSkills: e.target.value })}
            className="w-full px-3 py-2 bg-dark-300 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Project Scope</label>
          <textarea
            value={formData.projectScope}
            onChange={(e) => setFormData({ ...formData, projectScope: e.target.value })}
            className="w-full px-3 py-2 bg-dark-300 rounded-lg"
            required
          />
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Generating Ideas...' : 'Generate Project Ideas'}
      </Button>
    </form>
  );
}