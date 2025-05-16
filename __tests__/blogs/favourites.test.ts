/* eslint-disable */
// @ts-nocheck

import * as auth from "@clerk/nextjs/server";
import { prisma } from "../../lib/prisma";
import { GET, POST, DELETE } from "../../app/api/blogs/favourites/route";
import type { NextRequest } from "next/server";

// Mock external dependencies
jest.mock("@clerk/nextjs/server", () => ({
  auth: jest.fn(),
}));

jest.mock("../../lib/prisma", () => ({
  prisma: {
    favorite: {
      findMany: jest.fn(),
      create: jest.fn(),
      deleteMany: jest.fn(),
    },
  },
}));

// Mock NextResponse
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data, options) => ({
      status: options?.status || 200,
      json: async () => data,
    })),
  },
  // Add NextRequest mock
  NextRequest: jest.fn().mockImplementation((input, init) => {
    return {
      json: jest.fn().mockResolvedValue({}),
      cookies: new Map(),
      nextUrl: new URL("http://localhost:3000"),
      url: "http://localhost:3000",
      headers: new Headers(),
      formData: jest.fn().mockResolvedValue(new FormData()),
      // Add other required properties
      ua: {},
      page: { name: "test" },
      [Symbol.for("edge-runtime.inspect.custom")]: {},
    };
  }),
}));

describe("Favourites API", () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("GET /api/blogs/favourites", () => {
    // Unit Test - Success case: Should return user's favourites
    it("should return user's favourites when authenticated", async () => {
      // Mock auth to return a userId
      (auth.auth as unknown as jest.Mock).mockResolvedValue({
        userId: "user123",
      });

      // Mock prisma to return favourites
      const mockFavourites = [
        { id: 1, userId: "user123", blogId: "blog1", title: "Test Blog" },
      ];
      (prisma.favorite.findMany as jest.Mock).mockResolvedValue(mockFavourites);

      // Call the GET function
      const response = await GET();
      const data = await response.json();

      // Assertions
      expect(response.status).toBe(200);
      expect(data).toEqual({ favourites: mockFavourites });
      expect(prisma.favorite.findMany).toHaveBeenCalledWith({
        where: { userId: "user123" },
      });
    });

    // Unit Test - Error case: Should return empty array when not authenticated
    it("should return empty array with 401 status when not authenticated", async () => {
      // Mock auth to return no userId
      (auth.auth as unknown as jest.Mock).mockResolvedValue({ userId: null });

      // Call the GET function
      const response = await GET();
      const data = await response.json();

      // Assertions
      expect(response.status).toBe(401);
      expect(data).toEqual({ favourites: [] });
      expect(prisma.favorite.findMany).not.toHaveBeenCalled();
    });

    // Integration Test - Error case: Should handle database errors
    it("should handle database errors gracefully", async () => {
      // Mock auth to return a userId
      (auth.auth as unknown as jest.Mock).mockResolvedValue({
        userId: "user123",
      });

      // Mock prisma to throw an error
      (prisma.favorite.findMany as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      // Call the GET function
      const response = await GET();
      const data = await response.json();

      // Assertions
      expect(response.status).toBe(500);
      expect(data).toEqual({ favourites: [] });
    });
  });

  describe("POST /api/blogs/favourites", () => {
    // Unit Test - Success case: Should add a new favourite
    it("should add a new favourite when authenticated", async () => {
      // Mock auth to return a userId
      (auth.auth as unknown as jest.Mock).mockResolvedValue({
        userId: "user123",
      });

      // Mock request body
      const mockBlog = {
        title: "Test Blog",
        description: "Test Description",
        url: "https://test.com/blog",
        urlToImage: "https://test.com/image.jpg",
        source: { name: "Test Source" },
        author: "Test Author",
        publishedAt: "2023-01-01",
      };

      // Update the request mock to use NextRequest
      const request = {
        json: jest.fn().mockResolvedValue(mockBlog),
        cookies: new Map(),
        nextUrl: new URL("http://localhost:3000"),
        url: "http://localhost:3000",
        headers: new Headers(),
        formData: jest.fn(),
        ua: {},
        page: { name: "test" },
        [Symbol.for("edge-runtime.inspect.custom")]: {},
      } as unknown as NextRequest;

      // Mock prisma to return the created favourite
      const mockCreatedFavourite = {
        id: 1,
        userId: "user123",
        ...mockBlog,
        blogId: mockBlog.url,
        sourceName: mockBlog.source.name,
      };
      (prisma.favorite.create as jest.Mock).mockResolvedValue(
        mockCreatedFavourite
      );

      // Call the POST function
      const response = await POST(request);
      const data = await response.json();

      // Assertions
      expect(response.status).toBe(200);
      expect(data).toEqual({ favourite: mockCreatedFavourite });
      expect(prisma.favorite.create).toHaveBeenCalledWith({
        data: {
          userId: "user123",
          blogId: mockBlog.url,
          title: mockBlog.title,
          description: mockBlog.description,
          url: mockBlog.url,
          urlToImage: mockBlog.urlToImage,
          sourceName: mockBlog.source.name,
          author: mockBlog.author,
          publishedAt: mockBlog.publishedAt,
        },
      });
    });

    // Unit Test - Error case: Should return 401 when not authenticated
    it("should return 401 when not authenticated", async () => {
      // Mock auth to return no userId
      (auth.auth as unknown as jest.Mock).mockResolvedValue({ userId: null });

      const request = {
        json: jest.fn(),
        cookies: new Map(),
        nextUrl: new URL("http://localhost:3000"),
        url: "http://localhost:3000",
        headers: new Headers(),
        formData: jest.fn(),
        ua: {},
        page: { name: "test" },
        [Symbol.for("edge-runtime.inspect.custom")]: {},
      } as unknown as NextRequest;

      // Call the POST function
      const response = await POST(request);
      const data = await response.json();

      // Assertions
      expect(response.status).toBe(401);
      expect(data).toEqual({ error: "Unauthorized" });
      expect(request.json).not.toHaveBeenCalled();
      expect(prisma.favorite.create).not.toHaveBeenCalled();
    });
  });

  describe("DELETE /api/blogs/favourites", () => {
    // Unit Test - Success case: Should delete a favourite
    it("should delete a favourite when authenticated", async () => {
      // Mock auth to return a userId
      (auth.auth as unknown as jest.Mock).mockResolvedValue({
        userId: "user123",
      });

      // Mock request body
      const mockRequestBody = {
        url: "https://test.com/blog",
      };

      const request = {
        json: jest.fn().mockResolvedValue(mockRequestBody),
        cookies: new Map(),
        nextUrl: new URL("http://localhost:3000"),
        url: "http://localhost:3000",
        headers: new Headers(),
        formData: jest.fn(),
        ua: {},
        page: { name: "test" },
        [Symbol.for("edge-runtime.inspect.custom")]: {},
      } as unknown as NextRequest;
      // Mock prisma to return success
      (prisma.favorite.deleteMany as jest.Mock).mockResolvedValue({ count: 1 });

      // Call the DELETE function
      const response = await DELETE(request);
      const data = await response.json();

      // Assertions
      expect(response.status).toBe(200);
      expect(data).toEqual({ message: "Favorite removed successfully" });
      expect(prisma.favorite.deleteMany).toHaveBeenCalledWith({
        where: {
          userId: "user123",
          url: mockRequestBody.url,
        },
      });
    });
  });
});
