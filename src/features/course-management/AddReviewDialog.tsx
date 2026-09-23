"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";

import AppButton from "@/components/AppButton";
import {
  Dialog,
  DialogContent,
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/utils/cn";
import useClientAction from "@/hooks/useClientAction";
import { createReviewAction } from "@/services/review/actions";

type AddReviewDialogProps = {
  courseId: string;
};

const AddReviewDialog = ({ courseId }: AddReviewDialogProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const { run: runCreateReview, isLoading } = useClientAction();

  const resetForm = () => {
    setRating(0);
    setFeedback("");
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      resetForm();
    }
  };

  const handleSubmitReview = async () => {
    const response = await runCreateReview(() =>
      createReviewAction({
        course: courseId,
        rating,
        feedback: feedback.trim(),
      }),
    );

    if (response?.status === "success") {
      handleOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <AppButton>Add review</AppButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader variant="create">
          <DialogTitle>Write a Review</DialogTitle>
          <DialogDescription>
            Share your thoughts about this course to help others.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <div className="grid gap-4 py-0">
            <div className="flex flex-col gap-2">
              <Label>Rating</Label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="focus:outline-none"
                    onClick={() => setRating(star)}
                  >
                    <Star
                      className={cn(
                        "h-6 w-6 cursor-pointer transition-colors",
                        rating >= star
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground hover:text-yellow-400",
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="feedback">Feedback</Label>
              <Textarea
                id="feedback"
                placeholder="Tell us what you liked or what could be improved..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <AppButton
            type="button"
            onClick={handleSubmitReview}
            disabled={!rating || feedback.trim().length < 10}
            isLoading={isLoading}
          >
            Submit review
          </AppButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddReviewDialog;
