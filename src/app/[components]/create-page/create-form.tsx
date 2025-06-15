import { LabeledInput } from '@/components/ui/input';
import { LabeledTextarea } from '@/components/ui/textarea';

export default function CreateForm() {
  return (
    <div className="flex flex-col gap-2 w-full mt-8">
      <LabeledInput label="Title" placeholder="Enter a title for your Seranote" required />
      <LabeledTextarea label="Message" placeholder="Write your message here..." required />
      <LabeledInput
        label="Email Address"
        type="email"
        placeholder="your@email.com"
        variant="minimal"
      />
    </div>
  );
}
