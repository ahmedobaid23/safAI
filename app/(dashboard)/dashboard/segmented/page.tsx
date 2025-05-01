"use client";

import Report from "@/components/report";
import SegmentedImage from "@/components/segmented-image";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export default function Page() {
  const [component, setComponent] = useState("segmented-image");
  const { isSignedIn } = useUser();

  return (
    <div>
      <div className="border-b">
        <div className="flex items-center justify-between px-6">
          <div>
            <button
              className={`py-4 ${
                component === "segmented-image"
                  ? "border-b-2 border-[#4CD964] font-medium"
                  : ""
              } mr-8 hover:cursor-pointer`}
              onClick={() => setComponent("segmented-image")}
            >
              Segmented Image
            </button>

            {isSignedIn && (
              <button
                className={`py-4 ${
                  component === "report"
                    ? "border-b-2 border-[#4CD964] font-medium"
                    : ""
                } mr-6 hover:cursor-pointer hover:opacity-70`}
                onClick={() => setComponent("report")}
              >
                Report
              </button>
            )}
          </div>
        </div>
      </div>

      {component === "segmented-image" ? (
        <SegmentedImage />
      ) : (
        isSignedIn && <Report />
      )}
    </div>
  );
}
