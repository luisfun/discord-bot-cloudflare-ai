import { ApplicationCommandOptionType } from "discord-api-types/v10"

export const TEXT_COMMAND = {
  name: `text`,
  description: `AIチャット`,
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: `p`,
      description: `AIに聞く内容`,
      required: true,
    },
    {
      type: ApplicationCommandOptionType.String,
      name: `s`,
      description: `システム用プロンプト`,
    },
  ],
}

export const IMAGE_COMMAND = {
  name: `image`,
  description: `画像生成`,
  options: [{
    type: ApplicationCommandOptionType.String,
    name: `p`,
    description: `画像生成の呪文`,
    required: true,
  }],
}

export const IMAGE_GENSHIN_COMMAND = {
  name: `image-genshin`,
  description: `画像生成＋原神プリセット`,
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: `c`,
      description: `キャラクター選択`,
      choices: [
        { name: `神里綾華`, value: `Kamisato Ayaka` },
        { name: `雷電将軍`, value: `Raiden Shogun` },
        { name: `胡桃`, value: `Hu Tao` },
        { name: `モナ`, value: `Mona` },
      ],
      required: true,
    },
    {
      type: ApplicationCommandOptionType.String,
      name: `p`,
      description: `追加の呪文`,
    }
  ],
}

export const JA2EN_COMMAND = {
  name: `ja2en`,
  description: `英語に翻訳`,
  options: [{
    type: ApplicationCommandOptionType.String,
    name: `ja`,
    description: `翻訳する日本語`,
    required: true,
  }],
}

export const CODE_COMMAND = {
  name: `code`,
  description: `コード生成`,
  options: [{
    type: ApplicationCommandOptionType.String,
    name: `p`,
    description: `コードの内容`,
    required: true,
  }],
}

/*
export const MISTRAL_COMMAND = {
  name: `mistral`,
  description: `Text Generation. model: mistral-7b-instruct-v0.1`,
}
export const SDXL_COMMAND = {
  name: `sdxl`,
  description: `Text-to-Image. model: stable-diffusion-xl-base-1.0`,
}
export const M2M_COMMAND = {
  name: `m2m`,
  description: `Translate. model: m2m100-1.2b`,
}

export const INVITE_COMMAND = {
  name: `invite`,
  description: `Get an invite link to add the bot to your server`,
};
*/
