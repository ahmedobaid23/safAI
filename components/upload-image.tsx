"use client";

import type React from "react";

import { useState, useRef } from "react";
import Image from "next/image";
import { ArrowRight, Upload, X, Loader2 } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function UploadImage() {
  const [image, setImage] = useState<File | null>(null);
  const [location, setLocation] = useState<string>("");
  const [segmentedImage, setSegmentedImage] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset states
    setError(null);
    setSuccess(false);

    // Validate file type
    if (!file.type.includes("image/")) {
      setError("Please upload an image file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("Image size should be less than 10MB");
      return;
    }

    setImage(file);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];

      // Reset states
      setError(null);
      setSuccess(false);

      // Validate file type
      if (!file.type.includes("image/")) {
        setError("Please upload an image file");
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("Image size should be less than 10MB");
        return;
      }

      setImage(file);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSegment = async () => {
    if (!image) return;

    try {
      setIsUploading(true);
      setError(null);

      if (location.trim() === "") {
        setError("Location is required");
        return;
      }
      const data = new FormData();
      data.append("location", location);
      data.append("image", image);

      const result = await axios.post("/api/segment", data);

      setSegmentedImage(result.data.segmentedImage);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        localStorage.setItem("image", base64String);
      };
      reader.readAsDataURL(image);
      localStorage.setItem("segmentedImage", result.data.segmentedImage);
      router.push("/dashboard/segmented");
    } catch (err) {
      setError("Failed to upload image. Please try again.");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <div className="w-full max-w-3xl mx-auto p-6">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter the name of the location"
          className="rounded border-0 bg-gray-100 px-4 py-3 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 w-full mb-4"
          aria-label="Location input"
        />
        {!preview ? (
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={triggerFileInput}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="flex justify-center mb-4">
              <Upload size={48} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">
              Drag and drop your satellite image
            </h3>
            <p className="text-gray-500 mb-4">or click to browse files</p>
            <button
              className="bg-[#4CD964] text-black font-medium py-2 px-6 rounded-md"
              onClick={(e) => {
                e.stopPropagation();
                triggerFileInput();
              }}
            >
              Browse Files
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative border rounded-lg overflow-hidden">
              {!segmentedImage && (
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70 transition-colors"
                >
                  <X size={20} />
                </button>
              )}
              <Image
                src={preview || "/placeholder.svg"}
                alt="Preview"
                width={800}
                height={450}
                className="w-full h-auto object-contain"
              />
            </div>

            <div className="flex justify-center">
              <button
                className={`flex items-center justify-center bg-[#4CD964] text-black font-medium py-3 px-8 rounded-md ${
                  isUploading
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-opacity-90"
                }`}
                onClick={handleSegment}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 size={18} className="mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Segment
                    <ArrowRight size={18} className="ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* {segmentedImage && (
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-2">Segmented Image</h3>
            <div className="space-y-4">
              <div className="relative border rounded-lg overflow-hidden">
                {!segmentedImage && (
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70 transition-colors"
                  >
                    <X size={20} />
                  </button>
                )}
                <Image
                  src={segmentedImage}
                  alt="Preview"
                  width={800}
                  height={450}
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        )} */}

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-md">
            Image uploaded successfully! Processing for segmentation...
          </div>
        )}
      </div>
    </>
  );
}
