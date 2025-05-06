"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Loading from "./loading";
import Navbar from "@/components/dashboard/dashboard-navbar";
import BlogCard from "@/components/dashboard/blog-card";

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

interface Favorite {
  id: string;
  blogId: string;
  url: string;
  urlToImage: string | null;
  title: string;
  description: string | null;
  sourceName: string | null;
  author: string | null;
  publishedAt: string;
}

interface BlogResponse {
  status: string;
  totalResults: number;
  articles: Article[];
}

export default function ExploreBlogsPage() {
  const { isSignedIn } = useUser();
  const [blogs, setBlogs] = useState<Article[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoritingStates, setFavoritingStates] = useState<
    Record<string, boolean>
  >({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const pageSize = 10;

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      // Fetch blogs
      const blogsResponse = await fetch("/api/blogs");
      if (!blogsResponse.ok) {
        throw new Error("Failed to fetch blogs");
      }
      const blogsData: BlogResponse = await blogsResponse.json();
      setBlogs(blogsData.articles);
      setTotalResults(blogsData.articles.length);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const favoritesResponse = await fetch("/api/favourites");
      if (favoritesResponse.ok) {
        const favoritesData = await favoritesResponse.json();
        setFavorites(favoritesData.favourites || []);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  // Check if a blog is favorited
  const isFavorited = (blog: Article) => {
    return favorites.some((fav) => fav.url === blog.url);
  };

  // Toggle favorite status
  const toggleFavorite = async (blog: Article, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Set loading state for this specific blog
    setFavoritingStates((prev) => ({ ...prev, [blog.url]: true }));

    try {
      if (!isFavorited(blog)) {
        const response = await fetch("/api/favourites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(blog),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.favourite) {
            setFavorites((prev) => [...prev, data.favourite]);
          }
        }
      } else {
        const response = await fetch("/api/favourites", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: blog.url }),
        });

        if (response.ok) {
          setFavorites((prev) => prev.filter((fav) => fav.url !== blog.url));
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setFavoritingStates((prev) => ({ ...prev, [blog.url]: false }));
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalResults / pageSize);

  // Fetch blogs and favourites on component mount
  useEffect(() => {
    fetchBlogs();
    if (isSignedIn) {
      fetchFavorites();
    }
  }, [isSignedIn]);

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
                <BlogCard
                  key={index}
                  blog={blog}
                  isFavorited={isFavorited(blog)}
                  isLoading={favoritingStates[blog.url] || false}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center gap-1">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
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
                        onClick={() => setCurrentPage(pageNum)}
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
                        onClick={() => setCurrentPage(totalPages)}
                        className="w-8 h-8 flex items-center justify-center rounded-md bg-white text-gray-700 hover:bg-gray-100"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
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
