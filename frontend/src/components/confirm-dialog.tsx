import { Dialog } from './ui/dialog';
import { Button } from './ui/button';

interface ConfirmDialogProps {
  confirmLabel: string;
  description: string;
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}

export function ConfirmDialog({
  confirmLabel,
  description,
  isOpen,
  isSubmitting,
  onClose,
  onConfirm,
  title,
}: ConfirmDialogProps) {
  return (
    <Dialog
      closeDisabled={isSubmitting}
      description={description}
      eyebrow="Confirm"
      isOpen={isOpen}
      maxWidthClassName="max-w-md"
      onClose={onClose}
      title={title}
    >
      <div className="mt-8 flex flex-wrap justify-end gap-3">
        <Button disabled={isSubmitting} onClick={onClose} variant="ghost">
          Cancel
        </Button>
        <Button
          disabled={isSubmitting}
          onClick={onConfirm}
          variant="danger"
        >
          {isSubmitting ? 'Deleting' : confirmLabel}
        </Button>
      </div>
    </Dialog>
  );
}
