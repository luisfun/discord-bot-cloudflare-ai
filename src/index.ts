import { Ai } from '@cloudflare/ai'
import type { CommandContext } from 'discord-hono'
import { DiscordHono } from 'discord-hono'
import { sdxlGenshin } from './sdxl-genshin'

export type Env = {
  Bindings: {
    AI: any
  }
}

const app = new DiscordHono<Env>()
  .command('text', c => c.resDefer(cfai, 'text'))
  .command('code', c => c.resDefer(cfai, 'code'))
  .command('image', c => c.resDefer(cfai, 'image'))
  .command('image-genshin', c => c.resDefer(cfai, 'genshin'))
  .command('ja2en', c => c.resDefer(cfai, 'ja2en'))

export default app

/**
 * AIの処理 ⇒ Discordの待機中メッセージへ送信
 * @param c Context
 * @param type AI type
 */
const cfai = async (c: CommandContext<Env>, type: 'text' | 'code' | 'image' | 'genshin' | 'ja2en') => {
  try {
    const ai = new Ai(c.env.AI)
    const prompt = (c.values.p || c.values.ja || '').toString()
    let content = ''
    let blob: Blob | undefined = undefined
    switch (type) {
      case 'text':
        content = `> ${prompt}\n\n${await t2t(ai, prompt)}`
        break
      case 'code':
        content = `> ${prompt}\n\n${await t2c(ai, prompt)}`
        break
      case 'image':
        content = '```\n' + prompt + '\n```'
        blob = await image(ai, prompt)
        break
      case 'genshin':
        const p = sdxlGenshin(c.values.c.toString(), prompt)
        content = '```\n' + p + '\n```'
        blob = await image(ai, p)
        break
      case 'ja2en':
        content = await ja2en(ai, prompt)
        break
    }
    if (!blob) await c.followup(content)
    else await c.followup({ content }, { blob, name: 'image.png' })
  } catch (e) {
    await c.followup('AI周りでエラーが発生しました')
    console.log(e)
  }
}

const image = async (ai: any, prompt: string) => new Blob([await t2i(ai, prompt)])
const ja2en = async (ai: any, prompt: string) => {
  const reply1 = await m2m(ai, prompt, 'japanese', 'english')
  const reply2 = await m2m(ai, reply1, 'english', 'japanese')
  return `> ${prompt}\n\`\`\`\n\n${reply1}\n\`\`\`\n> ${reply2}`
}

// ai core
const t2t = async (ai: any, prompt: string) =>
  (await ai.run('@cf/mistral/mistral-7b-instruct-v0.1', { prompt })).response as string
const t2c = async (ai: any, prompt: string) =>
  (await ai.run('@hf/thebloke/deepseek-coder-6.7b-instruct-awq', { prompt })).response as string
const t2i = async (ai: any, prompt: string) =>
  (await ai.run('@cf/stabilityai/stable-diffusion-xl-base-1.0', { prompt, num_steps: 20 })) as ArrayBuffer
const m2m = async (ai: any, text: string, source_lang: string, target_lang: string) =>
  (await ai.run('@cf/meta/m2m100-1.2b', { text, source_lang, target_lang })).translated_text as string
