"use client";

import { useMemo, useState } from "react";
import { Lock, AlertCircle } from "lucide-react";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { getStripe } from "@/lib/stripeClient";
import useClientAction from "@/hooks/useClientAction";
import {
  createCardSetupIntentAction,
  setDefaultCardAction,
  revalidateSavedCardsAction,
} from "@/services/cards/actions";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "15px",
      color: "#0f172a",
      fontFamily: "var(--font-montserrat), sans-serif",
      "::placeholder": { color: "#94a3b8" },
    },
    invalid: { color: "#dc2626" },
  },
};

interface AddCardFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  isFirstCard: boolean;
}

const AddCardForm = ({
  onSuccess,
  onCancel,
  isFirstCard,
}: AddCardFormProps) => {
  const stripe = useStripe();
  const elements = useElements();

  const [cardholderName, setCardholderName] = useState("");
  const [setAsDefault, setSetAsDefault] = useState(isFirstCard);
  const [isConfirmingStripe, setIsConfirmingStripe] = useState(false);
  const [isCreatingSetupIntent, setIsCreatingSetupIntent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { run: runCardAction, isLoading: isCardActionLoading } =
    useClientAction();

  const isProcessing =
    isCreatingSetupIntent || isConfirmingStripe || isCardActionLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    if (!cardholderName.trim()) {
      setErrorMessage("Please enter the name on the card.");
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);
    if (!cardNumberElement) return;

    setErrorMessage(null);

    // 1. Request SetupIntent clientSecret from backend
    setIsCreatingSetupIntent(true);
    let setupResponse;
    try {
      setupResponse = await createCardSetupIntentAction();
    } catch {
      setErrorMessage("Unable to initialize card setup. Please try again.");
      setIsCreatingSetupIntent(false);
      return;
    }
    setIsCreatingSetupIntent(false);

    if (
      !setupResponse ||
      setupResponse.status !== "success" ||
      !setupResponse.data?.clientSecret
    ) {
      setErrorMessage(
        setupResponse?.message ||
          "Unable to initialize card setup. Please try again.",
      );
      return;
    }

    // 2. Confirm the card setup on Stripe directly
    setIsConfirmingStripe(true);
    const result = await stripe.confirmCardSetup(
      setupResponse.data.clientSecret,
      {
        payment_method: {
          card: cardNumberElement,
          billing_details: {
            name: cardholderName.trim(),
          },
        },
      },
    );
    setIsConfirmingStripe(false);

    if (result.error) {
      setErrorMessage(
        result.error.message ||
          "Card setup failed with Stripe. Please check your card details.",
      );
      return;
    }

    const paymentMethodId =
      typeof result.setupIntent?.payment_method === "string"
        ? result.setupIntent.payment_method
        : (result.setupIntent?.payment_method as { id?: string } | undefined)
            ?.id;

    // 3. Invalidate card tags and optionally set default via backend server actions
    if ((setAsDefault || isFirstCard) && paymentMethodId) {
      await runCardAction(() => setDefaultCardAction(paymentMethodId));
    } else {
      await runCardAction(() => revalidateSavedCardsAction());
    }

    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogBody className="space-y-4">
        {errorMessage && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="cardholderName" className="text-xs font-medium">
            Cardholder Name
          </Label>
          <Input
            id="cardholderName"
            placeholder="John Doe"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            disabled={isProcessing}
            required
            className="h-10"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Card Number</Label>
          <div className="rounded-md border bg-background px-3 py-2.5 shadow-xs focus-within:ring-2 focus-within:ring-ring focus-within:border-ring">
            <CardNumberElement
              options={{
                ...CARD_ELEMENT_OPTIONS,
                disabled: isProcessing,
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Expiry Date</Label>
            <div className="rounded-md border bg-background px-3 py-2.5 shadow-xs focus-within:ring-2 focus-within:ring-ring focus-within:border-ring">
              <CardExpiryElement
                options={{
                  ...CARD_ELEMENT_OPTIONS,
                  disabled: isProcessing,
                }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Security Code (CVC)</Label>
            <div className="rounded-md border bg-background px-3 py-2.5 shadow-xs focus-within:ring-2 focus-within:ring-ring focus-within:border-ring">
              <CardCvcElement
                options={{
                  ...CARD_ELEMENT_OPTIONS,
                  disabled: isProcessing,
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Checkbox
            id="setDefault"
            checked={setAsDefault}
            onCheckedChange={(checked) => setSetAsDefault(Boolean(checked))}
            disabled={isProcessing || isFirstCard}
          />
          <Label
            htmlFor="setDefault"
            className="text-xs font-medium cursor-pointer leading-snug"
          >
            Set as default payment method for future course enrollments
          </Label>
        </div>

        <div className="flex items-center gap-2 pt-1 text-[11px] text-muted-foreground">
          <Lock className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Encrypted with bank-grade 256-bit SSL via Stripe</span>
        </div>
      </DialogBody>

      <DialogFooter className="mt-4">
        <AppButton
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
        >
          Cancel
        </AppButton>
        <AppButton
          type="submit"
          isLoading={isProcessing}
          disabled={isProcessing || !stripe}
        >
          Save Card
        </AppButton>
      </DialogFooter>
    </form>
  );
};

export interface AddCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isFirstCard: boolean;
  onSuccess?: () => void;
}

export const AddCardDialog = ({
  open,
  onOpenChange,
  isFirstCard,
  onSuccess,
}: AddCardDialogProps) => {
  const stripePromise = useMemo(() => getStripe(), []);

  const handleSuccess = () => {
    onOpenChange(false);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader variant="create">
          <DialogTitle>Add Payment Card</DialogTitle>
          <DialogDescription>
            Enter your card details. We use bank-level encryption to secure your
            details.
          </DialogDescription>
        </DialogHeader>

        <Elements stripe={stripePromise}>
          <AddCardForm
            isFirstCard={isFirstCard}
            onSuccess={handleSuccess}
            onCancel={() => onOpenChange(false)}
          />
        </Elements>
      </DialogContent>
    </Dialog>
  );
};

export default AddCardDialog;
