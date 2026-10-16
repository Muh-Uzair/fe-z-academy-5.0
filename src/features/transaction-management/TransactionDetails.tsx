"use client";

import { useState } from "react";
import {
  BookOpen,
  Calendar,
  Check,
  Clock,
  Copy,
  GraduationCap,
  Mail,
  Receipt,
  ShieldCheck,
  User,
} from "lucide-react";

import PageFlexCol from "@/components/PageFlexCol";
import PageHeader from "@/components/PageHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatCourseLevel } from "@/features/course-management/courseHelpers";
import { PaymentStatusBadge, formatCurrency } from "./transactionHelpers";
import type { Transaction } from "@/response-types/transactionResponseTypes";

type TransactionDetailsProps = {
  transaction: Transaction;
  showFinancialBreakdown?: boolean;
};

const formatDateTime = (dateStr?: string | null) => {
  if (!dateStr) return "—";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  } catch {
    return dateStr;
  }
};

const TransactionDetails = ({
  transaction,
  showFinancialBreakdown = true,
}: TransactionDetailsProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    if (!transaction?.transactionId) return;
    navigator.clipboard.writeText(transaction.transactionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const course = transaction.courseDetails;
  const student = transaction.studentDetails;
  const instructor = transaction.instructorDetails;

  return (
    <PageFlexCol>
      <PageHeader
        pageHeading="Transaction Details"
        pageDescription="Review the complete billing, course, and participant details of this transaction."
        backButton
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content Area: Transaction reference, purchased course, and participants */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Transaction ID
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyId}
                    className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                    title="Copy Transaction ID"
                  >
                    {copied ? (
                      <>
                        <Check className="size-3 text-emerald-600" />
                        <span className="text-emerald-600 font-medium">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="font-mono text-base sm:text-lg font-semibold tracking-tight text-foreground select-all">
                  {transaction.transactionId}
                </p>
              </div>

              <div>
                <PaymentStatusBadge status={transaction.paymentStatus} />
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
              <Calendar className="size-3.5" />
              <span>Created on {formatDateTime(transaction.createdAt)}</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Purchased Course Section */}
            <div className="rounded-xl border border-border/60 bg-muted/20 p-4 sm:p-5">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Purchased Item
                </span>
                {course?.level && (
                  <Badge variant="outline" className="text-xs font-normal capitalize">
                    {formatCourseLevel(course.level)}
                  </Badge>
                )}
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex size-11 sm:size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <BookOpen className="size-5 sm:size-6" />
                </div>

                <div className="min-w-0 flex-1 space-y-1.5">
                  <h3 className="font-semibold text-base sm:text-lg text-foreground leading-snug">
                    {course?.title || "Course details unavailable"}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    {course?.totalDurationInMinutes ? (
                      <span className="flex items-center gap-1">
                        <Clock className="size-3.5" />
                        {course.totalDurationInMinutes} minutes
                      </span>
                    ) : null}
                    <span className="font-medium text-foreground">
                      Listed Price: {formatCurrency(course?.price ?? transaction.totalPrice, transaction.currency)}
                    </span>
                  </div>

                  {course?.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 pt-1">
                      {course.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Parties Involved Section */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Parties Involved
              </h4>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Student Box */}
                <div className="rounded-xl border border-border/60 p-4 bg-card hover:bg-muted/10 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-muted-foreground">
                      Student
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      <User className="size-3" />
                      Buyer
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 border border-border/50">
                      <AvatarImage
                        src={
                          student?.avatar ||
                          (student?.fullName
                            ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                student.fullName
                              )}&background=random`
                            : undefined)
                        }
                        alt={student?.fullName || "Student"}
                      />
                      <AvatarFallback>
                        {student?.fullName?.charAt(0) || "S"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm text-foreground truncate">
                        {student?.fullName || "Unknown Student"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                        <Mail className="size-3 shrink-0" />
                        <span className="truncate">{student?.email || "—"}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Instructor Box */}
                <div className="rounded-xl border border-border/60 p-4 bg-card hover:bg-muted/10 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-muted-foreground">
                      Instructor
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
                      <GraduationCap className="size-3" />
                      Teacher
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 border border-border/50">
                      <AvatarImage
                        src={
                          instructor?.avatar ||
                          (instructor?.fullName
                            ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                instructor.fullName
                              )}&background=random`
                            : undefined)
                        }
                        alt={instructor?.fullName || "Instructor"}
                      />
                      <AvatarFallback>
                        {instructor?.fullName?.charAt(0) || "I"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm text-foreground truncate">
                        {instructor?.fullName || "Unknown Instructor"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                        <Mail className="size-3 shrink-0" />
                        <span className="truncate">{instructor?.email || "—"}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Sidebar: Payment receipt & revenue split */}
        <Card className="h-fit">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Receipt className="size-4" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Payment Summary</CardTitle>
                <CardDescription className="text-xs">
                  Order receipt & billing status
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Course Price</span>
                <span className="font-medium text-foreground">
                  {formatCurrency(transaction.totalPrice, transaction.currency)}
                </span>
              </div>

              <div className="flex items-center justify-between text-muted-foreground">
                <span>Status</span>
                <PaymentStatusBadge status={transaction.paymentStatus} />
              </div>

              <div className="flex items-center justify-between text-muted-foreground">
                <span>Paid Date</span>
                <span className="font-medium text-foreground text-xs sm:text-sm text-right">
                  {formatDateTime(transaction.amountPaidAt)}
                </span>
              </div>

              {transaction.stripeChargeId && (
                <div className="flex items-center justify-between text-muted-foreground pt-0.5">
                  <span>Charge ID</span>
                  <span
                    className="font-mono text-xs text-foreground bg-muted/60 px-1.5 py-0.5 rounded truncate max-w-[130px]"
                    title={transaction.stripeChargeId}
                  >
                    {transaction.stripeChargeId}
                  </span>
                </div>
              )}
            </div>

            {/* Amount Paid Highlight Card */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Amount Paid</p>
                <p className="text-xl font-bold text-foreground">
                  {formatCurrency(transaction.amountPaid, transaction.currency)}
                </p>
              </div>
              <Badge variant="default" className="uppercase text-[10px] tracking-wide font-semibold">
                {transaction.currency}
              </Badge>
            </div>

            {showFinancialBreakdown ? (
              <>
                <Separator />

                <div className="space-y-2.5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Platform Split
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Instructor Revenue</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(
                        transaction.instructorRevenue,
                        transaction.currency
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Admin Commission ({transaction.adminCommissionPercentage}%)
                    </span>
                    <span className="font-medium text-foreground">
                      {formatCurrency(
                        transaction.adminCommission,
                        transaction.currency
                      )}
                    </span>
                  </div>
                </div>
              </>
            ) : null}

            <div className="rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="size-4 shrink-0 text-primary" />
              <span>Processed securely via Stripe Payments.</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageFlexCol>
  );
};

export default TransactionDetails;
