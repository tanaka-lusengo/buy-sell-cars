"use client";

import { useRouter } from "next/navigation";

import { signOut } from "@/src/server/actions/auth";
import { ButtonAsLink } from "@/src/components/ui";

export const SignOut = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <ButtonAsLink hoverEffect="color" onClick={handleLogout}>
      Sign Out
    </ButtonAsLink>
  );
};
