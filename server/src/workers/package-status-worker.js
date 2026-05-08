import { Package } from '../models/Package.js'

export const refreshPackageStatuses = async () => {
  const now = new Date()
  const in30Days = new Date(now)
  in30Days.setDate(in30Days.getDate() + 30)

  // Mark expired
  await Package.updateMany(
    {
      status: { $in: ['active', 'expiring_soon'] },
      expiryDate: { $lte: now },
    },
    { status: 'expired' },
  )

  // Mark expiring soon (within 30 days)
  await Package.updateMany(
    {
      status: 'active',
      expiryDate: { $gt: now, $lte: in30Days },
    },
    { status: 'expiring_soon' },
  )

  // Restore active for things pushed further out (e.g. after renewal)
  await Package.updateMany(
    {
      status: 'expiring_soon',
      expiryDate: { $gt: in30Days },
    },
    { status: 'active' },
  )
}

let intervalHandle = null

export const startPackageStatusWorker = (intervalMs = 60 * 60 * 1000) => {
  if (intervalHandle) return
  refreshPackageStatuses().catch((err) =>
    console.error('[package-worker] initial run failed:', err),
  )
  intervalHandle = setInterval(() => {
    refreshPackageStatuses().catch((err) =>
      console.error('[package-worker] tick failed:', err),
    )
  }, intervalMs)
  console.log(
    `✓ Package status worker started (every ${intervalMs / 60_000}min)`,
  )
}
