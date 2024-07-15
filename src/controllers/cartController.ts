import { Request, Response } from "express"
import { z } from "zod"

import db from "@/lib/database"
import { logger } from "@/lib/logger"

const createCart = async (req: Request, res: Response) => {
  const bodySchema = z.object({
    sessionId: z.string(),
  })

  const { sessionId } = bodySchema.parse(req.body)

  if (!sessionId) {
    return res.status(400).json({ error: "sessionId is required" })
  }

  const cart = await db.cart.create({
    data: {
      sessionId,
      total: 0,
    },
  })

  logger.info(`Cart with id ${cart.id} created`)

  res.json(cart)
}

const getCartById = async (req: Request, res: Response) => {
  const { id, sessionId } = req.params

  if (!id && !sessionId) {
    return res.status(400).json({ error: "id or sessionId is required" })
  }

  const cart = await db.cart.findUnique({
    where: { id, sessionId },
    include: { items: { include: { product: true } } },
  })

  if (!cart) {
    return res.status(404).json({ error: "Cart not found" })
  }

  return res.json(cart)
}

const addItemToCart = async (req: Request, res: Response) => {
  const bodySchema = z.object({
    cartId: z.string(),
    productId: z.string(),
  })

  const { cartId, productId } = bodySchema.parse(req.body)

  if (!cartId || !productId) {
    return res.status(400).json({ error: "cartId and productId are required" })
  }

  const cart = await db.cart.findUnique({
    where: { id: cartId },
    include: { items: true },
  })

  if (!cart) {
    return res.status(404).json({ error: "Cart not found" })
  }

  const product = await db.product.findUnique({ where: { id: productId } })

  if (!product) {
    return res.status(404).json({ error: "Product not found" })
  }

  const existingItem = cart.items.find(item => item.productId === productId)

  if (existingItem) {
    await db.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + 1 },
    })

    const updatedCart = await db.cart.update({
      where: { id: cartId },
      data: {
        total: {
          increment: product.price * existingItem.quantity,
        },
        updatedAt: new Date(),
      },
      include: { items: true },
    })

    return res.json({ cart: updatedCart })
  }

  await db.cartItem.create({
    data: {
      cartId,
      productId,
      quantity: 1,
    },
  })

  const updatedCart = await db.cart.update({
    where: { id: cartId },
    data: {
      total: {
        increment: product.price,
      },
      updatedAt: new Date(),
    },
    include: { items: true },
  })

  return res.json({ cart: updatedCart })
}

const removeItemFromCart = async (req: Request, res: Response) => {
  const bodySchema = z.object({
    cartId: z.string(),
    productId: z.string(),
  })

  const { cartId, productId } = bodySchema.parse(req.body)

  const cartItem = await db.cartItem.findFirst({
    where: { cartId, productId },
    include: { product: true },
  })

  if (!cartItem) {
    return res.status(404).json({ error: "Item not found in cart" })
  }

  if (cartItem.quantity > 1) {
    await db.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity: cartItem.quantity - 1 },
    })
  } else {
    await db.cartItem.delete({ where: { id: cartItem.id } })
  }

  const cart = await db.cart.update({
    where: { id: cartId },
    data: { total: { decrement: cartItem.product.price } },
    include: { items: { include: { product: true } } },
  })

  res.json({ cart })
}

const deleteCart = async (req: Request, res: Response) => {
  const { id } = req.params

  if (!id) {
    return res.status(400).json({ error: "id is required" })
  }

  await db.cart.delete({ where: { id }, include: { items: true } })

  logger.info(`Cart with id ${id} deleted`)

  res.status(204).send()
}

export default {
  createCart,
  getCartById,
  addItemToCart,
  removeItemFromCart,
  deleteCart,
}
