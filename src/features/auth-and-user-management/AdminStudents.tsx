"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import PageFlexCol from "@/components/PageFlexCol";
import PageHeader from "@/components/PageHeader";
import AppTable from "@/components/AppTable";
import AppSearchBar from "@/components/AppSearchBar";
import TableImage from "@/components/TableImage";
import { Badge } from "@/components/ui/badge";
import AppButton from "@/components/AppButton";
import { usersData } from "@/dummy-data/usersData";

const students = usersData.filter((u) => u.role === "student");

const AdminStudents = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const filteredStudents = students.filter(
    (u) =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

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
              onChange={(value: string) => setSearch(value)}
            />
          </div>
        }
        data={filteredStudents}
        columns={[
          {
            key: "avatar",
            label: "Avatar",
            render: (value: string | null, row: { fullName: string }) => (
              <TableImage
                src={
                  value ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(row.fullName)}&background=random`
                }
                alt={row.fullName}
                shape="circle"
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
            render: (_: unknown, row: { _id: string }) => (
              <div className="text-right">
                <AppButton onClick={() => router.push(`/user-profile/${row._id}`)}>
                  View Profile
                </AppButton>
              </div>
            ),
          },
        ]}
        pagination={true}
      />
    </PageFlexCol>
  );
};

export default AdminStudents;