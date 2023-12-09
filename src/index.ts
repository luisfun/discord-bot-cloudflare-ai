import { Hono } from "hono"
import { InteractionType, InteractionResponseType } from "discord-interactions"
import verifyKey from "./middleware-verify-key"
import * as com from "./commands"
import cfai from "./cloudflare-ai"

type Bindings = {
	AI: any;
}

const deferred = { type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE } // メッセージの返答を待機中にする

const app = new Hono<{ Bindings: Bindings }>()
app.get("*", (c) => c.text(`👋`))
app.use("*", verifyKey())
app.post("/", async (c) => {
	const interaction = JSON.parse(await c.req.text())
	if(interaction.type === InteractionType.PING) { // システムによる応答確認に使用
		return c.json({ type: InteractionResponseType.PONG, })
  }
	if(interaction.type === InteractionType.APPLICATION_COMMAND) {
		const token = interaction.token
		// @ts-expect-error
		const optionValue = (optionName: string): string => interaction.data.options.find(e=>e.name === optionName)?.value||``
		switch(interaction.data.name.toLowerCase()) {
			case com.TEXT_COMMAND.name: {
				const prompt = optionValue(com.TEXT_COMMAND.options[0].name)
				const system = optionValue(com.TEXT_COMMAND.options[1].name)
				c.executionCtx.waitUntil(cfai(`mistral`, c.env, token, prompt, system))
				return c.json(deferred)
			}
			case com.IMAGE_COMMAND.name: {
				const prompt = optionValue(com.IMAGE_COMMAND.options[0].name)
				c.executionCtx.waitUntil(cfai(`sdxl`, c.env, token, prompt))
				return c.json(deferred)
			}
			case com.IMAGE_GENSHIN_COMMAND.name: {
				const prompt = optionValue(com.IMAGE_GENSHIN_COMMAND.options[0].name)
				const prompt2 = optionValue(com.IMAGE_GENSHIN_COMMAND.options[1].name)
				c.executionCtx.waitUntil(cfai(`genshin`, c.env, token, prompt, prompt2))
				return c.json(deferred)
			}
			case com.JA2EN_COMMAND.name: {
				const prompt = optionValue(com.JA2EN_COMMAND.options[0].name)
				c.executionCtx.waitUntil(cfai(`ja2en`, c.env, token, prompt))
				return c.json(deferred)
			}
			case com.CODE_COMMAND.name: {
				const prompt = optionValue(com.CODE_COMMAND.options[0].name)
				c.executionCtx.waitUntil(cfai(`code`, c.env, token, prompt))
				return c.json(deferred)
			}
			default:
				return c.json({ error: `Unknown Type` }, 400)
		}
	}
	return c.json({ error: `Unknown Type` }, 400)
})
app.all("*", (c) => c.text(`Not Found.`, 404))
export default app
