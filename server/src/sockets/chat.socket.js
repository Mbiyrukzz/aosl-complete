export const registerChatHandlers = (io, socket) => {
  socket.on('chat:message', (payload) => {
    // Broadcast to everyone in the room
    io.to(payload.room).emit('chat:message', {
      from: socket.user?.email || 'anonymous',
      text: payload.text,
      timestamp: Date.now(),
    })
  })

  socket.on('chat:join', (room) => {
    socket.join(room)
  })
}
