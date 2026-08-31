import { Badge } from "@/components/ui/badge";

interface InstructorVerificationBadgeProps {
  isVerified: boolean;
}

const InstructorVerificationBadge = ({
  isVerified,
}: InstructorVerificationBadgeProps) => {
  return isVerified ? (
    <Badge>Verified</Badge>
  ) : (
    <Badge variant="destructive">Not verified</Badge>
  );
};

export default InstructorVerificationBadge;
