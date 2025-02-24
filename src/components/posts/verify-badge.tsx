import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "convex/react";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Badge } from "../ui/badge";

export const VerifyBadge = ({
  postId,
  isVerified,
}: {
  postId: Id<"posts">;
  isVerified: boolean;
}) => {
  const user = useQuery(api.users.currentUser);
  const updateVerified = useMutation(api.posts.updateVerified);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const isAdmin = user?.role === "admin";

  const handleToggle = async () => {
    if (!isAdmin || loading) return;

    setLoading(true);
    try {
      await updateVerified({
        postId: postId,
        isVerified: !isVerified,
      });

      toast({
        title: isVerified ? "❌ Unverified" : "✅ Verified",
        description: isVerified
          ? "Post has been unverified."
          : "Post has been verified successfully.",
      });
    } catch (error) {
      console.error("Verification toggle failed:", error);
      toast({
        title: "Error",
        description: "Failed to update verification status.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Badge
      variant={"outline"}
      className={
        isVerified
          ? "bg-green-100 text-green-800 text-xs cursor-pointer"
          : "bg-yellow-100 text-yellow-800 text-xs cursor-pointer"
      }
      onClick={isAdmin ? handleToggle : undefined}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
      ) : isVerified ? (
        <CheckCircle className="w-4 h-4 mr-1" />
      ) : (
        <XCircle className="w-4 h-4 mr-1" />
      )}
      {isVerified ? "Verified" : "Not Verified"}
    </Badge>
  );
};
