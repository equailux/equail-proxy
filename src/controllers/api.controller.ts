import { RequestHandler } from "express";
import { Api } from "../models/api.model.js";
import { ApiCreateSchema } from "../schemas/api.schema.js";

//

const post: RequestHandler = async (req, res, next) => {
    const { data, error, success } = ApiCreateSchema.safeParse(req.body)
    if (!success) return res.status(400).send(error.issues.at(0)?.message)

    const { url, hash, email } = data
    const [api] = await Api.findOrCreate({ where: { email }, defaults: data })
    api.update({ url, hash, online: true })
    res.send(api.dataValues)
}

//

export default { post }
