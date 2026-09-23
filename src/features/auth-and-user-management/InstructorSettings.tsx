"use client";

import PageHeader from "@/components/PageHeader";
import PageFlexCol from "@/components/PageFlexCol";

import { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import AppButton from "@/components/AppButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bell, Camera, Lock, User } from "lucide-react";
import type { AuthUser } from "@/response-types/authResponseTypes";
import type { UploadAvatarResponse } from "@/response-types/userResponseTypes";
import { getInstructorOnboardingLinkAction } from "@/services/user/actions";
import { updateProfileAction, uploadAvatarAction } from "@/services/user/actions";
import useClientAction from "@/hooks/useClientAction";

// ─── SCHEMA (editable fields only) ───────────────────────────────────────────
const instructorSettingsSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  bio: z.string().min(10, "Bio must be at least 10 characters."),
  highestEducation: z
    .string()
    .min(2, "Highest education must be at least 2 characters."),
  yearsOfExperience: z
    .number("Must be a number")
    .min(0, "Years of experience cannot be negative.")
    .max(60, "Years of experience looks too high."),
});

type InstructorSettingsFormValues = z.infer<typeof instructorSettingsSchema>;

async function uploadImageToS3(
  uploadData: Extract<UploadAvatarResponse, { status: "success" }>["data"],
  file: File,
) {
  const formData = new FormData();
  Object.entries(uploadData.fields).forEach(([key, value]) => {
    formData.append(key, value);
  });
  formData.append("file", file);

  const res = await fetch(uploadData.uploadUrl, {
    method: "POST",
    body: formData,
  });

  return res.ok;
}

type InstructorSettingsProps = {
  user: AuthUser;
};

const InstructorSettings = ({ user }: InstructorSettingsProps) => {
  // VARS
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { run: runOnboardingAction, isLoading: isOnboardingLoading } =
    useClientAction();
  const { run: runUpdateAction, isLoading: isUpdateLoading } = useClientAction();

  const form = useForm<InstructorSettingsFormValues>({
    resolver: zodResolver(instructorSettingsSchema),
    mode: "onChange",
    defaultValues: {
      fullName: user.fullName,
      bio: user.bio,
      highestEducation: user.highestEducation,
      yearsOfExperience: user.yearsOfExperience,
    },
  });

  // FUNCTIONS
  const onSubmit = async (values: InstructorSettingsFormValues) => {
    const response = await runUpdateAction(async () => {
      let avatarKey: string | undefined;

      if (avatarFile) {
        const uploadResponse = await uploadAvatarAction({
          fileName: avatarFile.name,
          fileType: avatarFile.type as "image/jpeg" | "image/png",
        });

        if (uploadResponse.status !== "success") {
          return uploadResponse;
        }

        const uploaded = await uploadImageToS3(uploadResponse.data, avatarFile);

        if (!uploaded) {
          return {
            status: "error" as const,
            message: "Failed to upload avatar. Please try again.",
            data: null,
          };
        }

        avatarKey = uploadResponse.data.fields.key;
      }

      return updateProfileAction({
        fullName: values.fullName,
        bio: values.bio,
        highestEducation: values.highestEducation,
        yearsOfExperience: values.yearsOfExperience,
        ...(avatarKey ? { avatarKey } : {}),
      });
    });

    if (response?.status === "success") {
      setAvatarFile(null);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);
  };

  const handleNotificationToggle = (checked: boolean) => {
    setNotificationsEnabled(checked);
    console.log(checked ? "Notification on" : "Notification off");
  };

  const handleStripeOnboarding = async () => {
    const response = await runOnboardingAction(() =>
      getInstructorOnboardingLinkAction(),
    );

    if (response?.status === "success") {
      window.location.assign(response.data.url);
    }
  };

  return (
    <PageFlexCol>
      {/* PAGE HEADER */}
      <PageHeader
        pageHeading="Settings"
        pageDescription="Manage your instructor profile and preferences."
      />

      {/* ── CARD 1: PROFILE INFO ── */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Info</CardTitle>
          <CardDescription>
            Update your personal information. Email and role cannot be changed.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* AVATAR SECTION */}
          <div className="flex items-center gap-5">
            <Avatar className="h-20 w-20">
              {avatarPreview ? (
                <AvatarImage src={avatarPreview} alt={user.fullName} />
              ) : null}
              <AvatarFallback className="bg-muted">
                <User className="h-10 w-10 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-sm font-medium">{user.fullName}</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <AppButton
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="mr-2 h-4 w-4" />
                Edit Avatar
              </AppButton>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Stripe onboarding</p>
              <p className="text-sm text-muted-foreground">
                {user.stripeOnboardingComplete
                  ? "Your Stripe account is ready to receive course payouts."
                  : "Complete Stripe onboarding to receive course payouts."}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant={
                  user.stripeOnboardingComplete ? "default" : "secondary"
                }
              >
                {user.stripeOnboardingComplete ? "Complete" : "Incomplete"}
              </Badge>
              {!user.stripeOnboardingComplete && (
                <AppButton
                  type="button"
                  size="sm"
                  isLoading={isOnboardingLoading}
                  onClick={handleStripeOnboarding}
                >
                  Complete onboarding
                </AppButton>
              )}
            </div>
          </div>

          <Separator />

          {/* NON-EDITABLE DISPLAY FIELDS */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Email – read only */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                <Lock className="h-3 w-3" /> Email
              </Label>
              <p className="text-sm font-medium text-muted-foreground">
                {user.email}
              </p>
            </div>

            {/* Role – badge */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                <Lock className="h-3 w-3" /> Role
              </Label>
              <div>
                <Badge variant="secondary" className="capitalize">
                  {user.role}
                </Badge>
              </div>
            </div>

            {/* Verified – badge */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                Status
              </Label>
              <div>
                {user.isVerified ? (
                  <Badge>Verified</Badge>
                ) : (
                  <Badge variant="destructive">Unverified</Badge>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* EDITABLE FORM FIELDS */}
          <Form {...form}>
            <form
              noValidate
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
            >
              {/* Row 1 */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Jane Doe"
                          autoComplete="name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="highestEducation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Highest Education</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Master of Computer Science"
                          autoComplete="organization-title"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Years of experience */}
              <FormField
                control={form.control}
                name="yearsOfExperience"
                render={({ field }) => (
                  <FormItem className="w-full max-w-[49%]">
                    <FormLabel>Years of Experience</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        placeholder="5"
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : "",
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Bio */}
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Frontend instructor with a passion for practical teaching."
                        className="min-h-24 max-h-48"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <AppButton type="submit" isLoading={isUpdateLoading} disabled={form.formState.isSubmitting}>
                Save Changes
              </AppButton>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* ── CARD 2: NOTIFICATIONS ── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </CardTitle>
          <CardDescription>
            Control your notification preference.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label
              htmlFor="instructor-notifications"
              className="text-sm font-medium cursor-pointer"
            >
              Notifications
            </Label>
            <Switch
              id="instructor-notifications"
              checked={notificationsEnabled}
              onCheckedChange={handleNotificationToggle}
            />
          </div>
        </CardContent>
      </Card>
    </PageFlexCol>
  );
};

export default InstructorSettings;
