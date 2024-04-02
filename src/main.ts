import "./env"
import { PuppeteerCrawler, log } from 'crawlee';
import { router } from './routes.js';
import { getNewVtubers } from './repository/vtubers.repository';


//
// // // 1. 신규 V튜버 확인
// // // 2. 새로운 라이브 내역 확인
// // // 3. 확인 안된 동영상 확인
//



const newChannelCrawler = new PuppeteerCrawler({
    // proxyConfiguration: new ProxyConfiguration({ proxyUrls: ['...'] }),
    requestHandler: router,
    // Comment this option to scrape the full website.
    maxRequestsPerCrawl: 20,
    headless: false,
    keepAlive: false,
    browserPoolOptions: {
        fingerprintOptions: {
            fingerprintGeneratorOptions: {
                locales: ['ja-JP']
            }
        }
    }
});
// Query new channels
const newChannels = await getNewVtubers()
const newChannelUrls = newChannels.map(data => data.url)

await newChannelCrawler.addRequests(newChannelUrls)

await newChannelCrawler.run();




