"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { signinAction } from "@/services/auth/actions";
import useClientAction from "@/hooks/useClientAction";

const signInSchema = z.object({
  email: z.email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
});

type SignInFormValues = z.infer<typeof signInSchema>;

type SignInProps = {
  email?: string;
};

const SignIn = ({ email = "" }: SignInProps) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { run: runSignInClientAction, isLoading: isLoadingSignIn } =
    useClientAction();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
    defaultValues: {
      email: email.trim(),
      password: "",
    },
  });

  useEffect(() => {
    if (email) {
      form.setValue("email", email.trim(), { shouldValidate: true });
    }
  }, [email, form]);

  const onSubmit = async (values: SignInFormValues) => {
    const response = await runSignInClientAction(() => signinAction(values));

    if (response && response.status === "success") {
      const user = response.data.user;
      const dashboardRoutes = {
        admin: "/admin/dashboard",
        instructor: "/instructor/dashboard",
        student: "/student/dashboard",
      } as const;

      router.push(dashboardRoutes[user.role]);
    }
  };

  const handleContinueWithGoogle = () => {
    console.log("continuing with google");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Use your account credentials to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              noValidate
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
            >
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
                      Use the email address linked to your account.
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
                          autoComplete="current-password"
                          className="pr-10"
                        />
                        <AppButton
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="absolute top-1/2 right-1"
                          style={{ transform: "translateY(-50%)" }}
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
                      Password must be at least 8 characters long.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="text-right">
                <Link
                  href="/forget-password"
                  className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <AppButton
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
                isLoading={isLoadingSignIn}
              >
                Sign In
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
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
