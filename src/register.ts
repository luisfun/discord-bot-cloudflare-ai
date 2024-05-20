import { env } from 'node:process'
import { modelMappings } from '@cloudflare/ai'
import { BooleanOption, Command, Option, register } from 'discord-hono'
import { config } from 'dotenv'
config({ path: '.dev.vars' })

const noCatalogModels = [
  '@cf/mistral/mixtral-8x7b-instruct-v0.1-awq',
  '@cf/deepseek-ai/deepseek-coder-7b-instruct-v1.5',
  '@cf/nexaaidev/octopus-v2',
  '@cf/m-a-p/opencodeinterpreter-ds-6.7b',
  '@cf/fblgit/una-cybertron-7b-v2-bf16',
  '@cf/sven/test',
]
const baseTextModels = modelMappings['text-generation'].models.filter(
  m => !m.includes('-lora') && !m.includes('-base') && !noCatalogModels.includes(m),
)
const codeModels = baseTextModels.filter(m => m.includes('code'))
const mathModels = baseTextModels.filter(m => m.includes('math'))
const textModels = baseTextModels.filter(m => !codeModels.includes(m) && !mathModels.includes(m))
const imageModels = modelMappings['text-to-image'].models.filter(
  m => !m.includes('-img2img') && !m.includes('-inpainting'),
)

const options = (promptDesc: string, defaultModel: string, models: string[]) => [
  new Option('prompt', promptDesc).required(),
  new BooleanOption('translation', '自動翻訳（デフォルト True）'),
  new Option('model', `選択モデル（デフォルト ${defaultModel}）`).choices(
    ...models.map(m => ({ name: m.split('/').slice(-1)[0], value: m })).sort((a, b) => a.name.localeCompare(b.name)),
  ),
]

const commands = [
  new Command('text', 'AIチャット').options(...options('AIに聞く内容', 'mistral-7b-instruct-v0.1', textModels)),
  new Command('code', 'コード補助').options(...options('AIに聞く内容', 'deepseek-coder-6.7b-instruct-awq', codeModels)),
  new Command('math', '数学の解決').options(...options('AIに聞く内容', 'deepseek-math-7b-instruct', mathModels)),
  new Command('image', '画像生成').options(...options('画像の要素', 'dreamshaper-8-lcm', imageModels)),
  new Command('image-genshin', '画像生成＋原神プリセット').options(
    new Option('character', 'キャラクター選択')
      .required()
      .choices(
        { name: '神里綾華', value: 'Kamisato Ayaka' },
        { name: '雷電将軍', value: 'Raiden Shogun' },
        { name: '胡桃', value: 'Hu Tao' },
        { name: 'モナ', value: 'Mona' },
      ),
    new Option('prompt', '追加の呪文'),
    new BooleanOption('translation', '自動翻訳（デフォルト True）'),
    new Option('model', '選択モデル（デフォルト stable-diffusion-xl-base-1.0）').choices(
      ...imageModels
        .map(m => ({ name: m.split('/').slice(-1)[0], value: m }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    ),
  ),
  new Command('ja2en', '英語に翻訳').options(new Option('prompt', '翻訳する日本語').required()),
]

register(
  commands,
  env.DISCORD_APPLICATION_ID,
  env.DISCORD_TOKEN,
  //env.DISCORD_TEST_GUILD_ID,
)
