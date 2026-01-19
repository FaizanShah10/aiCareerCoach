"use client";

import dynamic from "next/dynamic";

const SignInClient = dynamic(() => import("./SignInClient"), {
  ssr: false,
});

export default function SignInClientWrapper() {
  return <SignInClient />;
}
