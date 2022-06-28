const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const { NotFoundError } = require("./utils/errors")
const { PORT } = require("./config")
const authRoutes = require("./routes/auth")

const app = express()

//enables cross-origins
app.use(cors())

//pare incoming request bodies
app.use(express.json())

//log request info
app.use(morgan("tiny"))

app.use("/auth", authRoutes)

app.use((req, res, next) => {
    return next(new NotFoundError())
})

app.use((err, req, res, next) => {
    const status = err.status || 500
    const message = err.message
    return res.status(status).json({
        error: { message, status }
    })
})

app.listen(PORT, () => {
    console.log(`🚀 Server running http://localhost:${PORT}`)
})

