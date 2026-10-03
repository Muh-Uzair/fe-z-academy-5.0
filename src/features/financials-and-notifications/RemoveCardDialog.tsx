"use client";

import { AlertCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import useClientAction from "@/hooks/useClientAction";
import { deleteSavedCardAction } from "@/services/cards/actions";
import type { SavedCard } from "@/response-types/cardResponseTypes";

export interface RemoveCardDialogProps {
  card: SavedCard | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const RemoveCardDialog = ({
  card,
  onClose,
  onSuccess,
}: RemoveCardDialogProps) => {
  const { run: runDeleteAction, isLoading: isDeleting } = useClientAction();

  const handleConfirmDelete = async () => {
    if (!card) return;
    const res = await runDeleteAction(() => deleteSavedCardAction(card.id));
    if (res?.status === "success") {
      onClose();
      onSuccess?.();
    }
  };

  return (
    <AlertDialog
      open={Boolean(card)}
      onOpenChange={(open) => !open && onClose()}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Remove Payment Card
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove your{" "}
            {card?.brand.toUpperCase()} card ending in{" "}
            <strong>{card?.last4}</strong>? You will need to re-enter this card
            if you wish to use it again.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isDeleting}
            onClick={(e) => {
              e.preventDefault();
              handleConfirmDelete();
            }}
          >
            {isDeleting ? "Removing..." : "Remove Card"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RemoveCardDialog;
