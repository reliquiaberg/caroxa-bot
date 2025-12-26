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

  // TOCAR MÚSICA
  if (message.content.startsWith('!play')) {
    const args = message.content.split(' ');
    const url = args[1];

    if (!url) {
      return message.reply('Coloque o link da música');
    }

    if (!message.member.voice.channel) {
      return message.reply('Entre em uma call primeiro');
    }

    playLoop(loopUrl);
    message.reply('🔁 Loop infinito ativado');
  }
});

async function playLoop(url) {
  const stream = await play.stream(url);
  const resource = createAudioResource(stream.stream, {
    inputType: stream.type,
    inlineVolume: true
  });

  resource.volume.setVolume(0.01); // bem baixinho

  player.play(resource);

  player.once(AudioPlayerStatus.Idle, () => {
    playLoop(url); // toca de novo quando acabar
  });
}

    const stream = await play.stream(url);
const resource = createAudioResource(stream.stream, {
  inputType: stream.type,
  inlineVolume: true
});

resource.volume.setVolume(0.01); // volume bem baixo (1%)


    player.play(resource);
    message.reply('🎶 Tocando música');
  }
});

client.login(process.env.TOKEN);
