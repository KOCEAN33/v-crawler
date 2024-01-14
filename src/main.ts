// For more information, see https://crawlee.dev/
import { PuppeteerCrawler, log } from 'crawlee';

import { router } from './routes.js';

// 1. 신규 V튜버 확인
// 2. 새로운 라이브 내역 확인
// 3. 확인 안된 동영상 확인

const startUrls = ['https://www.youtube.com/@tsuna_nekota/streams'];

const crawler = new PuppeteerCrawler({
    // proxyConfiguration: new ProxyConfiguration({ proxyUrls: ['...'] }),
    requestHandler: router,
    // Comment this option to scrape the full website.
    maxRequestsPerCrawl: 20,
    headless: false,
    // autoscaledPoolOptions: {
    //     isFinishedFunction: async () => newData(),
    // },
    browserPoolOptions: {
        fingerprintOptions: {
            fingerprintGeneratorOptions: {
                locales: ['ja-JP']
            }
        }
    }
});

await crawler.run(startUrls);

async function newData() {
    console.log('this is finished')
    return false
}