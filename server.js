import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// cPanel provides PORT in environment variables
const PORT = Number(process.env.PORT || 3000)

const distPath = path.join(__dirname, 'build')

// Serve built assets
app.use(express.static(distPath))

// SPA fallback: always return index.html
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

