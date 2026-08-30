import VerifyOtp from "@/features/auth-and-user-management/VerifyOtp";

type VerifyOtpPageProps = {
  searchParams: Promise<{ email?: string; mode?: string }>;
};

const VerifyOtpPage = async ({ searchParams }: VerifyOtpPageProps) => {
  const { email = "", mode = "" } = await searchParams;

  return <VerifyOtp email={email} mode={mode} />;
};

export default VerifyOtpPage;

