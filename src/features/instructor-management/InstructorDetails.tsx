"use client";

import { useState } from "react";

import PageFlexCol from "@/components/PageFlexCol";
import PageHeader from "@/components/PageHeader";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

import { Role } from "@/types/userTypes";

import { usersData } from "@/dummy-data";

const dummyInstructor = usersData.find(u => u.role === Role.Instructor) || usersData[0];

const InstructorDetails = () => {
  const [verificationReason, setVerificationReason] = useState("");

  const handleCancelVerification = () => {
    console.log("cancel verification", {
      instructorId: dummyInstructor._id,
      verificationReason,
    });
  };

  return (
    <PageFlexCol>
      <PageHeader
        pageHeading="Instructor Details"
        pageDescription="Review instructor profile details and manage instructor verification status."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-start gap-4">
              <img
                src={dummyInstructor.avatar ?? ""}
                alt={dummyInstructor.fullName}
                className="h-20 w-20 rounded-full object-cover border"
              />

              <div className="space-y-2">
                <div>
                  <CardTitle>{dummyInstructor.fullName}</CardTitle>

                  <CardDescription>{dummyInstructor.email}</CardDescription>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge>
                    {dummyInstructor.isVerified ? "Verified" : "Not Verified"}
                  </Badge>

                  <Badge variant="outline">{dummyInstructor.role}</Badge>

                  <Badge variant="outline">
                    {dummyInstructor.yearsOfExperience} Years Experience
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Bio</p>

              <p className="text-sm leading-7">{dummyInstructor.bio}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Highest Education
                </p>

                <p className="font-medium">
                  {dummyInstructor.highestEducation}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Years of Experience
                </p>

                <p className="font-medium">
                  {dummyInstructor.yearsOfExperience} Years
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Meta</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Account Status
              </p>

              <p className="font-medium">
                {dummyInstructor.isVerified
                  ? "Verified Instructor"
                  : "Pending Verification"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Joined Platform
              </p>

              <p className="font-medium">
                {new Date(dummyInstructor.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Last Updated</p>

              <p className="font-medium">
                {new Date(dummyInstructor.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Verification Management</CardTitle>

          <CardDescription>
            Cancel instructor verification if the account no longer meets
            platform requirements.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Verification Rejection Reason</p>

            <Textarea
              value={verificationReason}
              onChange={(event) => setVerificationReason(event.target.value)}
              placeholder="Explain why the instructor verification is being cancelled."
              className="min-h-32"
            />

            <p className="text-sm text-muted-foreground">
              This message can later be shown to the instructor.
            </p>
          </div>

          <div className="flex justify-end">
            <Button
              variant="destructive"
              onClick={handleCancelVerification}
              disabled={!verificationReason.trim()}
            >
              Cancel Verification
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageFlexCol>
  );
};

export default InstructorDetails;
