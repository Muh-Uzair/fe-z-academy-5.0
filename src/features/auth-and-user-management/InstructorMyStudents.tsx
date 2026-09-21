"use client";

import { useRouter } from "next/navigation";
import { User } from "lucide-react";

import PageFlexCol from "@/components/PageFlexCol";
import PageHeader from "@/components/PageHeader";
import AppTable from "@/components/AppTable";
import AppSearchBar from "@/components/AppSearchBar";
import TableImage from "@/components/TableImage";
import { Badge } from "@/components/ui/badge";
import AppButton from "@/components/AppButton";
import type {
  Pagination,
  UserDetails,
} from "@/response-types/userResponseTypes";

type InstructorMyStudentsProps = {
  students: UserDetails[];
  pagination: Pagination | null;
  search: string;
};

const InstructorMyStudents = ({
  students,
  pagination,
  search,
}: InstructorMyStudentsProps) => {
  const router = useRouter();

  const updateQuery = (next: { search?: string; page?: number }) => {
    const nextSearch = next.search ?? search;
    const nextPage = next.page ?? pagination?.page ?? 1;

    const searchParams = new URLSearchParams();
    if (nextSearch) searchParams.set("search", nextSearch);
    if (nextPage > 1) searchParams.set("page", String(nextPage));

    const query = searchParams.toString();
    router.push(`/instructor/my-students${query ? `?${query}` : ""}`);
  };

  return (
    <PageFlexCol>
      <PageHeader
        pageHeading="Students"
        pageDescription="Browse and manage all registered students on the platform."
      />

      <AppTable
        upperHeader={
          <div className="max-w-sm">
            <AppSearchBar
              placeholder="Search students by name or email..."
              defaultValue={search}
              onChange={(value: string) =>
                updateQuery({ search: value, page: 1 })
              }
            />
          </div>
        }
        data={students}
        columns={[
          {
            key: "avatar",
            label: "Avatar",
            render: (value: string | null, row: { fullName: string }) => (
              <TableImage
                src={value || ""}
                alt={row.fullName}
                shape="circle"
                fallbackIcon={User}
              />
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
            key: "isVerified",
            label: "Verified",
            render: (value: boolean) => (
              <>
                {value ? (
                  <Badge>Verified</Badge>
                ) : (
                  <Badge variant="destructive">Not Verified</Badge>
                )}
              </>
            ),
          },
          {
            key: "action",
            label: "Action",
            render: (_: unknown, row: UserDetails) => (
              <div className="text-right">
                <AppButton href={`/user-profile/${row._id}?role=${row.role}`}>
                  View Details
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

export default InstructorMyStudents;
