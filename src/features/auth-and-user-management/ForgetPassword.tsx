"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { forgetPasswordAction } from "@/services/auth/actions";
import useClientAction from "@/hooks/useClientAction";

const forgetPasswordSchema = z.object({
  email: z.email("Please enter a valid email address."),
});

type ForgetPasswordFormValues = z.infer<typeof forgetPasswordSchema>;

const ForgetPassword = () => {
  const router = useRouter();
  const { run: runForgetPasswordAction, isLoading } = useClientAction();

  const form = useForm<ForgetPasswordFormValues>({
    resolver: zodResolver(forgetPasswordSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgetPasswordFormValues) => {
    const response = await runForgetPasswordAction(() =>
      forgetPasswordAction(values),
    );

    if (response && response.status === "success") {
      const params = new URLSearchParams({
        email: values.email,
        mode: "reset-password",
      });
      router.push(`/verify-otp?${params.toString()}`);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>
            Enter your account email and we&apos;ll send you an OTP to reset
            your password.
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

              <AppButton
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
                isLoading={isLoading}
              >
                Send OTP
              </AppButton>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgetPassword;
