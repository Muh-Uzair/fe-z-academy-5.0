import TransactionDetails from "@/features/transaction-management/TransactionDetails";
import { getTransactionDetailsQuery } from "@/services/transaction/queries";

type InstructorTransactionDetailsPageProps = {
  params: Promise<{ id: string }>;
};

const InstructorTransactionDetailsPage = async ({
  params,
}: InstructorTransactionDetailsPageProps) => {
  const { id } = await params;
  const response = await getTransactionDetailsQuery(id);

  return <TransactionDetails transaction={response.data.transaction} />;
};

export default InstructorTransactionDetailsPage;
