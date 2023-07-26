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
    run: async (client: Client, interaction: CommandInteraction) => {
        // const content = "Hello there!";

        // await interaction.followUp({
        //     ephemeral: true,
        //     content: content
        // });
        const charaClient = new Character();
        const character = await charaClient.searchCharacter("Marin Kitagawa");
        console.log(character);
        
        // await interaction.followUp({
        //     ephemeral: true,
        //     content: character.toString()
        // });
    }
};