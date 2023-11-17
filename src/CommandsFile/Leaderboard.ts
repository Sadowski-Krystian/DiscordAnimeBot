import { CommandInteraction, Client, ApplicationCommandOptionType, AttachmentBuilder, APIEmbed, ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";
import { Command } from "../interfaces/Command";
import commandCategory from "../enum/CommandsCategory";
import { Character } from "@shineiichijo/marika";
import { CalculateXp } from "../AutoCommands/CalculateLevels";
import { pb } from "../database";
import embeds from "../config";
const PocketBase = require('pocketbase/cjs')
const canvacord = require("canvacord");
export const leaderboard: Command = {
    name: "leaderboard",
    description: "Shows yours/someone level",
    type: 1,
    category: commandCategory.Fun,
    showHelp: true,
    helpDescription: "Show top 10 peapole",
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
        let record;
            try {
                record = await pb.collection('levels').getList(1, 10, {
                    sort: '-level, -xp',
                })
            } catch (error: any) {
                return await interaction.followUp({
                    content: "Dont find any levels on this server",
                    ephemeral: true
                })
             
            }
        let description = "";
        for(const item of record.items){
            description += "<@"+item.userId+"> - "+item.level+" lvl\n"
            
        }
        const create = new ButtonBuilder()
                    .setLabel('Full Leaderboard')
                    .setURL("https://discord-bot.pockethost.io/leaderboard.html")
                    .setStyle(ButtonStyle.Link);
                    const row: any = new ActionRowBuilder()
                        .addComponents(create);
        const embed: APIEmbed = {
            title: "Tops Levels",
            color: parseInt(embeds.color, 16),
            description: description,
            footer: {
                text: embeds.footer
            }
            
        }

        return await interaction.followUp({
            embeds: [embed],
            components: [row],
            ephemeral: true
        })
        
        
    }
};