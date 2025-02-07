
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { QuestionnaireData } from '../Questionnaire';

interface WorkStyleProps {
  formData: Partial<QuestionnaireData>;
  setFormData: (data: any) => void;
}

export function WorkStyle({ formData, setFormData }: WorkStyleProps) {
  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-foreground mt-8 mb-6">Work Style</h2>

      <div className="space-y-4">
        <Label htmlFor="problemSolvingStyle">Problem-Solving Approach</Label>
        <Textarea
          id="problemSolvingStyle"
          value={formData.problemSolvingStyle || ''}
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
          value={formData.preferredWorkStyle || ''}
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
          value={formData.projectScope || ''}
          onChange={(e) => setFormData({ ...formData, projectScope: e.target.value })}
          className="bg-secondary/50 border-secondary min-h-[150px]"
          placeholder="What kind of impact do you want your project to have? Examples: Solving real-world problems, innovating in a specific industry, improving efficiency, raising awareness, benefiting a local community, advancing research, or building a scalable business solution. Example: 'I want to create a project that helps small businesses automate their workflows, saving them time and resources.'"
          required
        />
      </div>
    </div>
  );
}
