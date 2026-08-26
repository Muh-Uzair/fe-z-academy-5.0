"use client";

import { useState } from "react";
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
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { resendOtpAction, verifyOtpAction } from "@/services/auth/actions";
import useClientAction from "@/hooks/useClientAction";

const OTP_LENGTH = 6;

type VerifyOtpProps = {
  email?: string;
};

const VerifyOtp = ({ email = "" }: VerifyOtpProps) => {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const normalizedEmail = email.trim();
  const { run: runVerifyOtpAction, isLoading: isVerifyLoading } =
    useClientAction();
  const { run: runResendOtpAction, isLoading: isResendLoading } =
    useClientAction();

  const handleVerifyOtp = async () => {
    if (!normalizedEmail || otp.length !== OTP_LENGTH) return;

    const response = await runVerifyOtpAction(() =>
      verifyOtpAction({
        email: normalizedEmail,
        otp,
      }),
    );

    if (response) {
      const params = new URLSearchParams({ email: normalizedEmail });
      router.push(`/signin?${params.toString()}`);
    }
  };

  const handleResendOtp = async () => {
    if (!normalizedEmail) return;

    await runResendOtpAction(() =>
      resendOtpAction({
        email: normalizedEmail,
      }),
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Verify OTP</CardTitle>
          <CardDescription>
            {normalizedEmail
              ? `Enter the 6-digit code sent to ${normalizedEmail}.`
              : "Enter the 6-digit code sent to your email address."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <InputOTP
              maxLength={OTP_LENGTH}
              value={otp}
              onChange={setOtp}
              containerClassName="items-center justify-center gap-1.5"
            >
              <InputOTPGroup className="gap-1.5">
                {Array.from({ length: 3 }, (_, index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="h-9 w-8 rounded-md text-sm md:h-10 md:w-9"
                  />
                ))}
              </InputOTPGroup>
              <span className="px-0.5 text-xs text-muted-foreground">-</span>
              <InputOTPGroup className="gap-1.5">
                {Array.from({ length: 3 }, (_, index) => (
                  <InputOTPSlot
                    key={index + 3}
                    index={index + 3}
                    className="h-9 w-8 rounded-md text-sm md:h-10 md:w-9"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          <AppButton
            className="w-full"
            onClick={handleVerifyOtp}
            isLoading={isVerifyLoading}
            disabled={!normalizedEmail || otp.length !== OTP_LENGTH}
          >
            Verify OTP
          </AppButton>

          <AppButton
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleResendOtp}
            isLoading={isResendLoading}
            disabled={!normalizedEmail}
          >
            Resend OTP
          </AppButton>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyOtp;
