import { APIEmbed, GuildMember } from "discord.js"
import embeds from "../config"
import { pbUser } from "src/interfaces/PocketbaseUser"

export const CalculateButtonPages = (start: number, end: number, array: Array<pbUser>): Array<boolean> =>{
    let Left: boolean = false
    let Right: boolean = false
    let MaxLeft: boolean = false
    let MaxRight: boolean = false
    if(start != 0 ){
        Left = false
        MaxLeft = false
    }
    if(end != array.length ){
        Right =false
        MaxRight = false
    }
    if(end == array.length){
        MaxRight = true
        Right = true
    }

    if(start ==0){
        MaxLeft = true
        Left = true
    }
    return [Left, Right, MaxLeft, MaxRight]
}