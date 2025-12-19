const { Client, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const ticketCommand = require('./commands/ticket');
const ticketLogCommand = require('./commands/ticket-log');
const ticketStatsCommand = require('./commands/ticket-stats');
const feedbackCommand = require('./commands/feedback');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions
  ]
});

client.once('clientReady', () => {
  console.log(`${client.user.tag} botu aktif!`);
});

client.on('messageCreate', async (message) => {
  if (!message.content.startsWith('/') || message.author.bot) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  console.log("Komut alındı:", command); // Burada terminalde komutları görebilirsiniz.

  if (command === 'ticket') {
    await ticketCommand(message, args, client);
  } else if (command === 'ticket-log') {
    await ticketLogCommand(message, args, client);
  } else if (command === 'ticket-stats') {
    await ticketStatsCommand(message, args, client);
  } else if (command === 'feedback') {
    await feedbackCommand(message, args, client);
  }
});

client.login(token);
