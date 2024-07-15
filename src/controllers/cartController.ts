import { Request, Response } from "express"
import { z } from "zod"

import db from "@/lib/database"

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

  const cart = await db.cart.findUnique({ where: { id: cartId } })

  if (!cart) {
    return res.status(404).json({ error: "Cart not found" })
  }

  const product = await db.product.findUnique({ where: { id: productId } })

  if (!product) {
    return res.status(404).json({ error: "Product not found" })
  }

  let cartItem = await db.cartItem.findFirst({
    where: { cartId, productId },
  })

  if (cartItem) {
    cartItem = await db.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity: cartItem.quantity + 1, price: product.price },
    })
  } else {
    cartItem = await db.cartItem.create({
      data: {
        cartId,
        productId,
        quantity: 1,
        price: product.price,
      },
    })
  }

  const updatedCart = await db.cart.update({
    where: { id: cartId },
    data: {
      items: {
        update: {
          where: { id: cartItem.id },
          data: { quantity: cartItem.quantity, price: cartItem.price },
        },
        create: {
          productId: product.id,
          quantity: cartItem.quantity,
          price: cartItem.price,
        },
      },
      total: cart.total + product.price,
    },
    include: { items: { include: { product: true } } },
  })

  res.json({ cart: updatedCart })
}

const removeItemFromCart = async (req: Request, res: Response) => {
  const bodySchema = z.object({
    cartId: z.string(),
    productId: z.string(),
  })

  const { cartId, productId } = bodySchema.parse(req.body)

  const cartItem = await db.cartItem.findFirst({
    where: { cartId, productId },
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
    data: { total: cartItem.price * -1 },
    include: { items: { include: { product: true } } },
  })

  res.json({ cart })
}

const deleteCart = async (req: Request, res: Response) => {
  const { id } = req.params

  if (!id) {
    return res.status(400).json({ error: "id is required" })
  }

  await db.cart.delete({ where: { id } })

  res.status(204).send()
}

export default {
  createCart,
  getCartById,
  addItemToCart,
  removeItemFromCart,
  deleteCart,
}
