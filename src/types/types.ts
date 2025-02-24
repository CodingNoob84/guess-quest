import { Id } from "../../convex/_generated/dataModel";

// Define User Type
export type User = {
  _id: Id<"users">;
  name?: string;
  email?: string;
  image?: string;
  role?: "user" | "admin";
};

// Define Post Type
export type Post = {
  _id: Id<"posts">;
  userId: Id<"users">;
  answers: string[];
  images: { id: Id<"_storage">; title: string }[];
  type: string;
  tags: string[];
  successCount: number;
  failureCount: number;
  userUpdated: number;
  isVerified: boolean;
};
