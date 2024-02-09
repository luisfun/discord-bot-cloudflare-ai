import dotenv from 'dotenv'
import process from 'node:process'
import type { RegisterArg } from 'discord-hono'
import { register } from 'discord-hono'
import { commands } from './commands.js' // '.js' is necessary for 'npm run register'.

dotenv.config({ path: '.dev.vars' })

const arg: RegisterArg = {
  commands: commands,
  applicationId: process.env.DISCORD_APPLICATION_ID,
  token: process.env.DISCORD_TOKEN,
  //guildId: process.env.DISCORD_TEST_GUILD_ID,
}

await register(arg)
