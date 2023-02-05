'use strict';

require('dotenv').config();
const { WebhookClient } = require('discord.js');
const alertEvents = require('./lib/AlertEvents');

const webhookClient = new WebhookClient({ id: process.env.DISCORD_WEBHOOK_ID, token: process.env.DISCORD_WEBHOOK_TOKEN });

// Listen for alerts and send the included messages to Discord.
alertEvents.onAlert((message) => {
  webhookClient.send({
    content: message,
  });
});
