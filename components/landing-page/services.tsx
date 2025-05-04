import React from "react";
import { ArrowRight, Sun } from "lucide-react";
import Link from "next/link";

const services = [
  {
    title: "AI-Powered Waste Detection",
    description:
      "SafAI leverages machine learning to detect and segment garbage in satellite images, enabling efficient environmental monitoring and large-scale waste identification.",
  },
  {
    title: "Real-Time Insights",
    description:
      "Receive processed satellite imagery with state-of-the-art segmentation results, helping cities and organizations tackle garbage issues quickly and efficiently.",
  },
  {
    title: "Scalable Coverage",
    description:
      "Analyze satellite data from urban or rural areas. SafAI scales to support environmental teams, municipalities, NGOs and related authorities with wide regional coverage.",
  },
];

const Services = () => {
  return (
    <section
      id="services"
      className="bg-[#F5F6F7] text-white min-h-screen flex flex-col px-4 md:px-8 py-12"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mt-10 md:mt-30">
          <div className="flex items-center gap-2 mb-10 md:mb-26">
            <Sun className="h-5 w-5 text-blue-500" />
            <span className="text-blue-500 font-medium uppercase tracking-wide text-sm">
              Our Services
            </span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="mb-20 flex flex-col md:flex-row md:justify-between md:items-end">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight max-w-4xl mb-7 md:mb-0">
            A Positive Impact for your Environment and the Planet
          </h1>
          <Link
            href="/sign-up"
            className="bg-green-500 hover:bg-green-600 text-black px-8 py-3 text-sm rounded-md flex items-center justify-center gap-2 transition-colors w-full md:w-[250px] mb-2"
          >
            Sign Up <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div className="flex flex-col" key={index}>
              <div className="flex md:flex-col gap-4 mb-4">
                <div className="bg-slate-900 p-4 rounded-md w-14 h-14 flex items-center justify-center shrink-0">
                  <svg
                    className="w-6 h-6 text-green-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2L3 7L12 12L21 7L12 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3 17L12 22L21 17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3 12L12 17L21 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-slate-900">
                  {service.title}
                </h2>
              </div>
              <p className="text-slate-700 text-base">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
