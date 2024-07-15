import express from "express"
import cron from "node-cron"

import routes from "@/routes"
import { logger } from "@/lib/logger"
import { deleteInactiveCarts } from "@/utils/deleteInactiveCarts"

const app = express()

app.use(express.json())
app.use(routes)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  if (process.env.NODE_ENV === "development") {
    logger.info(`Success! Server is running on port ${PORT}.`)
    logger.info(`Visit http://localhost:${PORT} to see the application.`)
  } else {
    logger.info(`Server is running.`)
  }
})

// Schedule the cart cleanup job to run every 24 hours
cron.schedule("0 0 * * *", () => {
  deleteInactiveCarts().catch(error => {
    logger.error("Error deleting inactive carts", error)
  })
})

export default app
