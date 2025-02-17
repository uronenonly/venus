const Pro = require('pro.db');

module.exports = async (client, reaction, user) => {
    if (user.bot) return;

    // Fetch partial reactions if needed
    if (reaction.partial) {
        try {
            await reaction.fetch();
        } catch (error) {
            console.error('Error fetching reaction:', error);
            return;
        }
    }

    // Check if reaction is on an embed message
    if (!reaction.message.embeds.length) return;

    const messageInfo = Pro.get(`message_${reaction.message.id}`);
    if (!messageInfo || messageInfo.authorId === user.id) return;

    // Get RoomInfo and check if it's the correct emoji
    const reactData = Pro.get(`RoomInfo_${reaction.message.channel.id}`);
    if (!reactData || reaction.emoji.id !== reactData.Emoji1_Id) return;

    // Update reaction count
    let userReactions = Pro.get(`reactions_${messageInfo.authorId}`) || 0;
    userReactions++;
    Pro.set(`reactions_${messageInfo.authorId}`, userReactions);

    try {
        const messageAuthor = await client.users.fetch(messageInfo.authorId);
        await messageAuthor.send(
            `**someone liked your post ... You now have ${userReactions} likes <a:vus:1301952660114636922>**`
        ).catch(() => {
            console.log(`Couldn't send DM to ${messageAuthor.tag}`);
        });
    } catch (error) {
        console.error('Error handling reaction:', error);
    }
};
