const { MongoClient } = require('mongodb');

async function main() {
  const uri =
    'mongodb+srv://test:demo12@cluster0.rogo5.mongodb.net/?retryWrites=true&w=majority';

  const client = new MongoClient(uri);
  try {
    await client.connect();
    await listDatabases(client);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
async function listDatabases(client) {
  const databasesListawait = client.db().admin().listDatabases();

  console.log('databases: ');
  databasesListawait.databases.forEach((db) => {
    console.log(`- ${db.name}`);
  });
}
