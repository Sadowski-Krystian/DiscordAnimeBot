import { Message, Client, MessageReaction, User } from "discord.js";
import { AutoCommand } from "../interfaces/AutoCommand";
const malScraper = require('mal-scraper')
import embeds from "../config"
import { Collectors } from "../Collectors";
export const AnimeInfo: AutoCommand = {
    run: async (client: Client, message: any) => {
        message.react('🀄')
       
        
        
        if(Collectors.has("AnimeInfo"+message.id)){
            return;
        }
        
        const filter = (reaction: MessageReaction, user: User) =>{
            // console.log(reaction.emoji.name);
            
            return reaction.emoji.name &&  ['🀄'].includes(reaction.emoji.name) && user.id === message.mentions.repliedUser?.id
        } 
        const collector = message.createReactionCollector({
            filter,
            max: 1,
            time: 1000 * 30
        })
        Collectors.set("AnimeInfo"+message.id, message.id)
        collector.on("collect", async () =>{

            
            const Description: String = message.embeds[0].description ?? 'Brak opisu';
            const regex = /Series\s·\s\*\*(.+?)\*\*/
            const match = Description.match(regex)
            if(!match){
                return;
            }
            const AnimeName = match[1];
            const botUser: User | null = client.user;
            let content = "";
            await malScraper.getResultsFromSearch(AnimeName, 'anime')
            .then((data: any) => {
                // console.log(data[0]);
                console.log(data[0]);
                
                if(data[0].es_score < 5 && data[0].name != AnimeName){
                    content = "This is propably not anime, maybe game";
                }
            })
            .catch((err: any) => console.log(err))
            if(content.length>1){
                return message.channel.send({
                    content: content
                })
            }
            const botUsername = botUser?.username ?? 'Nieznany bot';
            const botAvatarURL = botUser?.avatarURL() ?? '';
            const fields: { name: string; value: any; inline: boolean; }[] = [];
            await malScraper.getInfoFromName(AnimeName, true, 'anime')
                .then((data: any) => {
                    // console.log(data);
                    let generes = "";
                    for(const genre in data.genres){
                        
                            generes = generes + data.genres[genre] + ", ";
                    }
                    generes.substring(0, generes.length-2);
                    fields.push(
                        {
                            name: "**Score**", 
                            value: data.score, 
                            inline: true 
                        }, 
                        {
                            name: "**Popularity**", 
                            value: data.popularity, 
                            inline: true 
                        }, 
                        {
                            name: "**Ranked**", 
                            value: data.ranked, 
                            inline: true 
                        },
                    {
                        name: "**Episodes**", 
                        value: data.episodes, 
                        inline: true 
                    }, 
                    {
                        name: "**Duration**", 
                        value: data.duration, 
                        inline: true 
                    }, 
                    {
                        name: "**Rating**", 
                        value: data.rating, 
                        inline: true 
                    },  
                    {
                        name: "**Genres**", 
                        value: generes,
                        inline: true 
                    },  
                    {
                        name: "**Status**", 
                        value: data.status,
                        inline: true 
                    },  
                    {
                        name: "**More Info**", 
                        value: "[MAL: "+AnimeName+"]("+data.url+")",
                        inline: false 
                    })

                })
                .catch((err: any) => console.log(err))
                
            const embed = {
                author:{
                    name: botUsername,
                    icon_url: botAvatarURL  
                },
                color: parseInt(embeds.color, 16),
                description: `# Anime: ${AnimeName}`,
                fields: fields,
                footer: {
                    text: embeds.footer
                }
                
            }

            await message.channel.send({
                embeds: [embed]
            });
            
        })

        collector.on("end", async () =>{
            Collectors.delete("AnimeInfo"+message.id)
        })
        
        
        
        
        
        
        
    }
};