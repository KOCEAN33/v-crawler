import { db } from '../database';
import { Profile } from '../@types/vtubers';

export async function getNewVtubers() {
  return db
    .selectFrom('youtubes')
    .select(['status', 'url'])
    .where('status', '=', 'new')
    .execute();
}

export async function updateNewVtubers(channelId: string, profile: Profile) {
  return await db.transaction().execute(async (trx) => {
    const vtuber = await trx
      .selectFrom('youtubes')
      .select(['id', 'url', 'vtuber_id'])
      .where('url', 'like', `%${profile.handle}`)
      .executeTakeFirstOrThrow();

    await trx
      .updateTable('youtubes')
      .set({
        status: 'activated',
        url: `https://youtube.com/channel/${channelId}`,
        name: profile.name,
        handle: profile.handle,
        channel_id: channelId,
        image: profile.image,
        description: profile.description,
      })
      .where('id', '=', vtuber.id)
      .executeTakeFirstOrThrow();

    await trx
      .updateTable('vtubers')
      .set({ name: profile.name })
      .where('id', '=', vtuber.vtuber_id)
      .executeTakeFirstOrThrow();
  });
}
