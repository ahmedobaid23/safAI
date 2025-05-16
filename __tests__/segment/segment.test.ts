/* eslint-disable */
// @ts-nocheck

import * as auth from "@clerk/nextjs/server";
import axios from "axios";
import { supabase } from "../../../lib/supabase";
import { base64ToBlob } from "../../../utils/base64ToBlob";
import { POST } from "../../../api/segment/route";

// Mock external dependencies
jest.mock("@clerk/nextjs/server", () => ({
  auth: jest.fn(),
}));

jest.mock("axios");

jest.mock("../../../lib/supabase", () => ({
  supabase: {
    storage: {
      from: jest.fn().mockReturnThis(),
      upload: jest.fn(),
      createSignedUrl: jest.fn(),
    },
  },
}));

jest.mock("../../../utils/base64ToBlob", () => ({
  base64ToBlob: jest.fn(),
}));

describe("Segment API", () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(global.Date, "now").mockReturnValue(1234567890);
  });

  // Unit Test - Success case: Should process image segmentation for authenticated user
  it("should process image segmentation for authenticated user", async () => {
    // Mock auth to return a userId
    (auth.auth as jest.Mock).mockResolvedValue({ userId: "user123" });

    // Mock file data
    const mockFile = new File(["test image content"], "test-image.jpg", {
      type: "image/jpeg",
    });
    const mockFormData = new FormData();
    mockFormData.append("image", mockFile);

    // Mock request
    const request = {
      formData: jest.fn().mockResolvedValue(mockFormData),
    } as unknown as Request;

    // Mock file buffer
    const mockArrayBuffer = new ArrayBuffer(10);
    const mockBuffer = new Uint8Array(mockArrayBuffer);
    mockFile.arrayBuffer = jest.fn().mockResolvedValue(mockArrayBuffer);

    // Mock Supabase upload
    (supabase.storage.from as jest.Mock).mockReturnValue({
      upload: jest.fn().mockResolvedValue({ error: null }),
      createSignedUrl: jest.fn().mockImplementation((path) => {
        return Promise.resolve({
          data: { signedUrl: `https://example.com/${path}` },
          error: null,
        });
      }),
    });

    // Mock ML model response
    (axios.post as jest.Mock).mockResolvedValue({
      data: { overlay_image: "base64encodedimage" },
    });

    // Mock base64ToBlob
    (base64ToBlob as jest.Mock).mockReturnValue(new Blob(["segmented image"]));

    // Call the POST function
    const response = await POST(request);
    const data = await response.json();

    // Assertions
    expect(response.status).toBe(200);
    expect(data).toEqual({
      originalImageUrl: "https://example.com/user123/1234567890-test-image.jpg",
      segmentedImageUrl:
        "https://example.com/user123/1234567890-test-image.jpg",
    });
  });

  // Unit Test - Success case: Should process image for unauthenticated user
  it("should process image segmentation for unauthenticated user", async () => {
    // Mock auth to return no userId
    (auth.auth as jest.Mock).mockResolvedValue({ userId: null });

    // Mock file data
    const mockFile = new File(["test image content"], "test-image.jpg", {
      type: "image/jpeg",
    });
    const mockFormData = new FormData();
    mockFormData.append("image", mockFile);

    // Mock request
    const request = {
      formData: jest.fn().mockResolvedValue(mockFormData),
    } as unknown as Request;

    // Mock file buffer
    const mockArrayBuffer = new ArrayBuffer(10);
    const mockBuffer = new Uint8Array(mockArrayBuffer);
    mockFile.arrayBuffer = jest.fn().mockResolvedValue(mockArrayBuffer);

    // Mock Supabase upload
    (supabase.storage.from as jest.Mock).mockReturnValue({
      upload: jest.fn().mockResolvedValue({ error: null }),
      createSignedUrl: jest.fn().mockImplementation((path) => {
        return Promise.resolve({
          data: { signedUrl: `https://example.com/${path}` },
          error: null,
        });
      }),
    });

    // Mock ML model response
    (axios.post as jest.Mock).mockResolvedValue({
      data: { overlay_image: "base64encodedimage" },
    });

    // Mock base64ToBlob
    (base64ToBlob as jest.Mock).mockReturnValue(new Blob(["segmented image"]));

    // Call the POST function
    const response = await POST(request);
    const data = await response.json();

    // Assertions
    expect(response.status).toBe(200);
    expect(data).toEqual({
      originalImageUrl:
        "https://example.com/unauthenticated/1234567890-test-image.jpg",
      segmentedImageUrl:
        "https://example.com/unauthenticated/1234567890-test-image.jpg",
    });
  });

  // Integration Test - Error case: Should handle Supabase upload errors
  it("should handle Supabase upload errors", async () => {
    // Mock auth to return a userId
    (auth.auth as jest.Mock).mockResolvedValue({ userId: "user123" });

    // Mock file data
    const mockFile = new File(["test image content"], "test-image.jpg", {
      type: "image/jpeg",
    });
    const mockFormData = new FormData();
    mockFormData.append("image", mockFile);

    // Mock request
    const request = {
      formData: jest.fn().mockResolvedValue(mockFormData),
    } as unknown as Request;

    // Mock file buffer
    const mockArrayBuffer = new ArrayBuffer(10);
    const mockBuffer = new Uint8Array(mockArrayBuffer);
    mockFile.arrayBuffer = jest.fn().mockResolvedValue(mockArrayBuffer);

    // Mock Supabase upload error
    (supabase.storage.from as jest.Mock).mockReturnValue({
      upload: jest
        .fn()
        .mockResolvedValue({ error: { message: "Upload failed" } }),
    });

    // Call the POST function
    const response = await POST(request);
    const data = await response.json();

    // Assertions
    expect(response.status).toBe(500);
    expect(data).toEqual({ error: "Upload failed" });
  });

  // System Test - Error case: Should handle ML model errors
  it("should handle ML model errors", async () => {
    // Mock auth to return a userId
    (auth.auth as jest.Mock).mockResolvedValue({ userId: "user123" });

    // Mock file data
    const mockFile = new File(["test image content"], "test-image.jpg", {
      type: "image/jpeg",
    });
    const mockFormData = new FormData();
    mockFormData.append("image", mockFile);

    // Mock request
    const request = {
      formData: jest.fn().mockResolvedValue(mockFormData),
    } as unknown as Request;

    // Mock file buffer
    const mockArrayBuffer = new ArrayBuffer(10);
    const mockBuffer = new Uint8Array(mockArrayBuffer);
    mockFile.arrayBuffer = jest.fn().mockResolvedValue(mockArrayBuffer);

    // Mock Supabase upload success
    (supabase.storage.from as jest.Mock).mockReturnValue({
      upload: jest.fn().mockResolvedValue({ error: null }),
      createSignedUrl: jest.fn().mockResolvedValue({
        data: { signedUrl: "https://example.com/image.jpg" },
        error: null,
      }),
    });

    // Mock ML model error
    (axios.post as jest.Mock).mockRejectedValue(new Error("ML model error"));

    // Call the POST function
    const response = await POST(request);
    const data = await response.json();

    // Assertions
    expect(response.status).toBe(500);
    expect(data).toEqual({ error: "Failed to process image segmentation" });
  });
});
