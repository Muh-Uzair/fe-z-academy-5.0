import SignIn from "@/features/auth-and-user-management/SignIn";

type SignInPageProps = {
  searchParams?:
    | Promise<{ email?: string | string[] }>
    | { email?: string | string[] };
};

const SignInPage = async ({ searchParams }: SignInPageProps) => {
  const params = await Promise.resolve(searchParams ?? {});
  const email = Array.isArray(params.email)
    ? params.email[0] ?? ""
    : params.email ?? "";

  return <SignIn email={email} />;
};

export default SignInPage;

