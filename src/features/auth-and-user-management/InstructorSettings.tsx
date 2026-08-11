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
import { Bell, Camera, Lock, ShieldCheck } from "lucide-react";

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

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const mockInstructor = {
  fullName: "Sarah Mitchell",
  email: "sarah.mitchell@example.com",
  bio: "Senior software engineer and educator with 11 years of industry experience. Specialises in full-stack development, system design, and helping developers land their dream jobs.",
  highestEducation: "Bachelor's",
  yearsOfExperience: 11,
  avatar: "https://i.pravatar.cc/150?u=user8",
  isVerified: true,
  role: "instructor",
};

// CMP CMP CMP
const InstructorSettings = () => {
  // VARS
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState(mockInstructor.avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials = mockInstructor.fullName
    .split(" ")
    .map((n) => n[0])
    .join("");

  const form = useForm<InstructorSettingsFormValues>({
    resolver: zodResolver(instructorSettingsSchema),
    mode: "onChange",
    defaultValues: {
      fullName: mockInstructor.fullName,
      bio: mockInstructor.bio,
      highestEducation: mockInstructor.highestEducation,
      yearsOfExperience: mockInstructor.yearsOfExperience,
    },
  });

  // FUNCTIONS
  const onSubmit = (values: InstructorSettingsFormValues) => {
    console.log("Instructor profile info:", values);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    console.log("Avatar image details:", {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    });
    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);
  };

  const handleNotificationToggle = (checked: boolean) => {
    setNotificationsEnabled(checked);
    console.log(checked ? "Notification on" : "Notification off");
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
              <AvatarImage src={avatarPreview} alt={mockInstructor.fullName} />
              <AvatarFallback className="text-xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-sm font-medium">{mockInstructor.fullName}</p>
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

          {/* NON-EDITABLE DISPLAY FIELDS */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Email – read only */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                <Lock className="h-3 w-3" /> Email
              </Label>
              <p className="text-sm font-medium text-muted-foreground">
                {mockInstructor.email}
              </p>
            </div>

            {/* Role – badge */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                <Lock className="h-3 w-3" /> Role
              </Label>
              <div>
                <Badge variant="secondary" className="capitalize">
                  {mockInstructor.role}
                </Badge>
              </div>
            </div>

            {/* Verified – badge */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                Status
              </Label>
              <div>
                {mockInstructor.isVerified ? (
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

              <AppButton type="submit" disabled={form.formState.isSubmitting}>
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
