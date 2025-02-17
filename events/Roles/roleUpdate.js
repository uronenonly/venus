const db = require("pro.db");
const humanizeDuration = require('humanize-duration');
const Discord = require('discord.js');

module.exports = async (client, oldRole, newRole) => {


        let logroles = db.get(`logroles_${oldRole.guild.id}`);
        if (!oldRole.guild.me.permissions.has('EMBED_LINKS')) return;
        if (!oldRole.guild.me.permissions.has('VIEW_AUDIT_LOG')) return;
      
        var logChannel = oldRole.guild.channels.cache.find((c) => c.id === logroles);
        if (!logChannel) return;
      
        oldRole.guild.fetchAuditLogs().then((logs) => {
          var userID = logs.entries.first().executor.id;
          var usertag = logs.entries.first().executor.tag;
          var userAvatar = logs.entries.first().executor.avatarURL({ dynamic: true });
      
           if (
            oldRole.name === newRole.name &&
            oldRole.permissions.bitfield === newRole.permissions.bitfield &&
            oldRole.hexColor === newRole.hexColor &&
            oldRole.position === newRole.position 
          ) {
             return;
          }
      
          let roleUpdateName = new Discord.MessageEmbed()
            .setAuthor(usertag, userAvatar)
              .setThumbnail(`https://j.top4top.io/p_30876geoe1.png`)
              .setColor(newRole.hexColor)
              .setDescription(`**تعديل الرول**\n\n**الرول : <@&${oldRole.id}>**\n**بواسطة : <@${userID}>**\n\`\`\`${oldRole.name} => ${newRole.name}\`\`\`\ `)
              .setFooter(client.user.username, client.user.displayAvatarURL())
      
            logChannel.send({ embeds: [roleUpdateName] });
      
      
      
            let permissionsAdded = [];
            let permissionsRemoved = [];
            
            newRole.permissions.toArray().forEach(perm => {
              if (!oldRole.permissions.has(perm)) {
                permissionsAdded.push(perm);
              }
            });
            
            oldRole.permissions.toArray().forEach(perm => {
              if (!newRole.permissions.has(perm)) {
                permissionsRemoved.push(perm);
              }
            });
            
            if (permissionsAdded.length > 0 || permissionsRemoved.length > 0) {
              let formattedPermissionsAdded = permissionsAdded.map(perm => `\`\`\`✅ - ${perm}\`\`\`\ `).join('\n');
              let formattedPermissionsRemoved = permissionsRemoved.map(perm => `\`\`\`❌ - ${perm}\`\`\`\ `).join('\n');
            
              let roleUpdateName = new Discord.MessageEmbed()
                .setAuthor(usertag, userAvatar)
                .setThumbnail('https://j.top4top.io/p_30876geoe1.png')
                .setColor(`#4a788f`)
                .setDescription(`**تعديل الرولات**\n\n**بواسطة : <@${userID}>**\n**الرول : <@&${oldRole.id}>**\n${formattedPermissionsAdded}${formattedPermissionsRemoved}`)
                .setFooter(client.user.username, client.user.displayAvatarURL())
            
              logChannel.send({ embeds: [roleUpdateName] });
            }
          
        });

      

  }