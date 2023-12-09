import type { MiddlewareHandler } from "hono"
import { verifyKey as discordVerifyKey } from "discord-interactions"

const verifyKey = (): MiddlewareHandler => async (c, next) => {
  const signature = c.req.header("X-Signature-Ed25519")
  const timestamp = c.req.header("X-Signature-Timestamp")
  const body = await c.req.text()
  const isValidRequest = signature && timestamp && discordVerifyKey(body, signature, timestamp, c.env.DISCORD_PUBLIC_KEY)
  if (!isValidRequest || !body) {
    console.log(`Invalid request signature`)
    return c.text(`Bad request signature`, 401)
  }
  return await next()
}
export default verifyKey
