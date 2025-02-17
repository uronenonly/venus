const express = require('express');
const cors = require('cors');
const app = express();
const fetch = require('node-fetch');

// تكوين CORS للسماح بالوصول من دومينك
app.use(cors({
    origin: '*' // في الإنتاج، ضع دومينك الفعلي هنا
}));

app.use(express.json());
app.use(express.static('public'));

// نقطة النهاية للتحقق من العضو
app.get('/check-member/:userId', async (req, res) => {
    const userId = req.params.userId;
    const guildId = process.env.GUILD_ID || '1314583058514706462';
    const botToken = process.env.DISCORD_TOKEN || 'MTI5ODM3Mjc5NTAwMDE2NDM1Mg.GxwEoC.l_x-Nxl2oLXiSTn_u7UtjZvP7XgKnBDxNl34kE';

    try {
        console.log(`Checking user ${userId} in guild ${guildId}`);
        const response = await fetch(
            `https://discord.com/api/v10/guilds/${guildId}/members/${userId}`,
            {
                headers: {
                    'Authorization': `Bot ${botToken}`
                }
            }
        );

        if (response.ok) {
            const userData = await response.json();
            // تحسين طريقة استخراج معلومات المستخدم
            res.json({
                success: true,
                username: userData.user.username || 'Unknown',
                discriminator: userData.user.discriminator || '0000',
                nickname: userData.nick || userData.user.username || 'Unknown',
                roles: userData.roles || [],
                joinedAt: userData.joined_at || 'Unknown'
            });
        } else if (response.status === 404) {
            res.json({ 
                success: false, 
                error: 'not_found',
                message: 'User is not a member of the server'
            });
        } else {
            console.error('Discord API Error:', response.status);
            res.json({ 
                success: false, 
                error: 'api_error',
                message: 'Failed to fetch user data'
            });
        }
    } catch (error) {
        console.error('Server Error:', error);
        res.json({ 
            success: false, 
            error: 'network_error',
            message: 'Internal server error'
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
