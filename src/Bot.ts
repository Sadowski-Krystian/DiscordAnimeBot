import {Client, ClientOptions, GatewayIntentBits} from "discord.js";
import ready from "./listeners/ready";
import interactionCreate from "./listeners/interactionCreate";
import dotenv from "dotenv"
import messageCreate from "./listeners/messageCreate";
import messageUpdate from "./listeners/messageUpdate";
import voiceStateUpdate from "./listeners/voiceStateUpdate";
// global.EventSource = require('eventsource');
dotenv.config();
console.log("Bot is starting...");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildVoiceStates,
        ]
});

ready(client);
interactionCreate(client);
messageCreate(client);
messageUpdate(client);
voiceStateUpdate(client);
client.login(process.env.TOKEN);

console.log(client);
