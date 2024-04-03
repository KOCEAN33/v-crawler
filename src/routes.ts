import { createPuppeteerRouter } from 'crawlee';
import { newChannelScrapeProcess } from './scraper/new-channel.js';
import { newVtuberScrapeProcess } from './scraper/new-vtuber.js';
import { updateNewVtubers } from './repository/vtubers.repository';

export const router = createPuppeteerRouter();

router.addDefaultHandler(async ({ request, page, log }) => {
  const { channelId, profile } = await newVtuberScrapeProcess(page, log);
  // await newChannelScrapeProcess(request, page, log)
  await updateNewVtubers(channelId, profile);
});
