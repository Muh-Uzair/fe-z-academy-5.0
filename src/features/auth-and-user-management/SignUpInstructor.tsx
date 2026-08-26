"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

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
import { signupAction } from "@/services/auth/actions";
import useClientAction from "@/hooks/useClientAction";

const signUpInstructorSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters long."),
  email: z.email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
  bio: z.string().min(10, "Bio must be at least 10 characters long."),
  highestEducation: z
    .string()
    .min(2, "Highest education must be at least 2 characters long."),
  yearsOfExperience: z
    .number()
    .min(0, "Years of experience cannot be negative.")
    .max(60, "Years of experience looks too high."),
});

type SignUpInstructorFormValues = z.infer<typeof signUpInstructorSchema>;

const SignUpInstructor = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { run: runSignUpClientAction, isLoading: isLoadingSignUp } =
    useClientAction();

  const form = useForm<SignUpInstructorFormValues>({
    resolver: zodResolver(signUpInstructorSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      bio: "",
      highestEducation: "",
      yearsOfExperience: 0,
    },
  });

  const onSubmit = async (values: SignUpInstructorFormValues) => {
    const response = await runSignUpClientAction(() =>
      signupAction({
        ...values,
        role: "instructor",
      }),
    );

    if (response) {
      // Instructors do not get an OTP, they await manual admin approval.
      // We route them back to sign-in. The success toast will show the pending message.
      const params = new URLSearchParams({ email: values.email });
      router.push(`/signin?${params.toString()}`);
    }
  };

  const handleContinueWithGoogle = () => {
    console.log("instructor continuing with google");
  };

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <fieldset
          disabled={isLoadingSignUp || form.formState.isSubmitting}
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
                  Enter the name you want to show on your instructor profile.
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
                  This email will be used for your instructor account.
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
                    placeholder="Frontend instructor with a passion for practical teaching."
                    className="max-h-75 min-h-24"
                  />
                </FormControl>
                <FormDescription>
                  Add a short introduction for your instructor profile.
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
                    placeholder="Master of Computer Science"
                    autoComplete="organization-title"
                  />
                </FormControl>
                <FormDescription>
                  Share your highest completed education credential.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="yearsOfExperience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Years Of Experience</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min={0}
                    placeholder="5"
                    onChange={(event) =>
                      field.onChange(Number(event.target.value))
                    }
                  />
                </FormControl>
                <FormDescription>
                  Tell us how many years of teaching or industry experience you
                  have.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <AppButton
            type="submit"
            className="w-full"
            isLoading={isLoadingSignUp}
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
        </fieldset>
      </form>
    </Form>
  );
};

export default SignUpInstructor;
