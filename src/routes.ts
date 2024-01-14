import {createPuppeteerRouter, puppeteerUtils} from 'crawlee';

export const router = createPuppeteerRouter();

// tsuna ID = UCIjdfjcSaEgdjwbgjxC3ZWg

router.addDefaultHandler(async ({ request, page, log, pushData }) => {
    log.info(`${request.url}`);

    // await puppeteerUtils.infiniteScroll(page, {scrollDownAndUp: true})
    await page.waitForSelector('ytd-rich-grid-renderer')
    const ID = await getChannelId(page)
    const data = await getStreamsFromPage(page)
    log.info(ID)


    // log.info(JSON.stringify(data))
    await pushData(data)
});


interface streamType {
    title: string,
    url: string,
    image: string
}
async function getStreamsFromPage(page) {
    return await page.$$eval('ytd-rich-item-renderer', ($posts) => {
        const scrapedData: streamType[] = [];

        $posts.forEach((element) => {
            return scrapedData.push({
                title: element.querySelector('#video-title').textContent.trim(),
                url: element.querySelector('.ytd-thumbnail').href ,
                image: element.querySelector('.yt-core-image').getAttribute('src'),
            });
        })

        return scrapedData
    })
}

async function getChannelId(page) {
    return await page.$$eval('meta', ($meta) => {
        return $meta.page.querySelector('meta:nth-child(81)').getAttribute('content').trim()
    })
}

