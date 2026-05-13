"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Role } from "@/types/userTypes";

const data = [
  {
    _id: "6823f1a9c1d2e3f4a5b6c701",
    fullName: "Liam Anderson",
    email: "liam.anderson@example.com",
    password: "hashed_password_1",
    bio: "Experienced full stack developer focused on scalable MERN applications.",
    highestEducation: "BS Computer Science",
    yearsOfExperience: 5,
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    isVerified: false,
    otp: null,
    otpExpires: null,
    role: Role.Instructor,
    createdAt: new Date("2025-01-10T10:20:30Z"),
    updatedAt: new Date("2025-01-12T08:15:00Z"),
  },
  {
    _id: "6823f1a9c1d2e3f4a5b6c702",
    fullName: "Emma Johnson",
    email: "emma.johnson@example.com",
    password: "hashed_password_2",
    bio: "Frontend engineer passionate about React and UI animations.",
    highestEducation: "BS Software Engineering",
    yearsOfExperience: 3,
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    isVerified: false,
    otp: "348921",
    otpExpires: new Date("2026-05-14T12:00:00Z"),
    role: Role.Instructor,
    createdAt: new Date("2025-02-02T09:00:00Z"),
    updatedAt: new Date("2025-02-05T11:45:00Z"),
  },
  {
    _id: "6823f1a9c1d2e3f4a5b6c703",
    fullName: "Noah Williams",
    email: "noah.williams@example.com",
    password: "hashed_password_3",
    bio: "Backend engineer experienced in APIs and distributed systems.",
    highestEducation: "MS Computer Science",
    yearsOfExperience: 7,
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    isVerified: false,
    otp: null,
    otpExpires: null,
    role: Role.Instructor,
    createdAt: new Date("2025-01-15T14:22:00Z"),
    updatedAt: new Date("2025-01-16T10:00:00Z"),
  },
  {
    _id: "6823f1a9c1d2e3f4a5b6c704",
    fullName: "Olivia Brown",
    email: "olivia.brown@example.com",
    password: "hashed_password_4",
    bio: "Creative UI/UX designer focused on accessibility and modern interfaces.",
    highestEducation: "Bachelors in Design",
    yearsOfExperience: 4,
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    isVerified: false,
    otp: "562781",
    otpExpires: new Date("2026-05-15T09:30:00Z"),
    role: Role.Instructor,
    createdAt: new Date("2025-03-01T12:00:00Z"),
    updatedAt: new Date("2025-03-03T15:20:00Z"),
  },
  {
    _id: "6823f1a9c1d2e3f4a5b6c705",
    fullName: "James Miller",
    email: "james.miller@example.com",
    password: "hashed_password_5",
    bio: "Cloud engineer working with AWS and Kubernetes infrastructure.",
    highestEducation: "BS Information Technology",
    yearsOfExperience: 6,
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    isVerified: false,
    otp: null,
    otpExpires: null,
    role: Role.Instructor,
    createdAt: new Date("2025-01-20T16:10:00Z"),
    updatedAt: new Date("2025-01-25T09:00:00Z"),
  },
  {
    _id: "6823f1a9c1d2e3f4a5b6c706",
    fullName: "Sophia Davis",
    email: "sophia.davis@example.com",
    password: "hashed_password_6",
    bio: "Software engineer building responsive and high-performance web apps.",
    highestEducation: "BS Computer Engineering",
    yearsOfExperience: 2,
    avatar: "https://randomuser.me/api/portraits/women/6.jpg",
    isVerified: false,
    otp: null,
    otpExpires: null,
    role: Role.Instructor,
    createdAt: new Date("2025-02-10T13:00:00Z"),
    updatedAt: new Date("2025-02-11T17:30:00Z"),
  },
  {
    _id: "6823f1a9c1d2e3f4a5b6c707",
    fullName: "Benjamin Wilson",
    email: "benjamin.wilson@example.com",
    password: "hashed_password_7",
    bio: "Experienced backend developer focused on scalable architecture.",
    highestEducation: "MS Software Engineering",
    yearsOfExperience: 8,
    avatar: "https://randomuser.me/api/portraits/men/7.jpg",
    isVerified: false,
    otp: "873421",
    otpExpires: new Date("2026-05-16T14:00:00Z"),
    role: Role.Instructor,
    createdAt: new Date("2025-04-05T11:11:00Z"),
    updatedAt: new Date("2025-04-06T12:12:00Z"),
  },
  {
    _id: "6823f1a9c1d2e3f4a5b6c708",
    fullName: "Ava Moore",
    email: "ava.moore@example.com",
    password: "hashed_password_8",
    bio: "MERN stack developer building modern SaaS platforms.",
    highestEducation: "BS Software Engineering",
    yearsOfExperience: 5,
    avatar: "https://randomuser.me/api/portraits/women/8.jpg",
    isVerified: false,
    otp: null,
    otpExpires: null,
    role: Role.Instructor,
    createdAt: new Date("2025-02-18T08:45:00Z"),
    updatedAt: new Date("2025-02-20T09:15:00Z"),
  },
  {
    _id: "6823f1a9c1d2e3f4a5b6c709",
    fullName: "William Taylor",
    email: "william.taylor@example.com",
    password: "hashed_password_9",
    bio: "Frontend engineer specializing in React and TypeScript.",
    highestEducation: "BS Media Sciences",
    yearsOfExperience: 4,
    avatar: "https://randomuser.me/api/portraits/men/9.jpg",
    isVerified: false,
    otp: null,
    otpExpires: null,
    role: Role.Instructor,
    createdAt: new Date("2025-03-10T10:10:10Z"),
    updatedAt: new Date("2025-03-12T08:30:00Z"),
  },
  {
    _id: "6823f1a9c1d2e3f4a5b6c710",
    fullName: "Mia Thomas",
    email: "mia.thomas@example.com",
    password: "hashed_password_10",
    bio: "React Native developer building cross-platform mobile applications.",
    highestEducation: "BS Information Systems",
    yearsOfExperience: 3,
    avatar: "https://randomuser.me/api/portraits/women/10.jpg",
    isVerified: false,
    otp: "219834",
    otpExpires: new Date("2026-05-17T10:30:00Z"),
    role: Role.Instructor,
    createdAt: new Date("2025-01-08T07:45:00Z"),
    updatedAt: new Date("2025-01-09T09:45:00Z"),
  },
  {
    _id: "6823f1a9c1d2e3f4a5b6c711",
    fullName: "Elijah Jackson",
    email: "elijah.jackson@example.com",
    password: "hashed_password_11",
    bio: "Senior backend engineer experienced with Node.js and PostgreSQL.",
    highestEducation: "BS Computer Science",
    yearsOfExperience: 9,
    avatar: "https://randomuser.me/api/portraits/men/11.jpg",
    isVerified: false,
    otp: null,
    otpExpires: null,
    role: Role.Instructor,
    createdAt: new Date("2025-02-22T15:00:00Z"),
    updatedAt: new Date("2025-02-24T16:45:00Z"),
  },
  {
    _id: "6823f1a9c1d2e3f4a5b6c712",
    fullName: "Charlotte White",
    email: "charlotte.white@example.com",
    password: "hashed_password_12",
    bio: "Cloud architect experienced in scalable infrastructure solutions.",
    highestEducation: "MS Software Engineering",
    yearsOfExperience: 10,
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    isVerified: false,
    otp: null,
    otpExpires: null,
    role: Role.Instructor,
    createdAt: new Date("2025-03-15T12:40:00Z"),
    updatedAt: new Date("2025-03-16T13:50:00Z"),
  },
  {
    _id: "6823f1a9c1d2e3f4a5b6c713",
    fullName: "Lucas Harris",
    email: "lucas.harris@example.com",
    password: "hashed_password_13",
    bio: "Junior frontend developer learning advanced React patterns.",
    highestEducation: "BS Information Technology",
    yearsOfExperience: 1,
    avatar: "https://randomuser.me/api/portraits/men/13.jpg",
    isVerified: false,
    otp: "654987",
    otpExpires: new Date("2026-05-18T18:00:00Z"),
    role: Role.Instructor,
    createdAt: new Date("2025-04-01T10:25:00Z"),
    updatedAt: new Date("2025-04-03T14:20:00Z"),
  },
  {
    _id: "6823f1a9c1d2e3f4a5b6c714",
    fullName: "Amelia Martin",
    email: "amelia.martin@example.com",
    password: "hashed_password_14",
    bio: "Database engineer with expertise in MongoDB and SQL systems.",
    highestEducation: "BS Computer Engineering",
    yearsOfExperience: 7,
    avatar: "https://randomuser.me/api/portraits/women/14.jpg",
    isVerified: false,
    otp: null,
    otpExpires: null,
    role: Role.Instructor,
    createdAt: new Date("2025-01-30T08:00:00Z"),
    updatedAt: new Date("2025-02-01T09:10:00Z"),
  },
  {
    _id: "6823f1a9c1d2e3f4a5b6c715",
    fullName: "Henry Walker",
    email: "henry.walker@example.com",
    password: "hashed_password_15",
    bio: "Passionate full stack engineer exploring modern JavaScript ecosystems.",
    highestEducation: "BS Software Engineering",
    yearsOfExperience: 2,
    avatar: "https://randomuser.me/api/portraits/men/15.jpg",
    isVerified: false,
    otp: "998877",
    otpExpires: new Date("2026-05-19T11:15:00Z"),
    role: Role.Instructor,
    createdAt: new Date("2025-03-20T17:30:00Z"),
    updatedAt: new Date("2025-03-22T18:45:00Z"),
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
    <section className="space-y-6 p-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Pending Instructor Verifications</h1>

        <p className="text-sm text-muted-foreground">
          Review and manage instructor applications awaiting approval.
        </p>
      </div>

      <div className="max-w-sm">
        <Input
          placeholder="Search instructors by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Avatar</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Highest Education</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredData.map((user) => (
              <TableRow key={user._id}>
                <TableCell>
                  <img
                    src={user.avatar || ""}
                    alt={user.fullName}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                </TableCell>

                <TableCell className="font-medium">{user.fullName}</TableCell>

                <TableCell>{user.email}</TableCell>

                <TableCell>{user.highestEducation}</TableCell>

                <TableCell>{user.yearsOfExperience} Years</TableCell>

                <TableCell>{user.isVerified ? "Yes" : "No"}</TableCell>

                <TableCell className="capitalize">{user.role}</TableCell>

                <TableCell className="text-right">
                  <Button size="sm">Verify</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>

          <PaginationItem>
            <PaginationLink href="#" isActive>
              1
            </PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </section>
  );
};

export default PendingVerifications;
