"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import React from "react";
import { Button } from "../ui/button";

export const SignInButton = () => {
  const { signIn } = useAuthActions();
  return <Button onClick={() => signIn("google")}>Sign in Google</Button>;
};

export const SignOutButton = () => {
  const { signOut } = useAuthActions();
  return <Button onClick={() => signOut()}>Log out</Button>;
};
