import express from "express"
import apiController from "../controllers/api.controller.js"

//

const router = express.Router()
router.use(express.json())
router.post("/", apiController.post)

//

export default { router }
