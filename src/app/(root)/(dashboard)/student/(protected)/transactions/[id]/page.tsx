import TransactionDetails from "@/features/transaction-management/TransactionDetails";
import { getTransactionDetailsQuery } from "@/services/transaction/queries";

type StudentTransactionDetailsPageProps = {
  params: Promise<{ id: string }>;
};

const StudentTransactionDetailsPage = async ({
  params,
}: StudentTransactionDetailsPageProps) => {
  const { id } = await params;
  const response = await getTransactionDetailsQuery(id);

  return (
    <TransactionDetails
      transaction={response.data.transaction}
      showFinancialBreakdown={false}
    />
  );
};

export default StudentTransactionDetailsPage;
