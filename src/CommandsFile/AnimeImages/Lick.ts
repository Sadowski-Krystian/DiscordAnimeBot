import { CommandInteraction, Client } from "discord.js";
import { Command } from "../../interfaces/Command";
import commandCategory from "../../enum/CommandsCategory";
import embeds from "../../config";
import { GetImage } from "../../AutoCommands/GetImage";
export const Lick: Command = {
    name: "lick",
    description: "Random SFW Lick Gif",
    type: 1,
    category: commandCategory.Fun,
    showHelp: true,
    helpDescription: "Random SFW Lick Gif",
    run: async (client: Client, interaction: CommandInteraction) => {
        const img = await GetImage("lick", "sfw");
        const embed = {
            color: parseInt(embeds.color, 16),
            image: {
                url: img,
            },
            footer: {
                text: embeds.footer
            }
            
        }
        if(img == "error"){
            return interaction.followUp({
                ephemeral: true,
                content: "Error to get an image"
            });
        }
        await interaction.followUp({
            ephemeral: true,
            embeds: [embed]
        });
    }
};