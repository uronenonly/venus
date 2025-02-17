const config = {
    guildId: '1314583058514706462',
    botToken: 'MTI5ODM3Mjc5NTAwMDE2NDM1Mg.GxwEoC.l_x-Nxl2oLXiSTn_u7UtjZvP7XgKnBDxNl34kE'
};

async function checkUserInServer(userId) {
    try {
        const response = await fetch(`http://localhost:3000/check-member/${userId}`);
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return { success: false, error: 'network_error' };
    }
}

function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
}

function validateDiscordId(id) {
    return /^\d{17,19}$/.test(id);
}

function formatDiscordInfo(userData) {
    const parts = [];
    if (userData.nickname) parts.push(`Nickname: ${userData.nickname}`);
    if (userData.username) parts.push(`Username: ${userData.username}`);
    if (userData.discriminator && userData.discriminator !== '0') {
        parts.push(`#${userData.discriminator}`);
    }
    if (userData.joinedAt) {
        const joinDate = new Date(userData.joinedAt).toLocaleDateString();
        parts.push(`Joined: ${joinDate}`);
    }
    return parts.join(' | ');
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const discordId = form.discordId.value.trim();
        
        if (!discordId) {
            showMessage('Please enter your Discord ID', 'error');
            return;
        }

        if (!validateDiscordId(discordId)) {
            showMessage('Please enter a valid Discord ID (17-19 digits)', 'error');
            return;
        }

        showMessage('Checking...', 'info');
        
        const result = await checkUserInServer(discordId);
        
        if (!result.success) {
            showMessage(result.message || 'Error checking server membership', 'error');
        } else {
            const userInfo = formatDiscordInfo(result);
            showMessage(`Verified! ${userInfo}`, 'success');
        }
    });
});
