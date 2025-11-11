'use client';
import { useState } from 'react';
import { useToast } from '@/hooks';
import { supabase } from '@/lib';
import { Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui';

type DeleteLinkDialogProps = {
  link: {
    id: number;
    label: string;
  };
  onLinkDeleted: () => void;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function DeleteLinkDialog({
  link,
  onLinkDeleted,
  trigger,
  open,
  onOpenChange,
}: DeleteLinkDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!link.id) {
      toast.error('Cannot delete link without an ID');
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase.from('links').delete().eq('id', link.id);

      if (error) throw error;

      toast.success('Link deleted successfully!');
      const handleClose = onOpenChange || setIsOpen;
      handleClose(false);
      onLinkDeleted();
    } catch (error) {
      toast.error('Failed to delete link. Please try again.');
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  const dialogOpen = open !== undefined ? open : isOpen;
  const handleOpenChange = onOpenChange || setIsOpen;

  return (
    <AlertDialog open={dialogOpen} onOpenChange={handleOpenChange}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Link</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{link.label}</strong>? This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            disabled={isDeleting}
            className='bg-destructive dark:text-primary hover:bg-destructive/90
              not-dark:text-white'
          >
            {isDeleting ? (
              <>
                <Loader2 className='animate-spin' />
                Deleting...
              </>
            ) : (
              'Delete Link'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
