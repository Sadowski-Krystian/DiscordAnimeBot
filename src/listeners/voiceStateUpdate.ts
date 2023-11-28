import { Channel, Client, RESTJSONErrorCodes } from "discord.js";
import { Commands } from "../Commands";
import { AnimeInfo } from "../AutoCommands/AnimeInfo";
import { CalculateXp } from "../AutoCommands/CalculateLevels";
import { pb } from "../database";
import { pbUser } from "../interfaces/PocketbaseUser";
const PocketBase = require('pocketbase/cjs')

export default (client: Client): void => {
    // console.log("voiceStateLoaded");
    
    client.on("voiceStateUpdate", async (oldState, newState) => {
        let guild = oldState.guild
        let member = guild.members.cache.get(oldState.id)
        if(member == undefined){
            return
        }
        if (member.user.bot) {
            return
        }
        if(oldState.channelId == null && newState.channelId != null){
            //dołączenie
            // console.log("dołączono");
            
            let user: pbUser = {
                avatar: "",
                collectionId: "",
                collectionName: "",
                created: "",
                email: "",
                emailVisibility: false,
                followers: [],
                following: [],
                id: "",
                privation: "",
                updated: "",
                userId: "",
                username: "",
                verified: false,
                expand: {},
                requests: [],
                notification: ""
            };
                try {
                    user = await pb.collection('users').getFirstListItem('userId="'+member.id+'"',{
                        expand: 'followers'
                    } );
                } catch (error: any) {
                    return
                }
                // console.log(user.expand.followers.lenght);
                if(user.followers.length<1){
                    return
                }
                for(let i=0; i<user.expand.followers.length; i++){
                    // console.log(user.expand.followers[i].userId);
                    
                    let tmp_user = guild.members.cache.get(user.expand.followers[i].userId)
                    // console.log(tmp_user);
                    
                    if(tmp_user == undefined){
                        continue
                    }
                    if(user.expand.followers[i].notification == "none"){
                        continue
                    }
                    // console.log(newState.channel);
                    
                    if(newState.channel == null){
                        continue
                    }
                    let invate = await newState.channel.createInvite(
                        {
                          maxAge: 10 * 60 * 1000, // maximum time for the invite, in milliseconds
                          maxUses: 1, // maximum times it can be used,
                        },
                        
                      )
                      .catch(console.log);
                      tmp_user.send({content: "`"+member.user.username + "#"+member.user.discriminator+"` just joined the channel `"+newState.channel.name+"` in `"+newState.guild.name+"`\nhttps://discord.gg/"+invate}).catch(error => {
                        
                            console.error('Failed to delete the message:', error);
                        
                    })
                }
            
        }
        if(oldState.channelId != newState.channelId){
            //przeniesienie
        }

        if(oldState.channelId != null && newState.channelId == null){
            //wyjście
        }

    })
}

