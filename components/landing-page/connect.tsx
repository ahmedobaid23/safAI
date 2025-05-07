import React from "react";
import { SunIcon, ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const teamMembers = [
  {
    name: "Ahmed Obaidullah",
    title: "Full Stack Developer",
    email: "aobaid.bese21seecs@seecs.edu.pk",
    linkedin: "https://www.linkedin.com/in/ahmed-obaidullah-975aa4231/",
    image: "/ahmed.jpeg",
  },
  {
    name: "M. Abdul Basit",
    title: "Machine Learning Engineer",
    email: "mbasit.bese21seecs@seecs.edu.pk",
    linkedin: "#",
    image: "/basit.jpeg",
  },
  {
    name: "Taimoor Sardar",
    title: "Machine Learning Engineer",
    email: "tsardar.bese21seecs@seecs.edu.pk",
    linkedin: "https://www.linkedin.com/in/taimoor-sardar/",
    image: "/taimoor.jpeg",
  },
];

const Connect = () => {
  return (
    <section
      id="connect"
      className="bg-gradient-to-b from-[#051C2F] to-[#105995] text-white py-16 px-4 md:px-8 min-h-screen flex flex-col items-center justify-center"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-2 text-sm uppercase tracking-wider text-sky-400 mb-6">
            <SunIcon className="h-5 w-5" />
            <span>Connect with us</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium mb-6">
            Contact us for more details
          </h1>

          <p className="max-w-2xl text-center text-gray-300">
            We offer innovative solution to detect and manage waste efficiently,
            helping you keep the environment clean and sustainable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <div key={member.name} className="flex flex-col">
              <div className="relative bg-gray-700/40 rounded-lg aspect-square mb-5">
                <Image
                  src={member.image}
                  alt="Preview"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>

              <h3 className="text-xl font-bold mb-1">{member.name}</h3>
              <p className="text-gray-300 mb-1">{member.title}</p>
              <p className="text-gray-400 text-sm mb-4">{member.email}</p>
              <Link
                href={member.linkedin}
                className="flex items-center gap-2 text-green-500 hover:text-green-600 transition-colors w-fit"
              >
                <span>LinkedIn</span>
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Connect;
