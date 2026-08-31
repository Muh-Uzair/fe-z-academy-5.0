import InstructorDetails from "@/features/auth-and-user-management/InstructorDetails";
import { getUserDetailsQuery } from "@/services/user/queries";

type InstructorDetailsPageProps = {
  params: Promise<{ id: string }>;
};

const AdminInstructorDetailsPage = async ({
  params,
}: InstructorDetailsPageProps) => {
  const { id } = await params;
  const response = await getUserDetailsQuery(id, "instructor");

  return <InstructorDetails instructor={response.data.user} />;
};

export default AdminInstructorDetailsPage;
