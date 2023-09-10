import { APIEmbed, ActionRowBuilder, AnyComponentBuilder, ButtonBuilder, ButtonStyle, GuildMember } from "discord.js"
import embeds from "../config"
import { pbUser } from "src/interfaces/PocketbaseUser"

export const YesNoRow = (): ActionRowBuilder<ButtonBuilder> =>{
    const Yes = new ButtonBuilder()
                    .setLabel('✅')
                    .setCustomId("yes")
                    .setStyle(ButtonStyle.Primary)
        const No = new ButtonBuilder()
                    .setLabel('❌')
                    .setCustomId("no")
                    .setStyle(ButtonStyle.Primary)
        const YesNo: any = new ActionRowBuilder().addComponents([Yes, No])
    return YesNo
}