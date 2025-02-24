"use client";

import { SignInButton } from "@/components/auth/auth-buttons";
import React from "react";

function SignInPage() {
  return (
    <div className="w-screen h-screen">
      <div className="h-full w-full flex justify-center items-center">
        <SignInButton />
      </div>
    </div>
  );
}

export default SignInPage;
