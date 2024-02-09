import type { Context } from 'discord-hono'
import type { Env } from '.'
import { Ai } from '@cloudflare/ai'
import sdxlGenshin from './sdxl-genshin'

/**
 * AIの処理 ⇒ Discordの待機中メッセージへ送信
 * @param c Context
 * @param type AI type
 */
const cfai = async (c: Context<Env>, type: 'text' | 'image' | 'genshin' | 'ja2en' | 'code') => {
  try {
    const ai = new Ai(c.env.AI)
    const prompt = c.command.values[0]
    const prompt2 = c.command.values[1]
    let content = ''
    let imageBuffer: ArrayBuffer | undefined = undefined
    switch (type) {
      case 'text':
        content = await text(ai, prompt, prompt2)
        break
      case 'image':
        content = prompt
        imageBuffer = await image(ai, prompt)
        break
      case 'genshin':
        content = sdxlGenshin(prompt, prompt2)
        imageBuffer = await image(ai, content)
        break
      case 'ja2en':
        content = await ja2en(ai, prompt)
        break
      case 'code':
        content = await code(ai, prompt)
        break
    }
    if (!imageBuffer) await c.followupText(content)
    else await c.followup({ content }, { blob: new Blob([imageBuffer]), name: 'image.png' })
  } catch {
    await c.followupText('AI周りでエラーが発生しました')
  }
}
export default cfai

const text = async (ai: any, prompt: string, system?: string) => {
  const messages = [
    { role: 'user', content: prompt },
    { role: 'system', content: system || '' },
  ]
  const reply = (await ai.run('@cf/mistral/mistral-7b-instruct-v0.1', { messages })).response
  return !system ? `### Ask\n${prompt}\n### Reply\n${reply}` : `### Ask\n- ${prompt}\n- ${system}\n### Reply\n${reply}`
}

const image = async (ai: any, prompt: string): Promise<ArrayBuffer> => {
  return await ai.run('@cf/stabilityai/stable-diffusion-xl-base-1.0', { prompt })
}

const m2m = async (ai: any, text: string, source_lang: string, target_lang: string): Promise<string> => {
  return (await ai.run('@cf/meta/m2m100-1.2b', { text, source_lang, target_lang })).translated_text
}

const ja2en = async (ai: any, ja: string) => {
  const reply1 = await m2m(ai, ja, 'japanese', 'english')
  const reply2 = await m2m(ai, reply1, 'english', 'japanese')
  return `### 日本語\n${ja}\n### ⇒English\n${reply1}\n### ⇒日本語\n${reply2}`
}

const code = async (ai: any, prompt: string): Promise<string> => {
  const messages = [{ role: 'user', content: prompt }]
  const reply = (await ai.run('@hf/thebloke/codellama-7b-instruct-awq', { messages })).response
  // const reply = (await ai.run('@hf/thebloke/deepseek-coder-6.7b-instruct-awq', { messages })).response
  console.log(reply)
  return `### Ask\n${prompt}\n### Reply\n${reply}`
}
