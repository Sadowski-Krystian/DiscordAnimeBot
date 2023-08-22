import { CommandInteraction, Client } from "discord.js";
import { Command } from "../interfaces/Command";
import commandCategory from "../enum/CommandsCategory";
import { Character } from "@shineiichijo/marika";
export const Hello: Command = {
    name: "hello",
    description: "Returns a greeting",
    type: 1,
    category: commandCategory.Fun,
    showHelp: true,
    helpDescription: "Hello command nothing special",
    run: async (client: Client, interaction: CommandInteraction) => {
        const content = "Hello there!";

        await interaction.followUp({
            ephemeral: true,
            content: content
        });
        
    }
};