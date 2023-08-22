import { CommandInteraction, Client, PermissionFlagsBits } from "discord.js";
import { Command } from "../interfaces/Command";
import commandCategory from "../enum/CommandsCategory";
const PocketBase = require('pocketbase/cjs')
export const LevelMessage: Command = {
    name: "levelmessage",
    description: "Set LevelUp Message",
    type: 1,
    helpDescription: "Set the levelUp Message \n$user - Level Up user \n$level - user level \nexample use: Congratulation $user you level up to $level level",
    options: [
        {
            type: 3,
            required: true,
            name: "message",
            description: "message to show up after level up on serwer"
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
        const pb = new PocketBase('http://127.0.0.1:8090');
        const authData = await pb.admins.authWithPassword('krystek23s@gmail.com', 'gulgulglut');
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
            // console.log(interaction.options.get('message'));
            const option = interaction.options.get('message')
            const message: any = option?.value
            if(!message.includes('$level')){
                return await interaction.followUp({
                    ephemeral: true,
                    content: "you have to put $level inside your message"
                });
            }
            settings.levelMessage = message
            await pb.collection('guildsSettings').update(settings.id, settings);
            await interaction.followUp({
                ephemeral: true,
                content: "message update sucesfull"
            });
    }
};