import express from "express"
import authController from "../controllers/auth.controller.js"
import logMiddleware from "../middlewares/log.middleware.js"

//

const router = express.Router()
router.use(express.json())
router.use(logMiddleware.log)
router.post("/sign-in", authController.signIn)
router.post("/sign-up", authController.signUp)

//

export default { router }
