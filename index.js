const fs = require('fs');
const {
  Client,
  Collection,
  Intents
} = require('discord.js');
const config = require('./config.json');
const {
  REST
} = require('@discordjs/rest');
const {
  Routes
} = require('discord-api-types/v9');
const {
  clientId
} = require('./config.json');
const t = require('./token.json');

const slashcommands = [];
const slashcommandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of slashcommandFiles) {
  const command = require(`./commands/${file}`);
  slashcommands.push(command.data.toJSON());
}

const rest = new REST({
  version: '9'
}).setToken(t.token);

rest.put(Routes.applicationCommands(clientId), {
    body: slashcommands
  })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS]
});

const Discord = require('discord.js');
client.discord = Discord;
client.config = config;

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
};

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
    client.on(event.name, (...args) => event.execute(...args, client));
};

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;


  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, client, config);
  } catch (error) {
    console.error(error);
    return interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true
    });
  };
});



const fetch = require('node-fetch');


const API_KEY = 'ptla_kDEUFZnibOphF2aDGyUeHCFD8Y9cBMisxrpX9BTLcch';
const NODE_ID = 'a453cfd7-3a30-4045-b10d-6d0fe2357485'; // Remplacez par l'ID de votre node

client.on('messageCreate', async message => {
  if (message.content === '!status') {
    const url = `https://panel.exode-hebergement.fr/api/application/nodes/${NODE_ID}/utilization`;
    const options = {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'Application/vnd.pterodactyl.v1+json'
      },
      method: 'GET'
    };
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      if (!data.attributes) {
        message.channel.send('Impossible de récupérer les informations de la node.');
        return;
      }
      const cpu = data.attributes.cpu_absolute ? data.attributes.cpu_absolute.toFixed(2) : 'indisponible';
      const ram = (data.attributes.memory_bytes / 1024 / 1024 / 1024).toFixed(2);
      message.channel.send(`La node est en ligne et utilise ${cpu}% CPU et ${ram} Go de RAM.`);
    } catch (error) {
      console.error(error);
      message.channel.send('Erreur lors de la récupération des informations de la node.');
    }
  }
});


client.login(require('./token.json').token);