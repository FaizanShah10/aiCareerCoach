'use client';

import { useSignIn } from "@clerk/nextjs";
import { useState } from "react";
import { FiUser, FiLock } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { Eye } from "lucide-react";

export default function CustomSignIn() {
  const { isLoaded, signIn } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [type, setType] = useState("password");

  const togglePassword = () => {
    setType((prev) => (prev === "password" ? "text" : "password"));
  };

  const handleSignIn = async () => {
    setError("");
    if (!isLoaded) return;

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        window.location.href = "/";
      } else {
        console.log("Additional steps required:", result);
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Sign-in failed");
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isLoaded) return;

    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Google sign-in failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-zinc-800 to-black px-4">
      <div className="w-full max-w-md p-6 backdrop-blur-md rounded-3xl shadow-xl border border-white/30">
        <h2 className="text-2xl font-bold text-center text-white mb-2">Login</h2>
        <p className="text-center text-white text-sm mb-6">Sign in to your account</p>

        {/* Google Sign-In */}
        <Button
          onClick={handleGoogleSignIn}
          variant="outline"
          className="w-full mb-4 rounded-xl text-white border-white hover:bg-white/10"
        >
          <FcGoogle className="mr-2" /> Continue with Google
        </Button>

        {/* Email */}
        <div className="mb-2">
          <Label htmlFor="email" className="text-white">Email</Label>
          <div className="relative">
            <FiUser className="absolute top-2.5 left-3 text-white text-md" />
            <Input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="pl-10 bg-white/30 text-white placeholder-white rounded-xl"
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-4">
          <Label htmlFor="password" className="text-white">Password</Label>
          <div className="relative">
            <FiLock className="absolute top-2.5 left-3 text-white text-md" />
            <div className="flex items-center">
              <Input
                id="password"
                type={type}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="pl-10 bg-white/30 text-white placeholder-white rounded-xl"
              />
              <span onClick={togglePassword} className="absolute right-3 cursor-pointer">
                <Eye size={16} />
              </span>
            </div>
          </div>
        </div>

        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

        {/* Sign In Button */}
        <Button
          onClick={handleSignIn}
          className="w-full rounded-xl text-sm text-black font-semibold bg-white hover:opacity-90"
        >
          SIGN IN
        </Button>

        <p className="text-center text-white mt-4 text-sm">
          Don't have an account?{" "}
          <Link href="/sign-up">
            <span className="font-semibold cursor-pointer hover:underline">Sign Up</span>
          </Link>
        </p>
      </div>
    </div>
  );
}
