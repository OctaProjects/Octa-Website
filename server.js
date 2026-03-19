import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// cPanel provides PORT in environment variables
const PORT = Number(process.env.PORT || 3000)

const distPath = path.join(__dirname, 'build')

// Serve built assets (Express 5 / path-to-regexp v8 rejects app.get('*', ...))
app.use(express.static(distPath))

// SPA fallback: non-file routes → index.html
app.use((_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

