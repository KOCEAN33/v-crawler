import { Metadata, Time, YoutubeStream } from '../@types/stream';
import { getYoutubeChannelId } from './channelId';
import { extractVideoId } from './utils';

export async function getVideoDesc(request, page, log) {
  const videoId = extractVideoId(request.url);
  await page.waitForSelector('.ytp-time-display');

  const time = await getTimeFromPlayer(page);

  await page.waitForSelector('#expand');
  await page.click('#expand');
  const data = await getDescFromMetadata(page);
  console.log('방송시간:', time);
  console.log('data:', data);
  console.log('id:', videoId);
}

async function getTimeFromPlayer(page) {
  return await page.$$eval('.ytp-time-display', ($posts) => {
    const scrapedData: Time[] = [];

    $posts.forEach((el) => {
      return scrapedData.push({
        time: el.querySelector('.ytp-time-duration').textContent.trim(),
      });
    });
    return scrapedData[0].time;
  });
}

async function getDescFromMetadata(page): Promise<string> {
  return await page.$eval('span.yt-formatted-string:nth-child(3)', (el) =>
    el.textContent.trim(),
  );
}
