import env from "../config/env.config.js"

//

const start = async () => setInterval(() => fetch(env.self), 15000)

//

export default { start }
