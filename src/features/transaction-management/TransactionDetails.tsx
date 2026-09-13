import { User } from "lucide-react";

import PageFlexCol from "@/components/PageFlexCol";
import PageHeader from "@/components/PageHeader";
import TableImage from "@/components/TableImage";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PaymentStatusBadge, formatCurrency } from "./transactionHelpers";
import type { Transaction } from "@/response-types/transactionResponseTypes";

type TransactionDetailsProps = {
  transaction: Transaction;
  showFinancialBreakdown?: boolean;
};

const TransactionDetails = ({
  transaction,
  showFinancialBreakdown = true,
}: TransactionDetailsProps) => {
  return (
    <PageFlexCol>
      <PageHeader
        pageHeading="Transaction Details"
        pageDescription="Review the full details of this course payment transaction."
        backButton
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="font-mono text-sm">
                  {transaction.transactionId}
                </CardTitle>
                <CardDescription>
                  {new Date(transaction.createdAt).toLocaleString()}
                </CardDescription>
              </div>
              <PaymentStatusBadge status={transaction.paymentStatus} />
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex items-start gap-4">
              <TableImage
                src={null}
                alt={transaction.courseDetails.title}
                shape="square"
                fallbackIcon={User}
                className="h-16 w-16 border"
              />

              <div>
                <p className="font-medium">{transaction.courseDetails.title}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {transaction.courseDetails.description}
                </p>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Student</p>
                <p className="font-medium">
                  {transaction.studentDetails.fullName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {transaction.studentDetails.email}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Instructor
                </p>
                <p className="font-medium">
                  {transaction.instructorDetails.fullName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {transaction.instructorDetails.email}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Total Price
              </p>
              <p className="font-medium">
                {formatCurrency(transaction.totalPrice, transaction.currency)}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Amount Paid
              </p>
              <p className="font-medium">
                {formatCurrency(transaction.amountPaid, transaction.currency)}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Paid At</p>
              <p className="font-medium">
                {transaction.amountPaidAt
                  ? new Date(transaction.amountPaidAt).toLocaleString()
                  : "—"}
              </p>
            </div>

            {showFinancialBreakdown ? (
              <>
                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Admin Commission
                  </p>
                  <p className="font-medium">
                    {formatCurrency(
                      transaction.adminCommission,
                      transaction.currency,
                    )}{" "}
                    ({transaction.adminCommissionPercentage}%)
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Instructor Revenue
                  </p>
                  <p className="font-medium">
                    {formatCurrency(
                      transaction.instructorRevenue,
                      transaction.currency,
                    )}
                  </p>
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </PageFlexCol>
  );
};

export default TransactionDetails;
