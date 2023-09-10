import { CommandInteraction, Client, ApplicationCommandOptionType, ButtonInteraction, StringSelectMenuInteraction, ComponentType, Message, RESTJSONErrorCodes } from "discord.js";
import { Command } from "../interfaces/Command";
import commandCategory from "../enum/CommandsCategory";
import { Character } from "@shineiichijo/marika";
import { pbUser } from "../interfaces/PocketbaseUser";
import { pb } from "../database";
import { Collectors } from "../Collectors";
import { YesNoRow } from "../AutoCommands/YesNoRow";
export const Follow: Command = {
    name: "follow",
    description: "followuje urzytkownika",
    type: 1,
    options: [
        {
            name: "target-user",
            description: "the users you want to follow",
            type: ApplicationCommandOptionType.Mentionable,
            required: true
        }
    ],
    category: commandCategory.Fun,
    showHelp: true,
    helpDescription: "followuje urzytkownika",
    run: async (client: Client, interaction: CommandInteraction) => {
        const mentionUserId = interaction.options.get('target-user')?.value
        const interactionUserId = interaction.user.id

        let user: pbUser, targetUser: pbUser = {
            avatar: "",
            collectionId: "",
            collectionName: "",
            created: "",
            email: "",
            emailVisibility: false,
            followers: [],
            following: [],
            id: "",
            privation: "",
            updated: "",
            userId: "",
            username: "",
            verified: false,
            expand: {},
            request: [],
            notification: ""
        };
        try {
            user = await pb.collection('users').getFirstListItem('userId="' + interactionUserId + '"');
        } catch (error: any) {
            return await interaction.followUp({
                ephemeral: true,
                content: "nie posiadasz profilu"
            });
        }
        try {
            targetUser = await pb.collection('users').getFirstListItem('userId="' + mentionUserId + '"');
        } catch (error: any) {
            return await interaction.followUp({
                ephemeral: true,
                content: "urzytkownik którego próbujesz followowac nie posiada profilu"
            });
        }
        if(targetUser.followers.includes(user.id)){
            return await interaction.followUp({
                ephemeral: true,
                content: "już followujesz tego usera"
            });
        }
        if(targetUser.id == user.id){
            return await interaction.followUp({
                ephemeral: true,
                content: "nie możesz follować samego siebie"
            });
        }
        
        let reply: Message<boolean>
        if (targetUser.privation == "private") {
            const YesNo = YesNoRow()
            reply = await interaction.followUp({
                content: "Profil użytkownija jest prywatny. Czy wysłac proźbe o followanie",
                components: [YesNo]
            });
            const filter = (i: ButtonInteraction | StringSelectMenuInteraction) => {
                return i.user.id === interaction.user.id
            }

            const collecorButtons = reply.createMessageComponentCollector({
                componentType: ComponentType.Button,
                filter,
                time: 1000 * 30
            })
            Collectors.set("FollowButtons" + interaction.id, interaction.id)
            collecorButtons.on('collect', async (buttonInteraction: ButtonInteraction) => {
                await buttonInteraction.deferUpdate()
                switch (buttonInteraction.customId) {
                    case "no":
                        await reply.edit({
                            content: "Anulowano prośbe",
                            components: []
                        });
                        break;

                    case "yes":
                        if(targetUser.request.includes(user.id)){
                            await reply.edit({
                                content: "Ten użytkownij ma już twoją proźbe",
                                components: []
                            });
                        }else{
                            if(targetUser.notification == "all"){
                                const userObject = await interaction.guild?.members.fetch(targetUser.userId);
                                // console.log(userObject);
                                
                                    userObject?.send("Masz nową prośbe o zezwolenie na follow od "+ user.username+ " - <@"+user.userId+">").catch(error => {
                                        
                                            console.error('Failed to delete the message:', error);
                                        
                                    });
                                
                                
                            }
                            targetUser.request.push(user.id)
                            await pb.collection('users').update(targetUser.id, targetUser);
                            
                            await reply.edit({
                                content: "Wysłano prośbe",
                                components: []
                            });
                        }
                        

                        break

                }
            })


            collecorButtons.on("end", async () => {
                Collectors.delete("FollowButtons" + interaction.id)
            })
            return

        }else{
            targetUser.followers.push(user.id)

            user.following.push(targetUser.id)
            await pb.collection('users').update(user.id, user);
            await pb.collection('users').update(targetUser.id, targetUser);
    
            return await interaction.followUp({
                ephemeral: true,
                content: "pomyślnie zafollowawałes tego uzytkownika"
            });
        }

        

    }
};