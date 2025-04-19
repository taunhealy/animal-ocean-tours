import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // First create test locations
  const startLocation = await prisma.location.create({
    data: {
      name: "Test Start Location",
      latitude: 25.7617,
      longitude: -80.1918,
    },
  });

  const endLocation = await prisma.location.create({
    data: {
      name: "Test End Location",
      latitude: 25.7616,
      longitude: -80.1917,
    },
  });

  // Create test marine life
  const marineLife = await prisma.marineLife.create({
    data: {
      name: "Test Dolphin",
      description: "A friendly dolphin",
      activeMonths: [1, 2, 3, 4],
    },
  });

  // Create test tour
  const tour = await prisma.tour.create({
    data: {
      name: "Test Marine Tour",
      description: "A test tour description that's detailed enough",
      difficulty: "MODERATE",
      duration: 4,
      tourType: "MARINE_EXPERIENCE",
      basePrice: 100,
      maxParticipants: 10,
      safetyBriefing: "Safety first!",
      published: true,
      startLocationId: startLocation.id,
      endLocationId: endLocation.id,
      marineLife: {
        connect: { id: marineLife.id },
      },
      highlights: ["Highlight 1", "Highlight 2"],
      inclusions: ["Inclusion 1", "Inclusion 2"],
      exclusions: ["Exclusion 1", "Exclusion 2"],
    },
  });

  console.log({ tour, marineLife, startLocation, endLocation });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
