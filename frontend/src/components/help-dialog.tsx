import { Dialog } from './ui/dialog';
import { Button } from './ui/button';

interface HelpDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpDialog({ isOpen, onClose }: HelpDialogProps) {
  return (
    <Dialog
      eyebrow="Help"
      isOpen={isOpen}
      maxWidthClassName="max-w-lg"
      onClose={onClose}
      title="How to use IA Todos"
    >
      <div className="mt-7 space-y-3 text-sm leading-7 text-violet-100/72">
        <p>
          Create a task with a title. Add a description when you have extra
          context; otherwise IA Todos will infer it from the title.
        </p>
        <p>
          Click the number next to a step to mark it as done. Click it again to
          mark it as pending.
        </p>
        <p>
          Use Add step, Edit, and Delete to manage the generated steps after the
          AI creates them.
        </p>
      </div>

      <div className="mt-8 flex justify-end">
        <Button onClick={onClose}>Got it</Button>
      </div>
    </Dialog>
  );
}
