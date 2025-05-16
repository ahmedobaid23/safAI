/* eslint-disable */
// @ts-nocheck

import { GET } from "../../../api/gallery/route";
import { supabase } from "../../../lib/supabase";

// Mock Supabase
jest.mock("../../../lib/supabase", () => ({
  supabase: {
    storage: {
      from: jest.fn().mockReturnThis(),
      list: jest.fn(),
      getPublicUrl: jest.fn(),
    },
  },
}));

describe("Gallery API", () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
  });

  // Unit Test - Success case: Should return gallery images
  it("should return gallery images successfully", async () => {
    // Mock Supabase response
    const mockFiles = [
      { name: "image1.jpg" },
      { name: "image2.png" },
      { name: "document.pdf" }, // Should be filtered out
      { name: "image3.gif" },
    ];

    // Mock list function
    (supabase.storage.from as jest.Mock).mockReturnValue({
      list: jest.fn().mockResolvedValue({ data: mockFiles, error: null }),
      getPublicUrl: jest.fn((name) => ({
        data: { publicUrl: `https://example.com/${name}` },
      })),
    });

    // Call the GET function
    const response = await GET();
    const data = await response.json();

    // Assertions
    expect(response.status).toBe(200);
    expect(data).toEqual({
      urls: [
        "https://example.com/image1.jpg",
        "https://example.com/image2.png",
        "https://example.com/image3.gif",
      ],
    });
    expect(supabase.storage.from).toHaveBeenCalledWith("gallery");
  });

  // Integration Test - Error case: Should handle Supabase errors
  it("should handle Supabase storage errors", async () => {
    // Mock Supabase error
    (supabase.storage.from as jest.Mock).mockReturnValue({
      list: jest.fn().mockResolvedValue({
        data: null,
        error: { message: "Storage error" },
      }),
    });

    // Call the GET function
    const response = await GET();
    const data = await response.json();

    // Assertions
    expect(response.status).toBe(500);
    expect(data).toEqual({ error: "Failed to fetch gallery images" });
  });

  // System Test - Error case: Should handle unexpected errors
  it("should handle unexpected errors", async () => {
    // Mock unexpected error
    (supabase.storage.from as jest.Mock).mockImplementation(() => {
      throw new Error("Unexpected error");
    });

    // Call the GET function
    const response = await GET();
    const data = await response.json();

    // Assertions
    expect(response.status).toBe(500);
    expect(data).toEqual({ error: "Internal server error" });
  });
});
