import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function Options({
  options,
  value,
  onChange,
}: {
  options: Array<{
    id: string;
    name: string;
    values: string[];
  }>;
  value: Record<string, string>;
  onChange: (v: Record<string, string>) => void;
}) {
  return (
    <div className="grid sm:grid-cols-2 gap-2 w-full">
      {options.map((option) => (
        <div key={option.id} className="flex flex-col gap-1 w-full">
          <Label className="text-sm font-medium">{option.name}</Label>
          <Select
            value={value[option.name] || ''}
            onValueChange={(val) => onChange({ ...value, [option.name]: val })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={`Select ${option.name}`} />
            </SelectTrigger>
            <SelectContent>
              {option.values.map((v) => (
                <SelectItem key={v} value={v}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
}
