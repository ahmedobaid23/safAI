"use client";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const { user } = useUser();
  if (user) {
    return (
      <div>
        Hello, {user.fullName}, {user.emailAddresses[0].emailAddress}
      </div>
    );
  }
  return <div>Landing Page</div>;
}
