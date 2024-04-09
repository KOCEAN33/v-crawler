import { createPuppeteerRouter } from 'crawlee';

import { convertTimeToSeconds, convertToCurrentTime } from './scraper/utils';
import { newChannelScrapeProcess } from './scraper/new-channel.js';
import { newVtuberScrapeProcess } from './scraper/new-vtuber.js';
import { getVideoDesc } from './scraper/get-video-desc';
import { updateNewVtubers } from './repository/vtubers.repository';
import {
  getOrCreateGame,
  insertVtuberStreams,
  updateNotFinishedStream,
  updateStreamData,
} from './repository/streams.repository';

export const newChannelRouter = createPuppeteerRouter();
export const getVideoRouter = createPuppeteerRouter();

newChannelRouter.addDefaultHandler(async ({ request, page, log }) => {
  // 유튜브 프로필 업데이트
  const { channelId, profile } = await newVtuberScrapeProcess(page, log);
  try {
    await updateNewVtubers(channelId, profile);
  } catch (error) {
    log.error(JSON.stringify(error));
  }

  // 유튜브 라이브 스트리밍 기록 크롤링
  const result = await newChannelScrapeProcess(request, page, log);
  try {
    await insertVtuberStreams(channelId, result);
    log.info(`${profile.name}'s youtube channel update successfully`);
  } catch (e) {
    log.error(`${profile.name}'s database update failed`);
  }
});

getVideoRouter.addDefaultHandler(async ({ request, page, log }) => {
  const { videoId, duration, date, game } = await getVideoDesc(
    request,
    page,
    log,
  );

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
    } else {
      await updateStreamData(videoId, formattedDuration, formattedDate, null);
    }
  }
});
