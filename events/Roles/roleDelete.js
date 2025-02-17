const db = require("pro.db");
const humanizeDuration = require('humanize-duration');
const Discord = require('discord.js');

module.exports = async (client, role) => {


        let logroles = db.get(`logroles_${role.guild.id}`); 
        if (!role.guild.me.permissions.has('EMBED_LINKS')) return;
        if (!role.guild.me.permissions.has('VIEW_AUDIT_LOG')) return;
      
        var logChannel = role.guild.channels.cache.find((c) => c.id === logroles);
        if (!logChannel) return;
      
        role.guild.fetchAuditLogs().then((logs) => {
          var userID = logs.entries.first().executor.id;
          var usertag = logs.entries.first().executor.tag;
          var userAvatar = logs.entries.first().executor.avatarURL({ dynamic: true });
      
          let roleDelete = new Discord.MessageEmbed()
          .setAuthor(usertag, userAvatar)
            .setThumbnail(`https://l.top4top.io/p_3087nj5vm1.png`)
            .setDescription(`**حذف الرول**\n\n**الرول : ${role.name}**\n**بواسطة : <@${userID}>**`)
            .setColor(`#4a788f`)
            .setFooter(client.user.username, client.user.displayAvatarURL())
          logChannel.send({ embeds: [roleDelete] });
        });

      

  }