import { CommandInteraction, Client, PermissionFlagsBits } from "discord.js";
import { Command } from "../interfaces/Command";
import commandCategory from "../enum/CommandsCategory";
import { Character } from "@shineiichijo/marika";
import { pb } from "../database";
const PocketBase = require('pocketbase/cjs')
export const RankEnable: Command = {
    name: "rank-enable",
    description: "enable/disable rank system",
    type: 1,
    defaultMemberPermissions: PermissionFlagsBits.ManageGuild,
    category: commandCategory.Moderation,
    showHelp: true,
    helpDescription: "enable/disable rank system",
    run: async (client: Client, interaction: CommandInteraction) => {
        
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

            let msg
            if(settings.enableLevel){
                settings.enableLevel = false
                msg = "Rank system in now disabled"
            }else{
                settings.enableLevel = true
                msg = "Rank system in now enabled"
            }

            await pb.collection('guildsSettings').update(settings.id, settings);
            await interaction.followUp({
                ephemeral: true,
                content: msg
            });
    }
};