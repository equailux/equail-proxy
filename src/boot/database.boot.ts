import env from "../config/env.config.js"
import { Sequelize } from "sequelize"
import { Api, apiAttributes, apiOptions } from "../models/api.model.js"
import { User, userAttributes, userOptions } from "../models/user.model.js"

//

const boot = async () => {
    const { user, pass, host, port, name, protocol } = env.database
    const url = `${protocol}://${user}:${pass}@${host}:${port}`
    const sequelize = new Sequelize(`${url}/${name}`, { logging: false })

    Api.init(apiAttributes, apiOptions(sequelize))
    User.init(userAttributes, userOptions(sequelize))

    await sequelize.authenticate()
    const { sync, alter, force } = env.database
    if (sync) await sequelize.sync({ alter, force })
}

//

export default { boot }
