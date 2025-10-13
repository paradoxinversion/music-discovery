import { Request, Response } from "express";

import { beforeEach, describe, expect, it, vi } from "vitest";
import User from "../db/models/User";
import { DEFAULT_TEST_USER_DATA } from "../../test-helpers/dbData";
import { getManagedArtists } from "./user";
import Artist from "../db/models/Artist";
describe("GetManagedArtists", () => {
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

  it("should get managed artists successfully", async () => {
    const user = new User(DEFAULT_TEST_USER_DATA);
    await user.save();
    const artist = new Artist({
      name: "Test Artist",
      genre: "Rock",
      managingUserId: user._id,
      biography: "A rock artist",
    });
    await artist.save();
    mockRequest.user = user;
    await getManagedArtists(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
  });
  it("should return 401 if user not authenticated", async () => {
    await getManagedArtists(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(401);
  });
});
