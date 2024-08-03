import { initializeSocketServer } from "@/utils/chat/socketServer";

export const config = {
  api: {
    bodyParser: false, // Disable body parsing for just this endpoint, we'll handle raw requests
  },
};

export default async function handler(req, res) {
  const io = res.socket.server.io;

  //checks if a Socket.io instance (io) is already attached to the nextjs HTTP server (res.socket.server).
  if (!io) {
    console.log("*First time, starting socket.io");

    //note: HTTP server instance (res.socket.server) that Next.js manages which is managing HTTP requests and responses for this API route.
    //it already exists in nextjs
    initializeSocketServer(res.socket.server);
  }

  res.end();
}
