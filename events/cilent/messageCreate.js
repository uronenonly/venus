const client = require("../../index");
const Data = require("pro.db");
const Pro = require("pro.db");

module.exports = async (client, message) => {
    try {
         if (
            !message ||
            message.author.bot ||
            !message.guild ||
            !message.content ||
            !message.content.toLowerCase().startsWith(client.config.prefix)
        ) {
            return;
        }

         const [cmd, ...args] = message.content
            .slice(client.config.prefix.length)
            .trim()
            .split(/ +/g);

         const command = client.commands.get(cmd.toLowerCase()) || 
                        client.commands.find(c => c.aliases?.includes(cmd.toLowerCase()));

        if (!command || typeof command.run !== 'function') return;

         await command.run(client, message, args);
    } catch (error) {
        console.error('An error occurred while processing the message:', error);
    }
};
