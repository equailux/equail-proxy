import express from "express"
import apiController from "../controllers/api.controller.js"
import logMiddleware from "../middlewares/log.middleware.js"

//

const router = express.Router()
router.use(express.json())
router.use(logMiddleware.log)
router.post("/", apiController.post)

//

export default { router }
