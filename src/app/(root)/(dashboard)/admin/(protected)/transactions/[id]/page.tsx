import TransactionDetails from "@/features/transaction-management/TransactionDetails";
import { getTransactionDetailsQuery } from "@/services/transaction/queries";

type AdminTransactionDetailsPageProps = {
  params: Promise<{ id: string }>;
};

const AdminTransactionDetailsPage = async ({
  params,
}: AdminTransactionDetailsPageProps) => {
  const { id } = await params;
  const response = await getTransactionDetailsQuery(id);

  return <TransactionDetails transaction={response.data.transaction} />;
};

export default AdminTransactionDetailsPage;
