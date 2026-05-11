import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/* ── Directory setup ─────────────────────────────────────── */

const uploadsDir = path.join(__dirname, '../../uploads')
const cvDir = path.join(uploadsDir, 'cvs')
const invoicesDir = path.join(uploadsDir, 'invoices')
const avatarsDir = path.join(process.cwd(), 'uploads/avatars')

for (const dir of [uploadsDir, cvDir, invoicesDir, avatarsDir]) {
  fs.mkdirSync(dir, { recursive: true })
}

/* ── Filters ─────────────────────────────────────────────── */

const imageFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error('Only JPG, PNG, GIF, and WebP images are allowed'))
  }
  cb(null, true)
}

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

// ✅ Fix: dedicated PDF filter for invoice uploads
const pdfFilter = (req, file, cb) => {
  if (file.mimetype !== 'application/pdf') {
    return cb(new Error('Only PDF files are accepted for invoice uploads'))
  }
  cb(null, true)
}

const avatarFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error('Only JPEG, PNG, WEBP, or GIF images allowed'))
  }
  cb(null, true)
}

/* ── Storage configs ─────────────────────────────────────── */

const makeStorage = (destDir) =>
  multer.diskStorage({
    destination: (req, file, cb) => cb(null, destDir),
    filename: (req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
      cb(null, `${unique}${path.extname(file.originalname).toLowerCase()}`)
    },
  })

const avatarStorage = multer.diskStorage({
  destination: avatarsDir,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, `${req.user.uid}-${Date.now()}${ext}`)
  },
})

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

/* ── Exported multer instances ───────────────────────────── */

/** General image upload (issue attachments etc.) */
export const upload = multer({
  storage: makeStorage(uploadsDir),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
})

/** ✅ Fix: eTIMS / invoice PDF upload — stored in uploads/invoices/ */
export const invoiceUpload = multer({
  storage: makeStorage(invoicesDir),
  fileFilter: pdfFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB — PDFs can be larger
})

/** CV upload (PDF / DOC / DOCX) */
export const cvUpload = multer({
  storage: cvStorage,
  fileFilter: cvFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
})

/** Avatar upload */
export const avatarUpload = multer({
  storage: avatarStorage,
  fileFilter: avatarFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
})
