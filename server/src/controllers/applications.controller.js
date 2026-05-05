import { Application } from '../models/Application.js'
import { Job } from '../models/Job.js'
import { sendEmail } from '../services/email.service.js'

// Public — submit an application (with CV file)
export const submitApplication = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'CV file is required' })
    }

    const { name, email, phone, coverLetter, jobId } = req.body

    if (!name?.trim() || !email?.trim()) {
      return res.status(400).json({ error: 'Name and email are required' })
    }

    // If applying to a specific job, verify it exists and is open
    let jobTitle = ''
    if (jobId) {
      const job = await Job.findById(jobId).lean()
      if (!job) return res.status(404).json({ error: 'Job not found' })
      if (job.status !== 'open') {
        return res
          .status(400)
          .json({ error: 'This job is no longer accepting applications' })
      }
      jobTitle = job.title
    }

    const application = await Application.create({
      jobId: jobId || null,
      jobTitle,
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || '',
      coverLetter: coverLetter?.trim() || '',
      cvFilename: req.file.filename,
      cvOriginalName: req.file.originalname,
      cvUrl: `/uploads/cvs/${req.file.filename}`,
    })

    // Notify admins via email (best effort — don't fail submission if email fails)
    try {
      const subject = jobTitle
        ? `New application: ${name} for ${jobTitle}`
        : `New CV submission: ${name}`
      const html = `
        <h2>${subject}</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        ${jobTitle ? `<p><strong>Position:</strong> ${jobTitle}</p>` : '<p><em>General CV submission (no specific role)</em></p>'}
        ${coverLetter ? `<p><strong>Cover letter:</strong></p><p style="white-space: pre-wrap;">${coverLetter}</p>` : ''}
        <p><strong>CV:</strong> ${req.file.originalname}</p>
        <p><em>View it in the admin dashboard.</em></p>
      `
      const toAddress = process.env.CONTACT_TO_EMAIL || process.env.GMAIL_USER
      await sendEmail({
        to: toAddress,
        subject,
        html,
        text: `${subject}\n\nName: ${name}\nEmail: ${email}\n${phone ? `Phone: ${phone}\n` : ''}${jobTitle ? `Position: ${jobTitle}\n` : 'General CV submission\n'}${coverLetter ? `\nCover letter:\n${coverLetter}` : ''}`,
        replyTo: email,
      })
    } catch (emailErr) {
      console.error('Failed to send application email notification:', emailErr)
      // continue — DB save succeeded, that's what matters
    }

    res.status(201).json({ application: application.toObject() })
  } catch (err) {
    console.error('submitApplication error:', err)
    res.status(500).json({ error: 'Failed to submit application' })
  }
}

// Admin — list all applications
export const listApplications = async (req, res) => {
  try {
    const filter = {}
    if (req.query.jobId) filter.jobId = req.query.jobId
    if (req.query.status) filter.status = req.query.status

    const applications = await Application.find(filter)
      .sort({ createdAt: -1 })
      .limit(200)
      .lean()
    res.json({ applications })
  } catch (err) {
    console.error('listApplications error:', err)
    res.status(500).json({ error: 'Failed to fetch applications' })
  }
}

// Admin — update application status
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body
    const valid = ['new', 'reviewing', 'shortlisted', 'rejected', 'hired']
    if (!valid.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true },
    ).lean()
    if (!application)
      return res.status(404).json({ error: 'Application not found' })
    res.json({ application })
  } catch (err) {
    console.error('updateApplicationStatus error:', err)
    res.status(500).json({ error: 'Failed to update application' })
  }
}
