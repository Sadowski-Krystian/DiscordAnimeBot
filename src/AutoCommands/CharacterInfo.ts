import { Message, Client } from "discord.js";
import { AutoCommand } from "../interfaces/AutoCommand";

export const CharacterInfo: AutoCommand = {
    run: async (client: Client, message: Message) => {
        console.log(message);
    }
};