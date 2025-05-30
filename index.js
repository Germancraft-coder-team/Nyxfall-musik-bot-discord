require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { DisTube } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
});

const distube = new DisTube(client, {
  plugins: [
    new SpotifyPlugin({
      parallel: true,
      emitEventsAfterFetching: true
    })
  ],
  leaveOnStop: true,
});

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (!message.guild || message.author.bot) return;

  const args = message.content.split(' ');
  const command = args.shift();

  if (command === '!play') {
    if (!args.length) return message.channel.send('Please provide a song name or URL.');
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.channel.send('Join a voice channel first!');
    distube.play(voiceChannel, args.join(' '), {
      textChannel: message.channel,
      member: message.member,
    });
  }

  if (command === '!skip') {
    distube.skip(message);
    message.channel.send('⏭ Skipped the song.');
  }

  if (command === '!stop') {
    distube.stop(message);
    message.channel.send('🛑 Stopped the music.');
  }
});

client.login(process.env.TOKEN);
