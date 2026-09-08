import { loadStripe, type Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null> | undefined;

// loadStripe() must only be called once — reuse the same promise across the
// app instead of re-initializing Stripe.js on every render.
export function getStripe() {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!publishableKey) {
      throw new Error(
        "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set — Stripe.js cannot be loaded.",
      );
    }

    stripePromise = loadStripe(publishableKey);
  }

  return stripePromise;
}
