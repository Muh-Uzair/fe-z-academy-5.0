import VerifyOtp from "@/features/auth-and-user-management/VerifyOtp";

type VerifyOtpPageProps = {
  searchParams?:
    | Promise<{ email?: string | string[]; mode?: string | string[] }>
    | { email?: string | string[]; mode?: string | string[] };
};

const VerifyOtpPage = async ({ searchParams }: VerifyOtpPageProps) => {
  const params = await Promise.resolve(searchParams ?? {});
  const email = Array.isArray(params.email)
    ? params.email[0] ?? ""
    : params.email ?? "";
  const mode = Array.isArray(params.mode)
    ? params.mode[0] ?? ""
    : params.mode ?? "";

  return <VerifyOtp email={email} mode={mode} />;
};

export default VerifyOtpPage;

