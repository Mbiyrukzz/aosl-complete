import { Company } from '../models/Company.js'
import { User } from '../models/User.js'
import { Package } from '../models/Package.js'
import { Issue } from '../models/Issue.js'

export const migrateToCompanies = async () => {
  console.log('[migration] Checking if company migration is needed...')

  // Check: are there any client users without companyId?
  const orphanClients = await User.countDocuments({
    role: 'client',
    companyId: null,
  })

  if (orphanClients === 0) {
    console.log('[migration] All clients have companies. Skipping.')
    return
  }

  console.log(`[migration] Found ${orphanClients} client(s) needing companies.`)

  // Group existing client users by their old `company` string field.
  // We use raw .find() here without a model filter, then read raw docs,
  // because the schema has dropped the `company` field.
  const rawDocs = await User.collection
    .find({ role: 'client', companyId: null })
    .toArray()

  const groups = new Map() // companyName → [user docs]
  for (const doc of rawDocs) {
    const name = (doc.company || '').trim() || `${doc.email} (personal)`
    if (!groups.has(name)) groups.set(name, [])
    groups.get(name).push(doc)
  }

  console.log(`[migration] Creating ${groups.size} company record(s)...`)

  for (const [companyName, userDocs] of groups) {
    // Default tier — bump manually in the admin UI later if needed
    const company = await Company.create({
      name: companyName,
      tier: 'silver',
      status: 'active',
      primaryContactEmail: userDocs[0].email || '',
    })

    const userIds = userDocs.map((u) => u._id)

    // 1. Link the users
    await User.updateMany({ _id: { $in: userIds } }, { companyId: company._id })

    // 2. Migrate any packages owned by these users → owned by the company
    //    (only matters if you had old packages with userId; new schema doesn't have it)
    await Package.collection.updateMany(
      { userId: { $in: userIds }, companyId: { $exists: false } },
      {
        $set: { companyId: company._id },
        $unset: { userId: '' },
      },
    )

    // 3. Backfill companyId + companyTier on existing issues
    await Issue.updateMany(
      { reporterUid: { $in: userDocs.map((u) => u.uid) }, companyId: null },
      { companyId: company._id, companyTier: 'silver' },
    )

    console.log(
      `[migration]   ✓ Company "${companyName}" — ${userIds.length} user(s)`,
    )
  }

  // 4. Migrate Packages from userId → companyId (if any old shape exists)
  console.log('[migration] Checking packages...')
  const oldPackages = await Package.collection
    .find({ userId: { $exists: true } })
    .toArray()

  for (const pkg of oldPackages) {
    const owner = await User.findById(pkg.userId).lean()
    if (owner?.companyId) {
      await Package.collection.updateOne(
        { _id: pkg._id },
        {
          $set: { companyId: owner.companyId },
          $unset: { userId: '' },
        },
      )
    }
  }
  console.log(`[migration] Migrated ${oldPackages.length} package(s)`)

  // 5. Migrate Reminders from userId-only → companyId + userId
  console.log('[migration] Checking reminders...')
  const oldReminders = await Reminder.collection
    .find({ companyId: { $exists: false } })
    .toArray()

  for (const reminder of oldReminders) {
    if (reminder.userId) {
      const owner = await User.findById(reminder.userId).lean()
      if (owner?.companyId) {
        await Reminder.collection.updateOne(
          { _id: reminder._id },
          { $set: { companyId: owner.companyId } },
        )
      }
    }
  }
  console.log(`[migration] Migrated ${oldReminders.length} reminder(s)`)

  // Drop the old `company` field from User docs (best-effort cleanup)
  await User.collection.updateMany({}, { $unset: { company: '' } })

  console.log('[migration] Done.')
}
