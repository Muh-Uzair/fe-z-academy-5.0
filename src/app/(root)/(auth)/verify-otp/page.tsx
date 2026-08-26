import VerifyOtp from "@/features/auth-and-user-management/VerifyOtp";

type VerifyOtpPageProps = {
  searchParams?:
    | Promise<{ email?: string | string[] }>
    | { email?: string | string[] };
};

const VerifyOtpPage = async ({ searchParams }: VerifyOtpPageProps) => {
  const params = await Promise.resolve(searchParams ?? {});
  const email = Array.isArray(params.email)
    ? params.email[0] ?? ""
    : params.email ?? "";

  return <VerifyOtp email={email} />;
};

export default VerifyOtpPage;

