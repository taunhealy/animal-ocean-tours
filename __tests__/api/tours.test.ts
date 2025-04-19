// __tests__/api/tours/route.test.ts
import { describe, expect, it } from "@jest/globals";
import { POST } from "@/app/api/tours/route";
import { prisma } from "@/lib/prisma";

describe("Tours API", () => {
  it("should create a tour with valid data", async () => {
    // Arrange: Valid tour data
    const validTourData = {
      name: "Dolphin Watch Tour",
      description: "Amazing dolphin watching experience",
      difficulty: "MODERATE",
      duration: 4,
      tourTypeId: "tour-type-1",
      basePrice: 100,
      maxParticipants: 10,
    };

    // Act: Make the request
    const response = await POST(
      new Request("http://localhost:3000/api/tours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validTourData),
      })
    );

    // Assert: Check response
    expect(response.status).toBe(201);
  });

  it("should reject invalid tour data", async () => {
    // Arrange: Invalid tour data (missing required fields)
    const invalidTourData = {
      name: "Test Tour",
      // Missing required fields
    };

    // Act: Make the request
    const response = await POST(
      new Request("http://localhost:3000/api/tours", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invalidTourData),
      })
    );

    // Assert: Check error response
    expect(response.status).toBe(400);
    const error = await response.json();
    expect(error).toHaveProperty("error");
  });

  it("should pass a simple test", () => {
    expect(true).toBe(true);
  });

  it("should create a location", async () => {
    // Arrange: Location data
    const locationData = {
      name: "Start Location",
      latitude: 25.7617,
      longitude: -80.1918,
      city: "Miami",
      country: "USA",
    };

    // Act: Create the location
    const location = await prisma.location.create({
      data: locationData,
    });

    // Assert: Check created location
    expect(location.name).toBe(locationData.name);
    expect(location.latitude).toBe(locationData.latitude);
    expect(location.longitude).toBe(locationData.longitude);
    expect(location.city).toBe(locationData.city);
    expect(location.country).toBe(locationData.country);
  });
});
