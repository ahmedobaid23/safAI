"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import ImageCarousel from "@/components/gallery/image-carousel";
import LoadingCarousel from "@/components/gallery/loading-carousel";
import Navbar from "@/components/dashboard/dashboard-navbar";

export default function GalleryPage() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/gallery");

        if (!response.ok) {
          throw new Error("Failed to fetch gallery images");
        }

        const data = await response.json();
        // console.log("Fetched images:", data);
        setImages(data.urls || []);
      } catch (error) {
        console.error("Error fetching gallery images:", error);
        toast.error("Failed to load gallery images. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title="Satellite Image Gallery" />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Select a Satellite Image
            </h2>

            {loading ? (
              <LoadingCarousel />
            ) : images.length > 0 ? (
              <ImageCarousel images={images} />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No images found in the gallery.</p>
                <p className="text-sm text-gray-400 mt-2">
                  Please upload images to your Supabase gallery bucket.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
