'use strict';

require('dotenv').config();
const glob = require('glob');
const path = require('path');
const { WebhookClient } = require('discord.js');
const alertEvents = require('./lib/AlertEvents');

const webhookClient = new WebhookClient({ id: process.env.DISCORD_WEBHOOK_ID, token: process.env.DISCORD_WEBHOOK_TOKEN });

// Listen for alerts and send the included messages to Discord.
alertEvents.onAlert((message) => {
  webhookClient.send({
    content: message,
  });
});

// Load all the alert plugins from the "alerts" directory.
glob.sync('./alerts/*').forEach((file) => {
  require(path.resolve(file));
});
