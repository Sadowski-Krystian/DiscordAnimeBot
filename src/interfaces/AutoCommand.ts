import { CommandInteraction, ChatInputApplicationCommandData, Client, Message } from "discord.js";
import commandCategory from "../enum/CommandsCategory";

export interface AutoCommand {
    run: (client: Client, message: any) => void;
}