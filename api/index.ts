import express from "express"
import env from "../src/config/env.config.js"
import database from "../src/boot/database.boot.js"
import apiRoute from "../src/routes/api.route.js"
import authRoute from "../src/routes/auth.route.js"

//

const app = express()

await database.boot()

//

app.use("/", (req, res) => res.send("I am api only."))
app.use("/api", apiRoute.router)
app.use("/auth", authRoute.router)

app.listen(env.port, env.host, () => console.log(`Proxy active on http://${env.host}:${env.port}.`))