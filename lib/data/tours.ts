import { Tour, TourSchedule } from "@prisma/client";

export type TourWithSchedules = Tour & {
  schedules: TourSchedule[];
  startLocation: { name: string } | null;
  endLocation: { name: string } | null;
};

// Fallback tour data
export const fallbackTours: TourWithSchedules[] = [
  {
    id: "seal-kayaking-adventure",
    name: "Seal Kayaking Adventure",
    description: "Get up close with playful Cape Fur Seals in their natural habitat. This kayaking tour takes you to Duiker Island, home to thousands of seals. Perfect for beginners and families.",
    difficulty: "BEGINNER",
    duration: 3,
    location: "Hout Bay, Cape Town",
    highlights: ["Close encounters with seals", "No experience required", "Stable double kayaks", "Professional guides"],
    inclusions: ["Kayaking equipment", "Safety briefing", "Waterproof bags", "Hot drinks after tour"],
    exclusions: ["Transportation to meeting point", "Gratuities"],
    maxParticipants: 12,
    basePrice: 850,
    images: ["/images/tours/seal-kayaking-1.jpg", "/images/tours/seal-kayaking-2.jpg"],
    published: true,
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-06-10"),
    guideId: null,
    guide: null,
    schedules: [
      {
        id: "sk-schedule-1",
        tourId: "seal-kayaking-adventure",
        startDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        endDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // 3 hours later
        price: 850,
        availableSpots: 8,
        status: "OPEN",
        notes: "Weather dependent. Confirmation 24 hours before.",
        guideId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    deleted: false,
    deletedAt: null,
    categoryId: null,
    category: null,
    tourType: "Seal Kayaking",
    startLocationId: null,
    startLocation: { name: "Hout Bay Harbor" },
    endLocationId: null,
    endLocation: { name: "Hout Bay Harbor" },
    metadata: null,
    locationId: null,
    locationDetails: null
  },
  {
    id: "ocean-safari-expedition",
    name: "Ocean Safari Expedition",
    description: "Experience the thrill of an ocean safari where you'll encounter dolphins, whales, and diverse marine life. This boat tour offers spectacular views and photo opportunities.",
    difficulty: "INTERMEDIATE",
    duration: 4,
    location: "Simon's Town, Cape Town",
    highlights: ["Marine Big 5 sightings", "Expert marine biologists", "Comfortable vessel", "Underwater viewing"],
    inclusions: ["Boat trip", "Light refreshments", "Binoculars", "Marine guide"],
    exclusions: ["Lunch", "Transportation to harbor", "Gratuities"],
    maxParticipants: 20,
    basePrice: 1200,
    images: ["/images/tours/ocean-safari-1.jpg", "/images/tours/ocean-safari-2.jpg"],
    published: true,
    createdAt: new Date("2023-02-20"),
    updatedAt: new Date("2023-07-15"),
    guideId: null,
    guide: null,
    schedules: [
      {
        id: "os-schedule-1",
        tourId: "ocean-safari-expedition",
        startDate: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        endDate: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // 4 hours later
        price: 1200,
        availableSpots: 12,
        status: "OPEN",
        notes: "Bring sunscreen and a camera. Dress warmly.",
        guideId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    deleted: false,
    deletedAt: null,
    categoryId: null,
    category: null,
    tourType: "Ocean Safari",
    startLocationId: null,
    startLocation: { name: "Simon's Town Harbor" },
    endLocationId: null,
    endLocation: { name: "Simon's Town Harbor" },
    metadata: null,
    locationId: null,
    locationDetails: null
  },
  {
    id: "sardine-run-expedition",
    name: "Sardine Run Expedition",
    description: "Witness one of the greatest marine spectacles on Earth - the annual Sardine Run. This multi-day adventure takes you to the heart of the action with daily boat launches.",
    difficulty: "ADVANCED",
    duration: 7,
    location: "Wild Coast, Eastern Cape",
    highlights: ["Massive bait balls", "Predator feeding frenzies", "Daily boat launches", "Underwater photography"],
    inclusions: ["Accommodation", "Meals", "Boat trips", "Diving equipment", "Expert guides"],
    exclusions: ["Flights to Eastern Cape", "Travel insurance", "Alcoholic beverages"],
    maxParticipants: 8,
    basePrice: 25000,
    images: ["/images/tours/sardine-run-1.jpg", "/images/tours/sardine-run-2.jpg"],
    published: true,
    createdAt: new Date("2023-03-10"),
    updatedAt: new Date("2023-08-05"),
    guideId: null,
    guide: null,
    schedules: [
      {
        id: "sr-schedule-1",
        tourId: "sardine-run-expedition",
        startDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        endDate: new Date(new Date().getTime() + 37 * 24 * 60 * 60 * 1000), // 7 days later
        price: 25000,
        availableSpots: 4,
        status: "OPEN",
        notes: "Advanced divers only. June-July is peak season.",
        guideId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    deleted: false,
    deletedAt: null,
    categoryId: null,
    category: null,
    tourType: "Sardine Run",
    startLocationId: null,
    startLocation: { name: "Port St Johns" },
    endLocationId: null,
    endLocation: { name: "Port St Johns" },
    metadata: null,
    locationId: null,
    locationDetails: null
  }
]; 