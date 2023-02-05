// Module includes
require('dotenv').config();
const { WebhookClient } = require('discord.js');

const webhookClient = new WebhookClient({ id: process.env.DISCORD_WEBHOOK_ID, token: process.env.DISCORD_WEBHOOK_TOKEN });

webhookClient.send({
  content: 'Webhook test',
});
