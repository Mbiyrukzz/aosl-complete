import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const uploadsDir = path.join(__dirname, '../../uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const cvDir = path.join(uploadsDir, 'cvs')
if (!fs.existsSync(cvDir)) {
  fs.mkdirSync(cvDir, { recursive: true })
}

/* ---------- Existing image upload (issues attachments) ---------- */

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, `${unique}${path.extname(file.originalname).toLowerCase()}`)
  },
})

const imageFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error('Only JPG, PNG, GIF, and WebP images are allowed'))
  }
  cb(null, true)
}

export const upload = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
})

/* ---------- New CV upload (PDF, DOC, DOCX) ---------- */

const cvStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, cvDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    const safeName = file.originalname
      .replace(/[^a-z0-9.-]/gi, '_')
      .toLowerCase()
    cb(null, `${unique}-${safeName}`)
  },
})

const cvFilter = (req, file, cb) => {
  const allowed = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error('CV must be a PDF, DOC, or DOCX file'))
  }
  cb(null, true)
}

export const cvUpload = multer({
  storage: cvStorage,
  fileFilter: cvFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB for CVs
})
