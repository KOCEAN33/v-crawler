import { createPuppeteerRouter } from 'crawlee';
import { newChannelScrapeProcess } from './scraper/new-channel.js';
import { newVtuberScrapeProcess } from './scraper/new-vtuber.js';
import { updateNewVtubers } from './repository/vtubers.repository';
import { insertVtuberStreams } from './repository/streams.repository';
import { getYoutubeChannelId } from './scraper/channelId';
import { getVideoDesc } from './scraper/get-video-desc';

export const newChannelrouter = createPuppeteerRouter();
export const getVideoRouter = createPuppeteerRouter();

newChannelrouter.addDefaultHandler(async ({ request, page, log }) => {
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

  if (game) {
    const gameData = {
      image: game.image,
      id: game.id.split('/').pop(),
      title: game.title,
    };
    console.log(videoId, duration, date, gameData);
  }
  // date 변환식
  log.info('no game data');
});
