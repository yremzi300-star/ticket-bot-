const { MongoClient } = require('mongodb');
const { mongoURI } = require('../config.json');

module.exports = async (message, args, client) => {
  if (args[0] === 'sıfırla' && message.member.roles.cache.some(role => role.name === 'Yönetici')) {
    const clientMongo = new MongoClient(mongoURI);
    await clientMongo.connect();
    const db = clientMongo.db('ticket_system');
    const stats = db.collection('stats');

    await stats.updateOne(
      { name: 'ticketStats' },
      { $set: { ticketsOpened: 0, ticketsClosed: 0 } },
      { upsert: true }
    );

    message.channel.send('Ticket istatistikleri başarıyla sıfırlandı.');
  }
};
