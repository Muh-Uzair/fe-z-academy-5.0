import UserProfile from "@/features/auth-and-user-management/UserProfile";

const UserProfilePage = ({ params }: { params: { id: string } }) => {
  return <UserProfile userId={params.id} />;
};

export default UserProfilePage;
