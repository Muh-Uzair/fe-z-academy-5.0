import UserProfile from "@/features/user-profile/ui/UserProfile";

const UserProfilePage = ({ params }: { params: { id: string } }) => {
  return <UserProfile userId={params.id} />;
};

export default UserProfilePage;
