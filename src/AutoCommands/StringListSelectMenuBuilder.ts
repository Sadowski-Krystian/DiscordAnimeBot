import { APIEmbed, APIMessageActionRowComponent, APISelectMenuOption, ActionRowBuilder, GuildMember, StringSelectMenuBuilder } from "discord.js"
import embeds from "../config"
import { pbUser } from "src/interfaces/PocketbaseUser"

export const StringListSelectMenuBuilder = (array: Array<pbUser>, start: number, end: number, placeholder: string): APIMessageActionRowComponent =>{
    let OptionsArray: Array<APISelectMenuOption> = []
            
        for(let i = start; i<end; i++){
            // console.log(array[i].username);
            
            OptionsArray.push({
                label: array[i].username,
                value: i.toString()
            })
        }
        

        const SelectMenu = new StringSelectMenuBuilder().addOptions(OptionsArray)
        .setCustomId("selectusermenu")
        .setPlaceholder(placeholder)
        const menuRow: any = new ActionRowBuilder().addComponents([SelectMenu])

    return menuRow
}