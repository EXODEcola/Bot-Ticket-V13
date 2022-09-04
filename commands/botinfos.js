const {
  SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('botinfo')
    .setDescription('Info Bot'),
  async execute(interaction, client) {
    const embed = new client.discord.MessageEmbed()
      .setColor('ff9600')
      .setAuthor('Bot Info', client.user.avatarURL())
      .setDescription('Bot Info.\n\nBot Developper par <@695967675842691142>')
      .setFooter(client.config.footerText, client.user.avatarURL())
      .setTimestamp();

    await interaction.reply({
      embeds: [embed]
    });
  },
};