import { Client } from "discord.js";
import { Commands } from "../Commands";
import { AnimeInfo } from "../AutoCommands/AnimeInfo";

export default (client: Client): void => {
    client.on("messageCreate", async (message) => {
        if(process.env.STATUS == "DEV" && message.guild?.id != process.env.GUILD){
            return;
        }
        if(message.author.id != "646937666251915264" || message.embeds.length == 0){
            return;
        }
        if(message.embeds[0].description?.includes("Series")){
            AnimeInfo.run(client, message);
        }
        
        
        
        
    })
}