const db = require("pro.db");
const humanizeDuration = require('humanize-duration');
const Discord = require('discord.js');

module.exports = async (client, oldMessage, newMessage) => {
  if (!oldMessage.guild) return;  

  let channelmessage = db.get(`channelmessage_${oldMessage.guild.id}`);
  
  if (oldMessage.author.bot) return;
  if (oldMessage.channel.type === "DM") return;
  if (!oldMessage.guild.me.permissions.has("EMBED_LINKS")) return;
  if (!oldMessage.guild.me.permissions.has("MANAGE_MESSAGES")) return;

  var logChannel = oldMessage.guild.channels.cache.find(
    (c) => c.id === channelmessage
  );
  if (!logChannel) return;

  if (oldMessage.content.startsWith("https://")) {
    for (const attachment of oldMessage.attachments.values()) {
      logChannel.send({ files: [attachment.url] });
    }
    return;
  }

  let messageUpdate = new Discord.MessageEmbed()
    .setAuthor(oldMessage.author.username, oldMessage.author.avatarURL({ dynamic: true }))
    .setThumbnail("https://h.top4top.io/p_30876v3oq1.png")
    .setColor("#4a788f")
    .setDescription(`**تعديل الرسالة**\n\n**بواسطة : ** <@${oldMessage.author.id}>\n**فيـ : ${oldMessage.channel}**\n**الرسالة : [أضغط هُنا للوصل إليها](${oldMessage.url})**\n\n**الرسالة القديمة :**\n\`\`\`${oldMessage.content}\`\`\`\n**الرسالة الجديدة :**\`\`\`${newMessage.content}\`\`\` `)
    .setFooter(client.user.username, client.user.displayAvatarURL());
  logChannel.send({ embeds: [messageUpdate] });
}
