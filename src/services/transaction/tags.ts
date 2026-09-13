export const TRANSACTION_TAGS = {
  transactions: "transactions",
  transactionDetails: (id: string) => `transaction-details-${id}`,
} as const;
