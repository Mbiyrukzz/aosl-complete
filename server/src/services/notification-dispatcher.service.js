import { sendEmail } from './email.service.js'
import { Notification } from '../models/Notification.js'
import { User } from '../models/User.js'
import {
  reminderEmail,
  invoiceReminderEmail,
  packageExpiryEmail,
  domainRenewalEmail,
} from './reminder-templates.js'

const TEMPLATE_BY_CATEGORY = {
  invoice: invoiceReminderEmail,
  package_expiry: packageExpiryEmail,
  domain_renewal: domainRenewalEmail,
  general: reminderEmail,
  reminder: reminderEmail,
}

// Map reminder categories → notification types
const TYPE_BY_CATEGORY = {
  invoice: 'invoice',
  package_expiry: 'package_expiry',
  domain_renewal: 'domain_renewal',
  support: 'general',
  general: 'reminder',
}

/**
 * Dispatch a notification to a user across enabled channels.
 * Writes a Notification record AND sends via email/whatsapp as configured.
 *
 * @param {Object} params
 * @param {String} params.userId - target user (Mongo _id of the User doc)
 * @param {String} params.title
 * @param {String} params.message
 * @param {String} [params.category='general']
 * @param {Object} [params.channels] - { email, whatsapp, inApp }
 * @param {String} [params.reminderId]
 * @param {String} [params.actionUrl]
 * @param {String} [params.actionLabel]
 */
export const dispatch = async ({
  userId,
  title,
  message,
  category = 'general',
  channels = { email: true, whatsapp: false, inApp: true },
  reminderId = null,
  actionUrl = '',
  actionLabel = '',
}) => {
  const user = await User.findById(userId).lean()
  if (!user) throw new Error(`User ${userId} not found`)

  const userPrefs = user.notificationPrefs || {}
  const finalChannels = {
    email: channels.email && userPrefs.emailIssueUpdates !== false,
    whatsapp: channels.whatsapp,
    inApp: channels.inApp !== false, // default true
  }

  // Create the Notification record (in-app feed entry)
  const notification = await Notification.create({
    recipient: user.uid, // existing field — Firebase UID, not Mongo ID
    type: TYPE_BY_CATEGORY[category] || 'reminder',
    title,
    message,
    actionUrl,
    actionLabel,
    reminderId,
    delivery: {
      email: { attempted: false, delivered: false, error: '' },
      whatsapp: { attempted: false, delivered: false, error: '' },
    },
    read: false,
  })

  // Email channel
  if (finalChannels.email && user.email) {
    const builder = TEMPLATE_BY_CATEGORY[category] || reminderEmail
    try {
      const html = builder({
        name: user.displayName || 'there',
        title,
        message,
        actionUrl,
        actionLabel,
      })
      await sendEmail({
        to: user.email,
        subject: title,
        html,
        text: `${title}\n\n${message}${
          actionUrl ? `\n\n${actionLabel || 'Open'}: ${actionUrl}` : ''
        }`,
      })
      notification.delivery.email = {
        attempted: true,
        delivered: true,
        error: '',
      }
    } catch (err) {
      console.error('Email dispatch failed:', err.message)
      notification.delivery.email = {
        attempted: true,
        delivered: false,
        error: err.message,
      }
    }
  }

  // WhatsApp channel — stubbed
  if (finalChannels.whatsapp && user.phone) {
    try {
      await sendWhatsApp({ to: user.phone, body: `${title}\n\n${message}` })
      notification.delivery.whatsapp = {
        attempted: true,
        delivered: true,
        error: '',
      }
    } catch (err) {
      notification.delivery.whatsapp = {
        attempted: true,
        delivered: false,
        error: err.message,
      }
    }
  }

  await notification.save()
  return notification
}

export const dispatchReminderToCompany = async (reminder) => {
  let recipients = []

  if (reminder.userId) {
    // Targeted at one user
    const user = await User.findById(reminder.userId).lean()
    if (user) recipients = [user]
  } else {
    // Fan out to all client users in the company
    recipients = await User.find({
      companyId: reminder.companyId,
      role: 'client',
    }).lean()
  }

  if (recipients.length === 0) {
    console.warn(
      `[reminder] No recipients for reminder ${reminder._id} (company ${reminder.companyId})`,
    )
    return []
  }

  const results = await Promise.allSettled(
    recipients.map((user) =>
      dispatch({
        userId: user._id,
        title: reminder.title,
        message: reminder.message,
        category: reminder.category,
        channels: reminder.channels,
        reminderId: reminder._id,
      }),
    ),
  )

  return results.map((r) => (r.status === 'fulfilled' ? r.value : null))
}

const sendWhatsApp = async (_params) => {
  throw new Error('WhatsApp not configured yet')
}
