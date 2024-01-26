import {db} from "../database.js";

async function addYoutubeVideos(channelId, data) {
    return await db.transaction().execute(async (trx) => {
        const vtuber = await trx.selectFrom('vtubers')
    })
}