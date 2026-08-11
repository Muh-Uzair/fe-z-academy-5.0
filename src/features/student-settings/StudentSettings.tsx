"use client";

import PageHeader from "@/components/PageHeader";

import { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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
import { Bell, Camera, Lock } from "lucide-react";
import PageFlexCol from "@/components/PageFlexCol";

// ─── SCHEMA (editable fields only) ───────────────────────────────────────────
const studentSettingsSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  bio: z.string().min(10, "Bio must be at least 10 characters."),
  highestEducation: z
    .string()
    .min(2, "Highest education must be at least 2 characters."),
});

type StudentSettingsFormValues = z.infer<typeof studentSettingsSchema>;

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const mockStudent = {
  fullName: "Alex Johnson",
  email: "alex.johnson@example.com",
  bio: "Computer science student passionate about web development and open-source projects. Always looking to learn something new.",
  highestEducation: "Bachelor's",
  avatar: "https://i.pravatar.cc/150?u=user3",
  role: "student",
};

// CMP CMP CMP
const StudentSettings = () => {
  // VARS
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState(mockStudent.avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials = mockStudent.fullName
    .split(" ")
    .map((n) => n[0])
    .join("");

  const form = useForm<StudentSettingsFormValues>({
    resolver: zodResolver(studentSettingsSchema),
    mode: "onChange",
    defaultValues: {
      fullName: mockStudent.fullName,
      bio: mockStudent.bio,
      highestEducation: mockStudent.highestEducation,
    },
  });

  // FUNCTIONS
  const onSubmit = (values: StudentSettingsFormValues) => {
    console.log("Student profile info:", values);
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
      <PageHeader
        pageHeading="Settings"
        pageDescription="Manage your student profile and preferences."
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
              <AvatarImage src={avatarPreview} alt={mockStudent.fullName} />
              <AvatarFallback className="text-xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-sm font-medium">{mockStudent.fullName}</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="mr-2 h-4 w-4" />
                Edit Avatar
              </Button>
            </div>
          </div>

          <Separator />

          {/* NON-EDITABLE DISPLAY FIELDS */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Email – read only */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                <Lock className="h-3 w-3" /> Email
              </Label>
              <p className="text-sm font-medium text-muted-foreground">
                {mockStudent.email}
              </p>
            </div>

            {/* Role – badge */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                <Lock className="h-3 w-3" /> Role
              </Label>
              <div>
                <Badge variant="secondary" className="capitalize">
                  {mockStudent.role}
                </Badge>
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
                          placeholder="John Doe"
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
                          placeholder="Bachelor of Science"
                          autoComplete="organization-title"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                        placeholder="Tell us a little about yourself..."
                        className="min-h-24 max-h-48"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={form.formState.isSubmitting}>
                Save Changes
              </Button>
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
              htmlFor="student-notifications"
              className="text-sm font-medium cursor-pointer"
            >
              Notifications
            </Label>
            <Switch
              id="student-notifications"
              checked={notificationsEnabled}
              onCheckedChange={handleNotificationToggle}
            />
          </div>
        </CardContent>
      </Card>
    </PageFlexCol>
  );
};

export default StudentSettings;
