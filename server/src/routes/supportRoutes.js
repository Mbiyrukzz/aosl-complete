import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js'

const listTicketsRoute = {
  path: '/support/tickets',
  method: 'get',
  middleware: [verifyFirebaseToken],
  handler: async (req, res) => {
    res.json({ tickets: [] })
  },
}

const createTicketRoute = {
  path: '/support/tickets',
  method: 'post',
  middleware: [verifyFirebaseToken],
  handler: async (req, res) => {
    // req.body has the ticket payload
    res.status(201).json({ message: 'ticket created' })
  },
}

export { listTicketsRoute, createTicketRoute }
