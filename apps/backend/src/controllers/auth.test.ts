import { Request, Response } from "express";

import { beforeEach, describe, expect, it, MockInstance, vi } from "vitest";
import { signUp, login, checkAuth } from "./auth";
import User from "../db/models/User";
import { DEFAULT_TEST_USER_DATA } from "../../test-helpers/dbData";
describe("SignUp", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  beforeEach(async () => {
    await User.deleteMany({});
    mockRequest = {};
    mockResponse = {
      status: vi.fn().mockReturnThis(), // Allow chaining .status().json()
      json: vi.fn(),
    };
  });

  it("should sign up a user successfully", async () => {
    mockRequest.body = {
      username: "testuser",
      email: "testuser@example.com",
      password: "password123",
    };
    await signUp(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Sign up successful",
    });
  });
});

describe("Log In", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  beforeEach(async () => {
    await User.deleteMany({});
    mockRequest = {};
    mockResponse = {
      status: vi.fn().mockReturnThis(), // Allow chaining .status().json()
      json: vi.fn(),
    };
  });

  it("should log in a user successfully", async () => {
    const user = new User(DEFAULT_TEST_USER_DATA);
    await user.save();
    mockRequest.body = {
      username: DEFAULT_TEST_USER_DATA.username,
      password: DEFAULT_TEST_USER_DATA.password,
    };
    mockRequest.user = user;
    await login(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
  });
});

describe("Check Auth", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  beforeEach(async () => {
    await User.deleteMany({});
    mockRequest = {};
    mockResponse = {
      status: vi.fn().mockReturnThis(), // Allow chaining .status().json()
      json: vi.fn(),
    };
  });

  it("should confirm authentication when user is authenticated", async () => {
    const user = new User(DEFAULT_TEST_USER_DATA);
    await user.save();
    // @ts-expect-error Mocking isAuthenticated method
    mockRequest.isAuthenticated = vi.fn().mockReturnValue(true);
    mockRequest.user = user;
    await checkAuth(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
  });

  it("should deny authentication when user is not authenticated", async () => {
    // @ts-expect-error Mocking isAuthenticated method
    mockRequest.isAuthenticated = vi.fn().mockReturnValue(false);
    await checkAuth(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
  });
});
