import { CommandInteraction, Client, ApplicationCommandOptionType, ActionRowBuilder, ButtonStyle, ButtonBuilder, UserResolvable, GuildMember, APIEmbed } from "discord.js";
import { Command } from "../interfaces/Command";
import commandCategory from "../enum/CommandsCategory";
import { Character } from "@shineiichijo/marika";
import { pb } from "../database";
import embeds from "../config"
import { ProfileEmbed } from "../AutoCommands/ProfileEmbed";
import { pbUser } from "../interfaces/PocketbaseUser";
export const Profile: Command = {
    name: "profile",
    description: "Shows yours/someone Profile",
    type: 1,
    options: [
        {
            name: "target-user",
            description: "the users whos level you want to see",
            type: ApplicationCommandOptionType.Mentionable
        }
    ],
    category: commandCategory.Profile,
    showHelp: true,
    helpDescription: "Hello command nothing special",
    run: async (client: Client, interaction: CommandInteraction) => {
        if(!interaction.inGuild()){
            return await interaction.followUp({
                ephemeral: true,
                content: "you have to use this command in guild"
            });
        }

        const mentionUserId = interaction.options.get('target-user')?.value
        const targetUserId: any = mentionUserId || interaction.member.user.id
        const targetUserObj: GuildMember | undefined = await interaction.guild?.members.fetch(targetUserId);
        if(targetUserObj == undefined){
            return
        }
        

        let embed: APIEmbed = {
            title: "Profile",
            author:{
                name: targetUserObj?.user.username,
                icon_url: targetUserObj?.displayAvatarURL()
            },
            color: parseInt(embeds.color, 16),
            description: "This user don't have profile",
            footer: {
                text: embeds.footer
            }
            
        }
        if(mentionUserId == undefined){
            embed.description = "You don't have a profile. \nThis link works 5 minutes";
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
            request: [],
            notification: ""
        };
            try {
                user = await pb.collection('users').getFirstListItem('userId="'+targetUserId+'"');
            } catch (error: any) {
                if(error.data.code == 404){
                    if(mentionUserId != undefined){
                        return await interaction.followUp({
                            embeds: [embed],
                        })
                    }
                    const authMethods = await pb.collection('users').listAuthMethods();
                    let link: any
                    let data: any
                    for (const provider of authMethods.authProviders) {
                        if(provider.name=="discord"){
                            link = provider.authUrl+"https://pocketbase-4.hop.sh/redirect.html"
                            data = {
                                name: provider.name,
                                state: provider.state,
                                codeVerifier: provider.codeVerifier,
                                codeChallenge: provider.codeChallenge,
                                codeChallengeMethod: provider.codeChallengeMethod,
                                userId: targetUserObj?.user.id,
                            }
                        }
                        
                        console.log(provider);
                        
                    }

                    const create = new ButtonBuilder()
                    .setLabel('Create Profile')
                    .setURL(link)
                    .setStyle(ButtonStyle.Link);
                    const record = await pb.collection('loginCodesTmp').create(data);
                    const deleteCode = ()=>{
                        pb.collection('loginCodesTmp').delete(record.id);
                    }
                    setTimeout(deleteCode, 5 * 60 * 1000)
                    
                    const row: any = new ActionRowBuilder()
                        .addComponents(create);
                    return await interaction.followUp({
                        embeds: [embed],
                        components: [row],
                        ephemeral: true
                    })
                    
                    

                }
             
            }
            // console.log(user);
            if((user.privation == "private" || user.privation == "non-public") && mentionUserId != undefined){
                return await interaction.followUp({
                    ephemeral: true,
                    content: "nie możesz zobaczyć tego profilu ponieważ jest on prywatny"
                });
            }
            embed = await ProfileEmbed(user, targetUserObj)
            await interaction.followUp({
                embeds: [embed],
            })
            
            
        
    }
};


