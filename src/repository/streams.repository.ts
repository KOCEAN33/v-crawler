import { db } from '../database.js';

// type Profile = {
//     image: string
//     name: string,
//     handle: string,
//     description: string,
// }

// search the new added vtubers, who don't have YouTube ID

async function getNewChannels() {
  return await db
    .selectFrom('vtubers')
    .select('youtube_id')
    .where('youtube_id', '=', null)
    .executeTakeFirst();
}
