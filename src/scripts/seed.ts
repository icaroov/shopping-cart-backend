import db from "@/lib/database"
import { logger } from "@/lib/logger"

const products = [
  {
    id: "pf0ZoB1FwH6",
    name: "FLORATTA SUMMER LOVE GIFT SET",
    description: "A fresh and floral fragrance",
    price: 60,
    imageUrl:
      "https://cdn.shopify.com/s/files/1/0587/6075/7446/files/BT-US_Floratta-Summer-Love-Set-2.jpg?v=1716562584&width=1252&crop=center",
  },
  {
    id: "pmSjGCTfn8w",
    name: "MALBEC COLOGNE FOR MEN",
    description: "A woody and intense fragrance",
    price: 210,
    imageUrl:
      "https://cdn.shopify.com/s/files/1/0587/6075/7446/files/BT-US_Malbec-Regular-5_3.jpg?v=1719536238&width=1252&crop=center",
  },
  {
    id: "pht4Xx5nHMB",
    name: "ZAAD ARCTIC EAU DE PARFUM FOR MEN",
    description: "A modern and sophisticated fragrance",
    price: 300,
    imageUrl:
      "https://cdn.shopify.com/s/files/1/0587/6075/7446/files/BT-US_Zaad-Arctic-Eau-de-Parfum-3.jpg?v=1718628768&width=1252&crop=center",
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
          description: product.description,
          imageUrl: product.imageUrl,
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
