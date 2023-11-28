import { CommandInteraction, Client, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, ActionRowBuilder, ButtonInteraction, StringSelectMenuInteraction, ComponentType } from "discord.js";
import { Command } from "../interfaces/Command";
import commandCategory from "../enum/CommandsCategory";
import { Character } from "@shineiichijo/marika";
import { pbUser } from "../interfaces/PocketbaseUser";
import { pb } from "../database";
import { compare } from "../AutoCommands/CompareName";
import { ListEmbed } from "../AutoCommands/ListEmbed";
import { StringListSelectMenuBuilder } from "../AutoCommands/StringListSelectMenuBuilder";
import { ListEmbedButtonBuilder } from "../AutoCommands/ListEmbedButtonBuilder";
import { Collectors } from "../Collectors";
import { CalculatePage } from "../AutoCommands/CalculatePage";
import { CalculateButtonPages } from "../AutoCommands/CalculateButtonPages";
import { YesNoRow } from "../AutoCommands/YesNoRow";
export const FollowRequest: Command = {
    name: "follow-request",
    description: "wyświetla lisę prośb o followanie",
    type: 1,
    category: commandCategory.Profile,
    showHelp: true,
    helpDescription: "followuje urzytkownika",
    run: async (client: Client, interaction: CommandInteraction) => {
        const interactionUserId = interaction.user.id

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
            requests: [],
            notification: ""
        };
        try {
            user = await pb.collection('users').getFirstListItem('userId="' + interactionUserId + '"', {
                expand: 'requests'
            });
        } catch (error: any) {
            return await interaction.followUp({
                ephemeral: true,
                content: "nie posiadasz profilu"
            });
        }
        if (user.privation !== "private") {
            return await interaction.followUp({
                ephemeral: true,
                content: "twoje konto jest publiczne więc nie posiadasz żadnych próśb"
            });
        }

        if (user.requests.length == 0) {
            return await interaction.followUp({
                ephemeral: true,
                content: "nie posiadasz żadnych próśb"
            });
        }
        // console.log(user.expand.requests);

        user.expand.requests.sort(compare)
        let start = 0
        let end = (user.expand.requests.length >= 10) ? 10 : user.expand.requests.length
        let embed = ListEmbed(user.expand.requests, start, end, "Follow requests")
        const [MaxLeft, Left, MaxRight, Right] = ListEmbedButtonBuilder(end)
        const row: any = new ActionRowBuilder().addComponents([MaxLeft, Left, Right, MaxRight])

        const menuRow = StringListSelectMenuBuilder(user.expand.requests, start, end, "wybiez użytkownika aby odrzucić lub zaakceptować")
        const reply = await interaction.followUp({
            embeds: [embed],
            components: [row, menuRow]
        })
        const filter = (i: ButtonInteraction | StringSelectMenuInteraction) => {
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
        let index: string
        Collectors.set("requestMenu" + interaction.id, interaction.id)
        collecorMenu.on('collect', async (MenuInteraction: StringSelectMenuInteraction) => {
            await MenuInteraction.deferUpdate()
            // console.log(user.expand.following[MenuInteraction.values[0]].id);
            index = MenuInteraction.values[0]
            embed.description = "czy akceptujesz follow uzytkownia " + user.expand.requests[MenuInteraction.values[0]].username
            const Back = new ButtonBuilder()
                .setLabel('back')
                .setCustomId("back")
                .setStyle(ButtonStyle.Primary)
                const YesNo = YesNoRow()
            const BackRow: any = new ActionRowBuilder().addComponents([Back])
            reply.edit({
                embeds: [embed],
                components: [YesNo, BackRow]
            })
        })

        collecorMenu.on("end", async () => {
            Collectors.delete("requestMenu" + interaction.id)
        })

        Collectors.set("requestButtons" + interaction.id, interaction.id)
        collecorButtons.on('collect', async (buttonInteraction: ButtonInteraction) => {
            await buttonInteraction.deferUpdate()

            if (buttonInteraction.customId == "no") {
                let toDelete = user.requests.indexOf(user.expand.requests[index].id)
                user.requests.splice(toDelete, 1)
                await pb.collection('users').update(user.id, user);
                embed.description = "pomyślnie odrzucono prośbę"
                reply.edit({
                    embeds: [embed],
                    components: []
                })
            }

            if (buttonInteraction.customId == "yes") {
                let toDelete = user.requests.indexOf(user.expand.requests[index].id)
                let userFollow
                try {
                    userFollow = await pb.collection('users').getOne(user.expand.requests[index].id);
                } catch (e) {
                    await interaction.followUp({
                        ephemeral: true,
                        content: "wystąpił błąd"
                    });
                }

                user.requests.splice(toDelete, 1)
                user.followers.push(userFollow.id)
                userFollow.following.push(user.id)


                await pb.collection('users').update(user.id, user);
                await pb.collection('users').update(userFollow.id, userFollow);
                embed.description = "pomyślnie zaakceptowano prośbę"
                reply.edit({
                    embeds: [embed],
                    components: []
                })
            }

            if (buttonInteraction.customId !== "no" && buttonInteraction.customId !== "yes") {


                const [newstart, newend] = CalculatePage(start, end, user.expand.requests, buttonInteraction.customId);
                start = newstart
                end = newend
                const [LeftBool, RightBool, MaxLeftBool, MaxRightBool] = CalculateButtonPages(start, end, user.expand.requests)
                Left.setDisabled(LeftBool)
                Right.setDisabled(RightBool)
                MaxLeft.setDisabled(MaxLeftBool)
                MaxRight.setDisabled(MaxRightBool)
                const menuRow = StringListSelectMenuBuilder(user.expand.requests, start, end, "wybiez użytkownika do unfolowania")
                embed = ListEmbed(user.expand.requestss, start, end, "requests")
                collecorButtons.resetTimer()
                reply.edit({
                    embeds: [embed],
                    components: [row, menuRow]
                })
            }
        })


        collecorButtons.on("end", async () => {
            Collectors.delete("requestButtons" + interaction.id)
        })

    }
};