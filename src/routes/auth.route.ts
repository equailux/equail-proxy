import express from "express"
import authController from "../controllers/auth.controller.js"

//

const router = express.Router()
router.use(express.json())
router.post("/sign-in", authController.signIn)
router.post("/sign-up", authController.signUp)

//

export default { router }
