import express from "express"
import env from "./config/env.config.js"
import database from "./boot/database.boot.js"
import apiRoute from "./routes/api.route.js"
import authRoute from "./routes/auth.route.js"

//

const app = express()

await database.boot()

//

app.use("/api", apiRoute.router)
app.use("/auth", authRoute.router)

app.listen(env.port, env.host, () => console.log(`Proxy active on http://${env.host}:${env.port}.`))