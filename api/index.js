import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import multer from 'multer'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/auth.Routes.js'
import userRoutes from './routes/users.Routes.js'
import postRoutes from './routes/posts.Routes.js'
import { register } from './controllers/auth.Controllers.js'
import { createPost } from './controllers/posts.Controllers.js'
import { verifyToken } from './middleware/auth.Middleware.js'
// Estas 3 líneas de abajo son sólo para llenar la torre (pizarra) de la app, poniendo algunos datos en la BD para no empezar sin datos y poder mostrar algo.
// import User from './models/user.Model.js'
// import Posts from './models/posts.Model.js'
// import { users, posts } from './data/index.js'
// Luego en las líneas 64 y 65 ejecuto la acción de pasar los datos a la BD.

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config()
const app = express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(morgan('common'))
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors())
app.use('/assets', express.static(path.join(__dirname, 'public/assets')))

/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/assets')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage })

/* ROUTES WITH FILES */
app.post('/auth/register', upload.single('picture'), register)
app.post('/posts', verifyToken, upload.single('picture'), createPost)

/* ROUTES */
app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/posts', postRoutes)

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001
mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`))
    /* ADD DATA ONLY ONE TIME. */
    // User.insertMany(users)
    // Posts.insertMany(posts)
  })
  .catch((error) => console.log(`${error} did not connect`))
