import bcrypt from "bcrypt"
import { RequestHandler } from "express";
import { Op } from "sequelize";
import { Api } from "../models/api.model.js";
import { User } from "../models/user.model.js";
import { UserSignInSchema, UserSignUpSchema } from "../schemas/user.schema.js";

//

const signIn: RequestHandler = async (req, res, next) => {
    const { data, error, success } = UserSignInSchema.safeParse(req.body)
    if (!success) return res.status(400).send(error.issues.at(0)?.message)

    const user = await User.findOne({ where: { email: data.email } })
    if (!user) return res.status(404).send("User not found.")

    const api = await Api.findOne({ where: { email: data.email } })
    if (!api) return res.status(404).send("Device isn't registered.")

    const match = await bcrypt.compare(data.password, api.hash)
    if (!match) return res.status(400).send("Incorrect credentials provided.")
    
    const response = await fetch(api.url, { method: "POST", body: JSON.stringify(data) })
    if (!response.ok) return res.status(response.status).send(await response.text())
    res.send({ ...(await response.json() as object), url: api.url })
}

const signUp: RequestHandler = async (req, res, next) => {
    const { data, error, success } = UserSignUpSchema.safeParse(req.body)
    if (!success) return res.status(400).send(error.issues.at(0)?.message)

    const exists = await User.count({ where: { email: data.email } }) > 0
    if (exists) return res.status(400).send("Email is already used.")

    const password = await bcrypt.hash(data.password, 10)
    const user = await User.create({ ...data, password }, { raw: true })
    res.send(user)
}

//

export default { signIn, signUp }
