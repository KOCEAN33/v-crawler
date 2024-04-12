import { createPuppeteerRouter } from 'crawlee';

import { convertTimeToSeconds, convertToCurrentTime } from '../scraper/utils';

import { getVideoDesc } from '../scraper/get-video-desc';
import {
  getOrCreateGame,
  updateNotFinishedStream,
  updateStreamData,
} from '../repository/streams.repository';

export const getDescRouter = createPuppeteerRouter();

getDescRouter.addDefaultHandler(async ({ request, page, log }) => {
  const { videoId, duration, date, game } = await getVideoDesc(
    request,
    page,
    log,
  );
  // console.log({ ID: videoId, Duration: duration, date: date, game: game });

  // date 변환식
  const formattedDate = convertToCurrentTime(date);
  const formattedDuration = convertTimeToSeconds(duration);

  if (formattedDate === null || formattedDuration === null) {
    // formattedDate 또는 formattedDuration 중 하나라도 null인 경우 처리할 로직
    await updateNotFinishedStream(videoId);
  } else {
    if (game) {
      const gameData = {
        image: game.image,
        id: game.id.split('/').pop() as string,
        title: game.title,
        subtitle: game.subtitle,
      };
      // 게임ID 쿼리 혹은 생성
      const gameId = await getOrCreateGame(gameData);
      await updateStreamData(videoId, formattedDuration, formattedDate, gameId);
      log.info(`${videoId} is updated with ${gameData.title}`);
    } else {
      await updateStreamData(videoId, formattedDuration, formattedDate, null);
      log.info(`${videoId} is updated with no GAME`);
    }
  }
});
