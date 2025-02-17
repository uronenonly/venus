const db = require("pro.db");
const humanizeDuration = require('humanize-duration');
const Discord = require('discord.js');

module.exports = async (client, message) => {
  if (message.channel.type === "DM" || message.author.bot) return;

   const logChannelId = db.get(`logpic_${message.guild.id}`);
  const logChannel = message.guild.channels.cache.get(logChannelId);
  if (!logChannel) return;

   if (message.attachments.size > 0) {
    for (const attachment of message.attachments.values()) {
      if (attachment.contentType.startsWith("image/") || attachment.contentType.startsWith("video/")) {
        await logChannel.send({ files: [attachment.url] });

         const messageDelete = new Discord.MessageEmbed()
          .setColor("#4a788f")
          .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))
          .setDescription(`**حذف صورة**\n\n**بواسطة :** <@${message.author.id}>\n**فيـ : **${message.channel}\n\`\`\`الرسالة : No Message\`\`\` `)
          .setThumbnail("https://e.top4top.io/p_3087eeprm1.png")
          .setFooter(client.user.username, client.user.displayAvatarURL());

        logChannel.send({ embeds: [messageDelete] });
      }
    }
  }

  else {
    let channelmessage = db.get(`channelmessage_${message.guild.id}`);
    let logChannel = message.guild.channels.cache.find((c) => c.id === channelmessage);
    if (!logChannel) return;

    const messageDelete = new Discord.MessageEmbed()
      .setColor("#4a788f")
      .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true })) 
      .setDescription(`**حذف الرسائل**\n\n**بواسطة : <@${message.author.id}>**\n**فيـ : ${message.channel}**\n\`\`\`الرسالة : ${message.content || ": No Message"}\`\`\`\ `)
      .setThumbnail("https://g.top4top.io/p_308720yx31.png")
      .setFooter(client.user.username, client.user.displayAvatarURL());

    logChannel.send({ embeds: [messageDelete] });
  }
}
