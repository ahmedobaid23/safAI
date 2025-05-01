import Image from "next/image";
import { useEffect, useState } from "react";

export default function SegmentedImage() {
  const [segmentedImage, setSegmentedImage] = useState<string | null>(null);

  useEffect(() => {
    const storedImage = localStorage.getItem("segmentedImage");
    if (storedImage) {
      setSegmentedImage(storedImage);
    }
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      {segmentedImage && (
        <div className="mt-8">
          <div className="space-y-4">
            <div className="relative border rounded-lg overflow-hidden">
              <Image
                src={segmentedImage ?? ""}
                alt="Preview"
                width={800}
                height={450}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
