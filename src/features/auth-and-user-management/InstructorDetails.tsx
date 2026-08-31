"use client";

import { useState } from "react";
import { User } from "lucide-react";

import PageFlexCol from "@/components/PageFlexCol";
import PageHeader from "@/components/PageHeader";

import { Badge } from "@/components/ui/badge";
import InstructorVerificationBadge from "@/components/InstructorVerificationBadge";
import AppButton from "@/components/AppButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import TableImage from "@/components/TableImage";
import useClientAction from "@/hooks/useClientAction";
import { updateUserVerificationAction } from "@/services/user/actions";
import type { UserDetails } from "@/response-types/userResponseTypes";

type InstructorDetailsProps = {
  instructor: UserDetails;
};

const InstructorDetails = ({ instructor }: InstructorDetailsProps) => {
  const [verificationReason, setVerificationReason] = useState("");
  const { run: runRejectAction, isLoading: isRejecting } = useClientAction();
  const { run: runVerifyAction, isLoading: isVerifying } = useClientAction();

  const handleCancelVerification = async () => {
    const response = await runRejectAction(() =>
      updateUserVerificationAction(instructor._id, "instructor", {
        isVerified: false,
        verificationRejectionReason: verificationReason,
      }),
    );

    if (response && response.status === "success") {
      setVerificationReason("");
    }
  };

  const handleVerify = async () => {
    await runVerifyAction(() =>
      updateUserVerificationAction(instructor._id, "instructor", {
        isVerified: true,
      }),
    );
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
              <TableImage
                src={instructor.avatar}
                alt={instructor.fullName}
                shape="circle"
                fallbackIcon={User}
                className="h-20 w-20 border"
              />

              <div className="space-y-2">
                <div>
                  <CardTitle>{instructor.fullName}</CardTitle>

                  <CardDescription>{instructor.email}</CardDescription>
                </div>

                <div className="flex flex-wrap gap-2">
                  <InstructorVerificationBadge
                    isVerified={instructor.isVerified}
                  />

                  <Badge variant="outline">{instructor.role}</Badge>

                  <Badge variant="outline">
                    {instructor.yearsOfExperience} Years Experience
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Bio</p>

              <p className="text-sm leading-7">{instructor.bio}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Highest Education
                </p>

                <p className="font-medium">{instructor.highestEducation}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Years of Experience
                </p>

                <p className="font-medium">
                  {instructor.yearsOfExperience} Years
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
                {instructor.isVerified
                  ? "Verified Instructor"
                  : "Pending Verification"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Joined Platform
              </p>

              <p className="font-medium">
                {new Date(instructor.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Last Updated</p>

              <p className="font-medium">
                {new Date(instructor.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {instructor.isVerified ? (
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
              <p className="text-sm font-medium">
                Verification Rejection Reason
              </p>

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
              <AppButton
                variant="destructive"
                onClick={handleCancelVerification}
                disabled={!verificationReason.trim() || isRejecting}
                isLoading={isRejecting}
              >
                Cancel Verification
              </AppButton>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Verification Management</CardTitle>

            <CardDescription>
              This instructor is not verified yet. Approve their account to
              give them access to instructor features.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex justify-end">
            <AppButton
              onClick={handleVerify}
              disabled={isVerifying}
              isLoading={isVerifying}
            >
              Verify Instructor
            </AppButton>
          </CardContent>
        </Card>
      )}
    </PageFlexCol>
  );
};

export default InstructorDetails;
