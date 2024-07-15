import { Request, Response } from "express"

import db from "@/lib/database"
import { logger } from "@/lib/logger"

const getProducts = async (_: Request, res: Response) => {
  try {
    const products = await db.product.findMany()

    if (!products) {
      return res.status(404).json({ error: "Products not found" })
    }

    res.json(products)
  } catch (error) {
    logger.error(error)
  }
}

export default { getProducts }
