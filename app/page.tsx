import Hero from "@/components/landing-page/hero";
import Problem from "@/components/landing-page/problem";
import Services from "@/components/landing-page/services";
import Connect from "@/components/landing-page/connect";
import Footer from "@/components/landing-page/footer";

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
