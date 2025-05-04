"use client";
import { useUser } from "@clerk/nextjs";
import { ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { name: "Dashboard", path: "/dashboard" },
  {
    name: "Blogs",
    path: "/blogs",
    children: [
      { name: "Explore Blogs", path: "/blogs/explore" },
      { name: "Favourites", path: "/blogs/favourites" },
    ],
  },
];

export default function Sidebar() {
  const { user } = useUser();
  const pathname = usePathname();
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (itemName: string) => {
    setOpenItems((prevState) => ({
      ...prevState,
      [itemName]: !prevState[itemName],
    }));
  };

  return (
    <div className="w-full bg-linear-to-b from-[#051C2F] to-[#105995] text-white p-6 flex flex-col">
      <div className="mb-8 flex items-center justify-center">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="SafAI Logo"
            width={75}
            height={75}
            priority
          />
        </Link>
      </div>

      <Link
        href="/dashboard"
        className="flex items-center justify-center gap-6 bg-[#4CD964] text-black font-medium py-3 px-4 rounded-md hover:bg-green-600"
      >
        New Image
        <ArrowRight size={18} />
      </Link>

      <div className="flex-1 mt-8">
        {user ? (
          <nav>
            {navItems.map((item) => {
              const hasChildren = item.children && item.children.length > 0;
              const isOpen = openItems[item.name] || false;
              const isActive =
                pathname === item.path ||
                (hasChildren &&
                  item.children?.some((child) => pathname === child.path));

              return (
                <div key={item.name} className="mb-1">
                  {hasChildren ? (
                    <>
                      <button
                        onClick={() => toggleItem(item.name)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-md ${
                          isActive
                            ? "bg-white/10 text-white"
                            : "text-gray-300 hover:bg-white/4 hover:text-white"
                        }`}
                      >
                        <span>{item.name}</span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isOpen && item.children && (
                        <div className="ml-4 mt-1 space-y-1 border-l border-white/10 pl-2">
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              href={child.path}
                              className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                                pathname === child.path
                                  ? "bg-white/10 text-white"
                                  : "text-gray-300 hover:bg-white/4 hover:text-white"
                              }`}
                            >
                              <span>{child.name}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.path}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                        pathname === item.path
                          ? "bg-white/10 text-white"
                          : "text-gray-300 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span>{item.name}</span>
                    </Link>
                  )}
                </div>
              );
            })}
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
