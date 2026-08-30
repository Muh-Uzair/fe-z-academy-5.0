import ResetPassword from "@/features/auth-and-user-management/ResetPassword";

type ResetPasswordPageProps = {
  searchParams: Promise<{ otp?: string }>;
};

const ResetPasswordPage = async ({ searchParams }: ResetPasswordPageProps) => {
  const { otp = "" } = await searchParams;

  return <ResetPassword otp={otp} />;
};

export default ResetPasswordPage;
