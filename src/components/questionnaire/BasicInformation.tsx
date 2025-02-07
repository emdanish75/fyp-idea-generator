
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QuestionnaireData } from '../Questionnaire';

interface BasicInformationProps {
  formData: Partial<QuestionnaireData>;
  setFormData: (data: any) => void;
  fieldofstudy: string[];
}

export function BasicInformation({ formData, setFormData, fieldofstudy }: BasicInformationProps) {
  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-foreground mb-6">Basic Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name || ''}
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
            value={formData.age || ''}
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
            value={formData.university || ''}
            onChange={(e) => setFormData({ ...formData, university: e.target.value })}
            className="bg-secondary/50 border-secondary"
            required
          />
        </div>
        
        <div className="space-y-4">
          <Label htmlFor="semester">Semester</Label>
          <Input
            id="semester"
            value={formData.semester || ''}
            onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
            className="bg-secondary/50 border-secondary"
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <Label htmlFor="major">Field of Study</Label>
        <Select 
          value={formData.major || ''}
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
    </div>
  );
}
