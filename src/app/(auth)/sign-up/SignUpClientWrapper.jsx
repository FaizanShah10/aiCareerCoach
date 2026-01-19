"use client";

import dynamic from "next/dynamic";

const SignUpClient = dynamic(() => import("./SignUpClient"), {
  ssr: false,
});

export default function SignUpClientWrapper() {
  return <SignUpClient />;
}
