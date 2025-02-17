const { Client, intents, Collection, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const axios = require("axios");
const Data = require("pro.db");
const moment = require("moment");


module.exports = async (client, message) => {
    if (!message.guild || message.author.bot) return;

    const reactData = Data.get(`RoomInfo_${message.channel.id}`);
    if (reactData) {
        const channel = message.guild.channels.cache.get(reactData.Channel_Id);
        if (channel) {
            const emoji1 = reactData.Emoji1_Id || await client.emojis.cache.find(emoji => emoji.id === reactData.Emoji1_Id);
            const emoji2 = reactData.Emoji2_Id || await client.emojis.cache.find(emoji => emoji.id === reactData.Emoji2_Id);
            const emoji3 = reactData.Emoji3_Id || await client.emojis.cache.find(emoji => emoji.id === reactData.Emoji3_Id);
            const emoji4 = reactData.Emoji4_Id || await client.emojis.cache.find(emoji => emoji.id === reactData.Emoji4_Id);
            const emoji5 = reactData.Emoji5_Id || await client.emojis.cache.find(emoji => emoji.id === reactData.Emoji5_Id);
            const emoji6 = reactData.Emoji6_Id || await client.emojis.cache.find(emoji => emoji.id === reactData.Emoji6_Id);

            if (emoji1) await message.react(emoji1);
            if (emoji2) await message.react(emoji2);
            if (emoji3) await message.react(emoji3);
            if (emoji4) await message.react(emoji4);
            if (emoji5) await message.react(emoji5);
            if (emoji6) await message.react(emoji6);
        }
    }

    const Word = Data.get(`Replys_${message.content}`);
    if (Word && message.content.startsWith(Word[0].Word)) {
        message.channel.send({ content: `${Word[0].Reply}` });
    }

     if (!message.author.bot && message.content) {
        const channels = Data.get(`setChannels_${message.guild.id}`) || [];
        if (channels.includes(message.channel.id)) {
            if (message.attachments.size === 0) {
                message.delete().catch(console.error);
            }
        }
    }

    const ChannelData = Data.get(`avtchats-[${message.guild.id}]`);
    const Color = await Data.get(`Guild_Color-${message.guild.id}`) || "#1e1f22";
    const storedChannels = await Data.get("Channels") || [];


    if (!Color || !ChannelData || !ChannelData.includes(message.channel.id)) return;

     if (message.attachments.size > 0) {
        for (const attachment of message.attachments.values()) {
            const isImage = attachment.contentType.startsWith("image/");
            const isVideo = attachment.contentType.startsWith("video/");

            if (isImage) {
                try {
                    const response = await axios.get(attachment.url, { responseType: "arraybuffer" });
                    const imageBuffer = Buffer.from(response.data, "binary");

                    const currentTime = moment();
                    const time = currentTime.format("h:mm A");  
                    
                    let footerText;
                    if (currentTime.isSame(moment().startOf('day'), 'day')) {
                        footerText = `At • Today at ${time}`;
                    } else if (currentTime.isSame(moment().subtract(1, 'days').startOf('day'), 'day')) {
                        footerText = `At • Yesterday at ${time}`;
                    } else {
                        footerText = `At • ${currentTime.format("MMMM Do YYYY")} at ${time}`;  
                    }          
                    
                    const embed = new MessageEmbed()
                        .setColor(Color)
                        .setImage("attachment://image.png")
                        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                        .setFooter(footerText); 
                    const row = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                            .setLabel('  ') 
                            .setEmoji('1303960082408800308') 
                                .setStyle("LINK")
                                .setURL(attachment.url)
                        );

                     await message.channel.send({
                        content: `**From:** <@${message.author.id}>`,
                        embeds: [embed],
                        files: [{ attachment: imageBuffer, name: "image.png" }],
                        components: [row]
                    });

                     await message.delete().catch(console.error);
                } catch (error) {
                    console.error("Error processing image:", error);
                }
            } else if (isVideo) {
                 await message.channel.send({
                    content: `**From:** <@${message.author.id}>`,
                    files: [attachment.url],
                });
                await message.delete().catch(console.error);
                const emoji1 = reactData?.Emoji1_Id || await client.emojis.cache.find(emoji => emoji.id === reactData?.Emoji1_Id);
                const emoji2 = reactData?.Emoji2_Id || await client.emojis.cache.find(emoji => emoji.id === reactData?.Emoji2_Id);
                const emoji3 = reactData?.Emoji3_Id || await client.emojis.cache.find(emoji => emoji.id === reactData?.Emoji3_Id);
                const emoji4 = reactData?.Emoji4_Id || await client.emojis.cache.find(emoji => emoji.id === reactData?.Emoji4_Id);
                const emoji5 = reactData?.Emoji5_Id || await client.emojis.cache.find(emoji => emoji.id === reactData?.Emoji5_Id);
                const emoji6 = reactData?.Emoji6_Id || await client.emojis.cache.find(emoji => emoji.id === reactData?.Emoji6_Id);
        
                if (emoji1) await sentMessage.react(emoji1);
                if (emoji2) await sentMessage.react(emoji2);
                if (emoji3) await sentMessage.react(emoji3);
                if (emoji4) await sentMessage.react(emoji4);
                if (emoji5) await sentMessage.react(emoji5);
                if (emoji6) await sentMessage.react(emoji6);
            
            }
        }
    } else if (message.content) {
        const currentTime = moment();
        const time = currentTime.format("h:mm A");  
        
        let footerText;
        if (currentTime.isSame(moment().startOf('day'), 'day')) {
            footerText = `At • Today at ${time}`;
        } else if (currentTime.isSame(moment().subtract(1, 'days').startOf('day'), 'day')) {
            footerText = `At • Yesterday at ${time}`;
        } else {
            footerText = `At • ${currentTime.format("MMMM Do YYYY")} at ${time}`;  
        }        
        
        const embed = new MessageEmbed()
            .setColor(Color)
            .setDescription(message.content)
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
            .setFooter(footerText); 
        const sentMessage = await message.channel.send({
            content: `**From:** <@${message.author.id}>`,
            embeds: [embed]
        });

         await message.delete().catch(console.error);

         const emoji1 = reactData?.Emoji1_Id || await client.emojis.cache.find(emoji => emoji.id === reactData?.Emoji1_Id);
        const emoji2 = reactData?.Emoji2_Id || await client.emojis.cache.find(emoji => emoji.id === reactData?.Emoji2_Id);
        const emoji3 = reactData?.Emoji3_Id || await client.emojis.cache.find(emoji => emoji.id === reactData?.Emoji3_Id);
        const emoji4 = reactData?.Emoji4_Id || await client.emojis.cache.find(emoji => emoji.id === reactData?.Emoji4_Id);
        const emoji5 = reactData?.Emoji5_Id || await client.emojis.cache.find(emoji => emoji.id === reactData?.Emoji5_Id);
        const emoji6 = reactData?.Emoji6_Id || await client.emojis.cache.find(emoji => emoji.id === reactData?.Emoji6_Id);

        if (emoji1) {
            await sentMessage.react(emoji1);
            // Store message info for reaction tracking
            Data.set(`message_${sentMessage.id}`, {
                authorId: message.author.id,
                messageId: sentMessage.id,
                channelId: message.channel.id,
                guildId: message.guild.id
            });
        }
        if (emoji2) await sentMessage.react(emoji2);
        if (emoji3) await sentMessage.react(emoji3);
        if (emoji4) await sentMessage.react(emoji4);
        if (emoji5) await sentMessage.react(emoji5);
        if (emoji6) await sentMessage.react(emoji6);
    }
    for (const entry of storedChannels) {
        if (entry.channelID === message.channel.id && entry.fontURL) {
            const fixedURL = entry.fontURL.startsWith('http') ? entry.fontURL : `https://${entry.fontURL.slice(5)}`;
            await message.channel.send({ files: [{ attachment: fixedURL, name: 'Bat.png' }] });
        }
    }
};
