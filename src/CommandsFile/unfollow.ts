import { CommandInteraction, Client, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, ActionRowBuilder, ButtonInteraction, ComponentType, SelectMenuBuilder, Component, AnyComponent, BaseSelectMenuBuilder, SelectMenuComponentOptionData, StringSelectMenuComponentData, BaseSelectMenuComponentData, ActionRow, ActionRowData, ModalActionRowComponent, ActionRowComponent, ComponentData, ActionRowComponentData, APISelectMenuOption, APISelectMenuComponent, APIStringSelectComponent, APIBaseComponent, APIActionRowComponent, APIMessageActionRowComponent, StringSelectMenuBuilder, StringSelectMenuInteraction } from "discord.js";
import { Command } from "../interfaces/Command";
import commandCategory from "../enum/CommandsCategory";
import { Character } from "@shineiichijo/marika";
import { pb } from "../database";
import { pbUser } from "../interfaces/PocketbaseUser";
import { ListEmbed } from "../AutoCommands/ListEmbed";
import { Collectors } from "../Collectors";
import { CalculatePage } from "../AutoCommands/CalculatePage";
import { CalculateButtonPages } from "../AutoCommands/CalculateButtonPages";
import { StringListSelectMenuBuilder } from "../AutoCommands/StringListSelectMenuBuilder";
import { compare } from "../AutoCommands/CompareName";
import { ListEmbedButtonBuilder } from "../AutoCommands/ListEmbedButtonBuilder";
export const Unfollow: Command = {
    name: "unfollow",
    description: "unfollowuje urzytkownika",
    type: 1,
    options: [
        {
            name: "target-user",
            description: "użytkownik którego chcesz unfollować",
            type: ApplicationCommandOptionType.Mentionable
        }
    ],
    category: commandCategory.Profile,
    showHelp: true,
    helpDescription: "followuje urzytkownika",
    run: async (client: Client, interaction: CommandInteraction) => {
        let user: pbUser = {
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
        const mentionUserId = interaction.options.get('target-user')?.value
        
            try {
                user = await pb.collection('users').getFirstListItem('userId="'+interaction.user.id+'"',{
                    expand: 'following'
                });
            } catch (error: any) {
                return await interaction.followUp({
                    ephemeral: true,
                    content: "nie posiadasz profilu"
                });
            }

        if(user.following.length == 0){
            return await interaction.followUp({
                ephemeral: true,
                content: "nie folloujesz żadnego usera"
            }); 
        }
        // console.log(user.expand.following);
        if(mentionUserId != undefined){
            let userToUnfollow
            try{
                userToUnfollow = await pb.collection('users').getFirstListItem('userId="'+mentionUserId+'"');
            }catch(e){
                await interaction.followUp({
                    ephemeral: true,
                    content: "wystąpił błąd"
                });
            }

            if(!user.following.includes(userToUnfollow.id)){
                return await interaction.followUp({
                    ephemeral: true,
                    content: "nie followujesz tego usera"
                }); 
            }

            const index = user.following.indexOf(userToUnfollow.id)
            user.following.splice(index, 1)
            await pb.collection('users').update(user.id, user);
            const indexUnfollow = userToUnfollow.followers.indexOf(user.id)
            userToUnfollow.followers.splice(indexUnfollow, 1)
            await pb.collection('users').update(userToUnfollow.id, userToUnfollow);
            return await interaction.followUp({
                ephemeral: true,
                content: "pomyślnie unfolowano "+userToUnfollow.username
            }); 
        }
          
        user.expand.following.sort(compare)
        let start = 0
        let end = (user.expand.following.length >= 10) ? 10 : user.expand.following.length 
        let embed = ListEmbed(user.expand.following, start, end, "following")

        

        

        const [MaxLeft, Left, MaxRight, Right] = ListEmbedButtonBuilder(end)

        const row: any = new ActionRowBuilder().addComponents([MaxLeft, Left, Right, MaxRight])
        
        const menuRow = StringListSelectMenuBuilder(user.expand.following, start, end, "wybiez użytkownika do unfolowania")
        const reply = await interaction.followUp({
            embeds: [embed],
            components: [row, menuRow]
        })
        const filter = (i: ButtonInteraction | StringSelectMenuInteraction) =>{
            return i.user.id === interaction.user.id
        }

        const collecorButtons = reply.createMessageComponentCollector({
                componentType: ComponentType.Button,
                filter,
                time: 1000 * 30
        })
        const collecorMenu = reply.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            filter,
            time: 1000 * 30
    })
        Collectors.set("UnFollowMenu"+interaction.id, interaction.id)
        collecorMenu.on('collect', async (MenuInteraction: StringSelectMenuInteraction) =>{
            await MenuInteraction.deferUpdate()
            // console.log(user.expand.following[MenuInteraction.values[0]].id);
            const index = user.following.indexOf(user.expand.following[MenuInteraction.values[0]].id)
            user.following.splice(index, 1)
            let userToUnfollow
            try{
                userToUnfollow = await pb.collection('users').getOne(user.expand.following[MenuInteraction.values[0]].id);
            }catch(e){
                await interaction.followUp({
                    ephemeral: true,
                    content: "wystąpił błąd"
                });
            }
            // console.log(user);
            

            await pb.collection('users').update(user.id, user);
            
             
            const indexUnfollow = userToUnfollow.followers.indexOf(user.id)
            userToUnfollow.followers.splice(indexUnfollow, 1)
            await pb.collection('users').update(userToUnfollow.id, userToUnfollow);
            console.log("zupdatowano");
            embed.description = "unfollowano "+userToUnfollow.username
            reply.edit({
                embeds: [embed],
                components: []
            })
        })

        collecorMenu.on("end", async () =>{
            Collectors.delete("UnFollowMenu"+interaction.id)
        })

        Collectors.set("UnFollowButtons"+interaction.id, interaction.id)
        collecorButtons.on('collect', async (buttonInteraction: ButtonInteraction) =>{
            await buttonInteraction.deferUpdate()
            const [newstart, newend] = CalculatePage(start, end, user.expand.following, buttonInteraction.customId);
            start = newstart
            end = newend
            const [LeftBool, RightBool, MaxLeftBool, MaxRightBool] = CalculateButtonPages(start, end, user.expand.following)
            Left.setDisabled(LeftBool)
            Right.setDisabled(RightBool)
            MaxLeft.setDisabled(MaxLeftBool)
            MaxRight.setDisabled(MaxRightBool)
            const menuRow = StringListSelectMenuBuilder(user.expand.following, start, end, "wybiez użytkownika do unfolowania")
            embed = ListEmbed(user.expand.following, start, end, "following")
            collecorButtons.resetTimer()
            reply.edit({
                embeds: [embed],
                components: [row, menuRow]
            })
        })


        collecorButtons.on("end", async () =>{
            Collectors.delete("UnFollowButtons"+interaction.id)
        })
        // console.log(user);

        // for(const myFollowing of user.expand.following){
        //     console.log(myFollowing.userId);
            
        // }
        
        
        
    }
};