import SignIn from "@/features/auth-and-user-management/SignIn";

type SignInPageProps = {
  searchParams: Promise<{ email?: string }>;
};

const SignInPage = async ({ searchParams }: SignInPageProps) => {
  const { email = "" } = await searchParams;

  return <SignIn email={email} />;
};

export default SignInPage;

