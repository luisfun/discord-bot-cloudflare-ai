import { TEXT_COMMAND, IMAGE_COMMAND, IMAGE_GENSHIN_COMMAND, JA2EN_COMMAND, CODE_COMMAND } from "./commands.js";
import dotenv from "dotenv";
import process from "node:process";

const commands = [TEXT_COMMAND, IMAGE_COMMAND, IMAGE_GENSHIN_COMMAND, JA2EN_COMMAND, CODE_COMMAND];
const guildCommands = [];

dotenv.config({ path: ".dev.vars" });

const token = process.env.DISCORD_TOKEN;
const applicationId = process.env.DISCORD_APPLICATION_ID;
const guildId = process.env.DISCORD_TEST_GUILD_ID;

if (!token) {
  throw new Error(`The DISCORD_TOKEN environment variable is required.`);
}
if (!applicationId) {
  throw new Error(`The DISCORD_APPLICATION_ID environment variable is required.`);
}

const registerGlobalCommands = async () => {
  const url = `https://discord.com/api/v10/applications/${applicationId}/commands`;
  await register(url, `global`);
}
const registerGuildCommands = async () => {
  const url = `https://discord.com/api/v10//applications/${applicationId}/guilds/${guildId}/commands`;
  await register(url);
}

const register = async (url, type) => {
  const response = await fetch(url, {
    headers: {
      "Content-Type": `application/json`,
      Authorization: `Bot ${token}`,
    },
    method: `PUT`,
    body: JSON.stringify(type===`global`?commands:guildCommands),
  });
  
  if (response.ok) {
    console.log(`Registered all commands`);
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } else {
    console.error(`Error registering commands`);
    let errorText = `Error registering commands \n ${response.url}: ${response.status} ${response.statusText}`;
    try {
      const error = await response.text();
      if (error) {
        errorText = `${errorText} \n\n ${error}`;
      }
    } catch (err) {
      console.error(`Error reading body from request:`, err);
    }
    console.error(errorText);
  }  
}

await registerGlobalCommands();
//await registerGuildCommands();
