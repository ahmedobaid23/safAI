"use client";
import Connect from "@/components/connect";
import Footer from "@/components/footer";
import Hero from "@/components/hero";
// import LandingNavbar from "@/components/landing-navbar";
import Problem from "@/components/problem";
import Services from "@/components/services";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Hero />
      <Problem />
      <Services />
      <Connect />
      <Footer />
    </div>
  );
}
