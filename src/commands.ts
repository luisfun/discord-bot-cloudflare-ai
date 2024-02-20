import { Command, Option } from 'discord-hono'

export const commands = [
  new Command('text', 'AIチャット').options(new Option('p', 'AIに聞く内容').required()),
  new Command('code', 'コード生成').options(new Option('p', 'コードの内容').required()),
  new Command('image', '画像生成').options(new Option('p', '画像生成の呪文').required()),
  new Command('image-genshin', '画像生成＋原神プリセット').options(
    new Option('c', 'キャラクター選択')
      .required()
      .choices(
        { name: '神里綾華', value: 'Kamisato Ayaka' },
        { name: '雷電将軍', value: 'Raiden Shogun' },
        { name: '胡桃', value: 'Hu Tao' },
        { name: 'モナ', value: 'Mona' },
      ),
    new Option('p', '追加の呪文'),
  ),
  new Command('ja2en', '英語に翻訳').options(new Option('ja', '翻訳する日本語').required()),
]
