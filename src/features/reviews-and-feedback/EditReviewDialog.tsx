"use client";

import { Star } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import AppButton from "@/components/AppButton";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/utils/cn";
import useClientAction from "@/hooks/useClientAction";
import { updateReviewAction } from "@/services/review/actions";
import type { Review } from "@/response-types/reviewResponseTypes";

const formSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  feedback: z
    .string()
    .min(10, "Feedback must be at least 10 characters")
    .max(500, "Feedback is too long"),
});

type EditReviewDialogProps = {
  review: Review;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const EditReviewDialog = ({
  review,
  open,
  onOpenChange,
}: EditReviewDialogProps) => {
  const { run: runUpdateReview, isLoading } = useClientAction();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: review.rating,
      feedback: review.feedback,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const response = await runUpdateReview(() =>
      updateReviewAction(review._id, {
        rating: values.rating,
        feedback: values.feedback,
      })
    );

    if (response?.status === "success") {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Review</DialogTitle>
          <DialogDescription>
            Update your review and rating for this course.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col overflow-hidden">
            <DialogBody className="space-y-4">
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className="focus:outline-none"
                            onClick={() => field.onChange(star)}
                          >
                            <Star
                              className={cn(
                                "h-6 w-6 cursor-pointer transition-colors",
                                field.value >= star
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground hover:text-yellow-400"
                              )}
                            />
                          </button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="feedback"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Feedback</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us what you liked or what could be improved..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </DialogBody>
            <DialogFooter>
              <AppButton type="submit" isLoading={isLoading}>
                Save changes
              </AppButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditReviewDialog;
