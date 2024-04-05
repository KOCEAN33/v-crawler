import './env';
import { PuppeteerCrawler } from 'crawlee';
import { getNewVtubers } from './repository/vtubers.repository';
import { getVideoRouter, newChannelrouter } from './routes.js';
import { db } from './database';

// 1. 신규 V튜버 확인
// 2. 새로운 라이브 내역 확인
// 3. 확인 안된 동영상 확인

// const newChannelCrawler = new PuppeteerCrawler({
//   // proxyConfiguration: new ProxyConfiguration({ proxyUrls: ['...'] }),
//   requestHandler: newChannelrouter,
//   // Comment this option to scrape the full website.
//   maxRequestsPerCrawl: 20,
//   headless: false,
//   autoscaledPoolOptions: {
//     isFinishedFunction: () => disconnectDb(),
//   },
//   browserPoolOptions: {
//     fingerprintOptions: {
//       fingerprintGeneratorOptions: {
//         locales: ['ja-JP'],
//       },
//     },
//   },
// });
// //Query new channels
// const newChannels = await getNewVtubers();
// const newChannelUrls = newChannels.map((data) => data.url);
//
// await newChannelCrawler.addRequests(newChannelUrls);
// await newChannelCrawler.run();

const getVideoCrawler = new PuppeteerCrawler({
  // proxyConfiguration: new ProxyConfiguration({ proxyUrls: ['...'] }),
  requestHandler: getVideoRouter,
  // Comment this option to scrape the full website.
  maxRequestsPerCrawl: 20,
  headless: false,
  autoscaledPoolOptions: {
    isFinishedFunction: () => disconnectDb(),
  },
  browserPoolOptions: {
    fingerprintOptions: {
      fingerprintGeneratorOptions: {
        locales: ['ja-JP'],
      },
    },
  },
});

await getVideoCrawler.addRequests([
  'https://www.youtube.com/watch?v=-odkfqEbesE',
]);

await getVideoCrawler.run();

async function disconnectDb() {
  await db.destroy();
  return true;
}
