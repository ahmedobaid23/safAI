import { MapPin } from "lucide-react";
import Link from "next/link";

const previousSegments = [
  { id: 1, name: "I-14, Islamabad" },
  { id: 2, name: "North Nazimabad, Karachi" },
  { id: 3, name: "Gulberg, Lahore" },
  { id: 4, name: "Phase 4, Bahria Town, Islamabad" },
  { id: 5, name: "H-12, Islamabad" },
];

export default function Sidebar() {
  return (
    <div className="w-64 bg-[#001529] text-white p-6 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">safAI</h1>
      </div>

      <div className="flex-1">
        <h2 className="text-sm font-medium text-gray-400 mb-4">
          Previous Segments
        </h2>
        <nav>
          {previousSegments.map((segment) => (
            <Link
              key={segment.id}
              href="#"
              className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-white/10 rounded-md mb-1"
            >
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{segment.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
