import { Job } from '../models/Job.js'

// Public — list open jobs only
export const listOpenJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'open' })
      .sort({ createdAt: -1 })
      .lean()
    res.json({ jobs })
  } catch (err) {
    console.error('listOpenJobs error:', err)
    res.status(500).json({ error: 'Failed to fetch jobs' })
  }
}

// Public — get a single job by id
export const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).lean()
    if (!job) return res.status(404).json({ error: 'Job not found' })
    res.json({ job })
  } catch (err) {
    console.error('getJob error:', err)
    res.status(500).json({ error: 'Failed to fetch job' })
  }
}

// Admin — list all jobs (open + closed)
export const listAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({}).sort({ createdAt: -1 }).lean()
    res.json({ jobs })
  } catch (err) {
    console.error('listAllJobs error:', err)
    res.status(500).json({ error: 'Failed to fetch jobs' })
  }
}

// Admin — create
export const createJob = async (req, res) => {
  try {
    const job = await Job.create({
      ...req.body,
      createdBy: req.user.uid,
      createdByEmail: req.user.email,
    })
    res.status(201).json({ job: job.toObject() })
  } catch (err) {
    console.error('createJob error:', err)
    res.status(500).json({ error: 'Failed to create job' })
  }
}

// Admin — update
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).lean()
    if (!job) return res.status(404).json({ error: 'Job not found' })
    res.json({ job })
  } catch (err) {
    console.error('updateJob error:', err)
    res.status(500).json({ error: 'Failed to update job' })
  }
}

// Admin — delete
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id).lean()
    if (!job) return res.status(404).json({ error: 'Job not found' })
    res.json({ success: true })
  } catch (err) {
    console.error('deleteJob error:', err)
    res.status(500).json({ error: 'Failed to delete job' })
  }
}
