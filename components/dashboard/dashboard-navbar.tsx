"use client";
import { useUser, UserButton } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
// import { Button } from "./ui/button";
import Link from "next/link";
// import MobileSidebar from "./mobile-sidebar";

interface NavbarProps {
  title: string;
}

export default function Navbar(props: NavbarProps) {
  const { user } = useUser();
  return (
    <>
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
        <div className="flex items-center gap-4 w-auto">
          <h1 className="text-3xl font-bold whitespace-nowrap">
            {props.title}
          </h1>
        </div>

        {user ? (
          <div className="flex w-full justify-end">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-3">
                <UserButton />
                <div>
                  <p className="font-medium">{`${user?.firstName} ${user?.lastName}`}</p>
                  <p className="text-sm text-[#808191]">
                    {user?.emailAddresses[0].emailAddress}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Link
            href="/sign-in"
            className="flex items-center bg-[#4CD964] text-black font-medium py-2 px-4 rounded-md"
          >
            Sign In
            <ArrowRight size={18} className="ml-2" />
          </Link>
        )}
      </header>
    </>
  );
}
