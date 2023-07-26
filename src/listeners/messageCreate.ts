import { Client } from "discord.js";
import { Commands } from "../Commands";
import { AnimeInfo } from "../AutoCommands/AnimeInfo";

export default (client: Client): void => {
    client.on("messageCreate", async (message) => {
        if(message.author.id != "646937666251915264" || message.embeds.length == 0){
            return;
        }
        if(message.embeds[0].description?.includes("Character")){
            AnimeInfo.run(client, message);
        }
        
        
        
        
    })
}