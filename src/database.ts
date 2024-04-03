import { Kysely, MysqlDialect, ParseJSONResultsPlugin } from 'kysely';
import {DB} from "./@types/types";
import { createPool } from 'mysql2';

const genSecret = () => {
    const databaseUrl = process.env.DATABASE_URL as string;
    if (databaseUrl) {
        const url = databaseUrl.split('/')[2];
        const database = databaseUrl.split('/')[3];
        const host = url.split(':')[1].split('@')[1];
        const port = Number(url.split(':')[2]);
        const username = url.split(':')[0];
        const password = url.split(':')[1].split('@')[0];
        return { host, port, username, password, database };
    }
};

export const db = new Kysely<DB>({
    dialect: new MysqlDialect({
        pool: createPool({
            host: genSecret()?.host,
            port: genSecret()?.port,
            user: genSecret()?.username,
            password: genSecret()?.password,
            database: genSecret()?.database,
            ssl: {
                ca: process.env.DATABASE_CA_CERT,
                cert: process.env.DATABASE_CLIENT_CERT,
                key: process.env.DATABASE_CLIENT_KEY,
                rejectUnauthorized: true,
                minVersion: 'TLSv1.2',
            },
        })
    }),
    plugins: [new ParseJSONResultsPlugin()],
    // log: ['query']
})