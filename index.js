const { Client, GatewayIntentBits } = require('discord.js');
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus
} = require('@discordjs/voice');
const play = require('play-dl');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

const player = createAudioPlayer();
let loopUrl = null;

client.once('ready', () => {
  console.log('Bot ligado!');
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // ENTRAR NA CALL
  if (message.content === '!entrar') {
    if (!message.member.voice.channel) {
      return message.reply('Entre em uma call primeiro');
    }

    const connection = joinVoiceChannel({
      channelId: message.member.voice.channel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator
    });

    connection.subscribe(player);
    message.reply('Entrei na call');
  }

  // LOOP INFINITO
  if (message.content.startsWith('!loop')) {
    const args = message.content.split(' ');
    loopUrl = args[1];

    if (!loopUrl) {
      return message.reply('Coloque o link do áudio');
    }

    if (!message.member.voice.channel) {
      return message.reply('Entre em uma call primeiro');
    }

    playLoop(loopUrl);
    message.reply('🔁 Loop infinito ativado (bem baixinho)');
  }

  // PARAR LOOP
  if (message.content === '!stop') {
    loopUrl = null;
    player.stop();
    message.reply('⏹️ Loop parado');
  }
});

async function playLoop(url) {
  if (!url) return;

  const stream = await play.stream(url);
  const resource = createAudioResource(stream.stream, {
    inputType: stream.type,
    inlineVolume: true
  });

  resource.volume.setVolume(0.01); // volume baixíssimo

  player.play(resource);

  player.once(AudioPlayerStatus.Idle, () => {
    if (loopUrl) playLoop(loopUrl);
  });
}

client.login(process.env.TOKEN);
