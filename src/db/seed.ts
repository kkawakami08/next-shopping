import { PrismaClient } from "@/generated/prisma";
import sampleData from "./sample-data";

const main = async () => {
  console.log("Seeding Database...");

  const prisma = new PrismaClient();

  //delete all existing items
  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: sampleData.products,
  });

  console.log("Database seeded successfully");
};

main();
