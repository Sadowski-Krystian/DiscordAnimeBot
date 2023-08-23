import { CommandInteraction, Client, ApplicationCommandOptionType, AttachmentBuilder } from "discord.js";
import { Command } from "../interfaces/Command";
import commandCategory from "../enum/CommandsCategory";
import { Character } from "@shineiichijo/marika";
import { CalculateXp } from "../AutoCommands/CalculateLevels";
import { pb } from "../database";
const PocketBase = require('pocketbase/cjs')
const canvacord = require("canvacord");
export const Rank: Command = {
    name: "rank",
    description: "Shows yours/someone level",
    type: 1,
    options: [
        {
            name: "target-user",
            description: "the users whos level you want to see",
            type: ApplicationCommandOptionType.Mentionable
        }
    ],
    category: commandCategory.Fun,
    showHelp: true,
    helpDescription: "Shows yours/someone level",
    run: async (client: Client, interaction: CommandInteraction) => {
        if(!interaction.inGuild()){
            return await interaction.followUp({
                ephemeral: true,
                content: "you have to use this command in guild"
            });
        }

        const mentionUserId = interaction.options.get('target-user')?.value
        const targetUserId: any = mentionUserId || interaction.member.user.id
        const targetUserObj = await interaction.guild?.members.fetch(targetUserId);

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
        let record;
            try {
                record = await pb.collection('levels').getFirstListItem('userId="'+targetUserId+'" && guildId = "'+interaction.guild?.id+'"');
            } catch (error: any) {
                if(error.data.code == 404){
                    const data = {
                        "userId": targetUserId,
                        "guildId": interaction.guild?.id,
                        "xp": 0,
                        "level": 0
                    };
                    
                    record = await pb.collection('levels').create(data);
                }
             
            }

            const allLevels: Array<any> = await pb.collection('levels').getFullList({
                sort: 'level, xp',
            });

            const currentRank = allLevels.findIndex((lvl) => lvl.userId == targetUserId) +1
            
            
            const rank = new canvacord.Rank()
                .setAvatar(targetUserObj?.user.displayAvatarURL({size: 256}))
                .setRank(currentRank)
                .setLevel(record.level)
                .setCurrentXP(record.xp)
                .setRequiredXP(CalculateXp(record.level))
                .setStatus(targetUserObj?.presence?.status)
                .setProgressBar("#FFC300", "COLOR")
                .setUsername(targetUserObj?.user.username)

            const data = await rank.build();
            const attachment = new AttachmentBuilder(data)
            await interaction.followUp({
                ephemeral: false,
                files: [attachment]
            });
    }
};