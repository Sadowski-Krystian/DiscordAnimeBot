import { CommandInteraction, Client } from "discord.js";
import { Command } from "../../interfaces/Command";
import commandCategory from "../../enum/CommandsCategory";
import { Character } from "@shineiichijo/marika";
import embeds from "../../config";
import { GetImage } from "../../AutoCommands/GetImage";
export const NSFWTrap: Command = {
    name: "nsfwtrap",
    description: "Random NSFW Trap Image",
    type: 1,
    category: commandCategory.Fun,
    showHelp: true,
    nsfw: true,
    run: async (client: Client, interaction: CommandInteraction) => {
        const img = await GetImage("trap", "nsfw");
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