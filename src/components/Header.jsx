"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "./ui/button";
import {
  ChevronDown,
  FileText,
  GraduationCap,
  LayoutDashboard,
  PenBox,
  StarsIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // <- Fix to use your actual UI wrapper, not Radix directly
import Link from "next/link";
import ModeToggle from "./toggle-mode";

const Header = () => {
  return (
    <div className="fixed top-0 left-0 w-full bg-transparent flex items-center justify-between px-4 z-50 lg:px-24 md:px-24 py-4">
      {/* Logo */}
      <Link href="/">
        <div>
          <h2 className="text-2xl font-bold">Job Sensei</h2>
        </div>
      </Link>

      {/* Right Side */}
      <div className="flex gap-2 items-center">
        <ModeToggle />

        {/* Signed In User View */}
        <SignedIn>
          <Link href="/dashboard">
            <Button>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span className="hidden md:block">Industry Insights</span>
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex items-center gap-2">
                <StarsIcon className="h-4 w-4" />
                <span className="hidden md:block">Tools</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 bg-black rounded-md p-2">
              <DropdownMenuItem asChild>
                <Link href="/resume/edit" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Build Resume
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/cover-letter" className="flex items-center gap-2">
                  <PenBox className="h-4 w-4" />
                  Cover Letter
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/roadmap" className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Roadmap Generation
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "w-9 h-9",
                userButtonPopoverCard: "shadow-xl",
                userPreviewMainIdentifier: "font-semibold",
              },
            }}
          />
        </SignedIn>

        {/* Signed Out View */}
        <SignedOut>
          <Link href="/sign-in">
            <Button className="bg-black text-white border border-gray-50 hover:text-black">
              Sign in
            </Button>
          </Link>
        </SignedOut>
      </div>
    </div>
  );
};

export default Header;
