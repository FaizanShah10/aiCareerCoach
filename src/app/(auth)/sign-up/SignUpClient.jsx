"use client";

import { useSignUp, useClerk } from "@clerk/nextjs";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { toast } from "sonner";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { userSignUpSchema } from "@/models/schema";

export default function SignUpClient() {
  const { isLoaded, signUp } = useSignUp();
  const { setActive } = useClerk();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState<"text" | "password">("password");
  const [error, setError] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerificationSent, setIsVerificationSent] = useState(false);

  if (!isLoaded) return null;

  const handlePasswordToggle = () =>
    setType((p) => (p === "password" ? "text" : "password"));

  const handleSignUp = async () => {
    setError("");

    const validation = userSignUpSchema.safeParse({
      username,
      email,
      password,
    });

    if (!validation.success) {
      const msg = validation.error.errors[0]?.message ?? "Invalid input";
      setError(msg);
      toast.error(msg);
      return;
    }

    try {
      await signUp.create({
        emailAddress: email,
        password,
        username,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setIsVerificationSent(true);
      toast.info("Verification code sent to your email");
    } catch (err) {
      const msg =
        err?.errors?.[0]?.message ?? "Sign-up failed. Try again.";
      setError(msg);
      toast.error(msg);
    }
  };

  const handleVerifyCode = async () => {
    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });

        await fetch("/api/create-user", { method: "POST" });

        toast.success("Email verified");
        router.push("/onboarding");
      } else {
        toast.error("Invalid or expired code");
      }
    } catch (err) {
      toast.error(
        err?.errors?.[0]?.message ?? "Verification failed"
      );
    }
  };

  const handleGoogleSignUp = async () => {
    await signUp.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/",
      redirectUrlComplete: "/",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md p-6 rounded-2xl border">
        <h2 className="text-xl font-bold mb-4 text-center">Create Account</h2>

        <Button onClick={handleGoogleSignUp} className="w-full mb-4">
          <FcGoogle className="mr-2" /> Continue with Google
        </Button>

        {!isVerificationSent ? (
          <>
            <Label>Username</Label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} />

            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />

            <Label>Password</Label>
            <div className="relative">
              <Input
                type={type}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                onClick={handlePasswordToggle}
                className="absolute right-3 top-2 cursor-pointer"
              >
                <Eye size={16} />
              </span>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button onClick={handleSignUp} className="w-full mt-3">
              Sign Up
            </Button>
          </>
        ) : (
          <>
            <Label>Verification Code</Label>
            <Input
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            <Button onClick={handleVerifyCode} className="w-full mt-3">
              Verify
            </Button>
          </>
        )}

        <p className="text-center text-sm mt-4">
          Already have an account? <Link href="/sign-in">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
