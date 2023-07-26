import { CommandInteraction, Client, User } from "discord.js";
import { Command } from "../interfaces/Command";
import embeds from "../config"
import { Commands } from "../Commands";
import commandCategory from "../enum/CommandsCategory";

export const Help: Command = {
    name: "help",
    description: "Information about commands",
    type: 1,
    category: commandCategory.Other,
    showHelp: false,
    run: async (client: Client, interaction: CommandInteraction) => {
        const fields = [];
        for (const key in commandCategory) {
            const CategoryNumber = Number(key)
            if (!isNaN(CategoryNumber)) {
                const CategoryName = commandCategory[CategoryNumber]
                const tmpCommand = Commands.filter(x => x.category == CategoryNumber && x.showHelp == true)
                if(tmpCommand.length>0){
                    fields.push({name: `${CategoryName} - ${tmpCommand.length}`, value: tmpCommand.map(x => `\`${x.name}\``).join(' | '), inline: true })
                }   
                
                
          }
        }
        const botUser: User | null = client.user;

        const botUsername = botUser?.username ?? 'Nieznany bot';
        const botAvatarURL = botUser?.avatarURL() ?? '';
        
        const embed = {
            author:{
                name: botUsername,
                icon_url: botAvatarURL  
            },
            color: parseInt(embeds.color, 16),
            description: 'For More information type `/help [command]`',
            fields: fields,
            footer: {
                text: embeds.footer
            }
            
        }

        await interaction.followUp({
            ephemeral: true,
            embeds: [embed]
        });
    }
};