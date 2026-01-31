import env from "../config/env.config.js"
import { Sequelize } from "sequelize"
import { Api, apiAttributes, apiOptions } from "src/models/api.model.js"

//

const boot = async () => {
    const { user, pass, host, port, name, dialect } = env.database
    const url = `${dialect}://${user}:${pass}@${host}:${port}`

    const rawsqlize = new Sequelize(url, { logging: false })
    await rawsqlize.query(`CREATE DATABASE IF NOT EXISTS \`${name}\`;`)
    const sequelize = new Sequelize(`${url}/${name}`, { logging: false })

    Api.init(apiAttributes, apiOptions(sequelize))

    await sequelize.authenticate()
    const { sync, alter, force } = env.database
    if (sync) await sequelize.sync({ alter, force })
}

//

export default { boot }
