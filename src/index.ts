import { DiscordHono } from 'discord-hono'
import { commands } from './commands'

type Bindings = {
  AI: any
}
export type Env = { Bindings: Bindings }

const app = new DiscordHono<Env>()
app.setCommands(commands)
export default app
