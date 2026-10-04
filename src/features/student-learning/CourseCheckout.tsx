"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Star, Clock, Users, Check } from "lucide-react";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import AppButton from "@/components/AppButton";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import AppCourseCardsGridLayout from "@/components/AppCourseCardsGridLayout";

import { getStripe } from "@/lib/stripeClient";
import { createCoursePaymentIntentAction } from "@/services/course/actions";
import type { PublicCourseListItem } from "@/response-types/courseResponseTypes";
import type { SavedCard } from "@/response-types/cardResponseTypes";
import { formatCourseLevel } from "@/features/course-management/courseHelpers";
import { CreditCard, CheckCircle2, ShieldCheck } from "lucide-react";
import { cn } from "@/utils/cn";

type CourseCheckoutProps = {
  course: PublicCourseListItem;
  similarCourses: PublicCourseListItem[];
  savedCards?: SavedCard[];
};

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#0f172a",
      "::placeholder": { color: "#94a3b8" },
    },
    invalid: { color: "#dc2626" },
  },
};

const PaymentForm = ({
  course,
  savedCards = [],
}: {
  course: PublicCourseListItem;
  savedCards?: SavedCard[];
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isFetchingIntent, setIsFetchingIntent] = useState(true);
  const [intentError, setIntentError] = useState<string | null>(null);

  const [nameOnCard, setNameOnCard] = useState("");
  const [cardError, setCardError] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  // Payment mode: "saved" (if saved cards exist) or "new"
  const [paymentMode, setPaymentMode] = useState<"saved" | "new">(
    savedCards.length > 0 ? "saved" : "new",
  );
  const defaultCard = savedCards.find((c) => c.isDefault) || savedCards[0];
  const [selectedCardId, setSelectedCardId] = useState<string>(
    defaultCard?.id || "",
  );

  useEffect(() => {
    let cancelled = false;

    const fetchPaymentIntent = async () => {
      setIsFetchingIntent(true);
      setIntentError(null);

      try {
        const response = await createCoursePaymentIntentAction(course._id);

        if (cancelled) return;

        if (response.status !== "success") {
          setIntentError(response.message);
          return;
        }

        if (!response.data.clientSecret) {
          setIntentError("Unable to start checkout for this course.");
          return;
        }

        setClientSecret(response.data.clientSecret);
      } catch (err) {
        if (cancelled) return;
        console.error("createCoursePaymentIntentAction failed:", err);
        setIntentError("Unable to start checkout for this course.");
      } finally {
        if (!cancelled) setIsFetchingIntent(false);
      }
    };

    fetchPaymentIntent();

    return () => {
      cancelled = true;
    };
  }, [course._id]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !clientSecret) return;

    setIsConfirming(true);
    setCardError(null);

    let result;

    if (paymentMode === "saved" && selectedCardId) {
      result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: selectedCardId,
      });
    } else {
      if (!elements) {
        setIsConfirming(false);
        return;
      }

      const cardNumberElement = elements.getElement(CardNumberElement);
      if (!cardNumberElement) {
        setIsConfirming(false);
        return;
      }

      result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumberElement,
          billing_details: { name: nameOnCard },
        },
      });
    }

    setIsConfirming(false);

    if (result.error) {
      setCardError(result.error.message ?? "Payment failed. Please try again.");
      return;
    }

    if (result.paymentIntent?.status === "succeeded") {
      setIsSuccessOpen(true);
      setTimeout(() => {
        window.location.replace("/student/my-learning/enrolled-courses");
      }, 5000);
    }
  };

  const isFormDisabled =
    isFetchingIntent ||
    !!intentError ||
    isConfirming ||
    !stripe ||
    (paymentMode === "new" && !elements);

  const selectedCard = savedCards.find((c) => c.id === selectedCardId);

  return (
    <>
      <Card className="sticky top-6 border-2 shadow-lg">
        <CardHeader className="bg-muted/30 border-b pb-6">
          <CardTitle className="text-xl">Payment Details</CardTitle>
          <CardDescription>
            Complete your purchase to start learning.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {isFetchingIntent ? (
            <div className="space-y-5">
              <Skeleton className="h-14 w-full rounded-lg" />

              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-11 w-full" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-11 w-full rounded-md" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-11 w-full rounded-md" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-11 w-full rounded-md" />
                </div>
              </div>

              <Skeleton className="h-12 w-full rounded-md" />
            </div>
          ) : isSuccessOpen ? (
            <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
                <Check className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-semibold">Payment Successful</h3>
              <p className="text-muted-foreground text-sm">
                You are now enrolled in &quot;{course.title}&quot;. Redirecting
                to your courses...
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 flex justify-between items-center text-xl font-bold bg-primary/10 p-4 rounded-lg">
                <span className="text-primary">Total Amount</span>
                <span>${course.price}</span>
              </div>

              {intentError ? (
                <p className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                  {intentError}
                </p>
              ) : null}

              {/* Toggle Payment Mode if saved cards exist */}
              {savedCards.length > 0 && (
                <div className="mb-5 flex rounded-lg border bg-muted/30 p-1">
                  <button
                    type="button"
                    onClick={() => setPaymentMode("saved")}
                    className={cn(
                      "flex-1 py-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5",
                      paymentMode === "saved"
                        ? "bg-background text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <CreditCard className="h-3.5 w-3.5" />
                    Saved Cards ({savedCards.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMode("new")}
                    className={cn(
                      "flex-1 py-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5",
                      paymentMode === "new"
                        ? "bg-background text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    New Card
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {paymentMode === "saved" && savedCards.length > 0 ? (
                  <div className="space-y-3">
                    <Label className="text-xs text-muted-foreground">
                      Select Payment Card
                    </Label>
                    <div className="space-y-2">
                      {savedCards.map((card) => {
                        const isSelected = card.id === selectedCardId;
                        return (
                          <div
                            key={card.id}
                            onClick={() => setSelectedCardId(card.id)}
                            className={cn(
                              "flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all",
                              isSelected
                                ? "border-primary bg-primary/5 ring-1 ring-primary shadow-xs"
                                : "hover:border-border/80 bg-background",
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  "h-4 w-4 rounded-full border flex items-center justify-center transition-colors",
                                  isSelected
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-muted-foreground/40",
                                )}
                              >
                                {isSelected && (
                                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-sm capitalize">
                                    {card.brand}
                                  </span>
                                  <span className="font-mono text-sm text-muted-foreground">
                                    •••• {card.last4}
                                  </span>
                                  {card.isDefault && (
                                    <Badge
                                      variant="outline"
                                      className="text-[10px] text-emerald-600 dark:text-emerald-400 border-emerald-500/30 px-1.5 py-0"
                                    >
                                      Default
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  Expires {card.expMonth}/{card.expYear}
                                </p>
                              </div>
                            </div>
                            <CreditCard className="h-5 w-5 text-muted-foreground/60" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="nameOnCard">Name on Card</Label>
                      <Input
                        id="nameOnCard"
                        placeholder="John Doe"
                        value={nameOnCard}
                        onChange={(event) =>
                          setNameOnCard(event.target.value)
                        }
                        className="h-11"
                        required={paymentMode === "new"}
                        disabled={isFormDisabled}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Card Number</Label>
                      <div className="rounded-md border px-3 py-3">
                        <CardNumberElement
                          options={{
                            ...CARD_ELEMENT_OPTIONS,
                            disabled: isFormDisabled,
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Expiry Date</Label>
                        <div className="rounded-md border px-3 py-3">
                          <CardExpiryElement
                            options={{
                              ...CARD_ELEMENT_OPTIONS,
                              disabled: isFormDisabled,
                            }}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>CVC</Label>
                        <div className="rounded-md border px-3 py-3">
                          <CardCvcElement
                            options={{
                              ...CARD_ELEMENT_OPTIONS,
                              disabled: isFormDisabled,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {cardError ? (
                  <p className="text-sm text-destructive">{cardError}</p>
                ) : null}

                <AppButton
                  type="submit"
                  className="w-full h-12 text-md mt-6"
                  size="lg"
                  disabled={
                    isFormDisabled ||
                    (paymentMode === "new" && !nameOnCard.trim()) ||
                    (paymentMode === "saved" && !selectedCardId)
                  }
                  isLoading={isConfirming}
                >
                  {paymentMode === "saved" && selectedCard
                    ? `Pay $${course.price} with •••• ${selectedCard.last4}`
                    : `Buy Now • $${course.price}`}
                </AppButton>
              </form>

              <div className="mt-6 text-center">
                <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg border border-dashed flex items-center justify-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  Payments processed securely via Stripe with 256-bit encryption.
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
};

const CourseCheckout = ({
  course,
  similarCourses,
  savedCards,
}: CourseCheckoutProps) => {
  const stripePromise = useMemo(() => getStripe(), []);
  const router = useRouter();

  const similarCoursesGrid = similarCourses as any;

  return (
    <div className="container mx-auto py-10 px-4 space-y-12 max-w-6xl">
      <h1 className="text-3xl font-bold tracking-tight">Secure Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Left Column: Course Details */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="overflow-hidden border-2">
            <CardContent className="p-0">
              <AspectRatio ratio={16 / 9}>
                <Image
                  src={course.thumbnailUrl}
                  alt={course.title}
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </AspectRatio>

              <div className="p-6 md:p-8 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold">{course.title}</h2>
                    <p className="text-muted-foreground font-medium">
                      By {course.instructorDetails.fullName} &bull;{" "}
                      {course.categoryDetails.name}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="capitalize text-sm px-3 py-1 shrink-0"
                  >
                    {formatCourseLevel(course.level)}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground bg-muted/30 p-4 rounded-xl border">
                  <div className="flex items-center gap-1.5 text-yellow-500 font-medium">
                    <Star className="h-4 w-4 fill-current" />
                    <span>{course.averageRating.toFixed(1)}</span>
                    <span className="text-muted-foreground font-normal">
                      ({course.totalReviews} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-primary" />
                    <span>{course.totalStudentsEnrolled} students</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>
                      {Math.floor(course.totalDurationInMinutes / 60)}h{" "}
                      {course.totalDurationInMinutes % 60}m
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {course.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Checkout Form */}
        <div className="lg:col-span-2">
          <Elements stripe={stripePromise}>
            <PaymentForm course={course} savedCards={savedCards} />
          </Elements>
        </div>
      </div>

      <Separator />

      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Similar Courses You Might Like
          </h2>
          <p className="text-muted-foreground mt-1">
            Explore other courses in the same category.
          </p>
        </div>

        {similarCoursesGrid.length > 0 ? (
          <AppCourseCardsGridLayout
            courses={similarCoursesGrid}
            renderFooter={(similarCourse) => (
              <AppButton
                className="w-full"
                onClick={() =>
                  router.push(
                    `/course-details/${similarCourse._id}?role=student&source=browse`,
                  )
                }
              >
                View Details
              </AppButton>
            )}
          />
        ) : (
          <p className="text-muted-foreground text-center py-10 border rounded-xl border-dashed">
            No similar courses found.
          </p>
        )}
      </div>
    </div>
  );
};

export default CourseCheckout;
