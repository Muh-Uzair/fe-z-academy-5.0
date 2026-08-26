import { Spinner } from "@/components/ui/spinner";

const AppLoadingScreen = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Spinner className="size-6 text-primary" />
    </div>
  );
};

export default AppLoadingScreen;
