import type { Env } from '.'
import type { Commands } from 'discord-hono'
import { Command, CommandOption } from 'discord-hono'
import cfai from './cloudflare-ai.js' // '.js' is necessary for 'npm run register'.

// prettier-ignore
export const commands: Commands<Env> = [
  new Command('text', 'AIチャット')
    .option(new CommandOption('p', 'AIに聞く内容').required())
    .option(new CommandOption('s', 'システム用プロンプト'))
    .resDefer(cfai, 'text'),
  new Command('text-en', 'AI chat')
    .option(new CommandOption('p', 'ask AI').required())
    .option(new CommandOption('s', 'system prompt'))
    .resDefer(cfai, 'text-en'),
  new Command('image', '画像生成')
    .option(new CommandOption('p', '画像生成の呪文').required())
    .resDefer(cfai, 'image'),
  new Command('image-genshin', '画像生成＋原神プリセット')
    .option(
      new CommandOption('c', 'キャラクター選択').required().choices([
        { name: '神里綾華', value: 'Kamisato Ayaka' },
        { name: '雷電将軍', value: 'Raiden Shogun' },
        { name: '胡桃', value: 'Hu Tao' },
        { name: 'モナ', value: 'Mona' },
      ]),
    )
    .option(new CommandOption('p', '追加の呪文'))
    .resDefer(cfai, 'genshin'),
  new Command('ja2en', '英語に翻訳')
    .option(new CommandOption('ja', '翻訳する日本語').required())
    .resDefer(cfai, 'ja2en'),
  new Command('code', 'コード生成')
    .option(new CommandOption('p', 'コードの内容').required())
    .resDefer(cfai, 'code'),
]
