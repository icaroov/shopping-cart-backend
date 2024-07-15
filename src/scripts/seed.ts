import db from "@/lib/database"
import { logger } from "@/lib/logger"

const products = [
  {
    id: "pf0ZoB1FwH6",
    name: "Floratta",
    price: 60,
  },
  {
    id: "pmSjGCTfn8w",
    name: "Malbec",
    price: 210,
  },
  {
    id: "pht4Xx5nHMB",
    name: "Her Code",
    price: 150,
  },
]

const seedDatabase = async () => {
  try {
    for (const product of products) {
      await db.product.upsert({
        where: { id: product.id },
        update: {},
        create: {
          id: product.id,
          name: product.name,
          price: product.price,
        },
      })
    }
    logger.info("Products seeded successfully")
  } catch (error) {
    logger.error("Error seeding products", error)
  } finally {
    await db.$disconnect()
  }
}

seedDatabase()
