import {createPuppeteerRouter, puppeteerUtils} from 'crawlee';
import {newChannelScrapeProcess} from "./scraper/new-channel.js";
import {newVtuberScrapeProcess} from "./scraper/new-vtuber.js";

export const router = createPuppeteerRouter();

// tsuna ID = UCIjdfjcSaEgdjwbgjxC3ZWg

router.addDefaultHandler(async ({ request, page, log }) => {

    await newVtuberScrapeProcess(page, log)
    await newChannelScrapeProcess(request, page, log)

});





