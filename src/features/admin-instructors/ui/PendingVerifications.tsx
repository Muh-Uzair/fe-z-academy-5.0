"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Role } from "@/types/userTypes";
import PageFlexCol from "@/components/PageFlexCol";
import PageHeader from "./PageHeader";
import AppTable from "./AppTable";

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
            <Input
              placeholder="Search instructors by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white"
            />
          </div>
        }
        data={filteredData}
        columns={[
          {
            key: "avatar",
            label: "Avatar",
            render: (value: string, row: { fullName: string }) => (
              <img
                src={value}
                alt={row.fullName}
                className="h-10 w-10 rounded-full object-cover"
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
            render: (value: boolean) => (value ? "Yes" : "No"),
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
                <Button
                  size="sm"
                  onClick={() => console.log("verify", row._id)}
                >
                  Verify
                </Button>
              </div>
            ),
          },
        ]}
      />

    </PageFlexCol>
  );
};

export default PendingVerifications;
