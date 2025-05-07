import { ArrowRight, Sun } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="bg-[#2F4252] text-white min-h-[90vh] flex flex-col">
      <div className="flex-1 flex flex-col justify-center px-6 xl:px-0 max-w-7xl mx-auto w-full">
        {/* Tagline */}
        <div className="flex items-center gap-2 mb-15 md:mb-25">
          <Sun className="w-5 h-5 text-white" />
          <span className="text-sm uppercase tracking-wider">
            SAFAI - Waste Management Solutions
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
          AI-Driven Garbage Detection Platform via Satellite Imagery
        </h1>

        {/* Description */}
        <p className="text-base sm:text-lg md:text-xl mb-8 max-w-2xl">
          We empower a cleaner, smarter future by combining cutting-edge AI with
          satellite imagery to tackle waste management challenges. Join us in
          making cities greener and cleaner, one detection at a time.
        </p>

        {/* Buttons */}
        <div className="flex flex-row sm:items-center gap-4">
          <Link
            href="/sign-up"
            className="bg-green-500 hover:bg-green-600 text-black font-medium py-3 px-8 rounded-md transition text-center"
          >
            Sign In
          </Link>
          <Link
            href="/dashboard"
            className="bg-green-500 hover:bg-green-600 text-black font-medium py-3 px-8 rounded-md transition flex items-center justify-center gap-2"
          >
            Get Demo
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
