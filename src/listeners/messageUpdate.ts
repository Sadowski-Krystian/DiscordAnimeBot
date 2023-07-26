import { Client, Collector, Message } from "discord.js";
import { Commands } from "../Commands";
import { AnimeInfo } from "../AutoCommands/AnimeInfo";

export default (client: Client): void => {
    client.on("messageUpdate", async (oldMessage, newMessage) => {
        if(newMessage.embeds.length == 0){
            return;
        }
        
        if(newMessage.embeds[0].description?.includes("Character")){
            AnimeInfo.run(client, newMessage);
        }
        
        
        
        
    })
}