const { Client, intents, Collection, MessageEmbed, MessageAttachment, MessageActionRow, MessageButton,
  MessageSelectMenu, WebhookClient, MessageModal, Role, Modal, TextInputComponent, Permissions } = require("discord.js");
  const { createCanvas, registerFont, canvas, loadImage } = require("canvas")
  const Discord = require("discord.js")
  var { inviteTracker } = require("discord-inviter");
  let client = require('../..')
  const fs = require("fs")
  const ms = require(`ms`)
  const { prefix, owners, Guild,token} = require(`${process.cwd()}/config`);
  const config = require(`${process.cwd()}/config`);
  const Data = require("pro.db")
  const db = require(`pro.db`)
  module.exports = client;
  client.config = require(`${process.cwd()}/config`);
   const { createTranscript } = require("discord-html-transcripts");
  const { Canvas, loadFont } = require('canvas-constructor/cairo');
  const humanizeDuration = require('humanize-duration');
  const emojione = require('emojione');
  
  

  

  
  // -------------------------------------------------------------------------------------------------------
  
  
  let { joinVoiceChannel } = require("@discordjs/voice");
          client.on("ready", async () => {
              let Voice = await Data.get(`Voice_${client.user.id}`)
              const channel = client.channels.cache.get(Voice);
              if (!channel || channel.type !== "GUILD_VOICE") { return }
              const GUILD = channel.guild;
              const connection = joinVoiceChannel({
                channelId: Voice,
                guildId: GUILD.id,
                adapterCreator: GUILD.voiceAdapterCreator,
                selfDeaf: true
              });
              connection;
            })
  
  
  // ----------------------------------------------------------------------
  
  // -------------------------------------------------------------------
  
  
  
  
  
  client.on('guildMemberAdd', async member => {
    const isBlocked = await Data.get(`blockedUsers_${member.id}`);
    if (isBlocked) {
      try {
        await member.kick('You are in the blacklist.');
  
        const logkick = Data.get(`logkick_${member.guild.id}`); // Fetching log kick channel ID from the database
        const logChannel = member.guild.channels.cache.get(logkick);
        if (logChannel) {
          const blockedUser = await client.users.fetch(member.id);
          const serverName = member.guild.name;
          const serverIcon = member.guild.iconURL();
          const blockEmbed = new MessageEmbed()
            .setColor(`#4a788f`)
            .setAuthor(serverName, serverIcon)
            .setDescription(`**طرد عضو\n\nالعضو : <@${member.id}>**\n\`\`\`Reason : بالقائمة السوداء\`\`\`\ `)
            .setThumbnail(`https://b.top4top.io/p_3088ti5fn1.png`)
            .setFooter(blockedUser.username, blockedUser.displayAvatarURL({ format: 'png', dynamic: true, size: 128 }))          
          logChannel.send({ embeds: [blockEmbed] });
        }
      } catch (error) {غ
        console.error(error);
      }
    }
  });
  
  
  