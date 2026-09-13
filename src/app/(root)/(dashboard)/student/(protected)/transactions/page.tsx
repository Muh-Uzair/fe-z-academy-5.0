import TransactionsTable from "@/features/transaction-management/TransactionsTable";
import { getTransactionsQuery } from "@/services/transaction/queries";
import type { Transaction } from "@/response-types/transactionResponseTypes";

type StudentTransactionsPageProps = {
  searchParams: Promise<{
    search?: string;
    page?: string;
    paymentStatus?: string;
  }>;
};

const PAYMENT_STATUSES: Transaction["paymentStatus"][] = [
  "pending",
  "paid",
  "failed",
  "refund_processing",
  "refunded",
];

const StudentTransactionsPage = async ({
  searchParams,
}: StudentTransactionsPageProps) => {
  const { search, page, paymentStatus } = await searchParams;

  const normalizedPaymentStatus = PAYMENT_STATUSES.includes(
    paymentStatus as Transaction["paymentStatus"],
  )
    ? (paymentStatus as Transaction["paymentStatus"])
    : undefined;

  const response = await getTransactionsQuery({
    search,
    page: page ? Number(page) : 1,
    paymentStatus: normalizedPaymentStatus,
  });

  return (
    <TransactionsTable
      basePath="/student/transactions"
      transactions={response.data.transactions}
      pagination={response.data.pagination}
      search={search ?? ""}
      paymentStatus={normalizedPaymentStatus ?? "all"}
      showStudentColumn={false}
    />
  );
};

export default StudentTransactionsPage;
