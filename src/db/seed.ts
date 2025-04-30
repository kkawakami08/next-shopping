import { PrismaClient } from "@/generated/prisma";
import sampleData from "./sample-data";

const main = async () => {
  console.log("Seeding Database...");

  const prisma = new PrismaClient();

  //delete all existing items
  await prisma.product.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  await prisma.product.createMany({
    data: sampleData.products,
  });
  await prisma.user.createMany({
    data: sampleData.users,
  });

  console.log("Database seeded successfully");
};

main();
