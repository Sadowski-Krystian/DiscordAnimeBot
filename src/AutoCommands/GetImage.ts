import fetch from 'node-fetch';

export const GetImage = async (name: any, nsfw: any): Promise<string> =>{
    const baseURL = 'https://api.waifu.pics';
    const response = await fetch(
        `${baseURL}/${nsfw}/${name}`,
        {
         headers: { 'Content-Type': 'application/json' },
         method: 'GET',
         body: undefined,
        },
       );
    
       if(!response.ok){
        return "error";
       }
       const json = (await response.json()) as { url: string };

    return json.url;
}