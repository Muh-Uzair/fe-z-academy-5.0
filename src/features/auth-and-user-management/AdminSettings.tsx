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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bell, Camera, Lock } from "lucide-react";

// ─── SCHEMA (editable fields only) ───────────────────────────────────────────
const adminSettingsSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
});

type AdminSettingsFormValues = z.infer<typeof adminSettingsSchema>;

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const mockAdmin = {
  fullName: "Omar Abdullah",
  email: "omar.admin@z-academy.com",
  avatar: "https://i.pravatar.cc/150?u=admin01",
  role: "admin",
};

// CMP CMP CMP
const AdminSettings = () => {
  // VARS
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState(mockAdmin.avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials = mockAdmin.fullName
    .split(" ")
    .map((n) => n[0])
    .join("");

  const form = useForm<AdminSettingsFormValues>({
    resolver: zodResolver(adminSettingsSchema),
    mode: "onChange",
    defaultValues: {
      fullName: mockAdmin.fullName,
    },
  });

  // FUNCTIONS
  const onSubmit = (values: AdminSettingsFormValues) => {
    console.log("Admin profile info:", values);
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
        pageDescription="Manage your admin profile and preferences."
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
              <AvatarImage src={avatarPreview} alt={mockAdmin.fullName} />
              <AvatarFallback className="text-xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-sm font-medium">{mockAdmin.fullName}</p>
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Email – read only */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                <Lock className="h-3 w-3" /> Email
              </Label>
              <p className="text-sm font-medium text-muted-foreground">
                {mockAdmin.email}
              </p>
            </div>

            {/* Role – badge */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                <Lock className="h-3 w-3" /> Role
              </Label>
              <div>
                <Badge className="capitalize">{mockAdmin.role}</Badge>
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
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Omar Abdullah"
                        autoComplete="name"
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
              htmlFor="admin-notifications"
              className="text-sm font-medium cursor-pointer"
            >
              Notifications
            </Label>
            <Switch
              id="admin-notifications"
              checked={notificationsEnabled}
              onCheckedChange={handleNotificationToggle}
            />
          </div>
        </CardContent>
      </Card>
    </PageFlexCol>
  );
};

export default AdminSettings;
