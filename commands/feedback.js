const { MessageActionRow, MessageButton } = require('discord.js');
const { mongoURI } = require('../config.json');
const { MongoClient } = require('mongodb');

module.exports = async (message, args, client) => {
  const clientMongo = new MongoClient(mongoURI);
  await clientMongo.connect();
  const db = clientMongo.db('ticket_system');
  const settings = db.collection('settings');

  // Geri bildirim butonları ekleyin
  const feedbackRow = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId('feedback_yes')
      .setLabel('Evet, memnun kaldım')
      .setStyle('SUCCESS'),
    new MessageButton()
      .setCustomId('feedback_no')
      .setLabel('Hayır, memnun kalmadım')
      .setStyle('DANGER')
  );

  await message.channel.send({
    content: 'Ticketınız çözüldü, geri bildiriminizi alabilir miyiz?',
    components: [feedbackRow]
  });

  const feedbackCollection = db.collection('feedback');
  const filter = i => i.user.id === message.author.id;

  const collector = message.channel.createMessageComponentCollector({ filter, time: 60000 });

  collector.on('collect', async i => {
    if (i.customId === 'feedback_yes') {
      await i.update({ content: 'Teşekkürler! Geri bildiriminizi aldık.', components: [] });
      await feedbackCollection.insertOne({ userId: message.author.id, feedback: 'Evet, memnun kaldım' });
    } else if (i.customId === 'feedback_no') {
      await i.update({ content: 'Üzgünüz! Geri bildiriminizi aldık.', components: [] });
      await feedbackCollection.insertOne({ userId: message.author.id, feedback: 'Hayır, memnun kalmadım' });
    }
  });
};
