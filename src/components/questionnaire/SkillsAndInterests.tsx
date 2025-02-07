
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { QuestionnaireData } from '../Questionnaire';

interface SkillsAndInterestsProps {
  formData: Partial<QuestionnaireData>;
  setFormData: (data: any) => void;
}

export function SkillsAndInterests({ formData, setFormData }: SkillsAndInterestsProps) {
  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-foreground mt-8 mb-6">Skills & Interests</h2>

      <div className="space-y-4">
        <Label htmlFor="technicalSkills">Skills</Label>
        <Textarea
          id="technicalSkills"
          value={formData.skills || ''}
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
          value={formData.interests || ''}
          onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
          className="bg-secondary/50 border-secondary min-h-[150px]"
          placeholder="Describe your areas of interest. Examples: Artificial Intelligence, cybersecurity, fintech, renewable energy, psychology and human behavior, robotics, healthcare innovation, e-commerce, space exploration, game development, environmental science, etc."
          required
        />
      </div>
    </div>
  );
}
