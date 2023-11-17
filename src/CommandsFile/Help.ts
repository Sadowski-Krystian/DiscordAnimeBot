import { CommandInteraction, Client, User, ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";
import { Command } from "../interfaces/Command";
import embeds from "../config"
import { Commands } from "../Commands";
import commandCategory from "../enum/CommandsCategory";

export const Help: Command = {
    name: "help",
    description: "Information about commands",
    type: 1,
    category: commandCategory.Other,
    options: [
        {
            name: "command",
            type: 3,
            description: "command name"
        }
    ],
    showHelp: false,
    helpDescription: "the help command",
    run: async (client: Client, interaction: CommandInteraction) => {
        const botUser: User | null = client.user;

        const botUsername = botUser?.username ?? 'Nieznany bot';
        const botAvatarURL = botUser?.avatarURL() ?? '';
        if(interaction.options.get('command')){
            const commandName: any = interaction.options.get('command')?.value
            const command = Commands.filter(x=> x.name == commandName)
            if(command.length == 0){
                return await interaction.followUp({
                    ephemeral: true,
                    content: "Wrong command name"
                });
            }
            const description = command[0].helpDescription
            const embed = {
                title: commandName,
                author:{
                    name: botUsername,
                    icon_url: botAvatarURL  
                },
                color: parseInt(embeds.color, 16),
                description: description,
                footer: {
                    text: embeds.footer
                }
                
            }
            return await interaction.followUp({
                ephemeral: true,
                embeds: [embed]
            });
            
        }
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
        
        const create = new ButtonBuilder()
                    .setLabel('Rules')
                    .setURL("https://discord-bot.pockethost.io/rules.html")
                    .setStyle(ButtonStyle.Link);
                    const row: any = new ActionRowBuilder()
                        .addComponents(create);
        const embed = {
            author:{
                name: botUsername,
                icon_url: botAvatarURL  
            },
            color: parseInt(embeds.color, 16),
            description: 'For More information type `/help [command]`',
            fields: fields,
            footer: {
                text: "Using my bot you accept my Rules"
            }
            
        }

        await interaction.followUp({
            ephemeral: true,
            embeds: [embed],
            components: [row]
        });
    }
};