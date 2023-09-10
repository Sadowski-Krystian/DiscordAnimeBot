import { APIEmbed, GuildMember } from "discord.js"
import embeds from "../config"
import { pbUser } from "src/interfaces/PocketbaseUser"

export const ListEmbed = (array: Array<pbUser>, start: number, end: number, title: string): APIEmbed =>{
    let description: string = "";
    
    
    for(let i = start; i<end; i++){
        description+="<@"+array[i].userId+"> - `"+array[i].username+"`\n"
    }
    
    
    
    const embed: APIEmbed = {
        title: title,
        color: parseInt(embeds.color, 16),
        description: description,
        footer: {
            text: "Showing "+(start+1)+"-"+end+" of "+array.length
        }
        
    }
    return embed
}