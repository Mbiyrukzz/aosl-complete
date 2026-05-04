const healthRoute = {
  path: '/health',
  method: 'get',
  middleware: [],
  handler: (req, res) => res.json({ ok: true }),
}

export { healthRoute }
