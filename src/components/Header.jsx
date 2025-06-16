import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import { Button } from "./ui/button"
import {ChevronDown, FileText, GraduationCap, LayoutDashboard, PenBox, StarsIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import Link from "next/link"
import { checkUser } from "@/lib/CheckUser"
import ModeToggle from "./toggle-mode"



const Header = async () => {
  await checkUser()
  return (
    <>
      <div className="fixed top-0 left-0 w-full bg-transparent flex items-center justify-between z-50 lg:px-24 md:px-24 px-4 py-4">
        <div>    
          <h2>Logo</h2>
          
        </div>
        <div className="flex gap-2">
          <ModeToggle/>
          <SignedIn>
            <Link href='/dashboard'>
              <Button >
                <LayoutDashboard/>
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
                <DropdownMenuContent align="end" className="w-52 bg-black rounded-md h-52 space-y-10 p-2">
                  <DropdownMenuItem asChild>
                    <Link href="/resume/edit" className="flex items-center">
                      <FileText className="h-4 w-4" />
                      Build Resume
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/cover-letter"
                      className="flex items-center gap-2"
                    >
                      <PenBox className="h-4 w-4" />
                      Cover Letter
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/interview" className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Interview Prep
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
           
          </SignedIn>
            <SignedOut>
              <Button className="bg-black text-white border border-gray-50 hover:text-black">
                <SignInButton />
              </Button>
            </SignedOut>
            <SignedIn>
              <UserButton 
              appearance={{
                elements: {
                  avatarBox: 'w-9 h-9',
                  userButtonPopoverCard: "shadow-xl",
                  userPreviewMainIdentifier: "font-semibold"
                }
              }}
              afterSignOutUrl="/"
              />
            </SignedIn>
        </div>

      </div>
    </>
  )
}

export default Header
