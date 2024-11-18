import {MongoClient} from 'mongodb';

let client: MongoClient;

export async function getMongoClient(): Promise<MongoClient> {
    if (!client) {
        const host = process.env.MONGODB_HOST || '';
        const port = '27017';
        const username = encodeURIComponent(process.env.MONGODB_USERNAME || '');
        const password = encodeURIComponent(process.env.MONGODB_PASSWORD || '');

        let uri = `mongodb://${username}:${password}@${host}:${port}`
            + '?replicaSet=rs0' // Required by DocumentDB.
            + '&retryWrites=false' // Required by DocumentDB. DocumentDB doesn’t support retryable writes.
            + '&ssl=true' // Required by DocumentDB. DocumentDB requires SSL/TLS for connections.
            + '&tlsAllowInvalidHostnames=true'
            + `&tlsCAFile=${encodeURIComponent(process.env.MONGODB_TLS_CA_FILE || '')}`
            + '&readPreference=secondaryPreferred' // Recommended to distribute read workload.
            + '&serverSelectionTimeoutMS=5000'; // Fail fast instead of waiting the default 30 seconds.
        if (process.env.MONGODB_USE_SSH_TUNNEL) {
            uri += '&directConnection=true';
        }
        client = new MongoClient(uri);
        await client.connect();
        console.log('Mongo connection to DocumentDB opened.');
    }

    return client;
}
