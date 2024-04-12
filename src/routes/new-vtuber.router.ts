import { createPuppeteerRouter } from 'crawlee';
import { newVtuberScrapeProcess } from '../scraper/new-vtuber';
import { updateNewVtubers } from '../repository/vtubers.repository';
import { newChannelScrapeProcess } from '../scraper/new-channel';
import { insertVtuberStreams } from '../repository/streams.repository';

export const newVtuberRouter = createPuppeteerRouter();

newVtuberRouter.addDefaultHandler(async ({ request, page, log }) => {
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
