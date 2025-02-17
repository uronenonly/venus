const db = require("pro.db");
const humanizeDuration = require('humanize-duration');
const Discord = require('discord.js');

module.exports = async (client, oldMember, newMember) => {


        let logroles = db.get(`logroles_${oldMember.guild.id}`); 
        var logChannel = oldMember.guild.channels.cache.find(c => c.id === logroles); 
        if (!logChannel) return;
        if (!oldMember.guild.id.includes(`${logChannel.guild.id}`)) return;
        if (!newMember.guild.id.includes(`${logChannel.guild.id}`)) return;
        
        const fetchedLogs = await oldMember.guild.fetchAuditLogs({
          limit: 1,
          type: 'MEMBER_ROLE_UPDATE',
        });
        
        const RoleLog = fetchedLogs.entries.first();
        const { executor } = RoleLog;
        
        const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
        if (removedRoles.size > 0) {
          let embed = new Discord.MessageEmbed()
           .setAuthor(executor.tag, executor.avatarURL({ dynamic: true, size: 1024, format: 'png' }))
            .setDescription(`**إزالة رول**\n\n**بواسطة : ${executor}**\n**لـ : <@${newMember.user.id}>**\n\`\`\`❌ - ${removedRoles.map(r => r.name)}\`\`\`\ `)
            .setColor(`#4a788f`)
            .setThumbnail('https://c.top4top.io/p_308751wky1.png')
            .setFooter(client.user.username, client.user.displayAvatarURL())
            logChannel.send({embeds: [embed]});
        }
        
        const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
      
        if (addedRoles.size > 0) {
          let embed = new Discord.MessageEmbed()
            .setAuthor(executor.tag, executor.avatarURL({ dynamic: true, size: 1024, format: 'png' }))
            .setDescription(`**إعطاء رول**\n\n**بواسطة : ${executor}**\n**لـ : <@${newMember.user.id}>**\n\`\`\`✅ - ${addedRoles.map(r => `${r.name} (${r.members.size})`).join('\n')}\`\`\`\ `)
            .setThumbnail('https://l.top4top.io/p_3087u4xhx1.png')
            .setColor(`#4a788f`)
            .setFooter(client.user.username, client.user.displayAvatarURL());
              
          logChannel.send({embeds: [embed]});
        }
        

      

  }