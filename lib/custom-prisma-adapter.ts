import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import type { Adapter } from "next-auth/adapters";
import { randomBytes } from "crypto";

export function CustomPrismaAdapter(): Adapter {
  const adapter = PrismaAdapter(prisma);

  return {
    ...adapter,
    createUser: async (user: any) => {
      // Generate a random password for OAuth users
      const randomPassword = randomBytes(16).toString("hex");

      // Create the user with the required password field
      const newUser = await prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          profileImage: user.image,
          password: randomPassword,
          role: "CUSTOMER",
        },
      });

      return {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        emailVerified: new Date(),
        image: newUser.profileImage,
      };
    },
  };
}
