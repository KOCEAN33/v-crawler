/*
 * 이 과정은 새로 추가된 VTuber의 유튜브 라이브 목록을 가져옵니다.
 * */

import { puppeteerUtils } from 'crawlee';
import { YoutubeStream } from '../@types/stream';

export async function newChannelScrapeProcess(request, page, log) {
  log.info(request.url);
  await page.goto(`${request.url}/streams`);
  await puppeteerUtils.infiniteScroll(page, { scrollDownAndUp: true });
  await page.waitForSelector('ytd-rich-grid-renderer');
  // const channelId = await getYoutubeChannelId(page);
  const data = await getStreamsFromPage(page);

  const result = data.map((item) => {
    const videoId = extractVideoId(item.url);
    return {
      title: item.title,
      id: videoId,
    };
  });

  log.info(`${result.length} videos crawled successfully`);
  return result;
}

async function getStreamsFromPage(page) {
  return await page.$$eval('ytd-rich-item-renderer', ($posts) => {
    const scrapedData: YoutubeStream[] = [];

    $posts.forEach((element) => {
      return scrapedData.push({
        title: element.querySelector('#video-title').textContent.trim(),
        url: element.querySelector('.ytd-thumbnail').href,
      });
    });

    return scrapedData;
  });
}

const extractVideoId = (youtubeLink: string) => {
  const url = new URL(youtubeLink);
  return url.searchParams.get('v');
};
