import { RequestHandler } from "express";
import { Api } from "../models/api.model.js";
import { ApiCreateSchema } from "../schemas/api.schema.js";

//

const post: RequestHandler = async (req, res, next) => {
    const { data, error, success } = ApiCreateSchema.safeParse(req.body)
    if (!success) return res.status(400).send(error.issues.at(0)?.message)

    const api = await Api.create(data, { raw: true })
    res.send(api)
}

//

export default { post }
