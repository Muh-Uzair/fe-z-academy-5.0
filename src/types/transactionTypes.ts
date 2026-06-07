export type PaymentStatus = "pending" | "paid" | "failed";

export interface Transaction {
  _id: string;
  transactionId: string;
  student: string;
  course: string;
  instructor: string;
  totalPrice: number;
  amountPaid: number;
  amountPaidAt: string | null;
  paymentStatus: PaymentStatus;
  adminCommissionPercentage: number;
  adminCommission: number;
  instructorRevenue: number;
  createdAt: string;
  updatedAt: string;
}
