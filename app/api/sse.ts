// pages/api/sse.ts

import { NextApiRequest, NextApiResponse } from "next"

// Map to store client connections
const clients = new Map<number, NextApiResponse>()

// Function to broadcast a message to all clients
const broadcastEvent = (data: object) => {
  for (const [clientId, clientRes] of clients) {
    clientRes.write(`data: ${JSON.stringify(data)}\n\n`)
  }
}

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  // Set headers for SSE
  res.setHeader("Content-Type", "text/event-stream")
  res.setHeader("Cache-Control", "no-cache")
  res.setHeader("Connection", "keep-alive")
  res.setHeader("Access-Control-Allow-Origin", "*")

  // Generate a unique ID for the client
  const clientId = Date.now() + Math.random() // Example ID generation strategy

  // Add this client to the map
  clients.set(clientId, res)

  // Function to send a message to a specific client
  const sendEventToClient = (clientId: number, data: object) => {
    const clientRes = clients.get(clientId)
    if (clientRes) {
      clientRes.write(`data: ${JSON.stringify(data)}\n\n`)
    }
  }

  // Example: Send a welcome message to this client
  sendEventToClient(clientId, { message: "Connected to SSE" })

  // Handle client disconnection
  req.on("close", () => {
    clients.delete(clientId) // Remove the client from the map
    res.end()
  })
}

// Example usage: Broadcast a message every 30 seconds
setInterval(() => {
  const message = { time: new Date().toISOString() }
  broadcastEvent(message)
}, 30000)

// Continue in pages/api/sse.ts
// pages/api/sse.ts

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set headers for SSE
  res.setHeader("Content-Type", "text/event-stream")
  res.setHeader("Cache-Control", "no-cache")
  res.setHeader("Connection", "keep-alive")
  res.setHeader("Access-Control-Allow-Origin", "*")

  // Example data streaming
  const intervalId = setInterval(() => {
    res.write(`data: ${JSON.stringify({ message: "Hello from SSE" })}\n\n`)
  }, 1000)

  req.on("close", () => {
    clearInterval(intervalId)
    res.end()
  })
}
