import { Router } from "express"

import cartController from "@/controllers/cart.controller"
import productController from "@/controllers/product.controller"

const routes = Router()

routes.get("/products", productController.getProducts)
routes.post("/cart", cartController.createCart)
routes.get("/cart/:id", cartController.getCartById)
routes.post("/cart/items", cartController.addItemToCart)
routes.delete("/cart/items", cartController.removeItemFromCart)
routes.delete("/cart/:id", cartController.deleteCart)

export default routes
