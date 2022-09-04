module.exports = {
  name: 'ready',
  async execute(client) {
    console.log('Bot En Ligne!')
    console.log('Bot Dev Par EXODEcola');
    const oniChan = client.channels.cache.get(client.config.ticketChannel)

    function sendTicketMSG() {
      const embed = new client.discord.MessageEmbed()
        .setColor('ff0000')
        .setAuthor('Ticket create', client.user.avatarURL())
        .setDescription('Bienvenue sur Ticket Support\n\nIl existe quatre types de Tickets différents. Pour ouvrir un ticket,\ncliquez simplement sur le bouton droit\n\nSupport-Ticket\nTicket de support pour tout ce qui concerne le serveur\n• Aide Serveur\n• Support\n• General\n• Plainte\n• Hébergement\n\n• Aide Serveur\n• Hébergement\n• Support et Questions\n• Questions et sujets généraux\n\nLes abus sont punis avec kick / ban.')
        .setFooter(client.config.footerText, client.user.avatarURL())
      const row = new client.discord.MessageActionRow()
        .addComponents(
          new client.discord.MessageButton()
          .setCustomId('open-ticket')
          .setLabel('Crée un Ticket')
          .setEmoji('🎫')
          .setStyle('PRIMARY'),
        );

      oniChan.send({
        embeds: [embed],
        components: [row]
        
      })

    }






    const toDelete = 10000;

    async function fetchMore(channel, limit) {
      if (!channel) {
        throw new Error(`Kanal created ${typeof channel}.`);
      }
      if (limit <= 100) {
        return channel.messages.fetch({
          limit
        });
      }

      let collection = [];
      let lastId = null;
      let options = {};
      let remaining = limit;

      while (remaining > 0) {
        options.limit = remaining > 100 ? 100 : remaining;
        remaining = remaining > 100 ? remaining - 100 : 0;

        if (lastId) {
          options.before = lastId;
        }

        let messages = await channel.messages.fetch(options);

        if (!messages.last()) {
          break;
        }

        collection = collection.concat(messages);
        lastId = messages.last().id;
      }
      collection.remaining = remaining;

      return collection;
    }

    const list = await fetchMore(oniChan, toDelete);

    let i = 1;

    list.forEach(underList => {
      underList.forEach(msg => {
        i++;
        if (i < toDelete) {
          setTimeout(function () {
            msg.delete()
          }, 1000 * i)
        }
      })
    })

    setTimeout(() => {
      sendTicketMSG()
    }, i);
  },
};
