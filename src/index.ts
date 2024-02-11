import { DiscordHono } from 'discord-hono'
import { commands } from './commands'

export type Env = {
  Bindings: {
    AI: any
  }
}

const app = new DiscordHono<Env>()
app.setCommands(commands)
export default app
