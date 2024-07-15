import db from "@/lib/database"
import { logger } from "@/lib/logger"

export const deleteInactiveCarts = async () => {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

  await db.cart.deleteMany({
    where: {
      updatedAt: {
        lt: twentyFourHoursAgo,
      },
    },
  })

  logger.info("Deleted inactive carts older than 24 hours")
}
