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
  .command('math', c => c.resDefer(cfai, 'math'))
  .command('image', c => c.resDefer(cfai, 'image'))
  .command('image-genshin', c => c.resDefer(cfai, 'genshin'))
  .command('ja2en', c => c.resDefer(cfai, 'ja2en'))

export default app

/**
 * AIの処理 ⇒ Discordの待機中メッセージへ送信
 * @param c Context
 * @param type AI type
 */
const cfai = async (c: CommandContext<Env>, type: 'text' | 'code' | 'math' | 'image' | 'genshin' | 'ja2en') => {
  try {
    const ai = new Ai(c.env.AI)
    const prompt = (c.values.prompt || '').toString()
    const translation = c.values.translation === false ? false : true
    let content = ''
    let blobs: Blob[] = []
    switch (type) {
      case 'text':
        content = '```' + prompt + '```' + (await trans(t2t, ai, prompt, translation))
        break
      case 'code':
        content = '```' + prompt + '```' + (await trans(t2c, ai, prompt, translation))
        break
      case 'math':
        content = '```' + prompt + '```' + (await trans(t2m, ai, prompt, translation))
        break
      case 'image':
        content = '```' + prompt + '```'
        blobs = await Promise.all([0, 1, 2].map(_ => image(ai, prompt)))
        break
      case 'genshin':
        const p = sdxlGenshin(c.values.character.toString(), prompt)
        content = '```' + p + '```'
        blobs = await Promise.all([0, 1, 2].map(_ => image(ai, p)))
        break
      case 'ja2en':
        content = await ja2en(ai, prompt)
        break
    }
    if (!blobs[0]) await c.followup(content)
    else
      await c.followup(
        { content },
        blobs.map(blob => ({ blob, name: 'image.png' })),
      )
  } catch (e) {
    await c.followup('AI周りでエラーが発生しました')
    console.log(e)
  }
}

const trans = async (model: (ai: any, p: string) => Promise<string>, ai: any, p: string, translation: boolean) => {
  if (!translation) return await model(ai, p)
  const res = await model(ai, await m2m(ai, p, 'japanese', 'english'))
  const enTexts = res.split('```')
  const jaTexts = await Promise.all(
    enTexts.map((e, i) => {
      if (i % 2 !== 0) return e
      return m2m(ai, e, 'english', 'japanese')
    }),
  )
  return jaTexts.join('```')
}
const image = async (ai: any, prompt: string) => new Blob([await t2i(ai, prompt)])
const ja2en = async (ai: any, prompt: string) => {
  const reply1 = await m2m(ai, prompt, 'japanese', 'english')
  const reply2 = await m2m(ai, reply1, 'english', 'japanese')
  return (
    '```' +
    prompt +
    '```:arrow_down:    English    :arrow_down:```' +
    reply1 +
    '```:arrow_down:    日本語    :arrow_down:```' +
    reply2 +
    '```'
  )
}

// ai core
const t2t = async (ai: any, prompt: string) =>
  (await ai.run('@cf/openchat/openchat-3.5-0106', { prompt })).response as string
const t2c = async (ai: any, prompt: string) =>
  (await ai.run('@hf/thebloke/deepseek-coder-6.7b-instruct-awq', { prompt })).response as string
const t2m = async (ai: any, prompt: string) =>
  (await ai.run('@cf/deepseek-ai/deepseek-math-7b-instruct', { prompt })).response as string
const t2i = async (ai: any, prompt: string) =>
  (await ai.run('@cf/stabilityai/stable-diffusion-xl-base-1.0', { prompt, num_steps: 20 })) as ArrayBuffer
//const t2i = async (ai: any, prompt: string) =>
//  (await ai.run('@cf/lykon/dreamshaper-8-lcm', { prompt, num_steps: 10 })) as ArrayBuffer
//const t2i = async (ai: any, prompt: string) =>
//  (await ai.run('@cf/bytedance/stable-diffusion-xl-lightning', { prompt, num_steps: 1 })) as ArrayBuffer
const m2m = async (ai: any, text: string, source_lang: string, target_lang: string) =>
  (await ai.run('@cf/meta/m2m100-1.2b', { text, source_lang, target_lang })).translated_text as string
