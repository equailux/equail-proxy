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

    const body = JSON.stringify(data)
    const apis = await Api.findAll({ where: { online: true }, attributes: ["url", "hash"], raw: true })
    const checks = await Promise.all(apis.map((a) => bcrypt.compare(body, a.hash)))

    const urls = checks
        .map((match, idx) => match ? idx : undefined)
        .filter((idx) => idx !== undefined)
        .map((idx) => apis.at(idx)!.url)
    if (urls.length <= 0) return res.status(404).send("Server might be offline.")

    const requests = urls.map((url) => fetch(url, { method: "POST", body }).catch(() => undefined))
    const results = await Promise.all<Response | undefined>(requests)

    const okidx = results.findIndex((r) => r && r.ok)
    const nokidx = results.findIndex((r) => r && !r.ok)

    if (okidx != -1) res.send({ ...(await results.at(okidx)!.json() as object), url: urls.at(okidx)! })
    else if (nokidx != -1) res.status(results.at(nokidx)!.status).send(results.at(nokidx)!.statusText)
    else return res.status(404).send("Server might be offline.")

    const failures = results
        .map((res, idx) => !!res ? idx : undefined)
        .filter((idx) => idx !== undefined)
        .map((idx) => urls.at(idx)!)
    await Api.update({ online: false }, { where: { url: { [Op.in]: failures } } })
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
