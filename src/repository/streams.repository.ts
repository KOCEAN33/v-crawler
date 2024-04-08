import { db } from '../database';
import { Game, Stream } from '../@types/stream';

export async function getVtuberByChannelId(channelId: string) {
  return await db
    .selectFrom('youtubes')
    .select(['id', 'url', 'vtuber_id'])
    .where('url', 'like', `%${channelId}`)
    .executeTakeFirstOrThrow();
}

export async function insertVtuberStreams(
  channelId: string,
  streams: Stream[],
) {
  try {
    return await db.transaction().execute(async (trx) => {
      const channel = await trx
        .selectFrom('youtubes')
        .select(['id', 'channel_id', 'vtuber_id'])
        .where('channel_id', '=', channelId)
        .executeTakeFirstOrThrow();

      await trx
        .insertInto('streams')
        .values(
          streams.map((p) => ({
            title: p.title,
            stream_id: p.id,
            vtuber_id: channel.vtuber_id,
            youtube_id: channel.id,
            updated_at: new Date(),
          })),
        )
        .executeTakeFirstOrThrow();

      await trx
        .updateTable('youtubes')
        .set({ updated_at: new Date(), crawled_at: new Date() })
        .executeTakeFirstOrThrow();
    });
  } catch (e) {
    console.error(e);
  }
}

export async function getOrCreateGame(game: Game) {
  const data = await db
    .selectFrom('games')
    .select(['id', 'youtube_id'])
    .where('youtube_id', '=', game.id)
    .executeTakeFirst();

  if (!data) {
    const create = await db
      .insertInto('games')
      .values({
        title: game.title,
        image: game.image,
        youtube_id: game.id,
        updated_at: new Date(),
      })
      .executeTakeFirst();
    return Number(create.insertId);
  }

  return data.id;
}
