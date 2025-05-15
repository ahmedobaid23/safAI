"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface ImageCarouselProps {
  images: string[];
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  const goToNext = useCallback(() => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, images.length]);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  const handleUseImage = () => {
    try {
      localStorage.setItem("galleryImage", images[currentIndex]);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving image to localStorage:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        goToNext();
      } else if (e.key === "ArrowLeft") {
        goToPrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [goToNext, goToPrevious]);

  return (
    <div className="relative">
      {/* Image container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
        <Image
          src={images[currentIndex] || "/placeholder.svg"}
          alt={`Satellite image ${currentIndex + 1}`}
          fill
          className="object-cover"
          priority
        />
        {/* Image indicators */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === currentIndex
                  ? "w-6 bg-[#4CD964]"
                  : "w-3 bg-white/70 hover:bg-white"
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="absolute inset-0 flex items-center justify-between px-4">
        <button
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className={`rounded-full bg-black/30 p-2 text-white hover:bg-black/50 transition ${
            currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          aria-label="Previous image"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={goToNext}
          disabled={currentIndex === images.length - 1}
          className={`rounded-full bg-black/30 p-2 text-white hover:bg-black/50 transition ${
            currentIndex === images.length - 1
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          aria-label="Next image"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Image counter */}
      <div className="absolute top-4 right-4 bg-black/50 text-white text-sm px-2 py-1 rounded">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Use this image button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleUseImage}
          className="bg-[#4CD964] text-black font-medium py-3 px-8 rounded-md hover:bg-green-600 transition-colors flex items-center gap-2 cursor-pointer z-10000"
        >
          Use this Image
        </button>
      </div>
    </div>
  );
}
