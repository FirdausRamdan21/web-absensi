import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
  datasources: {
    db: { url: process.env.DIRECT_URL },
  },
});

async function main() {
  const passwordHash = await bcrypt.hash("sekretaris123", 12);

  await prisma.user.upsert({
    where: { username: "sekretaris" },
    update: { name: "Sekretaris Kelas", role: UserRole.SEKRETARIS, isActive: true },
    create: {
      username: "sekretaris",
      name: "Sekretaris Kelas",
      passwordHash,
      role: UserRole.SEKRETARIS,
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });