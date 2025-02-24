"use client";

import { useUser } from "@/hooks/use-user";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const { loading, user } = useUser();
  const router = useRouter(); // Use Next.js router

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user && user.role === "user") {
    router.push("/"); // Redirect if user is not an admin
    return null; // Prevent rendering
  }

  return <div>admin</div>;
}
