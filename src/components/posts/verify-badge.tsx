import { CheckCircle, XCircle } from "lucide-react";
import { Badge } from "../ui/badge";
import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";

export const VerifyBadge = ({ isVerified }: { isVerified: boolean }) => {
  const user = useQuery(api.users.currentUser);
  const isAdmin = user?.role == "admin";

  const handleToggle = () => {
    console.log("toggle", isAdmin);
  };
  return (
    <Badge
      variant={isVerified ? "default" : "secondary"}
      className={
        isVerified
          ? "bg-green-100 text-green-800"
          : "bg-yellow-100 text-yellow-800"
      }
      onClick={isAdmin ? handleToggle : undefined}
    >
      {isVerified ? (
        <CheckCircle className="w-4 h-4 mr-1" />
      ) : (
        <XCircle className="w-4 h-4 mr-1" />
      )}
      {isVerified ? "Verified" : "Not Verified"}
    </Badge>
  );
};
