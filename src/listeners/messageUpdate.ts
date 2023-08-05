import { Client, Collector, Message } from "discord.js";
import { Commands } from "../Commands";
import { AnimeInfo } from "../AutoCommands/AnimeInfo";

export default (client: Client): void => {
    client.on("messageUpdate", async (oldMessage, newMessage) => {
        if(process.env.STATUS == "DEV" && newMessage.guild?.id != process.env.GUILD){
            return;
        }
        if(newMessage.embeds.length == 0){
            return;
        }
        
        if(newMessage.embeds[0].description?.includes("Series")){
            AnimeInfo.run(client, newMessage);
        }
        
        
        
        
    })
}