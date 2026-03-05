import express from "express"
import httpProxy from "http-proxy"
import z from "zod"

//

// --- Instances
const app = express()
const proxy = httpProxy.createProxyServer({ changeOrigin: true, preserveHeaderKeyCase: true, xfwd: false })

// --- Predefined
app.get("/", (_, res) => res.send("I am api only."))

// --- Target Url
let target = process.env.TARGET || "https://equail-api-v1.onrender.com"
console.info(`[Proxy]: Initial target set to ${target}.`)

// --- Target Changer
app.post("/target", express.json(), (req, res) => {
    const schema = z.object({ target: z.url() })
    const { data, error, success } = schema.safeParse(req.body)
    if (!success) return res.status(400).send(error.issues.at(0)?.message)
    
    console.info(`[Proxy]: Target changed to ${data.target}.`)
    target = data.target
    return res.send(target)
})

// --- Proxy All Traffic
app.use((req, res, next) => { console.info(`[Proxy]: ${req.ip} ${req.method} ${req.originalUrl}.`); next() })
app.use((req, res) => proxy.web(req, res, { target }))

// --- Show Proxy Error
proxy.on("error", (err, req, res) => {
    console.error(`[Proxy]: ${err?.message}.`, err)
    if (!(res as any)?.headersSent) (res as any)?.writeHead(500, { "Content-Type": "text/plain" })
    res.end(`[Proxy]: We couldn't pass your request.`)
})

// --- Listen
const [host, port] = [process.env.HOST || "0.0.0.0", Number(process.env.PORT || 3128)]
app.listen(port, host, () => console.log(`[Proxy]: Proxy active on http://${host}:${port}.`))

// --- Heart Beat
setInterval(() => fetch(process.env.SELF || "").catch(() => {}), 60 * 1000)

//
