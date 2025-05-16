/* eslint-disable */
// @ts-nocheck

import { Webhook } from "svix";
import { createUser, deleteUser } from "../../../lib/users";
import { POST } from "../../../api/webhooks/clerk/route";

// Mock external dependencies
jest.mock("svix", () => ({
  Webhook: jest.fn(),
}));

jest.mock("next/headers", () => ({
  headers: jest.fn(),
}));

jest.mock("../../../lib/users", () => ({
  createUser: jest.fn(),
  deleteUser: jest.fn(),
}));

// Save original environment
const originalEnv = process.env;

describe("Clerk Webhook API", () => {
  // Setup and teardown
  beforeEach(() => {
    jest.resetAllMocks();
    // Mock environment variables
    process.env = { ...originalEnv, SIGNING_SECRET: "test-secret" };
  });

  afterAll(() => {
    // Restore environment
    process.env = originalEnv;
  });

  // Unit Test - Error case: Should return error when missing Svix headers
  it("should return error when missing Svix headers", async () => {
    // Mock headers to return incomplete data
    const mockHeadersGet = jest.fn().mockImplementation((key) => {
      if (key === "svix-id") return "test-id";
      if (key === "svix-timestamp") return "test-timestamp";
      return null; // Missing svix-signature
    });

    require("next/headers").headers.mockReturnValue({
      get: mockHeadersGet,
    });

    // Mock request
    const request = {
      json: jest.fn(),
    } as unknown as Request;

    // Call the POST function
    const response = await POST(request);

    // Assertions
    expect(response.status).toBe(400);
    expect(await response.text()).toBe("Error: Missing Svix headers");
  });

  // Unit Test - Error case: Should return error when webhook verification fails
  it("should return error when webhook verification fails", async () => {
    // Mock headers to return complete data
    const mockHeadersGet = jest.fn().mockImplementation((key) => {
      if (key === "svix-id") return "test-id";
      if (key === "svix-timestamp") return "test-timestamp";
      if (key === "svix-signature") return "test-signature";
      return null;
    });

    require("next/headers").headers.mockReturnValue({
      get: mockHeadersGet,
    });

    // Mock request
    const request = {
      json: jest.fn().mockResolvedValue({ type: "user.created" }),
    } as unknown as Request;

    // Mock Webhook to throw error
    (Webhook as jest.Mock).mockImplementation(() => ({
      verify: jest.fn().mockImplementation(() => {
        throw new Error("Verification error");
      }),
    }));

    // Call the POST function
    const response = await POST(request);

    // Assertions
    expect(response.status).toBe(400);
    expect(await response.text()).toBe("Error: Verification error");
  });

  // Integration Test - Success case: Should handle user.created event
  it("should handle user.created event successfully", async () => {
    // Mock headers to return complete data
    const mockHeadersGet = jest.fn().mockImplementation((key) => {
      if (key === "svix-id") return "test-id";
      if (key === "svix-timestamp") return "test-timestamp";
      if (key === "svix-signature") return "test-signature";
      return null;
    });

    require("next/headers").headers.mockReturnValue({
      get: mockHeadersGet,
    });

    // Mock user data
    const mockUserData = {
      id: "user123",
      email_addresses: [{ email_address: "test@example.com" }],
      first_name: "Test",
      last_name: "User",
    };

    // Mock request
    const request = {
      json: jest.fn().mockResolvedValue({
        type: "user.created",
        data: mockUserData,
      }),
    } as unknown as Request;

    // Mock Webhook verification
    (Webhook as jest.Mock).mockImplementation(() => ({
      verify: jest.fn().mockReturnValue({
        type: "user.created",
        data: mockUserData,
      }),
    }));

    // Mock createUser
    (createUser as jest.Mock).mockResolvedValue({
      id: "user123",
      email: "test@example.com",
      name: "Test User",
    });

    // Call the POST function
    const response = await POST(request);

    // Assertions
    expect(response.status).toBe(200);
    expect(await response.text()).toBe("User created succesfully");
    expect(createUser).toHaveBeenCalledWith({
      id: "user123",
      email: "test@example.com",
      name: "Test User",
    });
  });

  // Integration Test - Success case: Should handle user.deleted event
  it("should handle user.deleted event successfully", async () => {
    // Mock headers to return complete data
    const mockHeadersGet = jest.fn().mockImplementation((key) => {
      if (key === "svix-id") return "test-id";
      if (key === "svix-timestamp") return "test-timestamp";
      if (key === "svix-signature") return "test-signature";
      return null;
    });

    require("next/headers").headers.mockReturnValue({
      get: mockHeadersGet,
    });

    // Mock user data
    const mockUserData = {
      id: "user123",
    };

    // Mock request
    const request = {
      json: jest.fn().mockResolvedValue({
        type: "user.deleted",
        data: mockUserData,
      }),
    } as unknown as Request;

    // Mock Webhook verification
    (Webhook as jest.Mock).mockImplementation(() => ({
      verify: jest.fn().mockReturnValue({
        type: "user.deleted",
        data: mockUserData,
      }),
    }));

    // Mock deleteUser
    (deleteUser as jest.Mock).mockResolvedValue({
      id: "user123",
    });

    // Call the POST function
    const response = await POST(request);

    // Assertions
    expect(response.status).toBe(200);
    expect(await response.text()).toBe("User deleted succesfully");
    expect(deleteUser).toHaveBeenCalledWith("user123");
  });

  // System Test - Error case: Should handle missing SIGNING_SECRET
  it("should throw error when SIGNING_SECRET is missing", async () => {
    // Remove SIGNING_SECRET from environment
    delete process.env.SIGNING_SECRET;

    // Mock request
    const request = {} as Request;

    // Call the POST function and expect it to throw
    await expect(POST(request)).rejects.toThrow(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env"
    );
  });
});
