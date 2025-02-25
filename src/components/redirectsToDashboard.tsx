"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";

export default function RedirectToDashboard() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname(); 

  useEffect(() => {
    // Redirect only if user is on authentication pages
    if (isSignedIn && (pathname === "/sign-in" || pathname === "/sign-up")) {
      router.push("/dashboard");
    }
  }, [isSignedIn, pathname, router]);

  return null;
}
