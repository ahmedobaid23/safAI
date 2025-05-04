import Image from "next/image";
import { useEffect, useState } from "react";

export default function Report() {
  const [image, setImage] = useState<string | null>(null);
  const [segmentedImage, setSegmentedImage] = useState<string | null>(null);
  useEffect(() => {
    const image = localStorage.getItem("image");
    const segmentedImage = localStorage.getItem("segmentedImage");
    if (image && segmentedImage) {
      setImage(image);
      setSegmentedImage(segmentedImage);
    }
  }, []);
  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="mt-8 space-y-4">
        <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0">
          <div className="flex-1 relative border rounded-lg overflow-hidden">
            <h2 className="text-lg font-semibold mb-2 text-center">Original</h2>
            <Image
              src={image ?? ""}
              alt="Original Preview"
              width={1200}
              height={675}
              className="w-full h-auto object-contain"
            />
          </div>
          <div className="flex-1 relative border rounded-lg overflow-hidden">
            <h2 className="text-lg font-semibold mb-2 text-center">
              Segmented
            </h2>
            <Image
              src={segmentedImage ?? ""}
              alt="Segmented Preview"
              width={1200}
              height={675}
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        <div className="border rounded-lg p-4 bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">Report Summary</h3>
          <p className="text-gray-700">
            The original image shows the selected area from the satellite
            imagery, while the segmented image highlights areas with potential
            garbage detected through the heatmap. The intensity of the colors in
            the heatmap correlates with the density of garbage presence.
          </p>
        </div>
      </div>
    </div>
  );
}
