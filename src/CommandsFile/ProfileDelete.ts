import { CommandInteraction, Client, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, ButtonInteraction, APIEmbed, JSONEncodable } from "discord.js";
import { Command } from "../interfaces/Command";
import commandCategory from "../enum/CommandsCategory";
import { Character } from "@shineiichijo/marika";
import { pb } from "../database";
import embeds from "../config";
import { Collectors } from "../Collectors";
export const ProfileDelete: Command = {
    name: "profile-delete",
    description: "Deleting yours profile",
    type: 1,
    category: commandCategory.Profile,
    showHelp: true,
    helpDescription: "Deleting yours profile",
    run: async (client: Client, interaction: CommandInteraction) => {
        let embed: APIEmbed = {
            title: "You dont have Profile",
            description: "You can create profile under /profile",
            author:{
                name: interaction.user.username,
                icon_url: interaction.user.displayAvatarURL()
            },
            color: parseInt(embeds.color, 16),
            footer: {
                text: embeds.footer
            }
            
        }
        let user: { id: any; };
            try {
                user = await pb.collection('users').getFirstListItem('userId="'+interaction.user.id+'"');
            } catch (error: any) {
                    return await interaction.followUp({
                        embeds: [embed],
                        ephemeral: true
                    })
                    
                    

                }
        


        embed.title = "Are you sure?"
        embed.description = undefined;
        
        const yes = new ButtonBuilder()
                    .setLabel('✅')
                    .setCustomId("yes")
                    .setStyle(ButtonStyle.Primary);
        

        const no = new ButtonBuilder()
                    .setLabel('❌')
                    .setCustomId("no")
                    .setStyle(ButtonStyle.Primary);
        
        const row: any = new ActionRowBuilder().addComponents([yes, no])

        const reply = await interaction.followUp({
            ephemeral: true,
            embeds: [embed],
            components: [row]
        });

        const filter = (i: ButtonInteraction) =>{
            return i.user.id === interaction.user.id
        }

        const collecor = reply.createMessageComponentCollector({
                componentType: ComponentType.Button,
                filter,
                max: 1,
                time: 1000 * 30
        })
        Collectors.set("ProfileDelete"+interaction.id, interaction.id)
        collecor.on('collect', async (buttonInteraction: ButtonInteraction) =>{
            await buttonInteraction.deferReply()
            yes.setDisabled(true)
            no.setDisabled(true)
            reply.edit({
                embeds: [embed],
                components: [row]
            })

            if(buttonInteraction.customId == "no"){
                embed.title = "Canceled"

                await buttonInteraction.followUp({
                    ephemeral: true,
                    embeds: [embed]
                });
            }else{
                embed.title = "Your accont has been deleted"
                await pb.collection('users').delete(user.id);
                await buttonInteraction.followUp({
                    ephemeral: true,
                    embeds: [embed]
                });
                
            }
            
        })


        collecor.on("end", async () =>{
            Collectors.delete("ProfileDelete"+interaction.id)
        })


        
        
    }
};