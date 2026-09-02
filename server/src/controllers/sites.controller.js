import { Site } from '../models/Site.js'

export const listSites = async (req, res) => {
  const sites = await Site.find().sort({ prefix: 1 })
  res.json({ sites })
}

export const getSite = async (req, res) => {
  const site = await Site.findById(req.params.id)
  if (!site) return res.status(404).json({ error: 'Site not found' })
  res.json({ site })
}

export const createSite = async (req, res) => {
  const { prefix, name, type, validationUrl, confirmationUrl, active } =
    req.body

  if (!prefix || !name) {
    return res.status(400).json({ error: 'prefix and name are required' })
  }
  if (type !== 'local' && (!validationUrl || !confirmationUrl)) {
    return res.status(400).json({
      error: 'validationUrl and confirmationUrl are required for remote sites',
    })
  }

  try {
    const site = await Site.create({
      prefix: prefix.trim().toUpperCase(),
      name,
      type: type || 'remote',
      validationUrl,
      confirmationUrl,
      active: active ?? true,
    })
    res.status(201).json({ site })
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ error: `Prefix "${prefix}" is already in use` })
    }
    res.status(500).json({ error: err.message })
  }
}

export const updateSite = async (req, res) => {
  const { name, type, validationUrl, confirmationUrl, active } = req.body
  try {
    const site = await Site.findByIdAndUpdate(
      req.params.id,
      { name, type, validationUrl, confirmationUrl, active },
      { new: true, runValidators: true, omitUndefined: true },
    )
    if (!site) return res.status(404).json({ error: 'Site not found' })
    res.json({ site })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const deleteSite = async (req, res) => {
  const site = await Site.findByIdAndDelete(req.params.id)
  if (!site) return res.status(404).json({ error: 'Site not found' })
  res.json({ success: true })
}
