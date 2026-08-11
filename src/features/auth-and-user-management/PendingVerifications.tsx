"use client";

import { useState } from "react";

import AppButton from "@/components/AppButton";

import { Role } from "@/types/userTypes";

import PageFlexCol from "@/components/PageFlexCol";
import PageHeader from "../../../components/PageHeader";
import AppTable from "../../../components/AppTable";
import AppSearchBar from "@/components/AppSearchBar";
import TableImage from "@/components/TableImage";
import { Badge } from "@/components/ui/badge";

const data = [
  {
    _id: "6823f1a9c1d2e3f4a5b6c701",
    fullName: "Liam Anderson",
    email: "liam.anderson@example.com",
    highestEducation: "BS Computer Science",
    yearsOfExperience: 5,
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    isVerified: false,
    role: Role.Instructor,
  },
  {
    _id: "6823f1a9c1d2e3f4a5b6c702",
    fullName: "Emma Johnson",
    email: "emma.johnson@example.com",
    highestEducation: "BS Software Engineering",
    yearsOfExperience: 3,
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    isVerified: false,
    role: Role.Instructor,
  },
  {
    _id: "6823f1a9c1d2e3f4a5b6c703",
    fullName: "Noah Williams",
    email: "noah.williams@example.com",
    highestEducation: "MS Computer Science",
    yearsOfExperience: 7,
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    isVerified: false,
    role: Role.Instructor,
  },
];

const PendingVerifications = () => {
  const [search, setSearch] = useState("");

  const filteredData = data.filter((user) => {
    return (
      user.fullName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    );
  });

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
              onChange={(value: string) => setSearch(value)}
            />
          </div>
        }
        data={filteredData}
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
                <AppButton onClick={() => console.log("verify", row._id)}>
                  Verify
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

export default PendingVerifications;
