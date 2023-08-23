import { Client, REST, Routes } from "discord.js";
import { Commands } from "../Commands";
import { pb } from "../database";
export default (client: Client): void => {
    client.on("ready", async () => {
        if(!client.user || !client.application){
            return;
        }
        console.log("Loading commands ...");
        
        await client.application.commands.set(Commands)
        // console.log(Commands);
        console.log(Commands);
        console.log("Commands loaded");
        // const token: any = process.env.TOKEN
        // const rest = new REST().setToken(token);

        // // and deploy your commands!
        // (async () => {
        //     try {
        //         console.log(`Started refreshing ${Commands.length} application (/) commands.`);

        //         // The put method is used to fully refresh all commands in the guild with the current set
        //         const data: any = await rest.put(
        //             Routes.applicationCommands("1131918822996193292"),
        //             { body: Commands },
        //         );

        //         console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        //     } catch (error) {
        //         // And of course, make sure you catch and log any errors!
        //         console.error(error);
        //     }
        // })();
        const authData = await pb.admins.authWithPassword('krystek23s@gmail.com', 'gulgulglut');
        // console.log(pb);
        
        
        console.log(`${client.user.username} is online`);
        
    })
}
