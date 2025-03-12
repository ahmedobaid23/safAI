"use client";
import { useUser } from "@clerk/nextjs";
import { ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";
// import { Button } from "./ui/button";

const previousSegments = [
  { id: 1, name: "I-14, Islamabad" },
  { id: 2, name: "North Nazimabad, Karachi" },
  { id: 3, name: "Gulberg, Lahore" },
  { id: 4, name: "Phase 4, Bahria Town, Islamabad" },
  { id: 5, name: "H-12, Islamabad" },
];

export default function Sidebar() {
  const { user } = useUser();
  return (
    <div className="w-full bg-linear-to-b from-[#051C2F] to-[#105995] text-white p-6 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">safAI</h1>
      </div>

      <Link
        href="/dashboard"
        className="flex items-center justify-center gap-6 bg-[#4CD964] text-black font-medium py-3 px-4 rounded-md"
      >
        New Image
        <ArrowRight size={18} />
      </Link>

      <div className="flex-1 mt-8">
        <h2 className="text-sm font-medium text-gray-400 mb-4">
          Previous Segments
        </h2>
        {user ? (
          <nav>
            {previousSegments.map((segment) => (
              <Link
                key={segment.id}
                href="#"
                className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-white/10 rounded-md mb-1"
              >
                <MapPin className="h-5 w-5" />
                <span className="text-sm">{segment.name}</span>
              </Link>
            ))}
          </nav>
        ) : (
          <div>
            <Link
              href="/sign-in"
              className="flex items-center justify-center gap-6 bg-[#4CD964] text-black font-medium py-3 px-4 rounded-md"
            >
              Sign In
              <ArrowRight size={18} />
            </Link>

            <div className="mt-2 text-center text-sm">
              New User?{" "}
              <Link href="/sign-up" className="text-[#4CD964] hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
