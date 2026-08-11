"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import AppButton from "@/components/AppButton";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

const signUpStudentSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters long."),
  email: z.email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
  bio: z.string().min(10, "Bio must be at least 10 characters long."),
  highestEducation: z
    .string()
    .min(2, "Highest education must be at least 2 characters long."),
});

type SignUpStudentFormValues = z.infer<typeof signUpStudentSchema>;

// CMP CMP CMP
const SignUpStudent = () => {
  // VARS
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<SignUpStudentFormValues>({
    resolver: zodResolver(signUpStudentSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      bio: "",
      highestEducation: "",
    },
  });
  const router = useRouter();

  // FUNCTIONS
  const onSubmit = (values: SignUpStudentFormValues) => {
    console.log("student sign up", { ...values, role: "student" });
    router.push("/verify-otp");
  };

  const handleContinueWithGoogle = () => {
    console.log("student continuing with google");
  };

  return (
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
                <Input {...field} placeholder="John Doe" autoComplete="name" />
              </FormControl>
              <FormDescription>
                Enter the name you want to use on your student profile.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="user@example.com"
                  autoComplete="email"
                />
              </FormControl>
              <FormDescription>
                This email will be used for your student account.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="password123"
                    autoComplete="new-password"
                    className="pr-10"
                  />
                  <AppButton
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="absolute top-[6px] right-1"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </AppButton>
                </div>
              </FormControl>
              <FormDescription>
                Choose a password with at least 8 characters.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Computer science student passionate about web development."
                  className="max-h-75 min-h-24"
                />
              </FormControl>
              <FormDescription>
                Add a short introduction for your student profile.
              </FormDescription>
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
              <FormDescription>
                Share your current or completed education level.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <AppButton
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          Sign Up
        </AppButton>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-sm text-muted-foreground">
              Continue with Google
            </span>
            <Separator className="flex-1" />
          </div>

          <AppButton
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleContinueWithGoogle}
          >
            Continue with Google
          </AppButton>
        </div>
      </form>
    </Form>
  );
};

export default SignUpStudent;
