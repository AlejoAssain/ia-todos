import { useState, type FormEvent } from 'react';
import { createTask } from '../lib/api';
import { Button } from './ui/button';
import { Dialog } from './ui/dialog';
import { FieldShell, TextArea, TextInput } from './ui/form-field';

interface CreateTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: () => void;
}

export function CreateTaskDialog({
  isOpen,
  onClose,
  onTaskCreated,
}: CreateTaskDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setError(null);

      await createTask({
        description: description.trim() || undefined,
        title,
      });

      onClose();
      onTaskCreated();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Could not create the task.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog
      description="Add a title and, optionally, a short description. The backend will generate the first set of steps with AI."
      eyebrow="New task"
      isOpen={isOpen}
      onClose={onClose}
      title="Create a task"
    >
      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <FieldShell label="Title">
          <TextInput
            className="py-3"
            maxLength={50}
            minLength={3}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Plan my mom's birthday pizza"
            required
            type="text"
            value={title}
          />
        </FieldShell>

        <FieldShell label="Description optional">
          <TextArea
            maxLength={150}
            minLength={5}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Keep it simple, homemade, and ready before dinner."
            value={description}
          />
        </FieldShell>

        {error ? (
          <div className="rounded-2xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        ) : null}

        <div className="flex flex-wrap justify-end gap-3 pt-2">
          <Button onClick={onClose} variant="ghost">
            Cancel
          </Button>
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Creating...' : 'Create task'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
