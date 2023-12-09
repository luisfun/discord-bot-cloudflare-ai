import { Ai } from "@cloudflare/ai"
import sdxlGenshin from "./sdxl-genshin"

/**
 * AIの処理 ⇒ Discordの待機中メッセージへ送信
 * @param type AI type
 * @param env 
 * @param token interaction token
 * @param prompt 
 * @param prompt2 mistral system prompt
 */
const cfai = async (type: `mistral`|`sdxl`|`genshin`|`ja2en`|`code`, env: any, token: string, prompt: string, prompt2?: string) => {
  const url = `https://discord.com/api/v10/webhooks/${env.DISCORD_APPLICATION_ID}/${token}` // DEFERRED_MESSAGEを上書きするURL
  try {
    const ai = new Ai(env.AI)
    let content = prompt
    let imageBuffer: ArrayBuffer | undefined = undefined
    switch(type) {
      case `mistral`:
        content = await mistral(ai, prompt, prompt2)
        break
      case `sdxl`:
        imageBuffer = await sdxl(ai, prompt)
        break
      case `genshin`:
        content = sdxlGenshin(prompt, prompt2)
        imageBuffer = await sdxl(ai, content)
        break
      case `ja2en`:
        content = await ja2en(ai, prompt)
        break
      case `code`:
        content = await codellama(ai, prompt)
        break
    }
    await sendDiscord(url, content, imageBuffer)
  } catch {
    await sendDiscord(url, `AI周りでエラーが発生しました`)
  }
}
export default cfai

const mistral = async (ai: any, prompt: string, system?: string) => {
  const messages = [
    { role: `user`, content: prompt },
    { role: `system`, content: system || `` },
  ]
  const reply = (await ai.run("@cf/mistral/mistral-7b-instruct-v0.1", { messages })).response
  return !system ?
    `### Ask\n${prompt}\n### Reply\n${reply}` :
    `### Ask\n- ${prompt}\n- ${system}\n### Reply\n${reply}`
}

const sdxl = async (ai: any, prompt: string): Promise<ArrayBuffer> => {
  return await ai.run("@cf/stabilityai/stable-diffusion-xl-base-1.0", { prompt })
}

const m2m = async (ai: any, text: string, source_lang: string, target_lang: string): Promise<string> => {
  return (await ai.run("@cf/meta/m2m100-1.2b", { text, source_lang, target_lang, })).translated_text
}

const ja2en = async (ai: any, ja: string) => {
  const reply1 = await m2m(ai, ja, `japanese`, `english`)
  const reply2 = await m2m(ai, reply1, `english`, `japanese`)
  return `### 日本語\n${ja}\n### ⇒English\n${reply1}\n### ⇒日本語\n${reply2}`
}

const codellama = async (ai: any, prompt: string): Promise<string> => {
  const messages = [
    { role: `user`, content: prompt },
  ]
  const reply = (await ai.run("@hf/thebloke/codellama-7b-instruct-awq", { messages })).response
  console.log(reply)
  return `### Ask\n${prompt}\n### Reply\n${reply}`
}

/**
 * テキストと画像を送信
 * @param url 
 * @param content text
 * @param imageBuffer image
 */
const sendDiscord = async (url: string, content: string, imageBuffer?: ArrayBuffer) => {
  const body = new FormData()
  body.append("payload_json", JSON.stringify({ content }))
  if(imageBuffer) body.append("file", new Blob([imageBuffer]), "image.png")
  await fetch(url, { method: "POST", body, })
}
