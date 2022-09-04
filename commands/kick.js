const {
  SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick un Membre.')
    .addUserOption(option =>
      option.setName('target')
      .setDescription('Kick un Membre')
      .setRequired(true))
    .addStringOption(option =>
        option.setName('raison')
        .setDescription('raison du kick')
        .setRequired(false)),
  async execute(interaction, client) {
    const user = client.guilds.cache.get(interaction.guildId).members.cache.get(interaction.options.getUser('target').id);
    const executer = client.guilds.cache.get(interaction.guildId).members.cache.get(interaction.user.id);

    if (!executer.permissions.has(client.discord.Permissions.FLAGS.KICK_MEMBERS)) return interaction.reply({
      content: 'vous n’êtes pas autorisé à exécuter cette commande! (`KICK_MEMBERS`)',
      ephemeral: true
    });

    if (user.roles.highest.rawPosition > executer.roles.highest.rawPosition) return interaction.reply({
      content: 'vous ne pouvez pas kick à ce membre',
      ephemeral: true
    });

    if (!user.kickable) return interaction.reply({
      content: 'Je ne peux pas kick à ce membre.',
      ephemeral: true
    });

    if (interaction.options.getString('raison')) {
      user.kick(interaction.options.getString('raison'))
      interaction.reply({
        content: `**${user.user.tag}** a bien été kick!`
      });
    } else {
      user.kick()
      interaction.reply({
        content: `**${user.user.tag}** a bien été kick!`
      });
    };
  },
};