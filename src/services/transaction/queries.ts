import "server-only";
import { cacheTag, cacheLife } from "next/cache";
import { apiClient } from "@/lib/apiClient";
import { buildQueryString } from "@/lib/buildQueryString";
import { TRANSACTION_TAGS } from "./tags";
import type {
  GetTransactionsResponse,
  GetTransactionDetailsResponse,
} from "@/response-types/transactionResponseTypes";

type GetTransactionsSuccessResponse = Extract<
  GetTransactionsResponse,
  { status: "success" }
>;
type GetTransactionDetailsSuccessResponse = Extract<
  GetTransactionDetailsResponse,
  { status: "success" }
>;

type GetTransactionsParams = {
  student?: string;
  course?: string;
  instructor?: string;
  paymentStatus?:
    | "pending"
    | "paid"
    | "failed"
    | "refund_processing"
    | "refunded";
  search?: string;
  projection?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

/**
 * Requires an authenticated session. Visibility is scoped by the caller's
 * role on the backend (no restrictTo gate, no role query param needed):
 * admins see every transaction, instructors see only transactions for their
 * own courses, students see only their own transactions.
 * Uses 'use cache: private' so the cache entry is scoped to the requesting
 * caller, based on the cookies read inside apiClient.
 */
export async function getTransactionsQuery(
  params: GetTransactionsParams = {},
): Promise<GetTransactionsSuccessResponse> {
  "use cache: private";
  cacheTag(TRANSACTION_TAGS.transactions);
  cacheLife("minutes");

  const query = buildQueryString(params);

  try {
    const res = await apiClient(`/transactions${query}`, {
      method: "GET",
    });
    const json: GetTransactionsResponse = await res.json();

    if (json.status !== "success") {
      throw new Error(json.message);
    }

    return json;
  } catch (err) {
    console.error("getTransactionsQuery failed:", err);
    throw err;
  }
}

/**
 * Requires an authenticated session. Admin can view any transaction;
 * instructor/student can only view a transaction where they are the
 * instructor/student on it (403 otherwise).
 * Uses 'use cache: private' so the cache entry is scoped to the requesting
 * caller, based on the cookies read inside apiClient.
 */
export async function getTransactionDetailsQuery(
  id: string,
): Promise<GetTransactionDetailsSuccessResponse> {
  "use cache: private";
  cacheTag(TRANSACTION_TAGS.transactionDetails(id));
  cacheLife("minutes");

  try {
    const res = await apiClient(`/transactions/${id}`, {
      method: "GET",
    });
    const json: GetTransactionDetailsResponse = await res.json();

    if (json.status !== "success") {
      throw new Error(json.message);
    }

    return json;
  } catch (err) {
    console.error("getTransactionDetailsQuery failed:", err);
    throw err;
  }
}
