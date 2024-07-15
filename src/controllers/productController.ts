import { Request, Response } from "express"

import db from "../lib/database"

const getProducts = async (req: Request, res: Response) => {
  const products = await db.product.findMany()
  res.json(products)
}

export default { getProducts }
