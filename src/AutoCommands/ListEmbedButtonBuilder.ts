import { APIEmbed, AnyComponentBuilder, ButtonBuilder, ButtonStyle, GuildMember } from "discord.js"
import embeds from "../config"
import { pbUser } from "src/interfaces/PocketbaseUser"

export const ListEmbedButtonBuilder = (end: number): Array<ButtonBuilder> =>{
    const MaxLeft = new ButtonBuilder()
                    .setLabel('⏮️')
                    .setCustomId("maxleft")
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true);
        const Left = new ButtonBuilder()
                    .setLabel('⬅️')
                    .setCustomId("left")
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true);
        const MaxRight = new ButtonBuilder()
                    .setLabel('⏭️')
                    .setCustomId("maxright")
                    .setStyle(ButtonStyle.Primary);
        const Right = new ButtonBuilder()
                    .setLabel('➡️')
                    .setCustomId("right")
                    .setStyle(ButtonStyle.Primary);
                    
        if(end<=10){
            Right.setDisabled(true)
            MaxRight.setDisabled(true)
        }
    return [MaxLeft, Left, MaxRight, Right]
}