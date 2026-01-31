import express from "express"
import env from "./config/env.config.js"
import database from "./boot/database.boot.js"

//

const app = express()

await database.boot()

//

app.listen(env.port, env.host, () => console.log(`Api active on http://${env.host}:${env.port}.`))