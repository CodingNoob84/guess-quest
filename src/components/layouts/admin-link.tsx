"use client";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "../ui/button";
import Link from "next/link";

export const AdminLink = () => {
  const user = useQuery(api.users.currentUser);
  if (user) {
    if (user.role == "admin") {
      return (
        <Button asChild>
          <Link href="/admin">Admin</Link>
        </Button>
      );
    }
  }
  return null;
};
