
const sdxlGenshin = (character: string, prompt?: string) =>
  `masterpiece, best quality, genshin, ` + (preset.find(e => e.name===character)?.prompt||``) + (prompt ? `, `+prompt : ``)
export default sdxlGenshin

const preset = [
  {
    name: `Kamisato Ayaka`,
    prompt: `1 girl, ponytail, bluish white hair, blue eyes, big eyes, slender, japanese, blue skirt, long skirt, black torso armor, golden accents, pink cord`,
  },
  {
    name: `Raiden Shogun`,
    prompt: `1 woman, single braid, deep purple hair, purple eyes, big eyes, curvy, purplish white kimono, cleavage, thigh, black tights, reddish purple obi, golden accents`,
  },
  {
    name: `Hu Tao`,
    prompt: `1 girl, black mandarin cap, reddish gray hair, red eyes, big eyes, slender, black coat, shorts, bare legs`,
  },
  {
    name: `Mona`,
    prompt: `1 girl, purple witch's hat, navy hair, twin tails, aqua eyes, big eyes, blue leotard, black tights, star accessories`,
  },
]
