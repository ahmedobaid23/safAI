"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Clock } from "lucide-react";
import Loading from "./loading";
import Navbar from "@/components/dashboard/dashboard-navbar";

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

interface BlogResponse {
  status: string;
  totalResults: number;
  articles: Article[];
}

export default function ExploreBlogsPage() {
  const [blogs, setBlogs] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const pageSize = 10;

  const fetchBlogs = async (page = 1) => {
    setLoading(true);
    try {
      // Fetch from our API route
      const response = await fetch("/api/blogs");

      if (!response.ok) {
        throw new Error("Failed to fetch blogs");
      }

      const data: BlogResponse = await response.json();
      console.log(data);
      setBlogs(data.articles);
      setTotalResults(data.articles.length);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(1);
  }, []);

  // Format the date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalResults / pageSize);

  return (
    <>
      <Navbar title="Explore Blogs" />
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <Loading />
        ) : blogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-8">
              {blogs.map((blog, index) => (
                <Link
                  href={blog.url}
                  target="_blank"
                  key={index}
                  className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col md:flex-row"
                >
                  <div className="md:w-1/3 h-64 relative">
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
                  </div>
                  <div className="p-6 md:w-2/3">
                    <h2 className="text-xl md:text-2xl font-bold mb-3 text-[#051C2F] line-clamp-2">
                      {blog.title}
                    </h2>
                    <div className="flex flex-wrap items-center text-sm text-gray-600 mb-4 gap-x-4">
                      {blog.source.name && (
                        <span className="flex items-center">
                          <span className="font-medium">
                            {blog.source.name}
                          </span>
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
                    <div className="flex items-center text-[#4CD964] font-medium">
                      Read more <ExternalLink className="ml-1 h-4 w-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center gap-1">
                  <button
                    onClick={() => fetchBlogs(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Previous
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Show pages around current page
                    let pageNum = i + 1;
                    if (totalPages > 5 && currentPage > 3) {
                      pageNum = currentPage - 2 + i;
                    }
                    if (pageNum > totalPages) return null;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => fetchBlogs(pageNum)}
                        className={`w-8 h-8 flex items-center justify-center rounded-md ${
                          currentPage === pageNum
                            ? "bg-[#4CD964] text-black font-medium"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <>
                      <span className="px-2">...</span>
                      <button
                        onClick={() => fetchBlogs(totalPages)}
                        className="w-8 h-8 flex items-center justify-center rounded-md bg-white text-gray-700 hover:bg-gray-100"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => fetchBlogs(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No articles found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search terms or browse different topics.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
