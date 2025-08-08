"use client";

import { useSignUp, useClerk } from "@clerk/nextjs";
import { useState } from "react";
import { FiUser, FiLock, FiAtSign } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { tree } from "next/dist/build/templates/app-page";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { userSignUpSchema } from "@/models/schema";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";




export default function CustomSignUp() {
  const { isLoaded, signUp } = useSignUp();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState('password')
  const [error, setError] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const router = useRouter();

  const { setActive } = useClerk();

  const handlePasswordToggle = () => {
    if(type === 'password'){
      setType('text')
    } else {
      setType('password')
    }
  }

  const handleSignUp = async () => {
    setError("");
    if (!isLoaded) return;

    const formData = {username, email, password} 

    const dataValidation = userSignUpSchema.safeParse(formData)

    if(!dataValidation.success){
      // If the data is not validate then take the first error we get starting from top and show it
      const firstError = dataValidation.error.errors[0]?.message
      setError(firstError)
      toast.error(firstError)
    }

    try {
      await signUp.create({ emailAddress: email, password, username });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setIsVerificationSent(true);
      toast.info("Verification Code Sent to Email!")
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Sign-up failed");
    }
  };

  const handleVerifyCode = async () => {
  try {
    setError("");

    const verificationResult = await signUp?.attemptEmailAddressVerification({
      code: verificationCode,
    });

    if (verificationResult?.status === "complete") {
      await setActive({ session: verificationResult.createdSessionId });

      toast.success("Email Verified Successfully!");

      // ✅ Now create user in DB
      const dbResponse = await fetch("/api/create-user", {
        method: "POST",
      });

      const result = await dbResponse.json();
      console.log("👤 User creation response:", result);

      if (result.status === "error") {
        toast.error("User DB creation failed: " + result.message);
      }

      router.push("/");
    } else {
      toast.error("Could not complete Verification, try again!");
    }
  } catch (error: any) {
    console.error("❌ Verification error:", error);
    setError(error.errors?.[0]?.message || "Verification failed");
  }
};



  const handleGoogleSignUp = async () => {
    if (!isLoaded) return;

    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/",
        redirectUrlComplete: "/",
      });
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Google sign-up failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-zinc-800 to-black px-4">
      <div className="w-full max-w-md p-6 backdrop-blur-md rounded-3xl shadow-xl border border-white/30">
        <h2 className="text-2xl font-bold text-center text-white mb-2">
          Create Account
        </h2>
        <p className="text-center text-white text-sm mb-6">
          Sign up to get started
        </p>

        {/* Google Sign-Up */}
        <Button
          onClick={handleGoogleSignUp}
          variant="outline"
          className="w-full mb-4 rounded-xl text-white border-white hover:bg-white/10"
        >
          <span>
            <FcGoogle />
          </span>
          Continue with Google
        </Button>

        {/* Username */}
        <div className="mb-2">
          <Label htmlFor="username" className="text-white">
            Username
          </Label>
          <div className="relative">
            <FiUser className="absolute top-2.5 left-3 text-white text-md" />
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="pl-10 bg-white/30 text-black placeholder-black rounded-xl"
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-2">
          <Label htmlFor="email" className="text-white">
            Email
          </Label>
          <div className="relative">
            <FiAtSign className="absolute top-2.5 left-3 text-white text-md" />
            <Input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="pl-10 bg-white/30 text-black placeholder-black rounded-xl"
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-4">
          <Label htmlFor="password" className="text-white">
            Password
          </Label>
          <div className="relative">
            <FiLock className="absolute top-2.5 left-3 text-white text-md" />
            <div className="flex items-center justify-between">
              <Input
              id="password"
              type={type}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="pl-10 bg-white/30 text-black placeholder-black rounded-xl"
            />
            <span onClick={handlePasswordToggle} className="absolute right-3 cursor-pointer"><Eye size={16}/></span>
            </div>
            
          </div>
        </div>

        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

        {/* Sign Up Button */}
        {!isVerificationSent ? (
          <Button
            onClick={handleSignUp}
            className="w-full rounded-xl text-black font-semibold bg-white hover:opacity-90"
          >
            SIGN UP
          </Button>
        ) : (
          <>
            <Label htmlFor="verificationCode" className="text-white">
              Verification Code
            </Label>
            <Input
              id="verificationCode"
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter the code sent to your email"
              className="mb-4 bg-white/30 text-black placeholder-black rounded-xl"
            />
            <Button onClick={handleVerifyCode}>Verify Email</Button>
          </>
        )}

        <p className="text-center text-white mt-4 text-sm">
          Already have an account?{" "}
          <Link href="/sign-in">
            <span className="font-semibold cursor-pointer hover:underline">
              Sign In
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
}
