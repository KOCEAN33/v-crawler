/*
 * 이 과정은 새로 추가된 VTuber의 유튜브 라이브 목록을 가져옵니다.
 * */

import { puppeteerUtils } from 'crawlee';

export async function newChannelScrapeProcess(request, page, log) {
  log.info(request.url);
  await puppeteerUtils.infiniteScroll(page, { scrollDownAndUp: true });
  await page.waitForSelector('ytd-rich-grid-renderer');
  const channelId = await page.$eval('meta:nth-child(81)', (el) =>
    el.getAttribute('content'),
  );
  const data = await getStreamsFromPage(page);

  const result = data.map((item) => {
    const videoId = extractVideoId(item.url);
    return {
      title: item.title,
      id: videoId,
      url: item.url,
      image: item.image,
    };
  });

  log.info(JSON.stringify(result));
}

interface streamType {
  title: string;
  url: string;
  image: string;
}

async function getStreamsFromPage(page) {
  return await page.$$eval('ytd-rich-item-renderer', ($posts) => {
    const scrapedData: streamType[] = [];

    $posts.forEach((element) => {
      return scrapedData.push({
        title: element.querySelector('#video-title').textContent.trim(),
        url: element.querySelector('.ytd-thumbnail').href,
        image: element.querySelector('.yt-core-image').getAttribute('src'),
      });
    });

    return scrapedData;
  });
}

const extractVideoId = (youtubeLink: string) => {
  const url = new URL(youtubeLink);
  return url.searchParams.get('v');
};

// const result = data.map((item) => {
//     const videoId = extractVideoId(item.url);
//     return {
//         title: item.title,
//         id: videoId,
//         url: item.url,
//         image: item.image
//     };
// });
