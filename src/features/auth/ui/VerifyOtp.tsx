"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
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

const OTP_LENGTH = 6;

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");

  const handleVerifyOtp = () => {
    console.log(otp);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Verify OTP</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to your email address.
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

          <Button className="w-full" onClick={handleVerifyOtp}>
            Verify OTP
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyOtp;
