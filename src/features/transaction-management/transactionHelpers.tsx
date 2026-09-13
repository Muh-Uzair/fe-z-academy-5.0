import { Badge } from "@/components/ui/badge";
import type { Transaction } from "@/response-types/transactionResponseTypes";

export type PaymentStatus = Transaction["paymentStatus"];

const PAYMENT_STATUS_META: Record<
  PaymentStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  pending: { label: "Pending", variant: "secondary" },
  paid: { label: "Paid", variant: "default" },
  failed: { label: "Failed", variant: "destructive" },
  refund_processing: { label: "Refund Processing", variant: "outline" },
  refunded: { label: "Refunded", variant: "outline" },
};

export const PaymentStatusBadge = ({ status }: { status: PaymentStatus }) => {
  const meta = PAYMENT_STATUS_META[status];

  return <Badge variant={meta.variant}>{meta.label}</Badge>;
};

export const formatCurrency = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);
