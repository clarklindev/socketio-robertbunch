export function changeNamespace(req, res) {
  const io = res.socket.server.io;

  // manufactured way to change an ns (without building a huge UI)
  if (!io) {
    throw new Error("first initialize socket /api/chat/socket");
  }

  //update namespaces array
  namespaces[0].addRoom(new Room(0, "deleted articles", 0));

  // Emit the change to the namespace
  io.of(namespaces[0].endpoint).emit("nsChange", namespaces[0]);

  // Respond with the updated namespace
  res.json(namespaces[0]);
}
