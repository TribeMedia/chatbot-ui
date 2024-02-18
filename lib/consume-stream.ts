export async function consumeReadableStream(
  stream: ReadableStream<Uint8Array> | null,
  callback: (chunk: string) => void,
  signal: AbortSignal,
  url: string, // URL is needed for the SSE fallback
  timeoutDuration: number = 10000
): Promise<void> {
  if (stream) {
    let reader = stream.getReader()
    const decoder = new TextDecoder()

    try {
      const { done, value } = await reader.read()
      if (done || !value) {
        console.log("Stream has ended or no data received, attempting SSE.")
        reader.releaseLock()
        consumeSSE(url, callback, signal, timeoutDuration)
        return
      }

      // Process the first chunk of data
      const text = decoder.decode(value, { stream: true })
      callback(text)

      // Continue reading and processing the rest of the stream
      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          console.log("Stream has ended.")
          break
        }
        const text = decoder.decode(value, { stream: true })
        callback(text)
      }
    } catch (error) {
      console.error("Error consuming stream:", error)
    } finally {
      reader.releaseLock()
    }
  } else {
    console.log("Stream is null, attempting SSE directly.")
    consumeSSE(url, callback, signal, timeoutDuration)
  }
}

function consumeSSE(
  url: string,
  callback: (data: string) => void,
  signal: AbortSignal,
  timeoutDuration: number
): void {
  const eventSource = new EventSource(url, { withCredentials: true })

  eventSource.onmessage = event => {
    console.log("Message from SSE:", event.data)
    callback(event.data)
  }

  eventSource.onerror = error => {
    console.error("SSE error:", error)
    eventSource.close()
  }

  signal.addEventListener(
    "abort",
    () => {
      console.log("Stream aborted by the user.")
      eventSource.close()
    },
    { once: true }
  )
}
