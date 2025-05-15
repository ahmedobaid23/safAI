"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Heart } from "lucide-react";
import Navbar from "@/components/dashboard/dashboard-navbar";
import Loading from "../explore/loading";
import BlogCard from "@/components/dashboard/blog-card";
import { toast } from "sonner";

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

export default function FavouritesPage() {
  const { isSignedIn, isLoaded } = useUser();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoritingStates, setFavoritingStates] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        fetchFavorites();
      } else {
        setLoading(false);
      }
    }
  }, [isSignedIn, isLoaded]);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/blogs/favourites");

      if (!response.ok) {
        throw new Error("Failed to fetch favorites");
      }

      const data = await response.json();
      setFavorites(data.favourites || []);
    } catch (error) {
      toast.error("Failed to fetch favorites. Please try again later.");
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  // Convert Favorite to Article format for BlogCard
  const favoriteToArticle = (favorite: Favorite): Article => ({
    source: {
      id: null,
      name: favorite.sourceName || "Unknown Source",
    },
    author: favorite.author,
    title: favorite.title,
    description: favorite.description,
    url: favorite.url,
    urlToImage: favorite.urlToImage,
    publishedAt: favorite.publishedAt,
    content: null,
  });

  // Toggle favorite status (remove from favorites)
  const toggleFavorite = async (blog: Article, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Set loading state for this specific blog
    setFavoritingStates((prev) => ({ ...prev, [blog.url]: true }));

    try {
      const response = await fetch("/api/blogs/favourites", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: blog.url }),
      });

      if (response.ok) {
        setFavorites((prev) => prev.filter((fav) => fav.url !== blog.url));
      }
    } catch (error) {
      toast.error("Failed to remove favorite. Please try again later.");
      console.error("Error removing favorite:", error);
    } finally {
      setFavoritingStates((prev) => ({ ...prev, [blog.url]: false }));
    }
  };

  if (!isLoaded || loading) {
    return (
      <>
        <Navbar title="Favourites" />
        <Loading />
      </>
    );
  }

  if (!isSignedIn) {
    return (
      <>
        <Navbar title="Favourites" />
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Please sign in</h2>
          <p className="text-gray-600 mb-8">
            You need to be signed in to view your favorites.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar title="Favourites" />
      <div className="container mx-auto px-4 py-8">
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 gap-8">
            {favorites.map((favorite) => (
              <BlogCard
                key={favorite.id}
                blog={favoriteToArticle(favorite)}
                isFavorited={true}
                isLoading={favoritingStates[favorite.url] || false}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No favorites yet
            </h3>
            <p className="text-gray-500 mb-8">
              Start exploring blogs and add them to your favorites by clicking
              the heart icon.
            </p>
            <a
              href="/blogs/explore"
              className="bg-[#4CD964] hover:bg-green-600 text-black font-medium py-2 px-6 rounded-md transition-colors"
            >
              Explore Blogs
            </a>
          </div>
        )}
      </div>
    </>
  );
}
