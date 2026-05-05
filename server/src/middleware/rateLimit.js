const buckets = new Map()

export const rateLimit = ({
  windowMs = 60_000,
  max = 10,
  keyGenerator,
} = {}) => {
  return (req, res, next) => {
    const key = keyGenerator ? keyGenerator(req) : `${req.ip}:${req.path}`

    const now = Date.now()
    const bucket = buckets.get(key)

    if (!bucket || now > bucket.resetAt) {
      buckets.set(key, { count: 1, resetAt: now + windowMs })
      return next()
    }

    if (bucket.count >= max) {
      const waitSec = Math.ceil((bucket.resetAt - now) / 1000)
      return res.status(429).json({
        error: `Too many requests. Try again in ${waitSec} seconds.`,
      })
    }

    bucket.count += 1
    next()
  }
}

// Clean up old buckets periodically so memory doesn't grow forever
setInterval(() => {
  const now = Date.now()
  for (const [key, bucket] of buckets) {
    if (now > bucket.resetAt) buckets.delete(key)
  }
}, 60_000) // every minute
