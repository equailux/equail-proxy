import express from "express"
import cors from "cors"
import httpProxy from "http-proxy"
import z from "zod"

//

// --- Instances
const app = express()
const proxy = httpProxy.createProxyServer({ changeOrigin: true, preserveHeaderKeyCase: true, xfwd: false, ws: true })

// --- Cors
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(", "), credentials: true }))

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
    const socket = res as any
    
    if (typeof socket?.write === "function" && typeof socket?.writable === "boolean") {
        if (socket.writable) socket.end()
        return
    }

    if (!socket?.headersSent) socket?.writeHead(500, { "Content-Type": "text/plain" })
    socket?.end(`[Proxy]: We couldn't pass your request.`)
})

// --- Listen
const [host, port] = [process.env.HOST || "0.0.0.0", Number(process.env.PORT || 3128)]
const server = app.listen(port, host, () => console.log(`[Proxy]: Proxy active on http://${host}:${port}.`))

// --- WebSocket
server.on("upgrade", (req, socket, head) => {
    const wsTarget = target.replace(/^https/, "wss").replace(/^http(?!s)/, "ws")
    console.info(`[Proxy]: WS upgrade ${req.url} -> ${wsTarget}.`)
    
    proxy.ws(req, socket, head, { target: wsTarget, changeOrigin: true }, (err) => {
        console.error(`[Proxy]: WS error for ${req.url}: ${err?.message}.`, err)
        socket.destroy()
    })
})

//
