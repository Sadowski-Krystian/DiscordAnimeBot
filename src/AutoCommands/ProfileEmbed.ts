import { APIEmbed, GuildMember } from "discord.js"
import embeds from "../config"
import { pbUser } from "src/interfaces/PocketbaseUser"

export const ProfileEmbed = (user: pbUser, targetUserObj: GuildMember): APIEmbed =>{
    const embed: APIEmbed = {
        title: user.username,
        author:{
            name: targetUserObj?.user.username,
            icon_url: targetUserObj?.displayAvatarURL()
        },
        color: parseInt(embeds.color, 16),
        fields: [
            {
                name: "privation",
                value: user.privation,
                inline: true, 
            },
            {
               name: "following",
               value: user.following.length.toString(),
               inline: true, 
            },
            {
                name: "followers",
                value: user.followers.length.toString(),
                inline: true, 
             },
             {
                 name: "notification",
                 value: user.notification,
                 inline: true, 
              }
        ],
        footer: {
            text: embeds.footer
        }
        
    }
    return embed
}