import dotenv from 'dotenv'
import process from 'node:process'
import { Command, Option, BooleanOption, register } from 'discord-hono'

dotenv.config({ path: '.dev.vars' })

const commands = [
  new Command('text', 'AIチャット').options(
    new Option('prompt', 'AIに聞く内容').required(),
    new BooleanOption('translation', '自動翻訳（デフォルトTrue）'),
  ),
  new Command('code', 'コード生成').options(
    new Option('prompt', 'コードの内容').required(),
    new BooleanOption('translation', '自動翻訳（デフォルトTrue）'),
  ),
  new Command('math', '数学の解決').options(
    new Option('prompt', '解きたい問題').required(),
    new BooleanOption('translation', '自動翻訳（デフォルトTrue）'),
  ),
  new Command('image', '画像生成').options(new Option('prompt', '画像生成の呪文').required()),
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
  ),
  new Command('ja2en', '英語に翻訳').options(new Option('prompt', '翻訳する日本語').required()),
]

await register(
  commands,
  process.env.DISCORD_APPLICATION_ID,
  process.env.DISCORD_TOKEN,
  //process.env.DISCORD_TEST_GUILD_ID,
)
