const { PasteClient, Publicity, ExpireDate } = require("pastebin-api");
const pastebin = new PasteClient("h7T_wgCdMWyaiG9bZFcdgNcn-iUxTWZp");

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (!interaction.isButton()) return;
    if (interaction.customId == "open-ticket") {
      if (client.guilds.cache.get(interaction.guildId).channels.cache.find(c => c.topic == interaction.user.id)) {
        return interaction.reply({
          content: 'vous avez déjà créé un Ticket !',
          ephemeral: true
        });
      };

      interaction.guild.channels.create(`ticket-${interaction.user.username}`, {
        parent: client.config.parentOpened,
        topic: interaction.user.id,
        permissionOverwrites: [{
          id: interaction.user.id,
          allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY'],
        },
        {
          id: client.config.roleSupport,
          allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY'],
        },
        {
          id: interaction.guild.roles.everyone,
          deny: ['VIEW_CHANNEL'],
        },
        ],
        type: 'text',
      }).then(async c => {
        interaction.reply({
          content: `Ticket a bien été crée! <#${c.id}>`,
          ephemeral: true
        });

        const embed = new client.discord.MessageEmbed()
          .setColor('ff9600')
          .setAuthor('Raison', ' ')
          .setDescription('choisissez une raison pour laquelle vous ouvrez un ticket')
          .setFooter('Ticket System', ' ')
          .setTimestamp();

        const row = new client.discord.MessageActionRow()
          .addComponents(
            new client.discord.MessageSelectMenu()
              .setCustomId('category')
              .setPlaceholder('choisissez une raison pour laquelle vous ouvrez un ticket')
              .addOptions([{
                label: 'Aide-Serveur',
                value: 'Aide-Serveur',
                emoji: { name: '📑' }
              },
              {
                label: 'Support',
                value: 'Support',
                emoji: { name: '❓' }
              },
              {
                label: 'Plainte',
                value: 'Plainte',
                emoji: { name: '😡' }
              },
              {
                label: 'Hébergement',
                value: 'Hébergement',
                emoji: { name: '📌' }
              },
              {
                label: 'Partenariat',
                value: 'Partenariat',
                emoji: { name: '🥇' }
              },
              ]),
          );

        msg = await c.send({
          content: `<@!${interaction.user.id}>`,
          embeds: [embed],
          components: [row]
        });

        const collector = msg.createMessageComponentCollector({
          componentType: 'SELECT_MENU',
          time: 20000
        });

        collector.on('collect', i => {
          if (i.user.id === interaction.user.id) {
            if (msg.deletable) {
              msg.delete().then(async () => {
                const embed = new client.discord.MessageEmbed()
                  .setColor('ff9600')
                  .setAuthor('Ticket', ' ')
                  .setDescription(`<@!${interaction.user.id}> a crée un **Ticket** avec la raison・ ${i.values[0]}`)
                  .setFooter('Ticket System', ' ')
                  .setTimestamp();

                const row = new client.discord.MessageActionRow()
                  .addComponents(
                    new client.discord.MessageButton()
                      .setCustomId('close-ticket')
                      .setLabel('Fermer Le ticket')
                      .setEmoji('899745362137477181')
                      .setStyle('DANGER'),
                  );

                const opened = await c.send({
                  content: `<@&${client.config.roleSupport}>`,
                  embeds: [embed],
                  components: [row]
                });

                opened.pin().then(() => {
                  opened.channel.bulkDelete(1);
                });
              });
            };
            if (i.values[0] == 'Aide-Serveur') {
              c.edit({
                parent: client.config.parentApply
              });
            };
            if (i.values[0] == 'Support') {
              c.edit({
                parent: client.config.parentSupport
              });
            };
            if (i.values[0] == 'Plainte') {
              c.edit({
                parent: client.config.parentComplaint
              });
            };
            if (i.values[0] == 'Hébergement') {
              c.edit({
                parent: client.config.parentHosting
              });
            };
            if (i.values[0] == 'Partenariat') {
              c.edit({
                parent: client.config.parentPartnership
              });
            };
          };
        });

        collector.on('end', collected => {
          if (collected.size < 1) {
            c.send(`Si Il n’y a aucune raison, le billet sera fermé.`).then(() => {
              setTimeout(() => {
                if (c.deletable) {
                  c.delete();
                };
              }, 5000);
            });
          };
        });
      });
    };

    if (interaction.customId == "close-ticket") {
      const guild = client.guilds.cache.get(interaction.guildId);
      const chan = guild.channels.cache.get(interaction.channelId);

      const row = new client.discord.MessageActionRow()
        .addComponents(
          new client.discord.MessageButton()
            .setCustomId('confirm-close')
            .setLabel('Fermer le Ticket')
            .setStyle('DANGER'),
          new client.discord.MessageButton()
            .setCustomId('no')
            .setLabel('Arréter la Fermeture')
            .setStyle('SECONDARY'),
        );

      const verif = await interaction.reply({
        content: 'Êtes-vous sûr de vouloir fermer le ticket?',
        components: [row]
      });

      const collector = interaction.channel.createMessageComponentCollector({
        componentType: 'BUTTON',
        time: 10000
      });

      collector.on('collect', i => {
        if (i.customId == 'confirm-close') {
          interaction.editReply({
            content: `Le billet a été fermé par <@!${interaction.user.id}>`,
            components: []
          });

          chan.edit({
            name: `closed-${chan.name}`,
            permissionOverwrites: [
              {
                id: client.users.cache.get(chan.topic),
                deny: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
              },
              {
                id: client.config.roleSupport,
                allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
              },
              {
                id: interaction.guild.roles.everyone,
                deny: ['VIEW_CHANNEL'],
              },
            ],
          })
            .then(async () => {
              const embed = new client.discord.MessageEmbed()
                .setColor('ff9600')
                .setAuthor('Ticket', ' ')
                .setDescription('```Ticket Sauvegarder```')
                .setFooter('Ticket System', ' ')
                .setTimestamp();

              const row = new client.discord.MessageActionRow()
                .addComponents(
                  new client.discord.MessageButton()
                    .setCustomId('delete-ticket')
                    .setLabel('Supprimer le ticket')
                    .setEmoji('🗑️')
                    .setStyle('DANGER'),
                );

              chan.send({
                embeds: [embed],
                components: [row]
              });
            });

          collector.stop();
        };
        if (i.customId == 'no') {
          interaction.editReply({
            content: 'Annuler la fermeture du Ticket!',
            components: []
          });
          collector.stop();
        };
      });

      collector.on('end', (i) => {
        if (i.size < 1) {
          interaction.editReply({
            content: 'Annuler la fermeture du Ticket!',
            components: []
          });
        };
      });
    };

    if (interaction.customId == "delete-ticket") {
      const guild = client.guilds.cache.get(interaction.guildId);
      const chan = guild.channels.cache.get(interaction.channelId);

      interaction.reply({
        content: 'ticket en sauvegarde...'
      });

      chan.messages.fetch().then(async (messages) => {
        let a = messages.filter(m => m.author.bot !== true).map(m =>
          `${new Date(m.createdTimestamp).toLocaleString('de-DE')} - ${m.author.username}#${m.author.discriminator}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`
        ).reverse().join('\n');
        if (a.length < 1) a = "Il n'y avait rien d'écrit dans le billet"

        const urlToPaste = await pastebin.createPaste({
          code: a,
          expireDate: ExpireDate.Never,
          format: "javascript",
          name: `log-${chan.id}.js`,
          publicity: 1,
        })
        const embed = new client.discord.MessageEmbed()
          .setAuthor('Logs Ticket', ' ')
          .setDescription(`📰 Ticket-Logs \`${chan.id}\` créé par <@!${chan.topic}> et supprimer par <@!${interaction.user.id}>\n\nLogs: [**Cliquez ici pour voir les logs**](${urlToPaste})`)
          .setColor('2f3136')
          .setTimestamp();

        const embed2 = new client.discord.MessageEmbed()
          .setAuthor('Logs Ticket', ' ')
          .setDescription(`📰 Backup de votre Ticket \`${chan.id}\`: [**Cliquez ici pour voir les logs**](${urlToPaste})`)
          .setColor('2f3136')
          .setTimestamp();

        client.channels.cache.get(client.config.logsTicket).send({
          embeds: [embed]
        });
        client.users.cache.get(chan.topic).send({
          embeds: [embed2]
        }).catch(() => { console.log('Je ne peux pas l’envoyer en DM') });
        chan.send('Suppression du Channel.');

        setTimeout(() => {
          chan.delete();
        }, 5000);
      });
    };
  },
};
