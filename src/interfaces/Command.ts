import { CommandInteraction, ChatInputApplicationCommandData, Client } from "discord.js";
import commandCategory from "../enum/CommandsCategory";

export interface Command extends ChatInputApplicationCommandData {
    category: commandCategory,
    showHelp: boolean,
    helpDescription: string,
    run: (client: Client, interaction: CommandInteraction) => void;
}