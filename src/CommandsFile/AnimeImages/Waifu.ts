import { CommandInteraction, Client } from "discord.js";
import { Command } from "../../interfaces/Command";
import commandCategory from "../../enum/CommandsCategory";
import { Character } from "@shineiichijo/marika";
import embeds from "../../config";
import { GetImage } from "../../AutoCommands/GetImage";
export const Waifu: Command = {
    name: "waifu",
    description: "Random SFW Waifu Image",
    type: 1,
    category: commandCategory.Fun,
    showHelp: true,
    run: async (client: Client, interaction: CommandInteraction) => {
        const img = await GetImage("waifu", "sfw");
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