import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import type { Adapter } from "next-auth/adapters";

export function CustomPrismaAdapter(): Adapter {
  const adapter = PrismaAdapter(prisma);

  return {
    ...adapter,
    createUser: async (user: any) => {
      // Generate a random password for OAuth users
      const randomPassword = Math.random().toString(36).slice(-8);

      // Create the user with the required password field
      // Remove fields that don't exist in your schema
      const { image, emailVerified, ...userData } = user;

      const newUser = await prisma.user.create({
        data: {
          ...userData,
          password: randomPassword,
          profileImage: image, // Map image to profileImage
          role: "CUSTOMER", // Set default role
        },
      });

      // Return the user with the fields NextAuth expects
      return {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        emailVerified: new Date(), // Add this for NextAuth
        image: newUser.profileImage,
      };
    },
  };
}
