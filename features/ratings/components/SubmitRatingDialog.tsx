'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { StarRating } from './StarRating';
import { useRatings } from '../hooks/useRatings';

interface SubmitRatingDialogProps {
  appointmentId: string;
  doctorId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const SubmitRatingDialog: React.FC<SubmitRatingDialogProps> = ({
  appointmentId,
  doctorId,
  open,
  onOpenChange,
  onSuccess,
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { useSubmitRating } = useRatings();
  const submitMutation = useSubmitRating(appointmentId);

  const handleSubmit = async () => {
    if (rating === 0) return;

    await submitMutation.mutateAsync({
      rating,
      comment,
    });

    onOpenChange(false);
    onSuccess?.();
    // Reset state
    setRating(0);
    setComment('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Rate your experience</DialogTitle>
          <DialogDescription>
            How was your appointment today? Your feedback helps us improve our services.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-6">
          <div className="flex flex-col items-center justify-center space-y-4 py-4 bg-muted/30 rounded-xl border border-dashed border-muted-foreground/20">
            <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Overall Rating
            </Label>
            <StarRating
              rating={rating}
              onRatingChange={setRating}
              size="lg"
            />
            <p className="text-sm font-medium">
              {rating === 0 ? 'Select a rating' : `${rating} out of 5 stars`}
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="comment" className="text-sm font-semibold">
              Share more about your experience (optional)
            </Label>
            <Textarea
              id="comment"
              placeholder="Tell us what you liked or what we can improve..."
              className="resize-none min-h-[120px] bg-background focus:ring-primary/20 transition-all border-muted-foreground/20"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-between gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={rating === 0 || submitMutation.isPending}
            onClick={handleSubmit}
            className="flex-1 sm:flex-none px-8 font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
          >
            {submitMutation.isPending ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
