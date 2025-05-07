import Image from "next/image";
import Link from "next/link";

const LandingNavbar = () => {
  return (
    <header className="bg-linear-to-b from-[#051C2F] to-[#105995] py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="SafAI Logo"
            width={75}
            height={75}
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-green-500 hover:text-green-300 transition"
          >
            Home
          </Link>
          <Link
            href="#problem"
            className="text-white hover:text-green-600 transition"
          >
            Problem
          </Link>
          <Link
            href="#services"
            className="text-white hover:text-green-600 transition"
          >
            Our Services
          </Link>
          <Link
            href="#connect"
            className="text-white hover:text-green-600 transition"
          >
            Connect with Us
          </Link>
        </nav>

        <Link
          href="/sign-up"
          className="bg-green-500 hover:bg-green-600 text-black font-medium py-2 px-6 rounded-md transition"
        >
          Login/Register
        </Link>
      </div>
    </header>
  );
};

export default LandingNavbar;
