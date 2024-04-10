import { db } from '../database';
import { Game, Stream } from '../@types/stream';

export async function getStreamsToUpdate() {
  return await db
    .selectFrom('streams')
    .select(['stream_id', 'is_finished'])
    .where('is_finished', 'is', null)
    .limit(10)
    .execute();
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

export async function getOrCreateGame(game: Game): Promise<number> {
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

export async function updateNotFinishedStream(videoId: string) {
  return await db
    .updateTable('streams')
    .set({ is_finished: 0, updated_at: new Date() })
    .where('stream_id', '=', videoId)
    .execute();
}

export async function updateStreamData(
  videoId: string,
  duration: number,
  date: Date,
  gameId: number | null,
) {
  return await db
    .updateTable('streams')
    .set({
      duration: duration,
      lived_at: date,
      is_finished: 1,
      game_id: gameId,
      updated_at: new Date(),
    })
    .where('stream_id', '=', videoId)
    .executeTakeFirst();
}
