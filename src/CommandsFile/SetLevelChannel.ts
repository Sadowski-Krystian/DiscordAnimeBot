import { CommandInteraction, Client, ChannelType, PermissionFlagsBits } from "discord.js";
import { Command } from "../interfaces/Command";
import commandCategory from "../enum/CommandsCategory";
import { pb } from "../database";
const PocketBase = require('pocketbase/cjs')
export const LevelChannel: Command = {
    name: "levelchannel",
    description: "Set LevelUp Channel",
    type: 1,
    helpDescription: "Set the levelUp Channel",
    options: [
        {
            type: 7,
            required: true,
            name: "channel",
            description: "channel to send level up messages",
            channelTypes: [ChannelType.GuildText]
        }
    ],
    defaultMemberPermissions: PermissionFlagsBits.ManageChannels,
    category: commandCategory.Moderation,
    showHelp: true,
    run: async (client: Client, interaction: CommandInteraction) => {
        if(!interaction.inGuild()){
            return await interaction.followUp({
                ephemeral: true,
                content: "you have to use this command in guild"
            });
        }
        let settings;
            try {
                settings = await pb.collection('guildsSettings').getFirstListItem('guildId = "'+interaction.guild?.id+'"');
            } catch (error: any) {
                if(error.data.code == 404){
                    const data = {
                        "guildId": interaction.guild?.id,
                        "levelChannel": "none",
                        "levelMessage": "none",
                        "enableLevel": false
                    };
                    
                    settings = await pb.collection('guildsSettings').create(data);
                }
             
            }

            if(!settings.enableLevel){
                return await interaction.followUp({
                    ephemeral: true,
                    content: "The rank system is disabled on this server"
                });
            }
            // console.log(interaction.options.get('channel'));
            const option = interaction.options.get('channel')
            const id: any = option?.value
            
            settings.levelChannel = id
            await pb.collection('guildsSettings').update(settings.id, settings);
            await interaction.followUp({
                ephemeral: true,
                content: "channel update sucesfull"
            });
    }
};