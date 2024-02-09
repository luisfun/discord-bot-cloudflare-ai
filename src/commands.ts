import type { Env } from '.'
import type { Commands } from 'discord-hono'
import { ApplicationCommandOptionType } from 'discord-api-types/v10'
import cfai from './cloudflare-ai'

export const commands: Commands<Env> = [
  [
    {
      name: 'text',
      description: 'AIチャット',
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: 'p',
          description: 'AIに聞く内容',
          required: true,
        },
        {
          type: ApplicationCommandOptionType.String,
          name: 's',
          description: 'システム用プロンプト',
        },
      ],
    },
    c => {
      c.executionCtx.waitUntil(cfai(c, 'text'))
      return c.resDefer()
    },
  ],
  [
    {
      name: 'image',
      description: '画像生成',
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: 'p',
          description: '画像生成の呪文',
          required: true,
        },
      ],
    },
    c => {
      c.executionCtx.waitUntil(cfai(c, 'image'))
      return c.resDefer()
    },
  ],
  [
    {
      name: 'image-genshin',
      description: '画像生成＋原神プリセット',
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: 'c',
          description: 'キャラクター選択',
          choices: [
            { name: '神里綾華', value: 'Kamisato Ayaka' },
            { name: '雷電将軍', value: 'Raiden Shogun' },
            { name: '胡桃', value: 'Hu Tao' },
            { name: 'モナ', value: 'Mona' },
          ],
          required: true,
        },
        {
          type: ApplicationCommandOptionType.String,
          name: 'p',
          description: '追加の呪文',
        },
      ],
    },
    c => {
      c.executionCtx.waitUntil(cfai(c, 'genshin'))
      return c.resDefer()
    },
  ],
  [
    {
      name: 'ja2en',
      description: '英語に翻訳',
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: 'ja',
          description: '翻訳する日本語',
          required: true,
        },
      ],
    },
    c => {
      c.executionCtx.waitUntil(cfai(c, 'ja2en'))
      return c.resDefer()
    },
  ],
  [
    {
      name: 'code',
      description: 'コード生成',
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: 'p',
          description: 'コードの内容',
          required: true,
        },
      ],
    },
    c => {
      c.executionCtx.waitUntil(cfai(c, 'code'))
      return c.resDefer()
    },
  ],
]
