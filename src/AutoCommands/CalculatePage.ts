import { APIEmbed, GuildMember } from "discord.js"
import embeds from "../config"
import { pbUser } from "src/interfaces/PocketbaseUser"

export const CalculatePage = (start: number, end: number, array: Array<pbUser>, customId: string): Array<number> =>{
    switch(customId){
        case "maxleft":
            start = 0
            end = (array.length >= 10) ? 10 : array.length 
            break;

        case "left":
            start = (start - 10 < 0) ? 0 : start - 10
            end = (end- 10 < 10) ? ((array.length < 10) ? array.length : 10) : end - 10
            break;

        case "maxright":
            end = array.length 
            start = array.length - 10
            break;

        case "right":
            start = (array.length - (start+10) < 10) ? array.length - 10 : start + 10
            end = (end + 10 > array.length) ? array.length : end + 10
            break;
    }
    return [start, end]
}