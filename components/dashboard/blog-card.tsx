"use client";

import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Clock, Heart, Loader2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";

interface Source {
  id: string | null;
  name: string;
}

interface Article {
  source: Source;
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

interface BlogCardProps {
  blog: Article;
  isFavorited: boolean;
  isLoading: boolean;
  onToggleFavorite: (blog: Article, e: React.MouseEvent) => void;
}

export default function BlogCard({
  blog,
  isFavorited,
  isLoading,
  onToggleFavorite,
}: BlogCardProps) {
  const { isSignedIn } = useUser();

  // Format the date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col md:flex-row relative">
      <Link
        href={blog.url}
        target="_blank"
        className="md:w-1/3 h-64 relative block"
      >
        {blog.urlToImage ? (
          <Image
            src={blog.urlToImage || "/placeholder.svg"}
            alt={blog.title}
            fill
            className="object-cover"
            unoptimized // Using unoptimized for external images
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">No image available</p>
          </div>
        )}
      </Link>

      <div className="p-6 md:w-2/3">
        <div className="flex justify-between items-start">
          <Link href={blog.url} target="_blank" className="block">
            <h2 className="text-xl md:text-2xl font-bold mb-3 text-[#051C2F] line-clamp-2 hover:text-3xl animate duration-450">
              {blog.title}
            </h2>
          </Link>

          {isSignedIn && (
            <button
              onClick={(e) => onToggleFavorite(blog, e)}
              disabled={isLoading}
              className="ml-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label={isFavorited ? "Favorited" : "Add to favorites"}
            >
              {isLoading ? (
                <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
              ) : (
                <motion.div
                  whileTap={{ scale: 0.8 }}
                  animate={isFavorited ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <Heart
                    className={`h-8 w-8 cursor-pointer ${
                      isFavorited
                        ? "fill-[#4CD964] text-[#4CD964]"
                        : "text-gray-400"
                    }`}
                  />
                </motion.div>
              )}
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center text-sm text-gray-600 mb-4 gap-x-4">
          {blog.source?.name && (
            <span className="flex items-center">
              <span className="font-medium">{blog.source.name}</span>
            </span>
          )}
          {blog.author && (
            <span className="flex items-center">
              <span>By {blog.author}</span>
            </span>
          )}
          <span className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{formatDate(blog.publishedAt)}</span>
          </span>
        </div>

        <p className="text-gray-700 mb-4 line-clamp-3">
          {blog.description || "No description available"}
        </p>

        <Link
          href={blog.url}
          target="_blank"
          className="flex items-center text-[#4CD964] font-medium hover:text-green-600"
        >
          Read more <ExternalLink className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
