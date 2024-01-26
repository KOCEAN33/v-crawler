import {Kysely} from "kysely";
import {DB} from "./@types/types.js";
import {PlanetScaleDialect} from "kysely-planetscale";

const genSecret = () => {
    if (process.env.DATABASE_URL) {
        const url = process.env.DATABASE_URL.split('/')[2];
        const host = url.split('@')[1];
        const username = url.split(':')[0];
        const password = url.split(':')[1].split('@')[0];
        return { host, username, password };
    }
    return
};

export const db = new Kysely<DB>({
    dialect: new PlanetScaleDialect({
        host: genSecret()?.host ,
        username:genSecret()?.username ,
        password:genSecret()?.password
    })
})