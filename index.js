const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

client.once('ready', () => {
  console.log('Bot ligado!');
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return;

  if (message.content === '!entrar') {
    if (!message.member.voice.channel) {
      message.reply('Entre em uma call primeiro');
      return;
    }

    joinVoiceChannel({
      channelId: message.member.voice.channel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator
    });

    message.reply('Entrei na call');
  }
});

client.login(process.env.TOKEN);
