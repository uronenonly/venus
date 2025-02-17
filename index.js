const { 
  Client, 
  Collection, 
  MessageEmbed,
  MessageSelectMenu,
  MessageActionRow,
  } = require("discord.js");


  const client = new Client({ 
    intents: [
        32767,
        'GUILD_MESSAGE_REACTIONS',
        'DIRECT_MESSAGES'
    ],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'] 
  });
  const Discord = require('discord.js')
  const dbq = require("pro.db");
  const db = require("pro.db");
  const moment = require('moment');
  const fs = require("fs");
  const { exec } = require('child_process');  
  const ms = require(`ms`);
  const { prefix, owners, Guild } = require(`${process.cwd()}/config`);
  const config = require(`${process.cwd()}/config`);
  const Data = require("pro.db");
 

  client.commands = new Collection();  
  module.exports = client;
  
  client.commands = new Collection();
  client.config = require(`${process.cwd()}/config`);
  require("./handler")(client);
  client.prefix = prefix;
  client.login(config.token);

  



  require("events").EventEmitter.defaultMaxListeners = 9999999;
  
  fs.readdir(`${__dirname}/events/`, (err, folders) => {
      if (err) return console.error(err);
  
      folders.forEach(folder => {
          if (folder.includes('.')) return;
  
          fs.readdir(`${__dirname}/events/${folder}`, (err, files) => {
              if (err) return console.error(err);
  
              files.forEach(file => {
                  if (!file.endsWith('.js')) return;
  
                  let eventName = file.split('.')[0];
                  let eventPath = `${__dirname}/events/${folder}/${file}`;
  
                  try {
                      let event = require(eventPath);
                      client.on(eventName, event.bind(null, client));
                  } catch (error) {
                  }
              });
          });
      });
  });

  client.once('ready', () => {
     let savedStatus = db.get(`${client.guilds.cache.first().id}_status`); 
    
     let statusMessage = savedStatus ? savedStatus : "Orbit Store";
  
     client.user.setPresence({
      activities: [{ name: statusMessage, type: 'STREAMING', url: 'https://twitch.tv/0rb' }],
      status: 'online'
    });
  
    
  });
  client.on('messageCreate', async message => {
    if (!message?.channel?.guild) return;
    if (message.author.bot) return;
  if (message.content.startsWith(prefix + 'setstatus')) {

    const isAllowed = owners.includes(message.author.id) || storedUsers.includes(message.author.id);
    if (!isAllowed) return;
    const args = message.content.split(" ").slice(1);
    if (args.length === 0) {
        return message.channel.send('> **قم بإدخال الرسالة.**');
    }

    const statusMessage = args.join(' ');
    client.user.setPresence({
      activities: [{ name: statusMessage, type: 'STREAMING', url: 'https://twitch.tv/0rb' }],
      status: 'online'
    });
     db.set(`${message.guild.id}_status`, `${statusMessage}`);
    return message.channel.send('> **تم تعيين الحاله للبوت بنجاح.**');
}
  })
  client.once("ready", async () => {
    console.log(`Name : ${client.user.tag}\nPing : ${client.ws.ping}\nPrefix : ${client.prefix}\nID : ${client.user.id}\nServer : ${client.guilds.cache.size}\nMembers : ${client.users.cache.size}\nChannels : ${client.channels.cache.size}`);
    
    const botId = client.user.id;
    client.config.botId = `https://discord.com/oauth2/authorize?client_id=${botId}&permissions=8&scope=bot`;
  
     fs.writeFile(`${process.cwd()}/config.json`, JSON.stringify(client.config, null, 4), (err) => {
      if (err) console.error(err);
    });

  });
     
    client.on('messageCreate', async (message) => {
      if (message.author.bot || !message.guild) return;
      if (!message.content.startsWith(prefix)) return;
    
      const args = message.content.slice(prefix.length).trim().split(/ +/);
      const command = args.shift().toLowerCase();
    
      if (command === 'restart') {
        if (!owners.includes(message.author.id)) return message.react('❌');
    
        message.reply('جاري إعادة تشغيل البوت...').then(() => {
          shutdownBot(); 
        });
      }
    });
    
     function shutdownBot() {
      console.log('إيقاف البوت...');
      client.destroy();  
      
       setTimeout(() => {
        restartBot();
      }, 3000); 
    }
    
     function restartBot() {
      const restartScript = exec('node index.js');  
    
      restartScript.on('exit', (code) => {
        console.log(`Bot restarted with code ${code}`);
        process.exit();
      });
    
      restartScript.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
      });
    
      restartScript.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
      });
    }
 

    
  
   process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
  });
  
  process.on("uncaughtException", (err, origin) => {
    console.error("Uncaught Exception:", err, "origin:", origin);
  });
  
  process.on("uncaughtExceptionMonitor", (err, origin) => {
    console.error("Uncaught Exception Monitor:", err, "origin:", origin);
  });
  
  process.on("multipleResolves", (type, promise, reason) => {
    console.error("Multiple Resolves:", type, "promise:", promise, "reason:", reason);
  });