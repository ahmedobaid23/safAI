"use client";

import type React from "react";
import { useState, useRef } from "react";
import Image from "next/image";
import { ArrowRight, Upload, X, Loader2 } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function UploadImage() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size should be less than 10MB");
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

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.includes("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size should be less than 10MB");
      return;
    }

    setImage(file);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current?.value) {
      fileInputRef.current.value = "";
    }
  };

  const handleSegment = async () => {
    if (!image) return;

    try {
      setIsUploading(true);
      const data = new FormData();
      data.append("image", image);

      const response = await axios.post("/api/segment", data);

      localStorage.setItem("image", response.data.originalImageUrl);
      localStorage.setItem("segmentedImage", response.data.segmentedImageUrl);

      toast.success("Image uploaded successfully! Processing complete.");
      router.push("/dashboard/segmented");
    } catch (err) {
      toast.error("Failed to upload image. Please try again.");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 flex items-center justify-center">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {!preview ? (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:bg-gray-50 transition-colors w-full h-full"
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
            className="bg-[#4CD964] text-black font-medium py-2 px-6 rounded-md hover:bg-green-600 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              triggerFileInput();
            }}
          >
            Browse Files
          </button>
        </div>
      ) : (
        <div className="space-y-4 w-full">
          <div className="relative border rounded-lg overflow-hidden">
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
            <Image
              src={preview || "/placeholder.svg"}
              alt="Preview"
              width={800}
              height={450}
              className="w-full max-h-[75vh] object-cover"
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
    </div>
  );
}
