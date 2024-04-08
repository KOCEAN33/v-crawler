import { Game } from '../@types/stream';
import { extractVideoId } from './utils';

export async function getVideoDesc(request, page, log) {
  const videoId = extractVideoId(request.url);
  log.info(`opening video ${videoId}`);

  // Puppeteer 오류로 먼저 평가식이 시작되는 것을 방지
  await Promise.race([
    page.waitForNetworkIdle(), // 일부 라이브 스트리밍에서 유튜브의 차단으로 작동하지 않음
    page.waitForSelector('#expand'),
  ]);
  await page.waitForSelector('.ytp-time-display');
  const duration = await getDurationFromPlayer(page);

  await page.waitForSelector('#expand');
  await page.click('#expand');

  const date = await getUploadDateFromDesc(page);
  const game = await getGameFromDesc(page);

  return { videoId, duration, date, game };
}

async function getDurationFromPlayer(page): Promise<string> {
  return await page.$eval('.ytp-time-duration', (el) => el.textContent.trim());
}

async function getUploadDateFromDesc(page): Promise<string> {
  return await page.$eval('span.bold:nth-child(3)', (el) =>
    el.textContent.trim(),
  );
}

async function getGameFromDesc(page): Promise<Game | undefined> {
  return await page.$$eval('ytd-rich-metadata-renderer', ($el) => {
    const scrapedData: Game[] = [];

    $el.forEach((el) => {
      return scrapedData.push({
        image: el.querySelector('img:nth-child(1)').getAttribute('src'),
        id: el.querySelector('a').getAttribute('href'),
        title: el.querySelector('#title').textContent.trim(),
        subtitle: el.querySelector('#subtitle').textContent.trim(),
      });
    });
    return scrapedData[0];
  });
}
