"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import AppButton from "@/components/AppButton";

import PageFlexCol from "@/components/PageFlexCol";
import AppSearchBar from "@/components/AppSearchBar";
import TableImage from "@/components/TableImage";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/PageHeader";
import AppTable from "@/components/AppTable";
import useClientAction from "@/hooks/useClientAction";
import { updateUserVerificationAction } from "@/services/user/actions";
import type {
  Pagination,
  UserDetails,
} from "@/response-types/userResponseTypes";

type PendingVerificationsProps = {
  instructors: UserDetails[];
  pagination: Pagination | null;
  search: string;
};

const PendingVerifications = ({
  instructors,
  pagination,
  search,
}: PendingVerificationsProps) => {
  const router = useRouter();
  const { run: runVerifyAction, isLoading: isVerifying } = useClientAction();
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const handleVerify = async (id: string) => {
    setVerifyingId(id);
    const response = await runVerifyAction(() =>
      updateUserVerificationAction(id, "instructor", { isVerified: true }),
    );
    setVerifyingId(null);

    if (response && response.status === "success") {
      router.refresh();
    }
  };

  const updateQuery = (next: { search?: string; page?: number }) => {
    const nextSearch = next.search ?? search;
    const nextPage = next.page ?? pagination?.page ?? 1;

    const searchParams = new URLSearchParams();
    if (nextSearch) searchParams.set("search", nextSearch);
    if (nextPage > 1) searchParams.set("page", String(nextPage));

    const query = searchParams.toString();
    router.push(
      `/admin/instructors/pending-verifications${query ? `?${query}` : ""}`,
    );
  };

  return (
    <PageFlexCol>
      <PageHeader
        pageHeading="Pending Instructor Verifications"
        pageDescription="Review and manage instructor applications awaiting approval."
      />

      <AppTable
        upperHeader={
          <div className="max-w-sm">
            <AppSearchBar
              placeholder="Search instructors by name or email..."
              defaultValue={search}
              onChange={(value: string) =>
                updateQuery({ search: value, page: 1 })
              }
            />
          </div>
        }
        data={instructors}
        columns={[
          {
            key: "avatar",
            label: "Avatar",
            render: (value: string, row: { fullName: string }) => (
              <TableImage src={value} alt={row.fullName} shape="circle" />
            ),
          },
          {
            key: "fullName",
            label: "Full Name",
            render: (value: string) => (
              <span className="font-medium">{value}</span>
            ),
          },
          {
            key: "email",
            label: "Email",
          },
          {
            key: "highestEducation",
            label: "Highest Education",
          },
          {
            key: "yearsOfExperience",
            label: "Experience",
            render: (value: number) => `${value} Years`,
          },
          {
            key: "isVerified",
            label: "Verified",
            render: (value: boolean) => (
              <>
                {!value && <Badge variant="destructive">Not verified</Badge>}
                {value && <Badge>Verified</Badge>}
              </>
            ),
          },
          {
            key: "role",
            label: "Role",
            render: (value: string) => (
              <span className="capitalize">{value}</span>
            ),
          },
          {
            key: "action",
            label: "Action",
            render: (_: unknown, row: { _id: string }) => (
              <div className="text-right">
                <AppButton
                  onClick={() => handleVerify(row._id)}
                  disabled={isVerifying}
                  isLoading={isVerifying && verifyingId === row._id}
                >
                  Verify
                </AppButton>
              </div>
            ),
          },
        ]}
        pagination={true}
        paginationMeta={pagination ?? undefined}
        onPageChange={(page) => updateQuery({ page })}
      />
    </PageFlexCol>
  );
};

export default PendingVerifications;
