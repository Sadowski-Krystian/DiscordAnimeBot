import { CommandInteraction, Client, ApplicationCommandOptionType } from "discord.js";
import { Command } from "../interfaces/Command";
import commandCategory from "../enum/CommandsCategory";
import { Character } from "@shineiichijo/marika";
import { pbUser } from "../interfaces/PocketbaseUser";
import { pb } from "../database";
export const NotificationSettings: Command = {
    name: "notification-settings",
    description: "zmienia ustawienia prywatności",
    type: 1,
    options: [
        {
            name: "option",
            description: "ustawienie prywatności",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: "all",
                    value: "all"
                },
                {
                    name: "none",
                    value: "none"
                },
                {
                    name: "only-join",
                    value: "only join"
                }
            ]
        }
    ],
    category: commandCategory.Profile,
    showHelp: true,
    helpDescription: "zmienia ustawienia prywatności",
    run: async (client: Client, interaction: CommandInteraction) => {
        
        const option: string | number | boolean = interaction.options.get('option')?.value || "all"
        if(typeof(option) != "string"){
            return await interaction.followUp({
                ephemeral: true,
                content: "error"
            });
        }
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
                user = await pb.collection('users').getFirstListItem('userId="'+interaction.user.id+'"');
            } catch (error: any) {
                return await interaction.followUp({
                    ephemeral: true,
                    content: "nie posiadasz profilu"
                });
             
            }
        user.notification = option
            // console.log(user);
            
        const record = await pb.collection('users').update(user.id, user);
        
        await interaction.followUp({
            ephemeral: true,
            content: "pomyślnie zmieniono sutawienia profilu"
        });
    }
};