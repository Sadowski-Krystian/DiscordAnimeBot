import { Channel, Client } from "discord.js";
import { Commands } from "../Commands";
import { AnimeInfo } from "../AutoCommands/AnimeInfo";
import { CalculateXp } from "../AutoCommands/CalculateLevels";
import { pb } from "../database";
import { pbGuildSettings } from "../interfaces/PocketBaseGuildSettings";
import { TestArray } from "../TestArrays";
const PocketBase = require('pocketbase/cjs')

export default (client: Client): void => {
    client.on("messageCreate", async (message) => {
        /*
        if(process.env.STATUS == "DEV" && message.guild?.id != process.env.GUILD){
            return;
        }
        if(message.author.id == "646937666251915264" && message.embeds.length != 0){
            if(message.embeds[0].description?.includes("Series"))
            AnimeInfo.run(client, message);
        }
        if(message.author.bot || !message.inGuild()){
            return
        }
        const xpToGive = randomXpGive(10, 15);
        let settings: pbGuildSettings ={
            collectionId: "",
            collectionName: "",
            created: "",
            id: "",
            updated: "",
            expand: undefined,
            guildId: "",
            levelChannel: "",
            levelMessage: "",
            enableLevel: false
        }
            try {
                settings = await pb.collection('guildsSettings').getFirstListItem('guildId = "'+message.guild.id+'"');
            } catch (error: any) {
                if(error.data.code == 404){
                    const data = {
                        "guildId": message.guild.id,
                        "levelChannel": "none",
                        "levelMessage": "none",
                        "enableLevel": false
                    };
                    try{
                        settings = await pb.collection('guildsSettings').create(data);
                    }catch(err: any){
                        console.log(err);
                        return;
                        
                    }
                    
                }
             
            }
            TestArray[0]++;
            console.log(TestArray[0]);
            
            if(!settings.enableLevel){
                return
            }
        let record;
            try {
                record = await pb.collection('levels').getFirstListItem('userId="'+message.author.id+'" && guildId = "'+message.guild.id+'"');
            } catch (error: any) {
                if(error.data.code == 404){
                    const data = {
                        "userId": message.author.id,
                        "guildId": message.guild.id,
                        "xp": 0,
                        "level": 0
                    };
                    
                    record = await pb.collection('levels').create(data);
                }
             
            }
            if(record.xp + xpToGive > CalculateXp(record.level)){
                record.xp = 0;
                record.level +=1;
                const level = record.level
                // console.log(messageMemeber);
                
                let customMessage = settings.levelMessage
                if(customMessage == "none"){
                    customMessage = `Gratulacje $user wbiłeś $level level`
                }
                customMessage = customMessage.replace('$level',level);
                customMessage = customMessage.replace('$user',"<@"+message.author.id+">");
                if(settings.levelChannel == "none"){
                    message.channel.send({
                        content: customMessage
                    })
                }else{
                    const channel: any = client.channels.cache.get(settings.levelChannel)
                    channel.send({
                        content: customMessage
                    })
                }
                
                
            }else{
                record.xp += xpToGive;
            }

            await pb.collection('levels').update(record.id, record);
            
            
        */
        
    })
}

const randomXpGive = (min: number, max: number) =>{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
