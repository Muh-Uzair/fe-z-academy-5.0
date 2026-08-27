import ResetPassword from "@/features/auth-and-user-management/ResetPassword";

type ResetPasswordPageProps = {
  searchParams?:
    | Promise<{ otp?: string | string[] }>
    | { otp?: string | string[] };
};

const ResetPasswordPage = async ({ searchParams }: ResetPasswordPageProps) => {
  const params = await Promise.resolve(searchParams ?? {});
  const otp = Array.isArray(params.otp) ? params.otp[0] ?? "" : params.otp ?? "";

  return <ResetPassword otp={otp} />;
};

export default ResetPasswordPage;
