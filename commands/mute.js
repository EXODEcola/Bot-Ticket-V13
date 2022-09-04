const {
    SlashCommandBuilder
  } = require('@discordjs/builders');
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName('mute')
      .setDescription('mute un Membre.')
      .addUserOption(option =>
        option.setName('target')
        .setDescription('mute un Membres')
        .setRequired(true))
      .addStringOption(option =>
        option.setName('raison')
        .setDescription('raison du mute')
        .setRequired(false)),
    async execute(interaction, client) {
      const user = client.guilds.cache.get(interaction.guildId).members.cache.get(interaction.options.getUser('target').id);
      const executer = client.guilds.cache.get(interaction.guildId).members.cache.get(interaction.user.id);
  
      if (!executer.permissions.has(client.discord.Permissions.FLAGS.BAN_MEMBERS)) return interaction.reply({
        content: 'vous n’êtes pas autorisé à utiliser cette commande ! (`MUTE_MEMBERS`)',
        ephemeral: true
      });
  
      if (user.roles.highest.rawPosition > executer.roles.highest.rawPosition) return interaction.reply({
        content: 'vous ne pouvez pas mute ce membre',
        ephemeral: true
      });
  
      if (!user.bannable) return interaction.reply({
        content: 'Je ne peux pas mettre ce membre en sourdine.',
        ephemeral: true
      });
  
      if (interaction.options.getString('raison')) {
        user.mute({
          reason: interaction.options.getString('raison'),
          days: 1
        });
        interaction.reply({
          content: `**${user.user.tag}** a bien été mis en sourdine!`
        });
      } else {
        user.mute({
          days: 1
        });
        interaction.reply({
          content: `**${user.user.tag}** a bien été mis en sourdine!`
        });
      };
    },
  };