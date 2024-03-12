import { PuppeteerCrawler, log } from 'crawlee';
import express from 'express';
import bodyparser from 'body-parser';
import { router } from './routes.js';

// // 1. 신규 V튜버 확인
// // 2. 새로운 라이브 내역 확인
// // 3. 확인 안된 동영상 확인

const crawler = new PuppeteerCrawler({
    // proxyConfiguration: new ProxyConfiguration({ proxyUrls: ['...'] }),
    requestHandler: router,
    // Comment this option to scrape the full website.
    maxRequestsPerCrawl: 20,
    headless: true,
    browserPoolOptions: {
        fingerprintOptions: {
            fingerprintGeneratorOptions: {
                locales: ['ja-JP']
            }
        }
    }
});

await crawler.addRequests(['https://www.youtube.com/@tsuna_nekota/streams'])

await crawler.run();


// const app = express();
// const port = 9000
// app.use(bodyparser.urlencoded({ extended: false }))
// app.use(bodyparser.json())
//
// app.post('/new', async (req, res) => {
//
//
//
//
//
// })
//
// app.listen(port, () => {
//     console.log(`crawler is running at port: ${port}`)
// })

