import mongoose from 'mongoose'

const siteSchema = new mongoose.Schema(
  {
    // e.g. "SR", "PR", "HQ", "MLD" — matched against the prefix of the
    // M-Pesa BillRefNumber (account number) sent by the paying customer.
    prefix: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: { type: String, required: true },

    // "local"  — this MERN app owns the payment itself, no forwarding.
    // "remote" — forward the raw Daraja payload to another app's own
    //            C2B validation/confirmation endpoint.
    type: { type: String, enum: ['local', 'remote'], default: 'remote' },

    // Internal, server-to-server URLs on the destination app's own domain.
    // Never registered with Safaricom directly — only ever called by this
    // dispatcher, protected by the shared X-Dispatch-Secret header.
    // e.g. https://hq.ashmif.com/payments/mobile/c2b/validation
    validationUrl: {
      type: String,
      required: function () {
        return this.type !== 'local'
      },
    },
    confirmationUrl: {
      type: String,
      required: function () {
        return this.type !== 'local'
      },
    },

    active: { type: Boolean, default: true },
  },
  { timestamps: true },
)

export const Site = mongoose.model('Site', siteSchema)
