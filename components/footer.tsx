import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#051C2F] to-[#105995] text-white py-12 px-4 md:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h2 className="text-green-500 text-2xl font-bold">safAI</h2>
            <p className="text-sm text-white">
              AI-Driven Garbage Detection
              <br />
              via Satellite Imagery
            </p>
            <p className="text-sm mt-4 pr-4">
              We empower a cleaner, smarter future by combining cutting-edge AI
              with satellite imagery to tackle waste management challenges.
            </p>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Services</h3>
            <ul className="space-y-2">
              <li>
                <p className="text-gray-300 transition-colors">
                  Garbage Detection
                </p>
              </li>
              <li>
                <p className="text-gray-300 transition-colors">
                  History Management
                </p>
              </li>
              <li>
                <p className="text-gray-300 transition-colors">
                  Report Generation
                </p>
              </li>
              <li>
                <p className="text-gray-300 transition-colors">
                  Comparison and Analytics
                </p>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Contact Info</h3>
            <p className="text-gray-300">
              Address: SEECS, H-12,
              <br />
              Islamabad, Pakistan
            </p>
            <p className="text-gray-300">
              <Link
                href="mailto:contact@safAI.com"
                className="hover:text-white transition-colors"
              >
                contact@safAI.com
              </Link>
            </p>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Newsletter</h3>
            <p className="text-sm text-gray-300">
              Subscribe to our newsletter to stay up-to-date with the latest
              news, tips, and trends in the industry.
            </p>
            <div className="flex mt-4">
              <input
                type="email"
                placeholder="Your Email"
                className="bg-white/10 border border-gray-600 rounded-l-md px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-[#4ade80]"
              />
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-black px-3 py-2 rounded-r-md transition-colors"
                aria-label="Subscribe to newsletter"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white my-8"></div>

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-white">
          <p>Copyright © 2024 safAI</p>
          <p className="mt-2 sm:mt-0">
            Designed and Developed with <span className="text-red-500">❤️</span>{" "}
            by Ahmed
          </p>
        </div>
      </div>
    </footer>
  );
}
