/* eslint-disable */
// @ts-nocheck

import { GET } from "../../../api/blogs/route";
import { jest } from "@jest/globals";

// Mock fetch
global.fetch = jest.fn();

// Save original environment
const originalEnv = process.env;

describe("News API", () => {
  // Setup and teardown
  beforeEach(() => {
    jest.resetAllMocks();
    // Mock environment variables
    process.env = { ...originalEnv, NEWS_API_KEY: "test-api-key" };
  });

  afterAll(() => {
    // Restore environment
    process.env = originalEnv;
  });

  // Unit Test - Success case: Should fetch news articles
  it("should fetch news articles successfully", async () => {
    // Mock successful API response
    const mockArticles = [
      {
        source: { id: "test-source", name: "Test Source" },
        author: "Test Author",
        title: "Test Title",
        description: "Test Description",
        url: "https://test.com/article",
        urlToImage: "https://test.com/image.jpg",
        publishedAt: "2023-01-01T00:00:00Z",
        content: "Test Content",
      },
    ];

    const mockResponse = {
      status: "ok",
      totalResults: 1,
      articles: mockArticles,
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    // Call the GET function
    const response = await GET();
    const data = await response.json();

    // Assertions
    expect(response.status).toBe(200);
    expect(data).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("https://newsapi.org/v2/everything?"),
      expect.objectContaining({
        headers: { "X-Api-Key": "test-api-key" },
        next: { revalidate: 3600 },
      })
    );
  });

  // Unit Test - Error case: Should handle missing API key
  it("should return error when API key is missing", async () => {
    // Remove API key from environment
    delete process.env.NEWS_API_KEY;

    // Call the GET function
    const response = await GET();
    const data = await response.json();

    // Assertions
    expect(response.status).toBe(500);
    expect(data).toEqual({ error: "News API key is not configured" });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  // Integration Test - Error case: Should handle API errors
  it("should handle API errors", async () => {
    // Mock error response from API
    const mockErrorResponse = {
      status: "error",
      code: "apiKeyInvalid",
      message: "Your API key is invalid",
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockErrorResponse),
    });

    // Call the GET function
    const response = await GET();
    const data = await response.json();

    // Assertions
    expect(response.status).toBe(400);
    expect(data).toEqual({ error: "Your API key is invalid" });
  });

  // System Test - Error case: Should handle network errors
  it("should handle network errors", async () => {
    // Mock network error
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Network error")
    );

    // Call the GET function
    const response = await GET();
    const data = await response.json();

    // Assertions
    expect(response.status).toBe(500);
    expect(data).toEqual({ error: "Failed to fetch news articles" });
  });
});
